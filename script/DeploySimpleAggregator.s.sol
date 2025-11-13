// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/SimpleAggregator.sol";
import "../contracts/FeedRegistry.sol";

contract DeploySimpleAggregator is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address feedRegistryAddress = vm.envAddress("NEXT_PUBLIC_FEED_REGISTRY_ADDRESS");
        
        // Get oracle addresses
        uint256 council01Key = vm.envUint("COUNCIL_01_PRIVATE_KEY");
        uint256 council02Key = vm.envUint("COUNCIL_02_PRIVATE_KEY");
        uint256 council03Key = vm.envUint("COUNCIL_03_PRIVATE_KEY");
        
        address council01 = vm.addr(council01Key);
        address council02 = vm.addr(council02Key);
        address council03 = vm.addr(council03Key);
        
        vm.startBroadcast(deployerKey);
        
        // Deploy SimpleAggregator for BNB/USD
        bytes32 feedId = keccak256("BNB/USD");
        SimpleAggregator simpleAgg = new SimpleAggregator(feedId);
        
        console.log("SimpleAggregator deployed at:", address(simpleAgg));
        
        // Authorize oracles
        simpleAgg.addOracle(council01);
        simpleAgg.addOracle(council02);
        simpleAgg.addOracle(council03);
        
        console.log("Authorized oracles:");
        console.log("  Council-01:", council01);
        console.log("  Council-02:", council02);
        console.log("  Council-03:", council03);
        
        // Update FeedRegistry to use SimpleAggregator
        FeedRegistry feedRegistry = FeedRegistry(feedRegistryAddress);
        feedRegistry.updateFeed(feedId, address(simpleAgg));
        
        console.log("FeedRegistry updated to use SimpleAggregator");
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Complete ===");
        console.log("Add this to your .env.local:");
        console.log("NEXT_PUBLIC_SIMPLE_AGGREGATOR_ADDRESS=", address(simpleAgg));
    }
}
