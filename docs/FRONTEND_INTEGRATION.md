# Frontend Integration Guide

## Connecting Frontend to Smart Contracts

After deploying contracts to BNB Testnet, follow these steps to connect your frontend:

### 1. Update Environment Variables

Copy deployed contract addresses to `.env.local`:

\`\`\`env
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545

# Contract Addresses (from deployment)
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_DISPUTE_ADDRESS=0x...
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS=0x...
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS=0x...
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x...

# The Odds API
THE_ODDS_API_KEY=your_api_key_here
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install ethers@^6.0.0 wagmi@^2.0.0 viem@^2.0.0
\`\`\`

### 3. Create Contract Hooks

\`\`\`typescript
// lib/contracts.ts
import { useReadContract, useWriteContract } from 'wagmi'
import PredictionMarketABI from './abis/PredictionMarket.json'

export function usePredictionMarket() {
  const address = process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS as \`0x\${string}\`
  
  const { data: games } = useReadContract({
    address,
    abi: PredictionMarketABI,
    functionName: 'getActiveGames',
  })
  
  const { writeContract } = useWriteContract()
  
  const placeBet = async (gameId: string, team: string, amount: bigint) => {
    return writeContract({
      address,
      abi: PredictionMarketABI,
      functionName: 'placeBet',
      args: [gameId, team],
      value: amount,
    })
  }
  
  return { games, placeBet }
}
\`\`\`

### 4. Update Predictions Page

Replace mock data with real contract calls:

\`\`\`typescript
// app/predictions/page.tsx
import { usePredictionMarket } from '@/lib/contracts'

export default function PredictionsPage() {
  const { games, placeBet } = usePredictionMarket()
  
  // Use real games data instead of mock
  // ...
}
\`\`\`

### 5. Setup Oracle Nodes

See `docs/SPORTS_DATA_INTEGRATION.md` for oracle node setup.

### 6. Test on BNB Testnet

1. Get testnet BNB from faucet
2. Connect wallet to BNB Testnet
3. Place test predictions
4. Verify transactions on BscScan Testnet

## Deployment Checklist

- [ ] Deploy all contracts to BNB Testnet
- [ ] Update `.env.local` with contract addresses
- [ ] Configure The Odds API key
- [ ] Setup oracle nodes to fetch NBA data
- [ ] Test wallet connection
- [ ] Test placing predictions
- [ ] Test automatic payouts
- [ ] Deploy frontend to Vercel

## Production Deployment

For mainnet deployment:

1. Deploy contracts to BNB Mainnet
2. Update RPC URL to mainnet
3. Fund InsuranceVault with real BNB
4. Setup production oracle nodes
5. Enable contract verification on BscScan
6. Update frontend environment variables
7. Deploy to production

## Support

For issues or questions:
- Documentation: https://docs.rion.xyz
- GitHub: https://github.com/rion-oracle
- Discord: https://discord.gg/rion
\`\`\`
