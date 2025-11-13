// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAggregator
 * @notice Handles committee reports and aggregation logic
 */
interface IAggregator {
    struct Report {
        bytes32 feedId;
        int256[] observations;
        uint256 timestamp;
        uint256 roundId;
        bytes32 merkleRoot;
        bytes aggregateSignature;
        uint256 signerBitmap;
    }

    struct RoundData {
        int256 answer;
        uint256 timestamp;
        uint256 observationCount;
        bytes32 merkleRoot;
        bool finalized;
    }

    event NewRound(uint256 indexed roundId, int256 answer, uint256 timestamp);
    event ReportSubmitted(uint256 indexed roundId, address indexed submitter);

    /**
     * @notice Submit a new committee report
     * @param report The signed report from the committee
     */
    function submitReport(Report calldata report) external;

    /**
     * @notice Get the latest round data
     */
    function latestRoundData() 
        external 
        view 
        returns (
            uint256 roundId,
            int256 answer,
            uint256 timestamp,
            uint256 observationCount
        );

    /**
     * @notice Get specific round data
     */
    function getRoundData(uint256 roundId) 
        external 
        view 
        returns (RoundData memory);

    /**
     * @notice Verify a report signature
     */
    function verifyReport(Report calldata report) 
        external 
        view 
        returns (bool);
}
