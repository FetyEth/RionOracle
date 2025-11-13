// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IFeedRegistry.sol";
import "./interfaces/IInsuranceVault.sol";

/**
 * @title PredictionMarket
 * @notice Decentralized sports prediction market powered by RION Oracle
 * @dev Users stake BNB on match outcomes, oracle resolves, winners get paid
 */
contract PredictionMarket {
    IFeedRegistry public immutable feedRegistry;
    IInsuranceVault public immutable insuranceVault;
    
    address public owner;
    uint256 public marketFee = 200; // 2% fee (basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    enum MarketType { MONEYLINE, SPREAD, TOTALS }
    enum MarketStatus { OPEN, LOCKED, RESOLVED, CANCELLED }
    enum Outcome { PENDING, HOME_WIN, AWAY_WIN, DRAW, OVER, UNDER }
    
    struct Market {
        bytes32 matchId;
        bytes32 feedId; // Oracle feed ID for this match
        MarketType marketType;
        MarketStatus status;
        Outcome result;
        uint256 lockTime;
        uint256 resolveTime;
        int256 line; // For spread/totals (e.g., -5.5 or 215.5)
        uint256 totalStakedHome;
        uint256 totalStakedAway;
        uint256 totalStakedOver;
        uint256 totalStakedUnder;
    }
    
    struct Prediction {
        address user;
        uint256 marketId;
        Outcome predictedOutcome;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
        uint256 payout;
    }
    
    struct Parlay {
        address user;
        uint256[] marketIds;
        Outcome[] predictedOutcomes;
        uint256 totalStake;
        uint256 combinedOdds; // Multiplied odds (e.g., 1.5 * 2.0 = 3.0)
        uint256 timestamp;
        bool claimed;
        uint256 payout;
    }
    
    uint256 public marketCount;
    uint256 public predictionCount;
    uint256 public parlayCount;
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => Prediction) public predictions;
    mapping(uint256 => Parlay) public parlays;
    mapping(address => uint256[]) public userPredictions;
    mapping(address => uint256[]) public userParlays;
    mapping(uint256 => uint256[]) public marketPredictions;
    
    event MarketCreated(uint256 indexed marketId, bytes32 indexed matchId, MarketType marketType);
    event PredictionPlaced(uint256 indexed predictionId, address indexed user, uint256 indexed marketId, Outcome outcome, uint256 amount);
    event ParlayPlaced(uint256 indexed parlayId, address indexed user, uint256[] marketIds, uint256 totalStake);
    event MarketResolved(uint256 indexed marketId, Outcome result);
    event PayoutClaimed(uint256 indexed predictionId, address indexed user, uint256 amount);
    event ParlayPayoutClaimed(uint256 indexed parlayId, address indexed user, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _feedRegistry, address _insuranceVault) {
        feedRegistry = IFeedRegistry(_feedRegistry);
        insuranceVault = IInsuranceVault(_insuranceVault);
        owner = msg.sender;
    }
    
    /**
     * @notice Create a new prediction market for a match
     */
    function createMarket(
        bytes32 matchId,
        bytes32 feedId,
        MarketType marketType,
        uint256 lockTime,
        int256 line
    ) external onlyOwner returns (uint256) {
        require(lockTime > block.timestamp, "Lock time must be in future");
        
        uint256 marketId = ++marketCount;
        
        markets[marketId] = Market({
            matchId: matchId,
            feedId: feedId,
            marketType: marketType,
            status: MarketStatus.OPEN,
            result: Outcome.PENDING,
            lockTime: lockTime,
            resolveTime: 0,
            line: line,
            totalStakedHome: 0,
            totalStakedAway: 0,
            totalStakedOver: 0,
            totalStakedUnder: 0
        });
        
        emit MarketCreated(marketId, matchId, marketType);
        return marketId;
    }
    
    /**
     * @notice Place a prediction on a market
     */
    function placePrediction(
        uint256 marketId,
        Outcome predictedOutcome
    ) external payable returns (uint256) {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.OPEN, "Market not open");
        require(block.timestamp < market.lockTime, "Market locked");
        require(msg.value > 0, "Must stake BNB");
        require(predictedOutcome != Outcome.PENDING, "Invalid outcome");
        
        // Validate outcome matches market type
        if (market.marketType == MarketType.MONEYLINE) {
            require(
                predictedOutcome == Outcome.HOME_WIN || 
                predictedOutcome == Outcome.AWAY_WIN || 
                predictedOutcome == Outcome.DRAW,
                "Invalid moneyline outcome"
            );
        } else if (market.marketType == MarketType.TOTALS) {
            require(
                predictedOutcome == Outcome.OVER || 
                predictedOutcome == Outcome.UNDER,
                "Invalid totals outcome"
            );
        }
        
        uint256 predictionId = ++predictionCount;
        
        predictions[predictionId] = Prediction({
            user: msg.sender,
            marketId: marketId,
            predictedOutcome: predictedOutcome,
            amount: msg.value,
            timestamp: block.timestamp,
            claimed: false,
            payout: 0
        });
        
        // Update market totals
        if (predictedOutcome == Outcome.HOME_WIN) {
            market.totalStakedHome += msg.value;
        } else if (predictedOutcome == Outcome.AWAY_WIN) {
            market.totalStakedAway += msg.value;
        } else if (predictedOutcome == Outcome.OVER) {
            market.totalStakedOver += msg.value;
        } else if (predictedOutcome == Outcome.UNDER) {
            market.totalStakedUnder += msg.value;
        }
        
        userPredictions[msg.sender].push(predictionId);
        marketPredictions[marketId].push(predictionId);
        
        emit PredictionPlaced(predictionId, msg.sender, marketId, predictedOutcome, msg.value);
        return predictionId;
    }
    
    /**
     * @notice Place a parlay bet (multiple predictions combined)
     */
    function placeParlay(
        uint256[] calldata marketIds,
        Outcome[] calldata predictedOutcomes
    ) external payable returns (uint256) {
        require(marketIds.length >= 2, "Parlay needs 2+ markets");
        require(marketIds.length == predictedOutcomes.length, "Length mismatch");
        require(msg.value > 0, "Must stake BNB");
        
        // Validate all markets are open
        for (uint256 i = 0; i < marketIds.length; i++) {
            Market storage market = markets[marketIds[i]];
            require(market.status == MarketStatus.OPEN, "Market not open");
            require(block.timestamp < market.lockTime, "Market locked");
        }
        
        uint256 parlayId = ++parlayCount;
        
        parlays[parlayId] = Parlay({
            user: msg.sender,
            marketIds: marketIds,
            predictedOutcomes: predictedOutcomes,
            totalStake: msg.value,
            combinedOdds: 0, // Calculated at resolution
            timestamp: block.timestamp,
            claimed: false,
            payout: 0
        });
        
        userParlays[msg.sender].push(parlayId);
        
        emit ParlayPlaced(parlayId, msg.sender, marketIds, msg.value);
        return parlayId;
    }
    
    /**
     * @notice Resolve a market using oracle data
     */
    function resolveMarket(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.OPEN || market.status == MarketStatus.LOCKED, "Already resolved");
        require(block.timestamp >= market.lockTime, "Too early");
        
        (int256 answer, uint256 timestamp, uint256 roundId) = feedRegistry.getLatestAnswer(market.feedId);
        
        // Determine outcome based on market type
        if (market.marketType == MarketType.MONEYLINE) {
            if (answer > 0) {
                market.result = Outcome.HOME_WIN;
            } else if (answer < 0) {
                market.result = Outcome.AWAY_WIN;
            } else {
                market.result = Outcome.DRAW;
            }
        } else if (market.marketType == MarketType.SPREAD) {
            // answer is the final score difference
            if (answer > market.line) {
                market.result = Outcome.HOME_WIN;
            } else {
                market.result = Outcome.AWAY_WIN;
            }
        } else if (market.marketType == MarketType.TOTALS) {
            // answer is the total score
            if (answer > market.line) {
                market.result = Outcome.OVER;
            } else {
                market.result = Outcome.UNDER;
            }
        }
        
        market.status = MarketStatus.RESOLVED;
        market.resolveTime = block.timestamp;
        
        emit MarketResolved(marketId, market.result);
    }
    
    /**
     * @notice Claim winnings from a prediction
     */
    function claimPrediction(uint256 predictionId) external {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.user == msg.sender, "Not your prediction");
        require(!prediction.claimed, "Already claimed");
        
        Market storage market = markets[prediction.marketId];
        require(market.status == MarketStatus.RESOLVED, "Not resolved");
        require(prediction.predictedOutcome == market.result, "Lost prediction");
        
        // Calculate payout based on pool odds
        uint256 totalPool = market.totalStakedHome + market.totalStakedAway + 
                           market.totalStakedOver + market.totalStakedUnder;
        uint256 winningPool = _getWinningPool(market);
        
        require(winningPool > 0, "No winning pool");
        
        // Payout = (user stake / winning pool) * (total pool - fee)
        uint256 feeAmount = (totalPool * marketFee) / BASIS_POINTS;
        uint256 payoutPool = totalPool - feeAmount;
        uint256 payout = (prediction.amount * payoutPool) / winningPool;
        
        prediction.claimed = true;
        prediction.payout = payout;
        
        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Transfer failed");
        
        emit PayoutClaimed(predictionId, msg.sender, payout);
    }
    
    /**
     * @notice Claim winnings from a parlay
     */
    function claimParlay(uint256 parlayId) external {
        Parlay storage parlay = parlays[parlayId];
        require(parlay.user == msg.sender, "Not your parlay");
        require(!parlay.claimed, "Already claimed");
        
        // Check all markets are resolved and all predictions won
        bool allWon = true;
        for (uint256 i = 0; i < parlay.marketIds.length; i++) {
            Market storage market = markets[parlay.marketIds[i]];
            require(market.status == MarketStatus.RESOLVED, "Not all resolved");
            
            if (market.result != parlay.predictedOutcomes[i]) {
                allWon = false;
                break;
            }
        }
        
        require(allWon, "Parlay lost");
        
        // Calculate parlay payout (simplified: 2x per leg)
        uint256 multiplier = 2 ** parlay.marketIds.length; // 2^n
        uint256 payout = parlay.totalStake * multiplier;
        
        parlay.claimed = true;
        parlay.payout = payout;
        
        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Transfer failed");
        
        emit ParlayPayoutClaimed(parlayId, msg.sender, payout);
    }
    
    /**
     * @notice Get user's predictions
     */
    function getUserPredictions(address user) external view returns (uint256[] memory) {
        return userPredictions[user];
    }
    
    /**
     * @notice Get user's parlays
     */
    function getUserParlays(address user) external view returns (uint256[] memory) {
        return userParlays[user];
    }
    
    /**
     * @notice Get market's predictions
     */
    function getMarketPredictions(uint256 marketId) external view returns (uint256[] memory) {
        return marketPredictions[marketId];
    }
    
    /**
     * @notice Calculate current odds for a market
     */
    function getMarketOdds(uint256 marketId) external view returns (
        uint256 homeOdds,
        uint256 awayOdds,
        uint256 overOdds,
        uint256 underOdds
    ) {
        Market storage market = markets[marketId];
        uint256 totalPool = market.totalStakedHome + market.totalStakedAway + 
                           market.totalStakedOver + market.totalStakedUnder;
        
        if (totalPool == 0) return (10000, 10000, 10000, 10000);
        
        homeOdds = market.totalStakedHome > 0 ? (totalPool * BASIS_POINTS) / market.totalStakedHome : 0;
        awayOdds = market.totalStakedAway > 0 ? (totalPool * BASIS_POINTS) / market.totalStakedAway : 0;
        overOdds = market.totalStakedOver > 0 ? (totalPool * BASIS_POINTS) / market.totalStakedOver : 0;
        underOdds = market.totalStakedUnder > 0 ? (totalPool * BASIS_POINTS) / market.totalStakedUnder : 0;
    }
    
    /**
     * @dev Get winning pool amount
     */
    function _getWinningPool(Market storage market) internal view returns (uint256) {
        if (market.result == Outcome.HOME_WIN) return market.totalStakedHome;
        if (market.result == Outcome.AWAY_WIN) return market.totalStakedAway;
        if (market.result == Outcome.OVER) return market.totalStakedOver;
        if (market.result == Outcome.UNDER) return market.totalStakedUnder;
        return 0;
    }
    
    /**
     * @notice Update market fee
     */
    function setMarketFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        marketFee = newFee;
    }
    
    /**
     * @notice Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    receive() external payable {}
}
