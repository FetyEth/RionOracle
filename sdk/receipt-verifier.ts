/**
 * Receipt verifier for HTTP-402 receipts
 */

import type { RionConfig, Receipt } from "./types"
import { MerkleTree } from "../lib/merkle-tree"

export class ReceiptVerifier {
  private config: RionConfig

  constructor(config: RionConfig) {
    this.config = config
  }

  /**
   * Store a receipt on-chain
   * @param receipt Receipt data
   */
  async storeReceipt(receipt: Omit<Receipt, "verified">): Promise<string> {
    // Simulate contract call
    // In production: call ReceiptStore.storeReceipt(...)
    const receiptHash = this.hashReceipt(receipt)
    console.log("Storing receipt:", receiptHash)
    return receiptHash
  }

  /**
   * Verify a receipt
   * @param receiptHash Receipt hash
   */
  async verifyReceipt(receiptHash: string): Promise<{
    valid: boolean
    receipt?: Receipt
  }> {
    // Simulate contract call
    // In production: call ReceiptStore.verifyReceipt(receiptHash)
    return {
      valid: true,
      receipt: {
        feedId: "BNB/USD",
        roundId: 12345,
        consumer: "0x1234567890123456789012345678901234567890",
        value: BigInt(61245000000),
        timestamp: Math.floor(Date.now() / 1000),
        merkleRoot: "0x1234567890123456789012345678901234567890123456789012345678901234",
        merkleProof: ["0xabcd...", "0xef01..."],
        signature: "0x" + "0".repeat(130),
        verified: true,
      },
    }
  }

  /**
   * Get receipt details
   * @param receiptHash Receipt hash
   */
  async getReceipt(receiptHash: string): Promise<Receipt | null> {
    const result = await this.verifyReceipt(receiptHash)
    return result.receipt || null
  }

  /**
   * Record proof-of-attention
   * @param receiptHash Receipt hash
   * @param metadata Additional metadata
   */
  async recordAttention(receiptHash: string, metadata: string): Promise<void> {
    if (!this.config.privateKey) {
      throw new Error("Private key required to record attention")
    }

    // Simulate contract call
    console.log("Recording attention:", { receiptHash, metadata })
  }

  /**
   * Verify Merkle proof locally
   * @param proof Merkle proof
   * @param root Merkle root
   * @param leaf Leaf value
   */
  verifyMerkleProof(proof: string[], root: string, leaf: string): boolean {
    return MerkleTree.verify(proof, root, leaf, 0)
  }

  /**
   * Hash receipt data
   */
  private hashReceipt(receipt: Omit<Receipt, "verified">): string {
    // Simulate keccak256 hash
    return (
      "0x" +
      Buffer.from(
        JSON.stringify({
          feedId: receipt.feedId,
          roundId: receipt.roundId,
          consumer: receipt.consumer,
          value: receipt.value.toString(),
          timestamp: receipt.timestamp,
        }),
      )
        .toString("hex")
        .slice(0, 64)
    )
  }
}
