/**
 * Contract addresses and ABIs for RION Oracle Network
 */

export const NETWORKS = {
  BNB_TESTNET: {
    chainId: 97,
    name: "BNB Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorer: "https://testnet.bscscan.com",
  },
  BNB_MAINNET: {
    chainId: 56,
    name: "BNB Mainnet",
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com",
  },
} as const

export type NetworkName = keyof typeof NETWORKS

// Load deployment addresses from environment or deployment file
export function getContractAddresses(network: NetworkName = "BNB_TESTNET") {
  // In production, these would be loaded from deployments/bnb-testnet.json
  // For now, return placeholder addresses that will be replaced after deployment
  return {
    FeedRegistry: process.env.NEXT_PUBLIC_FEED_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
    Dispute: process.env.NEXT_PUBLIC_DISPUTE_ADDRESS || "0x0000000000000000000000000000000000000000",
    InsuranceVault: process.env.NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000",
    ReceiptStore: process.env.NEXT_PUBLIC_RECEIPT_STORE_ADDRESS || "0x0000000000000000000000000000000000000000",
  }
}

export function getNetworkConfig(chainId: number) {
  const network = Object.values(NETWORKS).find((n) => n.chainId === chainId)
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
  return network
}

export function getExplorerUrl(address: string, chainId = 97): string {
  const network = getNetworkConfig(chainId)
  return `${network.explorer}/address/${address}`
}
