// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/InsuranceVault.sol";

contract DeployInsurance is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy InsuranceVault
        InsuranceVault insuranceVault = new InsuranceVault();
        
        console.log("InsuranceVault deployed to:", address(insuranceVault));
        
        // Fund the vault with initial capital (1 BNB)
        insuranceVault.fundVault{value: 1 ether}();
        console.log("Vault funded with 1 BNB");
        
        vm.stopBroadcast();
    }
}
