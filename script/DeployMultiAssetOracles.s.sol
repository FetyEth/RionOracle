// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contracts/SimpleAggregator.sol";

contract DeployMultiAssetOracles is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        address council01 = 0xD53c0d3118Ea819A7842C390D9c855550b4E0Ed3;
        address council02 = 0x1678b27db792638538a9D47129E000aa227265Ff;
        address council03 = 0x1deC4755eC37B0B260A4991968Faf35d820fD103;
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Asset names and their feed IDs
        string[6] memory assets = [
            "ETH/USD",
            "BTC/USD",
            "SOL/USD",
            "XRP/USD",
            "DOGE/USD",
            "LINK/USD"
        ];
        
        console.log("Deploying Multi-Asset Oracle System...\n");
        console.log("COPY THESE ADDRESSES TO YOUR CONFIG FILES:\n");
        
        for (uint256 i = 0; i < assets.length; i++) {
            bytes32 feedId = keccak256(bytes(assets[i]));
            
            SimpleAggregator aggregator = new SimpleAggregator(feedId);
            
            // Authorize all 3 council members
            aggregator.addOracle(council01);
            aggregator.addOracle(council02);
            aggregator.addOracle(council03);
            
            console.log("%s: %s", assets[i], address(aggregator));
        }
        
        console.log("\nAll 6 asset feeds deployed successfully!");
        console.log("Add these addresses to oracle-node/config.json and .env.local");
        
        vm.stopBroadcast();
    }
}
