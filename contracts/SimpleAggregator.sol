// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SimpleAggregator
 * @notice Simplified aggregator for testnet that accepts individual oracle submissions
 * @dev Use the main Aggregator.sol for production with BLS signatures
 */
contract SimpleAggregator {
    bytes32 public immutable feedId;
    uint256 public currentRoundId;
    
    struct RoundData {
        int256 answer;
        uint256 timestamp;
        uint256 observationCount;
        bool finalized;
    }
    
    mapping(uint256 => RoundData) public rounds;
    mapping(address => bool) public authorizedOracles;
    
    address public owner;
    uint256 public constant AGGREGATION_WINDOW = 60; // 60 seconds
    
    // Temporary storage for current round submissions
    mapping(uint256 => int256[]) private pendingObservations;
    mapping(uint256 => mapping(address => bool)) private hasSubmitted;
    
    event NewRound(uint256 indexed roundId, int256 answer, uint256 timestamp);
    event OracleSubmission(uint256 indexed roundId, address indexed oracle, int256 value);
    event OracleAuthorized(address indexed oracle);
    event OracleRevoked(address indexed oracle);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }
    
    constructor(bytes32 _feedId) {
        feedId = _feedId;
        owner = msg.sender;
    }
    
    /**
     * @notice Authorize an oracle to submit data
     */
    function addOracle(address oracle) external onlyOwner {
        require(oracle != address(0), "Invalid oracle address");
        authorizedOracles[oracle] = true;
        emit OracleAuthorized(oracle);
    }
    
    /**
     * @notice Revoke oracle authorization
     */
    function removeOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = false;
        emit OracleRevoked(oracle);
    }
    
    /**
     * @notice Submit oracle observation
     */
    function submitValue(int256 value, uint256 timestamp) external onlyAuthorizedOracle {
        require(timestamp <= block.timestamp, "Future timestamp");
        require(block.timestamp - timestamp <= 300, "Stale data"); // 5 min max
        
        uint256 roundId = currentRoundId + 1;
        
        // Prevent double submission in same round
        require(!hasSubmitted[roundId][msg.sender], "Already submitted");
        
        // Add observation
        pendingObservations[roundId].push(value);
        hasSubmitted[roundId][msg.sender] = true;
        
        emit OracleSubmission(roundId, msg.sender, value);
        
        // If we have enough submissions, finalize the round
        if (pendingObservations[roundId].length >= 2) { // Minimum 2 oracles
            _finalizeRound(roundId, timestamp);
        }
    }
    
    /**
     * @notice Finalize a round by calculating median
     */
    function _finalizeRound(uint256 roundId, uint256 timestamp) private {
        int256[] memory observations = pendingObservations[roundId];
        int256 median = _calculateMedian(observations);
        
        currentRoundId = roundId;
        rounds[roundId] = RoundData({
            answer: median,
            timestamp: timestamp,
            observationCount: observations.length,
            finalized: true
        });
        
        emit NewRound(roundId, median, timestamp);
    }
    
    /**
     * @notice Calculate median of observations
     */
    function _calculateMedian(int256[] memory values) private pure returns (int256) {
        uint256 len = values.length;
        require(len > 0, "No values");
        
        // Simple bubble sort for small arrays
        for (uint256 i = 0; i < len; i++) {
            for (uint256 j = i + 1; j < len; j++) {
                if (values[i] > values[j]) {
                    int256 temp = values[i];
                    values[i] = values[j];
                    values[j] = temp;
                }
            }
        }
        
        // Return median
        if (len % 2 == 0) {
            return (values[len / 2 - 1] + values[len / 2]) / 2;
        } else {
            return values[len / 2];
        }
    }
    
    /**
     * @notice Get latest round data
     */
    function latestRoundData() 
        external 
        view 
        returns (
            uint256 roundId,
            int256 answer,
            uint256 timestamp,
            uint256 observationCount
        ) 
    {
        roundId = currentRoundId;
        RoundData memory round = rounds[roundId];
        return (roundId, round.answer, round.timestamp, round.observationCount);
    }
    
    /**
     * @notice Get specific round data
     */
    function getRoundData(uint256 roundId) external view returns (RoundData memory) {
        return rounds[roundId];
    }
}
