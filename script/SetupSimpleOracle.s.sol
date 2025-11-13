// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/SimpleAggregator.sol";
import "../contracts/FeedRegistry.sol";

contract SetupSimpleOracle is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address feedRegistryAddr = vm.envAddress("NEXT_PUBLIC_FEED_REGISTRY_ADDRESS");
        
        // Get oracle addresses from private keys
        uint256 council1Key = vm.envUint("COUNCIL_01_PRIVATE_KEY");
        uint256 council2Key = vm.envUint("COUNCIL_02_PRIVATE_KEY");
        uint256 council3Key = vm.envUint("COUNCIL_03_PRIVATE_KEY");
        
        address oracle1 = vm.addr(council1Key);
        address oracle2 = vm.addr(council2Key);
        address oracle3 = vm.addr(council3Key);
        
        vm.startBroadcast(deployerKey);
        
        // Deploy SimpleAggregator for BNB/USD
        bytes32 feedId = keccak256("BNB/USD");
        SimpleAggregator simpleAgg = new SimpleAggregator(feedId);
        console.log("SimpleAggregator deployed:", address(simpleAgg));
        
        // Authorize the 3 oracles
        simpleAgg.addOracle(oracle1);
        simpleAgg.addOracle(oracle2);
        simpleAgg.addOracle(oracle3);
        console.log("Authorized oracle 1:", oracle1);
        console.log("Authorized oracle 2:", oracle2);
        console.log("Authorized oracle 3:", oracle3);
        
        // Update FeedRegistry to use SimpleAggregator
        FeedRegistry feedRegistry = FeedRegistry(feedRegistryAddr);
        feedRegistry.updateFeed(feedId, address(simpleAgg));
        console.log("Updated FeedRegistry to use SimpleAggregator");
        console.log("\nAdd this to your .env.local:");
        console.log("NEXT_PUBLIC_SIMPLE_AGGREGATOR_ADDRESS=", address(simpleAgg));
        
        vm.stopBroadcast();
    }
}
