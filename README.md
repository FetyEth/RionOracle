# RION Oracle Network

BNB-native oracle network with provable data feeds, dispute resolution, and user insurance.

## Features

- **Provable Data**: BLS signatures + Merkle proofs for every price
- **User Insurance**: Actual compensation for losses from bad data
- **Public Disputes**: Challenge incorrect reports with DAO voting
- **Dual Delivery**: Push for DeFi, Pull for AI agents (HTTP-402)
- **Low Cost**: Optimized for BNB Chain gas efficiency

## Quick Start

### Install SDK

\`\`\`bash
npm install @rion/sdk
\`\`\`

### Query Price Data

\`\`\`typescript
import { RionClient } from '@rion/sdk';

const client = new RionClient({
  rpcUrl: 'https://bsc-dataseed.binance.org',
  registryAddress: '0x...',
  chainId: 56,
});

const latest = await client.feeds.getLatestPrice('BNB/USD');
console.log(\`Price: $\${client.feeds.formatPrice(latest.value)}\`);
\`\`\`

### Use in Solidity

\`\`\`solidity
import "@rion/contracts/interfaces/IFeedRegistry.sol";

contract MyProtocol {
  IFeedRegistry public oracle;
  
  function getPrice() public view returns (int256) {
    bytes32 feedId = keccak256("BNB/USD");
    (int256 price,,) = oracle.getLatestAnswer(feedId);
    return price;
  }
}
\`\`\`

## Architecture

### Three-Layer Design

1. **Alpha Aggregators**: Fetch prices, compute median, sign reports
2. **Beta Challengers**: Monitor feeds, create disputes
3. **Gamma Notaries**: Verify provenance, maintain audit trails

### Smart Contracts

- **FeedRegistry**: Main consumer entry point
- **Aggregator**: Committee reports and median calculation
- **Dispute**: Challenge system with DAO voting
- **InsuranceVault**: User compensation pool
- **ReceiptStore**: HTTP-402 receipt verification

## Project Structure

\`\`\`
rion-oracle/
├── contracts/          # Solidity smart contracts
│   ├── FeedRegistry.sol
│   ├── Aggregator.sol
│   ├── Dispute.sol
│   ├── InsuranceVault.sol
│   └── ReceiptStore.sol
├── sdk/               # TypeScript SDK
│   ├── client.ts
│   ├── feed-reader.ts
│   ├── dispute-manager.ts
│   └── receipt-verifier.ts
├── app/               # Next.js Explorer
│   ├── page.tsx       # Main explorer
│   ├── docs/          # Documentation
│   └── landing/       # Landing page
├── scripts/           # Deployment scripts
└── examples/          # Integration examples
\`\`\`

## Development

### Install Dependencies

\`\`\`bash
npm install
forge install
\`\`\`

### Run Explorer

\`\`\`bash
npm run dev
\`\`\`

### Deploy Contracts to BNB Testnet

**⚠️ Contracts are not yet deployed. Follow these steps:**

1. **Get Testnet BNB**: Visit [BNB Faucet](https://testnet.bnbchain.org/faucet-smart)

2. **Set Private Key**:
\`\`\`bash
export PRIVATE_KEY=your_private_key_here
\`\`\`

3. **Deploy Contracts**:
\`\`\`bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
\`\`\`

4. **Update Environment**: Copy addresses from \`deployments/bnb-testnet.json\` to \`.env.local\`

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) or visit \`/deploy\` in the app.

### Run Tests

\`\`\`bash
forge test
npm test
\`\`\`

## Contract Addresses

### BSC Testnet

**Status**: 🚧 Pending Deployment

Contracts will be deployed to BNB Testnet (Chain ID: 97). After deployment, addresses will be available in \`deployments/bnb-testnet.json\`.

To deploy, run:
\`\`\`bash
./scripts/deploy.sh
\`\`\`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Links

- [Explorer](https://rion.network)
- [Documentation](https://docs.rion.network)
- [GitHub](https://github.com/rion-network)
- [Discord](https://discord.gg/rion)
- [Twitter](https://twitter.com/rion_network)
