/**
 * Basic usage examples for RION SDK
 */

import { RionClient } from "../sdk"

async function main() {
  // Initialize client
  const client = new RionClient({
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    registryAddress: "0x1111111111111111111111111111111111111111",
    chainId: 97, // BSC Testnet
  })

  console.log("RION SDK Basic Usage Examples\n")

  // Example 1: Get latest price
  console.log("1. Getting latest BNB/USD price...")
  const latest = await client.feeds.getLatestPrice("BNB/USD")
  console.log(`   Price: $${client.feeds.formatPrice(latest.value)}`)
  console.log(`   Round: #${latest.roundId}`)
  console.log(`   Timestamp: ${new Date(latest.timestamp * 1000).toISOString()}\n`)

  // Example 2: Assert freshness
  console.log("2. Checking price freshness...")
  try {
    await client.feeds.assertFresh("BNB/USD", 300) // Max 5 minutes old
    console.log("   ✓ Price is fresh\n")
  } catch (error) {
    console.log(`   ✗ ${error}\n`)
  }

  // Example 3: Get feed configuration
  console.log("3. Getting feed configuration...")
  const config = await client.feeds.getFeedConfig("BNB/USD")
  console.log(`   Aggregator: ${config.aggregator}`)
  console.log(`   Heartbeat: ${config.heartbeat}s`)
  console.log(`   Active: ${config.active}\n`)

  // Example 4: Get historical price
  console.log("4. Getting historical price...")
  const historical = await client.feeds.getHistoricalPrice("BNB/USD", 12340)
  console.log(`   Price: $${client.feeds.formatPrice(historical.value)}`)
  console.log(`   Timestamp: ${new Date(historical.timestamp * 1000).toISOString()}\n`)

  // Example 5: Subscribe to updates
  console.log("5. Subscribing to price updates...")
  const unsubscribe = client.feeds.subscribeToPriceUpdates("BNB/USD", (data) => {
    console.log(`   Update: $${client.feeds.formatPrice(data.value)} at round #${data.roundId}`)
  })

  // Run for 15 seconds then unsubscribe
  setTimeout(() => {
    unsubscribe()
    console.log("   Unsubscribed\n")
  }, 15000)
}

main().catch(console.error)
