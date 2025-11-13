# Environment Variable Names - Clear Mapping Guide

This guide shows EXACTLY which wallet goes where in the `.env` file.

---

## Your 6 Funded Wallets

### Wallet 1: Deployer + Admin (1-2 tBNB)
**Purpose:** Deploys contracts, manages system

**In .env file:**
\`\`\`env
DEPLOYER_PRIVATE_KEY="0x..."
\`\`\`

---

### Wallet 2: Council-01 (0.5 tBNB)
**Purpose:** Oracle node that submits data on-chain

**In .env file:**
\`\`\`env
COUNCIL_01_PRIVATE_KEY="0x..."
\`\`\`

---

### Wallet 3: Council-02 (0.5 tBNB)
**Purpose:** Oracle node that submits data on-chain

**In .env file:**
\`\`\`env
COUNCIL_02_PRIVATE_KEY="0x..."
\`\`\`

---

### Wallet 4: Council-03 (0.5 tBNB)
**Purpose:** Oracle node that submits data on-chain

**In .env file:**
\`\`\`env
COUNCIL_03_PRIVATE_KEY="0x..."
\`\`\`

---

### Wallet 5: Watchtower (0.5-1 tBNB)
**Purpose:** Monitors for bad data, opens disputes

**In .env file:**
\`\`\`env
WATCHTOWER_PRIVATE_KEY="0x..."
\`\`\`

---

### Wallet 6: Test User (0.1 tBNB)
**Purpose:** Tests predictions and insurance claims

**In .env file:**
\`\`\`env
TEST_USER_PRIVATE_KEY="0x..."
\`\`\`

---

## Your 5 Off-Chain Signing Keys (NO funding needed)

### Signer 1: Council-01 Off-Chain Signer
**Purpose:** Signs price data off-chain for Council-01

**In .env file:**
\`\`\`env
COUNCIL_01_SIGNER_PRIVATE_KEY="0x..."
\`\`\`

---

### Signer 2: Council-02 Off-Chain Signer
**Purpose:** Signs price data off-chain for Council-02

**In .env file:**
\`\`\`env
COUNCIL_02_SIGNER_PRIVATE_KEY="0x..."
\`\`\`

---

### Signer 3: Council-03 Off-Chain Signer
**Purpose:** Signs price data off-chain for Council-03

**In .env file:**
\`\`\`env
COUNCIL_03_SIGNER_PRIVATE_KEY="0x..."
\`\`\`

---

### Signer 4: Relay Signer
**Purpose:** Signs relay messages for meta-transactions

**In .env file:**
\`\`\`env
RELAY_SIGNER_PRIVATE_KEY="0x..."
\`\`\`

---

### Signer 5: Provider Receipt Signer
**Purpose:** Signs HTTP-402 receipts for AI agents

**In .env file:**
\`\`\`env
PROVIDER_RECEIPT_SIGNER_PRIVATE_KEY="0x..."
\`\`\`

---

## Quick Reference Table

| Wallet Name | Needs Funding? | Amount | Env Variable Name |
|-------------|----------------|--------|-------------------|
| Deployer/Admin | YES | 1-2 tBNB | `DEPLOYER_PRIVATE_KEY` |
| Council-01 | YES | 0.5 tBNB | `COUNCIL_01_PRIVATE_KEY` |
| Council-02 | YES | 0.5 tBNB | `COUNCIL_02_PRIVATE_KEY` |
| Council-03 | YES | 0.5 tBNB | `COUNCIL_03_PRIVATE_KEY` |
| Watchtower | YES | 0.5-1 tBNB | `WATCHTOWER_PRIVATE_KEY` |
| Test User | YES | 0.1 tBNB | `TEST_USER_PRIVATE_KEY` |
| Council-01 Signer | NO | 0 tBNB | `COUNCIL_01_SIGNER_PRIVATE_KEY` |
| Council-02 Signer | NO | 0 tBNB | `COUNCIL_02_SIGNER_PRIVATE_KEY` |
| Council-03 Signer | NO | 0 tBNB | `COUNCIL_03_SIGNER_PRIVATE_KEY` |
| Relay Signer | NO | 0 tBNB | `RELAY_SIGNER_PRIVATE_KEY` |
| Receipt Signer | NO | 0 tBNB | `PROVIDER_RECEIPT_SIGNER_PRIVATE_KEY` |

---

## How to Fill It Out

### Step 1: Get Your 6 Funded Wallets
From MetaMask → Settings → Security & Privacy → Show Private Key

\`\`\`env
DEPLOYER_PRIVATE_KEY="0xabc123..."
COUNCIL_01_PRIVATE_KEY="0xdef456..."
COUNCIL_02_PRIVATE_KEY="0x789ghi..."
COUNCIL_03_PRIVATE_KEY="0xjkl012..."
WATCHTOWER_PRIVATE_KEY="0xmno345..."
TEST_USER_PRIVATE_KEY="0xpqr678..."
\`\`\`

### Step 2: Generate 5 New Signing Keys
Run this command 5 times:
\`\`\`bash
cast wallet new
\`\`\`

Copy each private key to:
\`\`\`env
COUNCIL_01_SIGNER_PRIVATE_KEY="0x..."
COUNCIL_02_SIGNER_PRIVATE_KEY="0x..."
COUNCIL_03_SIGNER_PRIVATE_KEY="0x..."
RELAY_SIGNER_PRIVATE_KEY="0x..."
PROVIDER_RECEIPT_SIGNER_PRIVATE_KEY="0x..."
\`\`\`

### Step 3: Add API Keys
\`\`\`env
THE_ODDS_API_KEY="your_key_from_theoddsapi.com"
BSC_API_KEY="your_key_from_bscscan.com"
\`\`\`

### Step 4: Deploy Contracts
After deployment, add contract addresses:
\`\`\`env
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS="0x..."
NEXT_PUBLIC_DISPUTE_ADDRESS="0x..."
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS="0x..."
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS="0x..."
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS="0x..."
\`\`\`

Done!
