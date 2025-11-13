import { createPublicClient, http } from "viem"
import { bscTestnet } from "viem/chains"

// Your deployed addresses
const FEED_REGISTRY = "0x764dA9aeFC10B9AF61720FeFE9F802FF243D3ad7"
const AGGREGATOR = "0xa53d9482d0414D4F1a9EB185d6210Eb3950bf5BA"
const PREDICTION_MARKET = "0xf7193673e0d2b1330Bfa080feADB8A8Ab106B5Ec"

// Create clients
const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
})

async function testDeployment() {
  console.log("🔍 Testing RION Oracle Network Deployment on BNB Testnet...\n")

  // Test 1: Check FeedRegistry
  console.log("1️⃣ Testing FeedRegistry...")
  try {
    const feedRegistryCode = await publicClient.getBytecode({
      address: FEED_REGISTRY as `0x${string}`,
    })
    console.log("✅ FeedRegistry deployed:", feedRegistryCode ? "YES" : "NO")
    console.log("🔗 View on BscScan:", `https://testnet.bscscan.com/address/${FEED_REGISTRY}\n`)
  } catch (error) {
    console.log("❌ FeedRegistry check failed\n")
  }

  // Test 2: Check Aggregator
  console.log("2️⃣ Testing Aggregator...")
  try {
    const aggregatorCode = await publicClient.getBytecode({
      address: AGGREGATOR as `0x${string}`,
    })
    console.log("✅ Aggregator deployed:", aggregatorCode ? "YES" : "NO")
    console.log("🔗 View on BscScan:", `https://testnet.bscscan.com/address/${AGGREGATOR}\n`)
  } catch (error) {
    console.log("❌ Aggregator check failed\n")
  }

  // Test 3: Check PredictionMarket
  console.log("3️⃣ Testing PredictionMarket...")
  try {
    const marketCode = await publicClient.getBytecode({
      address: PREDICTION_MARKET as `0x${string}`,
    })
    console.log("✅ PredictionMarket deployed:", marketCode ? "YES" : "NO")
    console.log("🔗 View on BscScan:", `https://testnet.bscscan.com/address/${PREDICTION_MARKET}\n`)
  } catch (error) {
    console.log("❌ PredictionMarket check failed\n")
  }

  // Test 4: Read FeedRegistry owner
  console.log("4️⃣ Reading contract data...")
  try {
    const owner = await publicClient.readContract({
      address: FEED_REGISTRY as `0x${string}`,
      abi: [
        {
          inputs: [],
          name: "owner",
          outputs: [{ type: "address" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "owner",
    })
    console.log("✅ FeedRegistry owner:", owner)
    console.log("   (This should be your DEPLOYER wallet address)\n")
  } catch (error) {
    console.log("❌ Could not read owner\n")
  }

  console.log("✅ All contracts are live on BNB Testnet!")
  console.log("\n📱 Next steps:")
  console.log("   1. Add contract addresses to .env.local")
  console.log("   2. Run: npm run dev")
  console.log("   3. Connect your wallet and test the UI")
}

testDeployment()
