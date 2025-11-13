// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IFeedRegistry
 * @notice Main entry point for RION oracle consumers
 * @dev Implements the standard oracle interface with provability features
 */
interface IFeedRegistry {
    struct FeedConfig {
        address aggregator;
        uint32 heartbeat;
        uint32 maxDeviation;
        bool active;
    }

    struct LatestAnswer {
        int256 value;
        uint256 timestamp;
        uint256 roundId;
    }

    event FeedRegistered(bytes32 indexed feedId, address aggregator);
    event FeedUpdated(bytes32 indexed feedId, address newAggregator);
    event FeedDeactivated(bytes32 indexed feedId);

    /**
     * @notice Get the latest price for a feed
     * @param feedId The feed identifier (e.g., keccak256("BNB/USD"))
     * @return value The latest price value
     * @return timestamp When the price was recorded
     * @return roundId The round identifier
     */
    function getLatestAnswer(bytes32 feedId) 
        external 
        view 
        returns (int256 value, uint256 timestamp, uint256 roundId);

    /**
     * @notice Get historical price data
     * @param feedId The feed identifier
     * @param roundId The specific round to query
     */
    function getAnswer(bytes32 feedId, uint256 roundId) 
        external 
        view 
        returns (int256 value, uint256 timestamp);

    /**
     * @notice Register a new feed
     * @param feedId The feed identifier
     * @param aggregator The aggregator contract address
     * @param heartbeat Maximum time between updates (seconds)
     * @param maxDeviation Maximum price deviation threshold (basis points)
     */
    function registerFeed(
        bytes32 feedId,
        address aggregator,
        uint32 heartbeat,
        uint32 maxDeviation
    ) external;

    /**
     * @notice Get feed configuration
     */
    function getFeedConfig(bytes32 feedId) 
        external 
        view 
        returns (FeedConfig memory);
}
