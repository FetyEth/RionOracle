/**
 * Main RION client for interacting with oracle contracts
 */

import { FeedReader } from "./feed-reader"
import { DisputeManager } from "./dispute-manager"
import { ReceiptVerifier } from "./receipt-verifier"
import type { RionConfig } from "./types"

export class RionClient {
  public feeds: FeedReader
  public disputes: DisputeManager
  public receipts: ReceiptVerifier

  private config: RionConfig

  constructor(config: RionConfig) {
    this.config = config
    this.feeds = new FeedReader(config)
    this.disputes = new DisputeManager(config)
    this.receipts = new ReceiptVerifier(config)
  }

  /**
   * Get the current configuration
   */
  getConfig(): RionConfig {
    return { ...this.config }
  }

  /**
   * Update RPC URL
   */
  setRpcUrl(rpcUrl: string): void {
    this.config.rpcUrl = rpcUrl
    this.feeds = new FeedReader(this.config)
    this.disputes = new DisputeManager(this.config)
    this.receipts = new ReceiptVerifier(this.config)
  }

  /**
   * Check connection to RION network
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.feeds.getLatestPrice("BNB/USD")
      return true
    } catch {
      return false
    }
  }

  /**
   * Get network status
   */
  async getNetworkStatus(): Promise<{
    connected: boolean
    chainId: number
    blockNumber: number
  }> {
    // Simulate network status check
    return {
      connected: true,
      chainId: this.config.chainId || 97,
      blockNumber: 12345678,
    }
  }
}
