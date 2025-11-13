// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IFeedRegistry.sol";
import "./interfaces/IAggregator.sol";

/**
 * @title FeedRegistry
 * @notice Central registry for all RION oracle feeds
 * @dev Main consumer-facing contract for price queries
 */
contract FeedRegistry is IFeedRegistry {
    mapping(bytes32 => FeedConfig) public feeds;
    address public owner;
    address public dao;

    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == dao, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Get the latest price for a feed
     */
    function getLatestAnswer(bytes32 feedId) 
        external 
        view 
        override
        returns (int256 value, uint256 timestamp, uint256 roundId) 
    {
        FeedConfig memory config = feeds[feedId];
        require(config.active, "Feed not active");
        require(config.aggregator != address(0), "Feed not found");
        
        IAggregator aggregator = IAggregator(config.aggregator);
        uint256 observationCount;
        
        (roundId, value, timestamp, observationCount) = aggregator.latestRoundData();
        
        // Validate freshness
        require(
            block.timestamp - timestamp <= config.heartbeat,
            "Stale data"
        );
        
        return (value, timestamp, roundId);
    }

    /**
     * @notice Get historical price data
     */
    function getAnswer(bytes32 feedId, uint256 roundId) 
        external 
        view 
        override
        returns (int256 value, uint256 timestamp) 
    {
        FeedConfig memory config = feeds[feedId];
        require(config.aggregator != address(0), "Feed not found");
        
        IAggregator aggregator = IAggregator(config.aggregator);
        IAggregator.RoundData memory round = aggregator.getRoundData(roundId);
        
        return (round.answer, round.timestamp);
    }

    /**
     * @notice Register a new feed
     */
    function registerFeed(
        bytes32 feedId,
        address aggregator,
        uint32 heartbeat,
        uint32 maxDeviation
    ) external override onlyOwner {
        require(aggregator != address(0), "Invalid aggregator");
        require(heartbeat > 0, "Invalid heartbeat");
        
        feeds[feedId] = FeedConfig({
            aggregator: aggregator,
            heartbeat: heartbeat,
            maxDeviation: maxDeviation,
            active: true
        });
        
        emit FeedRegistered(feedId, aggregator);
    }

    /**
     * @notice Update feed aggregator
     */
    function updateFeed(bytes32 feedId, address newAggregator) 
        external 
        onlyOwner 
    {
        require(feeds[feedId].aggregator != address(0), "Feed not found");
        require(newAggregator != address(0), "Invalid aggregator");
        
        feeds[feedId].aggregator = newAggregator;
        emit FeedUpdated(feedId, newAggregator);
    }

    /**
     * @notice Deactivate a feed
     */
    function deactivateFeed(bytes32 feedId) external onlyOwner {
        require(feeds[feedId].aggregator != address(0), "Feed not found");
        feeds[feedId].active = false;
        emit FeedDeactivated(feedId);
    }

    /**
     * @notice Get feed configuration
     */
    function getFeedConfig(bytes32 feedId) 
        external 
        view 
        override
        returns (FeedConfig memory) 
    {
        return feeds[feedId];
    }

    /**
     * @notice Set DAO address
     */
    function setDAO(address _dao) external onlyOwner {
        require(_dao != address(0), "Invalid DAO address");
        dao = _dao;
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }
}
