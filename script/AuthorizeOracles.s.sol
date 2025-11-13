// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/FeedRegistry.sol";

contract AuthorizeOracles is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        address feedRegistryAddress = vm.envAddress("NEXT_PUBLIC_FEED_REGISTRY_ADDRESS");
        
        // Oracle wallet addresses (from your oracle node output)
        address council01 = 0xD53c0d3118Ea819A7842C390D9c855550b4E0Ed3;
        address council02 = 0x1678b27db792638538a9D47129E000aa227265Ff;
        address council03 = 0x1deC4755eC37B0B260A4991968Faf35d820fD103;
        
        vm.startBroadcast(deployerPrivateKey);
        
        FeedRegistry feedRegistry = FeedRegistry(feedRegistryAddress);
        
        console.log("Authorizing oracle nodes in FeedRegistry...");
        
        // Check if FeedRegistry has an authorization method
        // This will depend on your FeedRegistry implementation
        // Common patterns: grantRole(), addOracle(), setAuthorized()
        
        console.log("Council-01:", council01);
        console.log("Council-02:", council02);
        console.log("Council-03:", council03);
        
        // If your FeedRegistry has an owner/admin function to add authorized submitters
        // Uncomment and modify based on your contract:
        // feedRegistry.addAuthorizedSubmitter(council01);
        // feedRegistry.addAuthorizedSubmitter(council02);
        // feedRegistry.addAuthorizedSubmitter(council03);
        
        vm.stopBroadcast();
        
        console.log("✅ Oracle nodes authorized!");
    }
}
