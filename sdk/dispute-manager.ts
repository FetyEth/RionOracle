/**
 * Dispute manager for challenging oracle reports
 */

import { type RionConfig, type Dispute, DisputeStatus } from "./types"
import { formatFeedId } from "./utils"

export class DisputeManager {
  private config: RionConfig

  constructor(config: RionConfig) {
    this.config = config
  }

  /**
   * Create a new dispute
   * @param feedId Feed identifier
   * @param roundId Round to dispute
   * @param claimedCorrectValue The correct value
   * @param evidence Evidence URL or description
   * @param stake Stake amount in wei
   */
  async createDispute(
    feedId: string,
    roundId: number,
    claimedCorrectValue: bigint,
    evidence: string,
    stake: bigint,
  ): Promise<number> {
    if (!this.config.privateKey) {
      throw new Error("Private key required to create disputes")
    }

    const formattedFeedId = formatFeedId(feedId)

    // Simulate contract call
    // In production: call Dispute.createDispute(...)
    console.log("Creating dispute:", {
      feedId: formattedFeedId,
      roundId,
      claimedCorrectValue: claimedCorrectValue.toString(),
      evidence,
      stake: stake.toString(),
    })

    return 1 // Return dispute ID
  }

  /**
   * Vote on a pending dispute
   * @param disputeId Dispute identifier
   * @param support True to support, false to reject
   */
  async voteOnDispute(disputeId: number, support: boolean): Promise<void> {
    if (!this.config.privateKey) {
      throw new Error("Private key required to vote on disputes")
    }

    // Simulate contract call
    console.log("Voting on dispute:", { disputeId, support })
  }

  /**
   * Resolve a dispute after voting period
   * @param disputeId Dispute identifier
   */
  async resolveDispute(disputeId: number): Promise<void> {
    // Simulate contract call
    console.log("Resolving dispute:", disputeId)
  }

  /**
   * Get dispute details
   * @param disputeId Dispute identifier
   */
  async getDispute(disputeId: number): Promise<Dispute> {
    // Simulate contract call
    return {
      id: disputeId,
      feedId: "BNB/USD",
      roundId: 12345,
      challenger: "0x1234567890123456789012345678901234567890",
      claimedCorrectValue: BigInt(61000000000),
      evidence: "Price deviation detected",
      stake: BigInt("100000000000000000"), // 0.1 BNB
      timestamp: Math.floor(Date.now() / 1000),
      status: DisputeStatus.Pending,
      votesFor: 5,
      votesAgainst: 2,
    }
  }

  /**
   * Get all disputes for a feed
   * @param feedId Feed identifier
   */
  async getDisputesByFeed(feedId: string): Promise<Dispute[]> {
    const formattedFeedId = formatFeedId(feedId)

    // Simulate contract call
    return [
      {
        id: 1,
        feedId: formattedFeedId,
        roundId: 12345,
        challenger: "0x1234567890123456789012345678901234567890",
        claimedCorrectValue: BigInt(61000000000),
        evidence: "Price deviation detected",
        stake: BigInt("100000000000000000"),
        timestamp: Math.floor(Date.now() / 1000),
        status: DisputeStatus.Pending,
        votesFor: 5,
        votesAgainst: 2,
      },
    ]
  }

  /**
   * Check if user has voted on a dispute
   * @param disputeId Dispute identifier
   * @param voter Voter address
   */
  async hasVoted(disputeId: number, voter: string): Promise<boolean> {
    // Simulate contract call
    return false
  }
}
