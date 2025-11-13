// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/FeedRegistry.sol";
import "../contracts/Aggregator.sol";

contract FeedRegistryTest is Test {
    FeedRegistry public registry;
    Aggregator public aggregator;
    
    bytes32 constant FEED_ID = keccak256("BNB/USD");
    uint32 constant HEARTBEAT = 300;
    uint32 constant MAX_DEVIATION = 500;
    
    address owner = address(1);
    
    function setUp() public {
        vm.startPrank(owner);
        
        registry = new FeedRegistry();
        
        aggregator = new Aggregator(
            FEED_ID,
            5, // committee size
            hex"" // empty public key for testing
        );
        
        vm.stopPrank();
    }
    
    function testRegisterFeed() public {
        vm.prank(owner);
        registry.registerFeed(FEED_ID, address(aggregator), HEARTBEAT, MAX_DEVIATION);
        
        IFeedRegistry.FeedConfig memory config = registry.getFeedConfig(FEED_ID);
        
        assertEq(config.aggregator, address(aggregator));
        assertEq(config.heartbeat, HEARTBEAT);
        assertEq(config.maxDeviation, MAX_DEVIATION);
        assertTrue(config.active);
    }
    
    function testCannotRegisterFeedAsNonOwner() public {
        vm.prank(address(2));
        vm.expectRevert("Not authorized");
        registry.registerFeed(FEED_ID, address(aggregator), HEARTBEAT, MAX_DEVIATION);
    }
    
    function testDeactivateFeed() public {
        vm.startPrank(owner);
        
        registry.registerFeed(FEED_ID, address(aggregator), HEARTBEAT, MAX_DEVIATION);
        registry.deactivateFeed(FEED_ID);
        
        IFeedRegistry.FeedConfig memory config = registry.getFeedConfig(FEED_ID);
        assertFalse(config.active);
        
        vm.stopPrank();
    }
    
    function testUpdateFeed() public {
        vm.startPrank(owner);
        
        registry.registerFeed(FEED_ID, address(aggregator), HEARTBEAT, MAX_DEVIATION);
        
        Aggregator newAggregator = new Aggregator(FEED_ID, 5, hex"");
        registry.updateFeed(FEED_ID, address(newAggregator));
        
        IFeedRegistry.FeedConfig memory config = registry.getFeedConfig(FEED_ID);
        assertEq(config.aggregator, address(newAggregator));
        
        vm.stopPrank();
    }
}
