/**
 * Feed reader for querying oracle price data
 */

import type { RionConfig, LatestAnswer, RoundData, FeedConfig } from "./types";
import { formatFeedId, parsePriceValue } from "./utils";
import { ethers } from "ethers";
import { SIMPLE_AGGREGATOR_ABI } from "@/lib/simple-aggregator-abi";

export class FeedReader {
  private config: RionConfig;
  private provider: ethers.JsonRpcProvider;

  constructor(config: RionConfig) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
  }

  /**
   * Get the latest price for a feed
   * @param feedId Feed identifier (e.g., "BNB/USD")
   * @returns Latest price data
   */
  async getLatestPrice(feedId: string): Promise<LatestAnswer> {
    const symbol = feedId.split("/")[0];
    const aggregatorKey = `NEXT_PUBLIC_${symbol}_AGGREGATOR_ADDRESS`;
    const aggregatorAddress = process.env[aggregatorKey];

    if (aggregatorAddress) {
      try {
        const aggregator = new ethers.Contract(
          aggregatorAddress,
          SIMPLE_AGGREGATOR_ABI,
          this.provider
        );
        const [roundId, answer, timestamp, observationCount] =
          await aggregator.latestRoundData();

        return {
          value: BigInt(answer),
          timestamp: Number(timestamp),
          roundId: Number(roundId),
        };
      } catch (error) {
        console.error(` Failed to fetch ${feedId} from contract:`, error);
      }
    }

    throw new Error(`No aggregator found for ${feedId}`);
  }

  /**
   * Get historical price data
   * @param feedId Feed identifier
   * @param roundId Specific round to query
   */
  async getHistoricalPrice(
    feedId: string,
    roundId: number
  ): Promise<{ value: bigint; timestamp: number }> {
    const formattedFeedId = formatFeedId(feedId);

    // Simulate contract call
    // In production: call FeedRegistry.getAnswer(formattedFeedId, roundId)
    return {
      value: BigInt(61000000000),
      timestamp: Math.floor(Date.now() / 1000) - 3600,
    };
  }

  /**
   * Get feed configuration
   * @param feedId Feed identifier
   */
  async getFeedConfig(feedId: string): Promise<FeedConfig> {
    const formattedFeedId = formatFeedId(feedId);

    // Simulate contract call
    return {
      feedId: formattedFeedId,
      aggregator: "0x1234567890123456789012345678901234567890",
      heartbeat: 60,
      maxDeviation: 100,
      active: true,
    };
  }

  /**
   * Get round data from aggregator
   * @param aggregatorAddress Aggregator contract address
   * @param roundId Round identifier
   */
  async getRoundData(
    aggregatorAddress: string,
    roundId: number
  ): Promise<RoundData> {
    // Simulate contract call
    return {
      answer: BigInt(61245000000),
      timestamp: Math.floor(Date.now() / 1000),
      observationCount: 5,
      merkleRoot:
        "0x1234567890123456789012345678901234567890123456789012345678901234",
      finalized: true,
    };
  }

  /**
   * Assert price freshness
   * @param feedId Feed identifier
   * @param maxAge Maximum age in seconds
   * @throws Error if price is stale
   */
  async assertFresh(feedId: string, maxAge = 300): Promise<void> {
    const latest = await this.getLatestPrice(feedId);
    const age = Math.floor(Date.now() / 1000) - latest.timestamp;

    if (age > maxAge) {
      throw new Error(`Price is stale: ${age}s old (max: ${maxAge}s)`);
    }
  }

  /**
   * Format price value with decimals
   * @param value Raw price value
   * @param decimals Number of decimals (default: 8)
   */
  formatPrice(value: bigint, decimals = 8): string {
    return parsePriceValue(value, decimals);
  }

  /**
   * Subscribe to price updates (WebSocket)
   * @param feedId Feed identifier
   * @param callback Callback function for updates
   */
  subscribeToPriceUpdates(
    feedId: string,
    callback: (data: LatestAnswer) => void
  ): () => void {
    // Simulate WebSocket subscription
    const interval = setInterval(async () => {
      const latest = await this.getLatestPrice(feedId);
      callback(latest);
    }, 5000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  }
}
