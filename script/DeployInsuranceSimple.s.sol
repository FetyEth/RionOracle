// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/InsuranceVault.sol";

contract DeployInsuranceSimple is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy InsuranceVault
        InsuranceVault insuranceVault = new InsuranceVault();
        
        console.log("=====================================");
        console.log("InsuranceVault deployed to:", address(insuranceVault));
        console.log("=====================================");
        console.log("Add this to your .env.local:");
        console.log("NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS=", address(insuranceVault));
        console.log("=====================================");
        
        // Optionally fund the vault if deployer has enough balance
        // You can send BNB to the vault manually later
        uint256 balance = address(msg.sender).balance;
        if (balance >= 0.1 ether) {
            (bool success, ) = address(insuranceVault).call{value: 0.1 ether}("");
            if (success) {
                console.log("Vault funded with 0.1 BNB");
            }
        }
        
        vm.stopBroadcast();
    }
}
