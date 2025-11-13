/**
 * Dispute creation and management example
 */

import { RionClient } from "../sdk"

async function main() {
  // Initialize client with private key for transactions
  const client = new RionClient({
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    registryAddress: "0x1111111111111111111111111111111111111111",
    chainId: 97,
    privateKey: "YOUR_PRIVATE_KEY_HERE", // Never commit real keys!
  })

  console.log("RION Dispute Management Example\n")

  // Example 1: Create a dispute
  console.log("1. Creating dispute for incorrect price...")
  const disputeId = await client.disputes.createDispute(
    "BNB/USD",
    12345,
    BigInt(61000000000), // Claimed correct value: $610.00
    "Price deviated by >5% from CEX average",
    BigInt("100000000000000000"), // 0.1 BNB stake
  )
  console.log(`   Dispute created with ID: ${disputeId}\n`)

  // Example 2: Get dispute details
  console.log("2. Getting dispute details...")
  const dispute = await client.disputes.getDispute(disputeId)
  console.log(`   Feed: ${dispute.feedId}`)
  console.log(`   Round: #${dispute.roundId}`)
  console.log(`   Challenger: ${dispute.challenger}`)
  console.log(`   Votes For: ${dispute.votesFor}`)
  console.log(`   Votes Against: ${dispute.votesAgainst}`)
  console.log(`   Status: ${dispute.status}\n`)

  // Example 3: Vote on dispute (DAO members only)
  console.log("3. Voting on dispute...")
  await client.disputes.voteOnDispute(disputeId, true) // Support
  console.log("   Vote submitted\n")

  // Example 4: Get all disputes for a feed
  console.log("4. Getting all disputes for BNB/USD...")
  const disputes = await client.disputes.getDisputesByFeed("BNB/USD")
  console.log(`   Found ${disputes.length} dispute(s)`)
  disputes.forEach((d) => {
    console.log(`   - Dispute #${d.id}: ${d.votesFor} for, ${d.votesAgainst} against`)
  })
}

main().catch(console.error)
