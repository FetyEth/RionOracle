# RION Oracle Network - Smart Contracts

Complete Solidity implementation of the RION Oracle Network on BNB Chain.

## Architecture

### Core Contracts

1. **FeedRegistry.sol** - Main entry point for oracle consumers
   - Manages all oracle feeds
   - Routes queries to appropriate aggregators
   - Validates data freshness

2. **Aggregator.sol** - Processes committee reports
   - Receives signed reports from oracle nodes
   - Calculates median from observations
   - Stores round data with Merkle roots

3. **DisputeManager.sol** - Handles disputes
   - 5-phase dispute resolution (Proposed → Evidence → Voting → Resolved)
   - Slashing mechanism for bad actors
   - Integration with insurance vault

4. **InsuranceVault.sol** - User compensation system
   - Accepts insurance claims from affected users
   - Processes payouts (up to 80% of losses)
   - Maintains minimum reserve

5. **ReceiptStore.sol** - HTTP-402 receipt verification
   - Stores receipts with Merkle proofs
   - Verifies data authenticity
   - Proof-of-attention for AI agents

### Libraries

- **ReportLib.sol** - Report validation and median calculation
- **MerkleProof.sol** - Merkle proof verification

## Deployment

### Prerequisites

1. Install Foundry:
\`\`\`bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
\`\`\`

2. Install dependencies:
\`\`\`bash
forge install
\`\`\`

3. Configure environment:
\`\`\`bash
cp .env.example .env
# Edit .env with your private key
\`\`\`

### Deploy to BNB Testnet

\`\`\`bash
# Get testnet BNB from faucet
# https://testnet.bnbchain.org/faucet-smart

# Deploy contracts
forge script script/Deploy.s.sol \
  --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 \
  --broadcast \
  --verify

# Save the deployed addresses to .env
\`\`\`

### Verify Contracts

\`\`\`bash
forge verify-contract \
  --chain-id 97 \
  --compiler-version v0.8.24 \
  <CONTRACT_ADDRESS> \
  contracts/FeedRegistry.sol:FeedRegistry
\`\`\`

## Testing

Run all tests:
\`\`\`bash
forge test
\`\`\`

Run with gas reporting:
\`\`\`bash
forge test --gas-report
\`\`\`

Run specific test:
\`\`\`bash
forge test --match-test testRegisterFeed
\`\`\`

## Contract Addresses (BNB Testnet)

After deployment, update these addresses in your frontend `.env.local`:

\`\`\`
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_DISPUTE_ADDRESS=0x...
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS=0x...
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS=0x...
\`\`\`

## Usage Examples

### Query Latest Price

```solidity
IFeedRegistry registry = IFeedRegistry(FEED_REGISTRY_ADDRESS);
bytes32 feedId = keccak256("BNB/USD");

(int256 price, uint256 timestamp, uint256 roundId) = registry.getLatestAnswer(feedId);
