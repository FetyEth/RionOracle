// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/ReceiptStore.sol";

contract DeployReceipts is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address feedRegistry = vm.envAddress("NEXT_PUBLIC_FEED_REGISTRY_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ReceiptStore
        ReceiptStore receiptStore = new ReceiptStore(feedRegistry);
        
        console.log("ReceiptStore deployed to:", address(receiptStore));
        console.log("Feed Registry:", feedRegistry);
        
        vm.stopBroadcast();
    }
}
