<p align="center">
  <img src="./assets/rion-app-banner.png" alt="RION Oracle App" width="100%" />
</p>

# RION Oracle App

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.19-purple?logo=ethereum)](https://wagmi.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?logo=twitter&logoColor=white)](https://x.com/RionOracle)
[![Website](https://img.shields.io/badge/Website-rion--oracle.com-blue)](https://www.rion-oracle.com/)

A comprehensive web interface for the RION Oracle Network — a BNB-native oracle system with provable data feeds, dispute resolution, and user insurance mechanisms.

## Overview

RION Oracle App is a full-featured frontend for interacting with the RION Oracle Network on BNB Chain. The application provides tools for:

- **Viewing and managing oracle data feeds** across multiple asset classes (crypto, sports outcomes)
- **Inspecting price history and feed integrity** with cryptographic proof verification
- **Participating in dispute resolution** through community voting
- **Managing prediction markets** and game outcome tracking
- **Accessing oracle SDK documentation** and integration guides
- **Receiving insurance compensation** for losses due to bad oracle data

The app serves developers, traders, and oracle operators who need to interact with on-chain price feeds, verify data integrity through BLS signatures and Merkle proofs, and participate in the network's governance mechanisms.

## Key Features

- **Provable Price Data** — BLS signatures and Merkle proofs for cryptographic verification of every price update
- **Live Feed Monitoring** — Real-time price feeds for crypto assets (BNB, ETH, BTC, SOL, XRP, DOGE, LINK) and sports outcomes
- **Public Dispute System** — Challenge incorrect oracle reports with community voting and resolution
- **User Insurance Vault** — Track and claim compensation for losses caused by bad oracle data
- **Receipt Verification** — Inspect and prove oracle data integrity with on-chain receipts
- **Prediction Markets** — View and interact with prediction market contracts and outcomes
- **SDK Integration** — Documentation and examples for developers building on RION
- **Explorer Dashboard** — Browse contracts, transactions, and network status
- **Wallet Integration** — Full Web3 support via RainbowKit and Wagmi for BNB Chain (Testnet & Mainnet)

## Tech Stack

### Frontend
- **Next.js 16** — React meta-framework with server & client components
- **React 19** — UI component library with hooks
- **TypeScript 5** — Static type safety across the application
- **Tailwind CSS 4** — Utility-first CSS with custom animations
- **Radix UI** — Unstyled, accessible component primitives
- **React Hook Form** — Performant form state management
- **TanStack React Query** — Server state management and data fetching

### Blockchain Integration
- **Wagmi 2** — React hooks for Ethereum interaction
- **Ethers.js** — Blockchain interaction and contract utilities
- **Viem** — Lightweight Ethereum client library
- **RainbowKit** — Beautiful wallet connection interface
- **Web3 Provider** — BNB Chain Testnet (ChainID 97) and Mainnet (ChainID 56)

### Development & Build
- **ESLint** — Code quality and style enforcement
- **PostCSS** — CSS transformation pipeline
- **Zod** — TypeScript-first schema validation

## Getting Started

### Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **pnpm** 8+ or **npm** 9+ (this project uses pnpm-lock.yaml)
- **Git** for version control

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/RionOracle/RionOracle.git
cd rion-app
```

2. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the project root (see [Configuration & Environment Variables](#configuration--environment-variables) section below):
```bash
cp .env.example .env.local  # if an example exists
# or manually create and populate .env.local
```

### Development

Start the development server:
```bash
pnpm run dev
# or
npm run dev
```

The app will be available at **http://localhost:3000**

### Production Build

Build for production:
```bash
pnpm run build
# or
npm run build
```

Start the production server:
```bash
pnpm run start
# or
npm run start
```

## Configuration & Environment Variables

The application requires several environment variables for blockchain interaction and API integrations. Create a `.env.local` file in the project root with the following variables:

**IMPORTANT:** Do NOT commit `.env.local` or any `.env` files to version control. The repository's `.gitignore` already excludes these files.

### Network & RPC Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_RPC_URL` | BNB Chain RPC endpoint (testnet or mainnet) | `https://data-seed-prebsc-1-s1.binance.org:8545` |

### Contract Addresses

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FEED_REGISTRY_ADDRESS` | FeedRegistry contract address for price data feeds |
| `NEXT_PUBLIC_DISPUTE_ADDRESS` | Dispute contract address for dispute resolution |
| `NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS` | InsuranceVault contract address for user compensation |
| `NEXT_PUBLIC_RECEIPT_STORE_ADDRESS` | ReceiptStore contract address for proof verification |

### Aggregator Addresses (Price Feed Oracles)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS` | Aggregator for BNB/USD price feed |
| `NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS` | Aggregator for ETH/USD price feed |
| `NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS` | Aggregator for BTC/USD price feed |
| `NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS` | Aggregator for SOL/USD price feed |
| `NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS` | Aggregator for XRP/USD price feed |
| `NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS` | Aggregator for DOGE/USD price feed |
| `NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS` | Aggregator for LINK/USD price feed |

### Game Outcome Markets

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GAME_LAKERS_CELTICS` | Game outcome contract: Lakers vs Celtics |
| `NEXT_PUBLIC_GAME_WARRIORS_NETS` | Game outcome contract: Warriors vs Nets |
| `NEXT_PUBLIC_GAME_HEAT_BUCKS` | Game outcome contract: Heat vs Bucks |
| `NEXT_PUBLIC_GAME_SUNS_MAVERICKS` | Game outcome contract: Suns vs Mavericks |
| `NEXT_PUBLIC_GAME_76ERS_NUGGETS` | Game outcome contract: 76ers vs Nuggets |

### Oracle Node Configuration (Server-side only)

These variables are used by API routes for oracle submission and should never be exposed to the client:

| Variable | Description |
|----------|-------------|
| `COUNCIL_01_PRIVATE_KEY` | Private key for Council-01 oracle node |
| `COUNCIL_02_PRIVATE_KEY` | Private key for Council-02 oracle node |
| `COUNCIL_03_PRIVATE_KEY` | Private key for Council-03 oracle node |
| `THE_ODDS_API_KEY` | API key for The Odds API (sports data) |

### Example `.env.local` File

```env
# Network
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545

# Contracts
NEXT_PUBLIC_FEED_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_DISPUTE_ADDRESS=0x...
NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS=0x...
NEXT_PUBLIC_RECEIPT_STORE_ADDRESS=0x...

# Price Feeds
NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS=0x...
NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS=0x...
NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS=0x...
# ... other aggregators

# Game Outcomes
NEXT_PUBLIC_GAME_LAKERS_CELTICS=0x...
# ... other games

# Server-side only (NEVER expose these)
COUNCIL_01_PRIVATE_KEY=0x...
COUNCIL_02_PRIVATE_KEY=0x...
COUNCIL_03_PRIVATE_KEY=0x...
THE_ODDS_API_KEY=your_api_key_here
```

## Available Scripts

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Start development server with hot reload |
| `pnpm run build` | Create optimized production build |
| `pnpm run start` | Start production server (requires prior build) |
| `pnpm run lint` | Run ESLint to check code quality |

## Project Structure

```
rion-app/
├── app/                    # Next.js 13+ App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with providers
│   ├── api/               # API routes (price feeds, oracle submission, etc.)
│   ├── explorer/          # Contract explorer interface
│   ├── predictions/       # Prediction market views
│   ├── disputes/          # Dispute resolution interface
│   ├── proof/             # Proof verification tools
│   ├── receipts/          # Oracle receipt inspection
│   ├── game/              # Game outcome markets
│   ├── lab/               # Experimental features
│   ├── docs/              # Documentation pages
│   └── status/            # Network status dashboard
├── components/            # React components
│   └── ui/               # Radix UI component wrappers
├── lib/                   # Utilities and helpers
│   ├── contracts.ts      # Contract addresses and ABIs
│   └── analytics.ts      # Analytics integration
├── hooks/                 # Custom React hooks
├── sdk/                   # RION SDK reference implementations
├── contracts/             # Solidity smart contracts (Foundry)
├── styles/                # Global styles and Tailwind config
├── public/                # Static assets
├── assets/                # Project assets (logos, banners)
└── scripts/               # Utility scripts (oracle deployment, testing)
```

## Core Modules

### Price Feeds (`app/explorer/`)
Real-time oracle price feeds with historical data, verification proofs, and feed status.

### Disputes (`app/disputes/`)
Interface for challenging oracle reports, voting on disputes, and viewing resolution outcomes.

### Insurance (`app/proof/`, `app/receipts/`)
View available insurance claims, verify proof of losses, and manage compensation claims.

### Predictions (`app/predictions/`)
Interact with prediction market contracts, view available markets, and track outcomes.

### Documentation (`app/docs/`, `app/api-docs/`)
Comprehensive guides for SDK integration, contract interaction, and API usage.

## Blockchain Networks

RION Oracle App supports both testnet and mainnet deployments:

| Network | Chain ID | RPC Endpoint | Block Explorer |
|---------|----------|--------------|---|
| BNB Testnet | 97 | https://data-seed-prebsc-1-s1.binance.org:8545 | https://testnet.bscscan.com |
| BNB Mainnet | 56 | https://bsc-dataseed.binance.org | https://bscscan.com |

Switch networks via the wallet connection interface or by updating `NEXT_PUBLIC_RPC_URL`.

## Deployment

### Self-Hosted

Deploy to any Node.js hosting:

```bash
# Build production bundle
pnpm run build

# Set environment variables in your host
export NEXT_PUBLIC_RPC_URL=...
export NEXT_PUBLIC_FEED_REGISTRY_ADDRESS=...
# ... other env vars

# Start server (ensure Node.js 18+ is installed)
pnpm run start
```

### Docker

Create a `Dockerfile` for containerized deployment (example):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Development & Contributing

### Code Quality

- **ESLint** enforces code style consistency
- **TypeScript** ensures type safety
- **Tailwind CSS** provides utility-first styling

Run linting:
```bash
pnpm run lint
```

### Adding New Pages

1. Create a new directory under `app/` (e.g., `app/my-feature/`)
2. Add `page.tsx` for the route
3. Import layout and components as needed
4. Follow existing patterns for wallet integration and contract interaction

### Adding New Feeds/Markets

1. Update contract addresses in `lib/contracts.ts`
2. Add environment variables in `.env.local`
3. Create new page or component to display the feed
4. Use existing fetch/query hooks from `lib/` or create new ones

## Security Considerations

- **Never commit `.env.local` or `.env.*` files** — they may contain sensitive keys
- **Private keys should only be in server-side code** — never pass to client components
- **Use `NEXT_PUBLIC_*` prefix ONLY for client-safe variables** — values are visible to users
- **Verify all contract addresses before interacting** — especially on mainnet
- **Keep dependencies updated** — run `pnpm update` periodically

## Troubleshooting

### Port 3000 already in use

Run on a different port:
```bash
pnpm run dev -- -p 3001
```

### Module not found errors

Clear cache and reinstall:
```bash
rm -rf .next node_modules
pnpm install
```

### Wallet connection issues

- Verify `NEXT_PUBLIC_RPC_URL` is valid
- Check browser console for error messages
- Ensure wallet (MetaMask, etc.) is connected to the correct network
- Clear browser cache and try again

### Contract address errors

- Verify contract addresses in `.env.local`
- Check that addresses are valid for the connected network
- Ensure contracts are deployed on the target network

## Additional Resources

- [RION Oracle Contracts](./contracts/) — Smart contract source and ABIs
- [SDK Documentation](./sdk/) — RION SDK integration examples
- [Examples](./examples/) — Code samples for common tasks
- [Architecture Docs](./docs/) — System design and data flow
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) — Production deployment instructions

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

## Support

For questions, issues, or contributions:

- **GitHub Issues**: [Report bugs or request features](https://github.com/RionOracle/RionOracle/issues)
- **Documentation**: See [./docs/](./docs/) for comprehensive guides

---

Built with ❤️ by the RION Oracle Team
