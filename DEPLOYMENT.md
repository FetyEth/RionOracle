# RION Oracle Network - Deployment Guide

## Prerequisites

1. **BNB Testnet BNB**: Get testnet BNB from [BNB Faucet](https://testnet.bnbchain.org/faucet-smart)
2. **Foundry**: Install from [getfoundry.sh](https://getfoundry.sh)
3. **Private Key**: Export your deployer wallet private key

## Deployment Steps

### 1. Install Dependencies

\`\`\`bash
# Install Foundry dependencies
forge install

# Install Node dependencies
npm install
\`\`\`

### 2. Set Environment Variables

\`\`\`bash
# Copy example env file
cp .env.example .env.local

# Set your private key (NEVER commit this)
export PRIVATE_KEY=your_private_key_here
\`\`\`

### 3. Deploy to BNB Testnet

\`\`\`bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
\`\`\`

This will:
- Deploy FeedRegistry contract
- Deploy Aggregator for BNB/USD feed
- Deploy Dispute contract
- Deploy InsuranceVault contract
- Deploy ReceiptStore contract
- Save addresses to `deployments/bnb-testnet.json`

### 4. Update Environment Variables

After deployment, copy the contract addresses from `deployments/bnb-testnet.json` to your `.env.local`:

\`\`\`env
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_DISPUTE_ADDRESS=0x...
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS=0x...
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS=0x...
\`\`\`

### 5. Verify Contracts (Optional)

\`\`\`bash
# Set BscScan API key
export BSC_API_KEY=your_api_key

# Verify FeedRegistry
forge verify-contract \
  --chain-id 97 \
  --compiler-version 0.8.24 \
  <REGISTRY_ADDRESS> \
  contracts/FeedRegistry.sol:FeedRegistry

# Repeat for other contracts...
\`\`\`

### 6. Start the Explorer

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the RION Oracle Explorer.

## Network Information

- **Chain ID**: 97
- **RPC URL**: https://data-seed-prebsc-1-s1.binance.org:8545
- **Explorer**: https://testnet.bscscan.com
- **Faucet**: https://testnet.bnbchain.org/faucet-smart

## Testnet Limitations

- Testnet BNB has no real value
- Network may be slower than mainnet
- Data is for testing purposes only
- Contracts can be redeployed as needed

## Mainnet Deployment

For mainnet deployment:

1. Update `foundry.toml` to use `bsc_mainnet` profile
2. Ensure sufficient BNB for gas fees
3. Audit all contracts thoroughly
4. Use a hardware wallet or secure key management
5. Update RPC URL to mainnet endpoint

## Troubleshooting

**Insufficient funds**: Get testnet BNB from the faucet
**RPC errors**: Try alternative RPC endpoints from [ChainList](https://chainlist.org)
**Deployment fails**: Check gas price and network congestion
**Contract verification fails**: Ensure compiler version matches exactly

## Support

For issues or questions, open an issue on GitHub or contact the RION team.
