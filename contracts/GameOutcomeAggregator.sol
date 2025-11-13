// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IFeedRegistry.sol";

contract GameOutcomeAggregator {
    address public immutable owner;
    IFeedRegistry public immutable feedRegistry;
    bytes32 public immutable gameId; // Unique identifier for the game
    
    mapping(address => bool) public authorizedOracles;
    
    struct GameOutcome {
        uint8 winner; // 1 = home, 2 = away, 3 = draw
        uint8 homeScore;
        uint8 awayScore;
        uint256 timestamp;
    }
    
    mapping(address => GameOutcome) public oracleSubmissions;
    address[] public submittedOracles;
    
    bool public gameFinalized;
    GameOutcome public finalOutcome;
    
    event OutcomeSubmitted(address indexed oracle, uint8 winner, uint8 homeScore, uint8 awayScore);
    event GameFinalized(uint8 winner, uint8 homeScore, uint8 awayScore);
    
    constructor(bytes32 _gameId) {
        owner = msg.sender;
        feedRegistry = IFeedRegistry(msg.sender);
        gameId = _gameId;
    }
    
    function authorizeOracle(address oracle) external {
        require(msg.sender == owner, "Only owner");
        authorizedOracles[oracle] = true;
    }
    
    function submitOutcome(uint8 winner, uint8 homeScore, uint8 awayScore) external {
        require(authorizedOracles[msg.sender], "Not authorized");
        require(!gameFinalized, "Game already finalized");
        require(winner >= 1 && winner <= 3, "Invalid winner");
        
        // Check if oracle already submitted
        bool alreadySubmitted = false;
        for (uint i = 0; i < submittedOracles.length; i++) {
            if (submittedOracles[i] == msg.sender) {
                alreadySubmitted = true;
                break;
            }
        }
        
        if (!alreadySubmitted) {
            submittedOracles.push(msg.sender);
        }
        
        oracleSubmissions[msg.sender] = GameOutcome({
            winner: winner,
            homeScore: homeScore,
            awayScore: awayScore,
            timestamp: block.timestamp
        });
        
        emit OutcomeSubmitted(msg.sender, winner, homeScore, awayScore);
        
        // Auto-finalize if we have consensus (2 out of 3 oracles agree)
        _checkConsensus();
    }
    
    function _checkConsensus() private {
        if (submittedOracles.length < 2) return;
        
        // Count votes for each winner (1=home, 2=away, 3=draw)
        uint8[4] memory winnerVotes; // Index 0 unused, 1-3 for winner values
        
        for (uint i = 0; i < submittedOracles.length; i++) {
            address oracle = submittedOracles[i];
            GameOutcome memory outcome = oracleSubmissions[oracle];
            winnerVotes[outcome.winner]++;
        }
        
        // If 2+ oracles agree on winner, finalize
        for (uint8 w = 1; w <= 3; w++) {
            if (winnerVotes[w] >= 2) {
                _finalizeGame(w);
                break;
            }
        }
    }
    
    function _finalizeGame(uint8 winner) private {
        // Get the outcome from the first oracle that voted for this winner
        for (uint i = 0; i < submittedOracles.length; i++) {
            address oracle = submittedOracles[i];
            GameOutcome memory outcome = oracleSubmissions[oracle];
            if (outcome.winner == winner) {
                finalOutcome = outcome;
                gameFinalized = true;
                emit GameFinalized(outcome.winner, outcome.homeScore, outcome.awayScore);
                break;
            }
        }
    }
    
    function getOutcome() external view returns (uint8 winner, uint8 homeScore, uint8 awayScore, bool finalized) {
        return (finalOutcome.winner, finalOutcome.homeScore, finalOutcome.awayScore, gameFinalized);
    }
}
