// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/DisputeManager.sol";

contract DeployDisputes is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        address feedRegistry = vm.envAddress("NEXT_PUBLIC_FEED_REGISTRY_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy a simple insurance vault (just a wallet for now)
        address insuranceVault = msg.sender; // Deployer acts as vault initially
        
        // Deploy DisputeManager with correct constructor parameters
        DisputeManager disputeManager = new DisputeManager(feedRegistry, insuranceVault);
        
        console.log("DisputeManager deployed at:", address(disputeManager));
        console.log("Feed Registry:", feedRegistry);
        console.log("Insurance Vault:", insuranceVault);

        vm.stopBroadcast();
    }
}
