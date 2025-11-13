# RION Oracle SDK

TypeScript SDK for integrating RION oracle feeds into your applications.

## Installation

\`\`\`bash
npm install @rion/sdk
\`\`\`

## Quick Start

\`\`\`typescript
import { RionClient } from '@rion/sdk';

const client = new RionClient({
  rpcUrl: 'https://bsc-dataseed.binance.org',
  registryAddress: '0x...',
  chainId: 56,
});

// Get latest price
const latest = await client.feeds.getLatestPrice('BNB/USD');
console.log(`Price: $${client.feeds.formatPrice(latest.value)}`);
\`\`\`

## Features

- **Price Feeds**: Query real-time and historical oracle data
- **Disputes**: Create and vote on data disputes
- **Receipts**: Verify HTTP-402 receipts with Merkle proofs
- **Subscriptions**: Real-time price updates via WebSocket
- **Type-Safe**: Full TypeScript support

## API Reference

### FeedReader

\`\`\`typescript
// Get latest price
const latest = await client.feeds.getLatestPrice('BNB/USD');

// Assert freshness
await client.feeds.assertFresh('BNB/USD', 300); // Max 5 minutes

// Subscribe to updates
const unsubscribe = client.feeds.subscribeToPriceUpdates('BNB/USD', (data) => {
  console.log('New price:', data.value);
});
\`\`\`

### DisputeManager

\`\`\`typescript
// Create dispute
const disputeId = await client.disputes.createDispute(
  'BNB/USD',
  12345,
  BigInt(61000000000),
  'Evidence URL',
  BigInt('100000000000000000')
);

// Vote on dispute
await client.disputes.voteOnDispute(disputeId, true);
\`\`\`

### ReceiptVerifier

\`\`\`typescript
// Verify receipt
const result = await client.receipts.verifyReceipt(receiptHash);

// Record attention (AI agents)
await client.receipts.recordAttention(receiptHash, metadata);
\`\`\`

## Examples

See the `/examples` directory for complete usage examples.

## License

MIT
