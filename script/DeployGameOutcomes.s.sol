// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/GameOutcomeAggregator.sol";

contract DeployGameOutcomes is Script {
    // Oracle addresses
    address constant COUNCIL_01 = 0xD53c0d3118Ea819A7842C390D9c855550b4E0Ed3;
    address constant COUNCIL_02 = 0x1678b27db792638538a9D47129E000aa227265Ff;
    address constant COUNCIL_03 = 0x1deC4755eC37B0B260A4991968Faf35d820fD103;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy 5 game outcome aggregators for upcoming NBA games
        string[5] memory gameIds = [
            "lakers-vs-celtics",
            "warriors-vs-nets", 
            "heat-vs-bucks",
            "suns-vs-mavericks",
            "76ers-vs-nuggets"
        ];
        
        for (uint i = 0; i < gameIds.length; i++) {
            bytes32 gameId = keccak256(abi.encodePacked(gameIds[i]));
            
            GameOutcomeAggregator aggregator = new GameOutcomeAggregator(gameId);
            
            // Authorize all 3 council members
            aggregator.authorizeOracle(COUNCIL_01);
            aggregator.authorizeOracle(COUNCIL_02);
            aggregator.authorizeOracle(COUNCIL_03);
            
            console.log("Game:", gameIds[i]);
            console.log("Aggregator:", address(aggregator));
            console.log("---");
        }
        
        vm.stopBroadcast();
    }
}
