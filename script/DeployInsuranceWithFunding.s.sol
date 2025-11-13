// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/InsuranceVault.sol";

contract DeployInsuranceWithFunding is Script {
    function run() external {
        // This will use the private key from --private-key flag
        vm.startBroadcast();

        // Deploy InsuranceVault (deployer becomes owner)
        InsuranceVault vault = new InsuranceVault();
        
        console.log("InsuranceVault deployed to:", address(vault));
        console.log("Owner:", vault.owner());
        
        // Fund the vault with 1 BNB
        (bool success,) = address(vault).call{value: 1 ether}("");
        require(success, "Funding failed");
        
        console.log("Vault funded with 1 BNB");
        console.log("Vault balance:", address(vault).balance);

        vm.stopBroadcast();
    }
}
