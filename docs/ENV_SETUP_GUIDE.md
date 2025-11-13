# Environment Variables Setup Guide

This guide explains every environment variable needed for the RION Oracle Network.

## Quick Start Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Generate 6 funded wallets (11 total keys)
- [ ] Get testnet BNB from faucet
- [ ] Deploy contracts and copy addresses
- [ ] Get API keys (BscScan, The Odds API, WalletConnect)
- [ ] Configure oracle nodes

---

## 1. Blockchain Configuration

### `NEXT_PUBLIC_CHAIN_ID=97`
**What:** BNB Chain Testnet ID  
**Action:** Leave as `97` (no changes needed)

### `NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545`
**What:** BNB Testnet RPC endpoint  
**Action:** Leave as default (or use your own RPC if you have one)

---

## 2. Wallet Setup (6 Funded Wallets)

### How to Generate Wallets

**Option 1: Using Foundry (Recommended)**
\`\`\`bash
# Generate a new wallet
cast wallet new

# Output:
# Successfully created new keypair.
# Address:     0x1234...
# Private key: 0xabcd...
\`\`\`

**Option 2: Using MetaMask**
1. Create new account in MetaMask
2. Go to Account Details → Export Private Key
3. Copy the private key

### How to Get Testnet BNB

Visit: https://testnet.bnbchain.org/faucet-smart

Request tBNB for each of your 6 funded wallets.

---

## 3. Wallet Variables Explained

### `DEPLOYER_PRIVATE_KEY`
**Who:** Deployer + Admin (combined role)  
**Needs:** 1-2 tBNB  
**Purpose:**
- Deploys all smart contracts
- Owns and manages contracts
- Funds the InsuranceVault

**How to fill:**
\`\`\`env
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
\`\`\`

---

### `COUNCIL_01_PRIVATE_KEY`, `COUNCIL_02_PRIVATE_KEY`, `COUNCIL_03_PRIVATE_KEY`
**Who:** Oracle nodes (Council-01, 02, 03)  
**Needs:** 0.2-0.5 tBNB each  
**Purpose:**
- Submit signed price data on-chain
- Submit sports results on-chain
- Pay gas fees for transactions

**How to fill:**
\`\`\`env
COUNCIL_01_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
COUNCIL_02_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
COUNCIL_03_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
\`\`\`

---

### `COUNCIL_01_SIGNER_PRIVATE_KEY`, `COUNCIL_02_SIGNER_PRIVATE_KEY`, `COUNCIL_03_SIGNER_PRIVATE_KEY`
**Who:** Off-chain signing keys  
**Needs:** NO funding required (never submit transactions)  
**Purpose:**
- Sign price data OFF-CHAIN
- Council wallets submit the signed data ON-CHAIN

**Important:** These are DIFFERENT from the Council wallet keys above.

**How to fill:**
\`\`\`env
COUNCIL_01_SIGNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
COUNCIL_02_SIGNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
COUNCIL_03_SIGNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
\`\`\`

---

### `WATCHTOWER_PRIVATE_KEY`
**Who:** Dispute monitor  
**Needs:** 0.5-1 tBNB  
**Purpose:**
- Monitors oracle data for inaccuracies
- Opens disputes when bad data detected
- Needs tBNB for dispute stake + gas

**How to fill:**
\`\`\`env
WATCHTOWER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
\`\`\`

---

### `TEST_USER_PRIVATE_KEY`
**Who:** Test user for demos  
**Needs:** 0.1 tBNB  
**Purpose:**
- Tests insurance claims
- Tests prediction market betting
- Only needs gas for transactions

**How to fill:**
\`\`\`env
TEST_USER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
\`\`\`

---

### `RELAY_SIGNER_PRIVATE_KEY`
**Who:** Meta-transaction signer  
**Needs:** NO funding required  
**Purpose:**
- Signs relay messages for meta-transactions
- Allows users to submit transactions without gas

**How to fill:**
\`\`\`env
RELAY_SIGNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
\`\`\`

---

### `PROVIDER_RECEIPT_SIGNER_PRIVATE_KEY`
**Who:** HTTP-402 receipt signer  
**Needs:** NO funding required  
**Purpose:**
- Signs HTTP-402 receipts for AI agents
- Enables pay-per-request oracle access

**How to fill:**
\`\`\`env
PROVIDER_RECEIPT_SIGNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
\`\`\`

---

## 4. Contract Addresses (After Deployment)

### Deploy Contracts First

\`\`\`bash
# Deploy all contracts
forge script script/Deploy.s.sol --rpc-url $NEXT_PUBLIC_RPC_URL --broadcast --private-key $DEPLOYER_PRIVATE_KEY

# Output will show deployed addresses:
# FeedRegistry deployed at: 0x1234...
# DisputeManager deployed at: 0x5678...
# etc.
\`\`\`

### Fill in Contract Addresses

\`\`\`env
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS=0x1234...
NEXT_PUBLIC_DISPUTE_ADDRESS=0x5678...
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS=0x9abc...
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS=0xdef0...
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x1111...
\`\`\`

---

## 5. API Keys

### `BSC_API_KEY`
**What:** BscScan API key for contract verification  
**Get from:** https://bscscan.com/myapikey  
**Required:** Optional (but recommended for verified contracts)

**How to get:**
1. Create account on BscScan
2. Go to "API Keys" section
3. Create new API key
4. Copy and paste

\`\`\`env
BSC_API_KEY=YOUR_BSCSCAN_API_KEY
\`\`\`

---

### `THE_ODDS_API_KEY`
**What:** Sports data API for NBA predictions  
**Get from:** https://the-odds-api.com  
**Cost:** $30/month (20,000 credits)  
**Required:** Yes (for predictions demo)

**How to get:**
1. Sign up at the-odds-api.com
2. Subscribe to $30/month plan
3. Copy API key from dashboard

\`\`\`env
THE_ODDS_API_KEY=YOUR_ODDS_API_KEY
\`\`\`

---

### `BINANCE_API_KEY`
**What:** Binance API for price feeds  
**Get from:** https://www.binance.com/en/my/settings/api-management  
**Required:** Optional (public endpoints work without key)

\`\`\`env
BINANCE_API_KEY=YOUR_BINANCE_API_KEY
\`\`\`

---

### `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
**What:** WalletConnect project ID for wallet connection  
**Get from:** https://cloud.walletconnect.com  
**Required:** Yes (for wallet connection in frontend)

**How to get:**
1. Sign up at cloud.walletconnect.com
2. Create new project
3. Copy Project ID

\`\`\`env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID
\`\`\`

---

## 6. Oracle Node Configuration

### `PRICE_UPDATE_INTERVAL=30000`
**What:** How often to fetch price data (milliseconds)  
**Default:** 30000 (30 seconds)  
**Action:** Leave as default or adjust based on needs

### `SPORTS_UPDATE_INTERVAL=60000`
**What:** How often to check for finished games (milliseconds)  
**Default:** 60000 (60 seconds)  
**Action:** Leave as default or adjust based on needs

### `MIN_PRICE_CHANGE_PERCENT=0.5`
**What:** Minimum price change to trigger update (percentage)  
**Default:** 0.5 (0.5% change)  
**Action:** Leave as default or adjust based on needs

---

## Summary: What You Need

### Total Wallets: 11 Private Keys

**6 Funded Wallets (need tBNB):**
1. Deployer + Admin (1-2 tBNB)
2. Council-01 (0.5 tBNB)
3. Council-02 (0.5 tBNB)
4. Council-03 (0.5 tBNB)
5. Watchtower (0.5-1 tBNB)
6. Test User (0.1 tBNB)

**Total tBNB needed: ~4-7 tBNB**

**5 Off-Chain Keys (NO funding needed):**
1. Council-01 Signer
2. Council-02 Signer
3. Council-03 Signer
4. Relay Signer
5. Provider Receipt Signer

### API Keys Needed:
1. BscScan API Key (optional)
2. The Odds API Key (required for predictions)
3. Binance API Key (optional)
4. WalletConnect Project ID (required)

---

## Deployment Checklist

- [ ] Generate 11 private keys (6 funded + 5 off-chain)
- [ ] Fund 6 wallets with testnet BNB
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all private keys
- [ ] Get API keys (BscScan, The Odds API, WalletConnect)
- [ ] Deploy contracts: `forge script script/Deploy.s.sol --rpc-url $NEXT_PUBLIC_RPC_URL --broadcast`
- [ ] Copy deployed contract addresses to `.env.local`
- [ ] Verify contracts on BscScan (optional)
- [ ] Start oracle nodes
- [ ] Test frontend connection
- [ ] Deploy to Vercel

---

## Security Notes

- **NEVER commit `.env.local` to git**
- **NEVER share private keys**
- **Use testnet only for testing**
- **For mainnet, use hardware wallets or secure key management**
