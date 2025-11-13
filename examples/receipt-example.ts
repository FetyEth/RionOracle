/**
 * Receipt verification example
 */

import { RionClient } from "../sdk"

async function main() {
  const client = new RionClient({
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    registryAddress: "0x1111111111111111111111111111111111111111",
    chainId: 97,
  })

  console.log("RION Receipt Verification Example\n")

  // Example 1: Verify a receipt
  console.log("1. Verifying receipt...")
  const receiptHash = "0x1234567890123456789012345678901234567890123456789012345678901234"
  const result = await client.receipts.verifyReceipt(receiptHash)

  if (result.valid && result.receipt) {
    console.log("   ✓ Receipt is valid")
    console.log(`   Feed: ${result.receipt.feedId}`)
    console.log(`   Consumer: ${result.receipt.consumer}`)
    console.log(`   Value: $${client.feeds.formatPrice(result.receipt.value)}`)
    console.log(`   Merkle Root: ${result.receipt.merkleRoot}\n`)
  } else {
    console.log("   ✗ Receipt is invalid\n")
  }

  // Example 2: Verify Merkle proof locally
  console.log("2. Verifying Merkle proof locally...")
  if (result.receipt) {
    const isValid = client.receipts.verifyMerkleProof(
      result.receipt.merkleProof,
      result.receipt.merkleRoot,
      "0xleaf...",
    )
    console.log(`   Proof valid: ${isValid}\n`)
  }

  // Example 3: Record proof-of-attention (AI agents)
  console.log("3. Recording proof-of-attention...")
  await client.receipts.recordAttention(
    receiptHash,
    JSON.stringify({
      agent: "TradingBot-v1",
      action: "executed_trade",
      trade_id: "T-12345",
      amount: "10 BNB",
    }),
  )
  console.log("   Attention proof recorded\n")
}

main().catch(console.error)
