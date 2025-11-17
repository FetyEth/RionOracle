# RION Oracle Network - Deployment Checklist

## Pre Deployment

- [ ] All smart contracts compiled without errors
- [ ] All tests passing (unit + integration)
- [ ] Frontend builds successfully
- [ ] All environment variables documented

## Smart Contract Deployment

- [ ] Deploy FeedRegistry.sol to BNB Testnet
- [ ] Deploy Aggregator.sol to BNB Testnet
- [ ] Deploy Dispute.sol to BNB Testnet
- [ ] Deploy InsuranceVault.sol to BNB Testnet
- [ ] Deploy ReceiptStore.sol to BNB Testnet
- [ ] Verify all contracts on BscScan
- [ ] Save all contract addresses

## Oracle Node Setup

- [ ] Set up 5 oracle nodes (minimum)
- [ ] Generate BLS key pairs for each node
- [ ] Configure API keys for exchanges (Binance, OKX, etc.)
- [ ] Fund nodes with testnet BNB for gas
- [ ] Test price fetching from all sources
- [ ] Test BLS signature generation
- [ ] Test contract submission

## Frontend Configuration

- [ ] Update contract addresses in .env.local
- [ ] Update RPC URL for BNB Testnet
- [ ] Test wallet connection
- [ ] Test contract reads
- [ ] Test contract writes
- [ ] Deploy to Vercel/hosting

## Testing

- [ ] Test end-to-end price update flow
- [ ] Test dispute submission
- [ ] Test insurance payout
- [ ] Test receipt verification
- [ ] Test all pages load correctly
- [ ] Test on mobile devices
- [ ] Test wallet interactions

## Go Live

- [ ] Announce testnet launch
- [ ] Monitor oracle nodes
- [ ] Monitor contract events
- [ ] Collect user feedback
- [ ] Fix any issues
- [ ] Prepare for mainnet

## Post-Launch

- [ ] Set up monitoring and alerts
- [ ] Document any issues
- [ ] Plan mainnet deployment
- [ ] Audit smart contracts
- [ ] Security review
