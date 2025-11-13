// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IAggregator.sol";
import "./libraries/ReportLib.sol";

/**
 * @title Aggregator
 * @notice Processes committee reports and maintains price feed state
 * @dev Implements median aggregation with BLS signature verification
 */
contract Aggregator is IAggregator {
    using ReportLib for int256[];
    using ReportLib for uint256;

    bytes32 public immutable feedId;
    uint256 public currentRoundId;
    uint256 public immutable committeeSize;
    bytes public committeePublicKey; // BLS aggregate public key

    mapping(uint256 => RoundData) public rounds;
    
    address public owner;
    address public feedRegistry;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRegistry() {
        require(msg.sender == feedRegistry, "Not registry");
        _;
    }

    constructor(
        bytes32 _feedId,
        uint256 _committeeSize,
        bytes memory _committeePublicKey
    ) {
        feedId = _feedId;
        committeeSize = _committeeSize;
        committeePublicKey = _committeePublicKey;
        owner = msg.sender;
    }

    /**
     * @notice Submit a new committee report
     * @dev Validates signatures, aggregates observations, and stores result
     */
    function submitReport(Report calldata report) external override {
        // Validate report belongs to this feed
        require(report.feedId == feedId, "Invalid feed ID");
        
        // Validate freshness
        ReportLib.validateFreshness(report.timestamp);
        
        // Validate signer threshold
        ReportLib.validateSigners(report.signerBitmap, committeeSize);
        
        // Verify BLS aggregate signature
        require(
            _verifyBLSSignature(report),
            "Invalid signature"
        );
        
        // Calculate median
        int256[] memory obs = report.observations;
        int256 aggregatedValue = obs.median();
        
        // Store round data
        uint256 roundId = ++currentRoundId;
        rounds[roundId] = RoundData({
            answer: aggregatedValue,
            timestamp: report.timestamp,
            observationCount: report.observations.length,
            merkleRoot: report.merkleRoot,
            finalized: true
        });
        
        emit NewRound(roundId, aggregatedValue, report.timestamp);
        emit ReportSubmitted(roundId, msg.sender);
    }

    /**
     * @notice Get latest round data
     */
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
        return (
            roundId,
            round.answer,
            round.timestamp,
            round.observationCount
        );
    }

    /**
     * @notice Get specific round data
     */
    function getRoundData(uint256 roundId) 
        external 
        view 
        override
        returns (RoundData memory) 
    {
        return rounds[roundId];
    }

    /**
     * @notice Verify report signature
     */
    function verifyReport(Report calldata report) 
        external 
        view 
        override
        returns (bool) 
    {
        return _verifyBLSSignature(report);
    }

    /**
     * @notice Update committee public key
     */
    function updateCommitteeKey(bytes memory newKey) external onlyOwner {
        committeePublicKey = newKey;
    }

    /**
     * @notice Set feed registry address
     */
    function setFeedRegistry(address _registry) external onlyOwner {
        feedRegistry = _registry;
    }

    /**
     * @dev Verify BLS aggregate signature
     * @dev In production, this would use a BLS precompile or library
     */
    function _verifyBLSSignature(Report calldata report) 
        internal 
        view 
        returns (bool) 
    {
        // Hash the report data
        bytes32 messageHash = ReportLib.hashReport(
            report.feedId,
            report.observations,
            report.timestamp,
            report.roundId,
            report.merkleRoot
        );
        
        // TODO: Implement actual BLS verification using precompile
        // For MVP, we'll use a simplified check
        // In production: verify(aggregateSignature, committeePublicKey, messageHash)
        
        return report.aggregateSignature.length > 0 && 
               committeePublicKey.length > 0;
    }
}
