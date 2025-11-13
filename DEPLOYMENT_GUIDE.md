# RION Oracle Network - Complete Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- [x] Node.js 18+ installed
- [x] Foundry installed (`curl -L https://foundry.paradigm.xyz | bash && foundryup`)
- [x] Git installed
- [x] 6 funded BNB Testnet wallets (4-7 tBNB total)
- [x] The Odds API key ($30/month plan)
- [x] Vercel account (for frontend deployment)

---

## Step 1: Clone & Setup Project

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd rion-oracle-network

git init

# Install frontend dependencies
npm install

# Install Foundry dependencies (IMPORTANT!)
forge install foundry-rs/forge-std

# Build contracts to verify setup
forge build
\`\`\`

---

## Step 2: Configure Environment Variables

### Create `.env` file in project root:

\`\`\`bash
cp .env.example .env
\`\`\`

### Fill in the `.env` file:

> **Need help with variable names?** See `ENV_VARIABLE_MAPPING.md` for a complete mapping guide.

#### **A. Blockchain Configuration**
\`\`\`env
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_RPC_URL="https://data-seed-prebsc-1-s1.binance.org:8545"
\`\`\`

#### **B. Your 6 Funded Wallets (Private Keys)**

**Get from MetaMask:** Settings → Security & Privacy → Show Private Key

\`\`\`env
# Wallet 1: Deployer + Admin (1-2 tBNB)
DEPLOYER_PRIVATE_KEY="0x..."

# Wallet 2: Council-01 Oracle Node (0.5 tBNB)
COUNCIL_01_PRIVATE_KEY="0x..."

# Wallet 3: Council-02 Oracle Node (0.5 tBNB)
COUNCIL_02_PRIVATE_KEY="0x..."

# Wallet 4: Council-03 Oracle Node (0.5 tBNB)
COUNCIL_03_PRIVATE_KEY="0x..."

# Wallet 5: Watchtower (0.5-1 tBNB)
WATCHTOWER_PRIVATE_KEY="0x..."

# Wallet 6: Test User (0.1 tBNB)
TEST_USER_PRIVATE_KEY="0x..."
\`\`\`

#### **C. Off-Chain Signing Keys (Generate 5 New Wallets - NO funding needed)**

**Generate new wallets:**

\`\`\`bash
# Run this command 5 times to generate 5 different wallets
cast wallet new
\`\`\`

**Then add them to .env:**

\`\`\`env
# Council Signing Keys (sign price data off-chain)
COUNCIL_01_SIGNER_PRIVATE_KEY="0x..."
COUNCIL_02_SIGNER_PRIVATE_KEY="0x..."
COUNCIL_03_SIGNER_PRIVATE_KEY="0x..."

# Relay Signer (for meta-transactions)
RELAY_SIGNER_PRIVATE_KEY="0x..."

# Provider Receipt Signer (for HTTP-402 receipts)
PROVIDER_RECEIPT_SIGNER_PRIVATE_KEY="0x..."
\`\`\`

#### **D. API Keys**

**The Odds API:** Sign up at https://the-odds-api.com

\`\`\`env
THE_ODDS_API_KEY="your_api_key_here"
\`\`\`

**BscScan API:** Get from https://bscscan.com/myapikey

\`\`\`env
BSC_API_KEY="your_bscscan_api_key"
\`\`\`

#### **E. Contract Addresses (Leave Empty for Now)**

\`\`\`env
# Will be filled after deployment in Step 3
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS=""
NEXT_PUBLIC_DISPUTE_ADDRESS=""
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS=""
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS=""
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=""
\`\`\`

---

## Step 3: Deploy Smart Contracts to BNB Testnet

### Run Deployment Script:

\`\`\`bash
forge script script/Deploy.s.sol \
  --rpc-url $NEXT_PUBLIC_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BSC_API_KEY \
  -vvvv
\`\`\`

### Expected Output:

\`\`\`
== Logs ==
Deploying to BNB Testnet...
FeedRegistry deployed at: 0x1234...
DisputeManager deployed at: 0x9abc...
InsuranceVault deployed at: 0xdef0...
ReceiptStore deployed at: 0x1111...
PredictionMarket deployed at: 0x2222...
Deployment successful!
\`\`\`

### Copy Deployed Addresses to `.env`:

\`\`\`env
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS="0x1234..."
NEXT_PUBLIC_DISPUTE_ADDRESS="0x9abc..."
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS="0xdef0..."
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS="0x1111..."
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS="0x2222..."
\`\`\`

### Fund InsuranceVault:

\`\`\`bash
cast send $NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS \
  --value 5ether \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url $NEXT_PUBLIC_RPC_URL
\`\`\`

---

## Step 4: Setup Oracle Nodes (3 Nodes)

Each of your 3 Council wallets will run an oracle node.

### Create `oracle-node/` directory:

\`\`\`bash
mkdir oracle-node
cd oracle-node
npm init -y
npm install ethers@6 axios dotenv
\`\`\`

### Create `oracle-node/config.json`:

\`\`\`json
{
  "rpcUrl": "https://data-seed-prebsc-1-s1.binance.org:8545",
  "chainId": 97,
  "feedRegistryAddress": "0x1234...",
  "oddsApiKey": "your_odds_api_key",
  "nodes": [
    {
      "name": "Council-01",
      "privateKey": "0x...",
      "signerKey": "0x..."
    },
    {
      "name": "Council-02",
      "privateKey": "0x...",
      "signerKey": "0x..."
    },
    {
      "name": "Council-03",
      "privateKey": "0x...",
      "signerKey": "0x..."
    }
  ]
}
\`\`\`

### Create `oracle-node/index.js`:

\`\`\`javascript
const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Load config
const config = require('./config.json');

// Setup provider
const provider = new ethers.JsonRpcProvider(config.rpcUrl);

// FeedRegistry ABI (simplified)
const feedRegistryABI = [
  "function submitReport(bytes32 feedId, int256 value, uint256 timestamp, bytes[] signatures) external"
];

// Initialize contracts
const feedRegistry = new ethers.Contract(
  config.feedRegistryAddress,
  feedRegistryABI,
  provider
);

// Oracle node class
class OracleNode {
  constructor(nodeConfig) {
    this.name = nodeConfig.name;
    this.wallet = new ethers.Wallet(nodeConfig.privateKey, provider);
    this.signer = new ethers.Wallet(nodeConfig.signerKey);
  }

  // Fetch BNB price from Binance
  async fetchBNBPrice() {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
    return parseFloat(response.data.price);
  }

  // Fetch NBA game results from The Odds API
  async fetchNBAResults() {
    const response = await axios.get(
      `https://api.the-odds-api.com/v4/sports/basketball_nba/scores`,
      {
        params: {
          apiKey: config.oddsApiKey,
          daysFrom: 1,
          completed: true
        }
      }
    );
    return response.data;
  }

  // Sign data off-chain
  async signData(feedId, value, timestamp) {
    const messageHash = ethers.solidityPackedKeccak256(
      ['bytes32', 'int256', 'uint256'],
      [feedId, value, timestamp]
    );
    return await this.signer.signMessage(ethers.getBytes(messageHash));
  }

  // Submit price feed
  async submitPriceFeed() {
    try {
      const price = await this.fetchBNBPrice();
      const feedId = ethers.id("BNB/USD");
      const value = Math.floor(price * 1e8); // 8 decimals
      const timestamp = Math.floor(Date.now() / 1000);

      // Sign the data
      const signature = await this.signData(feedId, value, timestamp);

      console.log(`[${this.name}] Submitting BNB/USD: $${price}`);

      // Submit to FeedRegistry
      const tx = await feedRegistry.connect(this.wallet).submitReport(
        feedId,
        value,
        timestamp,
        [signature]
      );

      await tx.wait();
      console.log(`[${this.name}] ✅ Submitted successfully`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Error:`, error.message);
    }
  }

  // Submit NBA game results
  async submitNBAResults() {
    try {
      const games = await this.fetchNBAResults();

      for (const game of games) {
        if (!game.completed) continue;

        const feedId = ethers.id(`NBA/${game.id}`);
        const winner = game.scores[0].score > game.scores[1].score ? 1 : 2;
        const timestamp = Math.floor(new Date(game.commence_time).getTime() / 1000);

        const signature = await this.signData(feedId, winner, timestamp);

        console.log(`[${this.name}] Submitting ${game.home_team} vs ${game.away_team}: Winner=${winner}`);

        const tx = await feedRegistry.connect(this.wallet).submitReport(
          feedId,
          winner,
          timestamp,
          [signature]
        );

        await tx.wait();
        console.log(`[${this.name}] ✅ NBA result submitted`);
      }
    } catch (error) {
      console.error(`[${this.name}] ❌ Error:`, error.message);
    }
  }

  // Start the oracle node
  start() {
    console.log(`[${this.name}] 🚀 Oracle node started`);

    // Submit price feeds every 30 seconds
    setInterval(() => this.submitPriceFeed(), 30000);

    // Check for NBA results every 60 seconds
    setInterval(() => this.submitNBAResults(), 60000);

    // Submit immediately on start
    this.submitPriceFeed();
    this.submitNBAResults();
  }
}

// Start all oracle nodes
config.nodes.forEach(nodeConfig => {
  const node = new OracleNode(nodeConfig);
  node.start();
});

console.log('🌐 RION Oracle Network started');
console.log(`📊 Monitoring: BNB/USD prices + NBA game results`);
\`\`\`

### Run oracle nodes:

\`\`\`bash
node index.js
\`\`\`

### Expected Output:

\`\`\`
🌐 RION Oracle Network started
📊 Monitoring: BNB/USD prices + NBA game results
[Council-01] 🚀 Oracle node started
[Council-02] 🚀 Oracle node started
[Council-03] 🚀 Oracle node started
[Council-01] Submitting BNB/USD: $650.50
[Council-01] ✅ Submitted successfully
[Council-02] Submitting BNB/USD: $650.51
[Council-02] ✅ Submitted successfully
\`\`\`

---

## Step 5: Deploy Frontend to Vercel

### Create `.env.local` for frontend:

\`\`\`env
# Copy these from your deployed contracts
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS="0x1234..."
NEXT_PUBLIC_DISPUTE_ADDRESS="0x9abc..."
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS="0xdef0..."
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS="0x1111..."
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS="0x2222..."

# BNB Testnet
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_RPC_URL="https://data-seed-prebsc-1-s1.binance.org:8545"

# The Odds API (for frontend to display odds)
NEXT_PUBLIC_THE_ODDS_API_KEY="your_api_key_here"
\`\`\`

### Deploy to Vercel:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
\`\`\`

### Or use Vercel Dashboard:
1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variables from `.env.local`
4. Deploy

---

## Step 6: Test Everything

### A. Test Price Feeds

\`\`\`bash
# Check if oracle nodes are submitting data
cast call $NEXT_PUBLIC_FEED_REGISTRY_ADDRESS \
  "latestAnswer(bytes32)" $(cast --format-bytes32-string "BNB/USD") \
  --rpc-url $NEXT_PUBLIC_RPC_URL

# Should return something like: 65050000000 (650.50 with 8 decimals)
\`\`\`

### B. Test Frontend

1. Go to your Vercel URL
2. Connect MetaMask to BNB Testnet
3. Check "Live Feeds" page - should show BNB/USD updating
4. Go to "Predictions" page
5. Try placing a bet on an NBA game

### C. Test Prediction Market

\`\`\`bash
# Place a bet via contract
cast send $NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS \
  "placeBet(string,uint8)" "game_123" 1 \
  --value 0.1ether \
  --private-key $TEST_USER_PRIVATE_KEY \
  --rpc-url $NEXT_PUBLIC_RPC_URL

# Check your bet
cast call $NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS \
  "getUserBets(address)" $TEST_USER_ADDRESS \
  --rpc-url $NEXT_PUBLIC_RPC_URL
\`\`\`

---

## Step 7: Monitor System

### View Oracle Node Logs:

\`\`\`bash
# Your oracle-node/index.js should be running and showing:
[Council-01] Submitting BNB/USD: $650.50
[Council-01] ✅ Submitted successfully
[Council-02] Submitting NBA/game_123: Winner=1
[Council-02] ✅ NBA result submitted
\`\`\`

### Check BNB Testnet Explorer:

- FeedRegistry: https://testnet.bscscan.com/address/YOUR_ADDRESS
- View all transactions and submissions

---

## Troubleshooting

### Issue: "Insufficient funds" error

**Solution:** Fund your wallets with more tBNB from faucet

### Issue: Oracle nodes not submitting

**Solution:** 
- Check API keys are correct
- Verify RPC URL is working
- Check wallet has gas

### Issue: Frontend not connecting to MetaMask

**Solution:**
- Ensure MetaMask is on BNB Testnet (Chain ID 97)
- Check contract addresses in `.env.local`

### Issue: Predictions not resolving

**Solution:**
- Verify oracle nodes are submitting NBA results
- Check game ID matches between frontend and oracle
- Ensure game has finished

---

## Summary Checklist

- [ ] All 6 wallets funded with tBNB
- [ ] `.env` file configured with all variables
- [ ] Smart contracts deployed to BNB Testnet
- [ ] InsuranceVault funded with 5+ tBNB
- [ ] 3 oracle nodes running
- [ ] Frontend deployed to Vercel
- [ ] Tested price feeds working
- [ ] Tested prediction market working

---

## Next Steps

1. **Monitor Oracle Nodes:** Keep them running 24/7
2. **Add More Feeds:** Expand to ETH/USD, BTC/USD, NFL, Soccer
3. **Community Testing:** Invite users to test on testnet
4. **Mainnet Deployment:** Once stable, deploy to BNB Chain mainnet

---

**Need Help?**
- Documentation: `/docs` folder
- GitHub Issues: Open an issue
- Community: Join our Discord
