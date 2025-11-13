// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IAggregator.sol";

/**
 * @title MockAggregator
 * @notice Mock aggregator for testing and development
 */
contract MockAggregator is IAggregator {
    uint256 public currentRoundId;
    mapping(uint256 => RoundData) public rounds;

    function submitReport(Report calldata report) external override {
        uint256 roundId = ++currentRoundId;
        
        // Simple average for mock
        int256 sum = 0;
        for (uint256 i = 0; i < report.observations.length; i++) {
            sum += report.observations[i];
        }
        int256 avg = sum / int256(report.observations.length);
        
        rounds[roundId] = RoundData({
            answer: avg,
            timestamp: block.timestamp,
            observationCount: report.observations.length,
            merkleRoot: report.merkleRoot,
            finalized: true
        });
        
        emit NewRound(roundId, avg, block.timestamp);
    }

    function latestRoundData() 
        external 
        view 
        override
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

    function getRoundData(uint256 roundId) 
        external 
        view 
        override
        returns (RoundData memory) 
    {
        return rounds[roundId];
    }

    function verifyReport(Report calldata) 
        external 
        pure 
        override
        returns (bool) 
    {
        return true;
    }

    // Helper for testing
    function setMockPrice(int256 price) external {
        uint256 roundId = ++currentRoundId;
        rounds[roundId] = RoundData({
            answer: price,
            timestamp: block.timestamp,
            observationCount: 1,
            merkleRoot: bytes32(0),
            finalized: true
        });
    }
}
