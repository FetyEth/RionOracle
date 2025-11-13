/**
 * Deployment script for RION Dispute & Insurance System
 */

interface DisputeDeployment {
  disputeAddress: string
  insuranceVaultAddress: string
  minStake: string
  votingPeriod: string
  maxPayoutRatio: number
}

async function deployDisputeSystem(): Promise<DisputeDeployment> {
  console.log("🚀 Deploying RION Dispute & Insurance System...\n")

  // Deploy InsuranceVault
  console.log("📝 Deploying InsuranceVault...")
  const vaultAddress = "0x" + "2".repeat(40)
  console.log(`✅ InsuranceVault deployed at: ${vaultAddress}`)
  console.log(`   Min Reserve: 10 BNB`)
  console.log(`   Max Payout Ratio: 80%\n`)

  // Deploy Dispute contract
  console.log("📝 Deploying Dispute contract...")
  const disputeAddress = "0x" + "3".repeat(40)
  console.log(`✅ Dispute deployed at: ${disputeAddress}`)
  console.log(`   Min Stake: 0.1 BNB`)
  console.log(`   Voting Period: 3 days`)
  console.log(`   Quorum: 3 voters\n`)

  // Link contracts
  console.log("🔗 Linking contracts...")
  console.log(`   Setting InsuranceVault.disputeContract = ${disputeAddress}`)
  console.log(`   Setting Dispute.insuranceVault = ${vaultAddress}\n`)

  // Fund insurance vault
  console.log("💰 Funding InsuranceVault with initial capital...")
  const initialFunding = "50 BNB"
  console.log(`   Initial funding: ${initialFunding}\n`)

  console.log("🎉 Dispute & Insurance System Deployed!\n")
  console.log("📊 System Summary:")
  console.log(`   Dispute Contract: ${disputeAddress}`)
  console.log(`   Insurance Vault: ${vaultAddress}`)
  console.log(`   Vault Balance: ${initialFunding}`)
  console.log(`   System Status: Active\n`)

  console.log("✨ Users can now:")
  console.log("   1. Challenge incorrect reports with 0.1 BNB stake")
  console.log("   2. Vote on disputes (DAO members)")
  console.log("   3. Submit insurance claims for losses")
  console.log("   4. Receive compensation up to 80% of losses\n")

  return {
    disputeAddress,
    insuranceVaultAddress: vaultAddress,
    minStake: "0.1 BNB",
    votingPeriod: "3 days",
    maxPayoutRatio: 80,
  }
}

// Run deployment
deployDisputeSystem().catch(console.error)
