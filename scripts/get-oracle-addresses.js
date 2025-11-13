require("dotenv").config({ path: "../.env.local" })
const { ethers } = require("ethers")

console.log("\n=== Oracle Wallet Addresses ===\n")

try {
  const council01Key = process.env.COUNCIL_01_PRIVATE_KEY
  const council02Key = process.env.COUNCIL_02_PRIVATE_KEY
  const council03Key = process.env.COUNCIL_03_PRIVATE_KEY

  if (!council01Key || !council02Key || !council03Key) {
    console.error("❌ ERROR: Council private keys not found in .env.local")
    console.log("\nMake sure your .env.local has:")
    console.log('COUNCIL_01_PRIVATE_KEY="0x..."')
    console.log('COUNCIL_02_PRIVATE_KEY="0x..."')
    console.log('COUNCIL_03_PRIVATE_KEY="0x..."')
    process.exit(1)
  }

  const wallet1 = new ethers.Wallet(council01Key)
  const wallet2 = new ethers.Wallet(council02Key)
  const wallet3 = new ethers.Wallet(council03Key)

  console.log("Council-01 Address:", wallet1.address)
  console.log("Council-02 Address:", wallet2.address)
  console.log("Council-03 Address:", wallet3.address)

  console.log("\n=== Copy these for authorization ===\n")
  console.log(wallet1.address)
  console.log(wallet2.address)
  console.log(wallet3.address)
  console.log("")
} catch (error) {
  console.error("❌ ERROR:", error.message)
  console.log("\nMake sure your private keys:")
  console.log("1. Start with 0x")
  console.log("2. Are 66 characters long (0x + 64 hex characters)")
  console.log("3. Contain only valid hex characters (0-9, a-f)")
}
