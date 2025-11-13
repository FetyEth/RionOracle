#!/bin/bash

echo "🔐 Authorizing Oracle Nodes..."
echo ""
echo "This script will whitelist your 3 oracle wallets in the FeedRegistry"
echo ""

# Load environment variables
source .env.local

# Oracle addresses from your running nodes
COUNCIL_01="0xD53c0d3118Ea819A7842C390D9c855550b4E0Ed3"
COUNCIL_02="0x1678b27db792638538a9D47129E000aa227265Ff"
COUNCIL_03="0x1deC4755eC37B0B260A4991968Faf35d820fD103"

echo "Oracle Addresses:"
echo "  Council-01: $COUNCIL_01"
echo "  Council-02: $COUNCIL_02"
echo "  Council-03: $COUNCIL_03"
echo ""
echo "FeedRegistry: $NEXT_PUBLIC_FEED_REGISTRY_ADDRESS"
echo ""

# Check if FeedRegistry has grantRole function (AccessControl pattern)
echo "Checking FeedRegistry authorization method..."

# Try to grant SUBMITTER_ROLE (common pattern)
SUBMITTER_ROLE=$(cast keccak "SUBMITTER_ROLE")

echo "Granting SUBMITTER_ROLE to Council-01..."
cast send $NEXT_PUBLIC_FEED_REGISTRY_ADDRESS \
  "grantRole(bytes32,address)" \
  $SUBMITTER_ROLE \
  $COUNCIL_01 \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url $NEXT_PUBLIC_RPC_URL

echo "Granting SUBMITTER_ROLE to Council-02..."
cast send $NEXT_PUBLIC_FEED_REGISTRY_ADDRESS \
  "grantRole(bytes32,address)" \
  $SUBMITTER_ROLE \
  $COUNCIL_02 \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url $NEXT_PUBLIC_RPC_URL

echo "Granting SUBMITTER_ROLE to Council-03..."
cast send $NEXT_PUBLIC_FEED_REGISTRY_ADDRESS \
  "grantRole(bytes32,address)" \
  $SUBMITTER_ROLE \
  $COUNCIL_03 \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url $NEXT_PUBLIC_RPC_URL

echo ""
echo "✅ All oracle nodes authorized!"
echo ""
echo "Now restart your oracle nodes:"
echo "  cd oracle-node"
echo "  npm start"
