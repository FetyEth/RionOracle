#!/bin/bash

# RION Oracle Network - BNB Testnet Deployment Script

echo "🚀 Deploying RION Oracle Network to BNB Testnet..."
echo ""

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
  echo "❌ Error: PRIVATE_KEY environment variable not set"
  echo "   Set it with: export PRIVATE_KEY=your_private_key"
  exit 1
fi

# Deploy FeedRegistry
echo "📝 Deploying FeedRegistry..."
REGISTRY_ADDRESS=$(forge create contracts/FeedRegistry.sol:FeedRegistry \
  --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 \
  --private-key $PRIVATE_KEY \
  --json | jq -r '.deployedTo')

echo "✅ FeedRegistry deployed at: $REGISTRY_ADDRESS"
echo ""

# Deploy Aggregator for BNB/USD
echo "📝 Deploying BNB/USD Aggregator..."
BNB_FEED_ID="0x$(echo -n 'BNB/USD' | xxd -p | tr -d '\n' | head -c 64 | awk '{printf "%-64s", $0}' | tr ' ' '0')"

BNB_AGGREGATOR=$(forge create contracts/Aggregator.sol:Aggregator \
  --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 \
  --private-key $PRIVATE_KEY \
  --constructor-args "$BNB_FEED_ID" 5 60 100 \
  --json | jq -r '.deployedTo')

echo "✅ BNB/USD Aggregator deployed at: $BNB_AGGREGATOR"
echo ""

# Deploy Dispute contract
echo "📝 Deploying Dispute contract..."
DISPUTE_ADDRESS=$(forge create contracts/Dispute.sol:Dispute \
  --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 \
  --private-key $PRIVATE_KEY \
  --constructor-args $REGISTRY_ADDRESS \
  --json | jq -r '.deployedTo')

echo "✅ Dispute deployed at: $DISPUTE_ADDRESS"
echo ""

# Deploy InsuranceVault
echo "📝 Deploying InsuranceVault..."
VAULT_ADDRESS=$(forge create contracts/InsuranceVault.sol:InsuranceVault \
  --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 \
  --private-key $PRIVATE_KEY \
  --constructor-args $DISPUTE_ADDRESS \
  --json | jq -r '.deployedTo')

echo "✅ InsuranceVault deployed at: $VAULT_ADDRESS"
echo ""

# Deploy ReceiptStore
echo "📝 Deploying ReceiptStore..."
RECEIPT_ADDRESS=$(forge create contracts/ReceiptStore.sol:ReceiptStore \
  --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 \
  --private-key $PRIVATE_KEY \
  --json | jq -r '.deployedTo')

echo "✅ ReceiptStore deployed at: $RECEIPT_ADDRESS"
echo ""

# Save deployment addresses
cat > deployments/bnb-testnet.json << EOF
{
  "network": "BNB Testnet",
  "chainId": 97,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "FeedRegistry": "$REGISTRY_ADDRESS",
    "Dispute": "$DISPUTE_ADDRESS",
    "InsuranceVault": "$VAULT_ADDRESS",
    "ReceiptStore": "$RECEIPT_ADDRESS"
  },
  "feeds": {
    "BNB/USD": {
      "feedId": "$BNB_FEED_ID",
      "aggregator": "$BNB_AGGREGATOR"
    }
  }
}
EOF

echo "🎉 Deployment Complete!"
echo ""
echo "📋 Deployment addresses saved to: deployments/bnb-testnet.json"
echo ""
echo "🔗 View on BscScan:"
echo "   FeedRegistry: https://testnet.bscscan.com/address/$REGISTRY_ADDRESS"
echo "   BNB/USD Aggregator: https://testnet.bscscan.com/address/$BNB_AGGREGATOR"
echo "   Dispute: https://testnet.bscscan.com/address/$DISPUTE_ADDRESS"
echo "   InsuranceVault: https://testnet.bscscan.com/address/$VAULT_ADDRESS"
echo "   ReceiptStore: https://testnet.bscscan.com/address/$RECEIPT_ADDRESS"
