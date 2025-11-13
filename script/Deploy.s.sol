// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/FeedRegistry.sol";
import "../contracts/Aggregator.sol";
import "../contracts/DisputeManager.sol";
import "../contracts/InsuranceVault.sol";
import "../contracts/ReceiptStore.sol";
import "../contracts/PredictionMarket.sol";

/**
 * @title Deploy
 * @notice Deployment script for RION Oracle Network
 * @dev Run with: forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy FeedRegistry
        console.log("Deploying FeedRegistry...");
        FeedRegistry feedRegistry = new FeedRegistry();
        console.log("FeedRegistry deployed at:", address(feedRegistry));

        // 2. Deploy InsuranceVault
        console.log("Deploying InsuranceVault...");
        InsuranceVault insuranceVault = new InsuranceVault();
        console.log("InsuranceVault deployed at:", address(insuranceVault));

        // 3. Deploy DisputeManager
        console.log("Deploying DisputeManager...");
        DisputeManager disputeManager = new DisputeManager(
            address(feedRegistry),
            address(insuranceVault)
        );
        console.log("DisputeManager deployed at:", address(disputeManager));

        // 4. Deploy ReceiptStore
        console.log("Deploying ReceiptStore...");
        ReceiptStore receiptStore = new ReceiptStore(address(feedRegistry));
        console.log("ReceiptStore deployed at:", address(receiptStore));

        // 5. Deploy sample Aggregator for BNB/USD
        console.log("Deploying BNB/USD Aggregator...");
        bytes32 bnbUsdFeedId = keccak256("BNB/USD");
        uint256 committeeSize = 5;
        bytes memory committeePublicKey = hex""; // Empty for MVP
        
        Aggregator bnbUsdAggregator = new Aggregator(
            bnbUsdFeedId,
            committeeSize,
            committeePublicKey
        );
        console.log("BNB/USD Aggregator deployed at:", address(bnbUsdAggregator));

        // 6. Register BNB/USD feed
        console.log("Registering BNB/USD feed...");
        feedRegistry.registerFeed(
            bnbUsdFeedId,
            address(bnbUsdAggregator),
            300, // 5 minute heartbeat
            500  // 5% max deviation
        );

        // 7. Set up contract relationships
        console.log("Setting up contract relationships...");
        insuranceVault.setDisputeContract(address(disputeManager));
        bnbUsdAggregator.setFeedRegistry(address(feedRegistry));

        // 8. Deploy PredictionMarket
        console.log("Deploying PredictionMarket...");
        PredictionMarket predictionMarket = new PredictionMarket(
            address(feedRegistry),
            address(insuranceVault)
        );
        console.log("PredictionMarket deployed at:", address(predictionMarket));

        console.log("\n=== Attempting to fund InsuranceVault ===");
        uint256 fundingAmount = 1 ether; // Changed from 10 ether to 1 ether
        if (address(msg.sender).balance >= fundingAmount) {
            console.log("Funding InsuranceVault with", fundingAmount / 1e18, "tBNB...");
            insuranceVault.fundVault{value: fundingAmount}();
            console.log("InsuranceVault funded successfully!");
        } else {
            console.log("WARNING: Insufficient balance to fund InsuranceVault");
            console.log("Current balance:", address(msg.sender).balance / 1e18, "tBNB");
            console.log("Required:", fundingAmount / 1e18, "tBNB");
            console.log("You can fund it manually later using:");
            console.log("cast send", address(insuranceVault), "\"fundVault()\" --value 1ether --private-key $DEPLOYER_PRIVATE_KEY");
        }

        vm.stopBroadcast();

        // Print deployment summary
        console.log("\n=== RION Oracle Network Deployment Summary ===");
        console.log("FeedRegistry:", address(feedRegistry));
        console.log("InsuranceVault:", address(insuranceVault));
        console.log("DisputeManager:", address(disputeManager));
        console.log("ReceiptStore:", address(receiptStore));
        console.log("BNB/USD Aggregator:", address(bnbUsdAggregator));
        console.log("PredictionMarket:", address(predictionMarket));
        console.log("\nSave these addresses to your .env file!");
    }
}
