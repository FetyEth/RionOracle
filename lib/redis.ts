import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_KV_KV_REST_API_URL!,
  token: process.env.UPSTASH_KV_KV_REST_API_TOKEN!,
});

export interface CouncilSubmission {
  oracle: string;
  price: number;
  txHash: string;
  bscScanLink: string;
  timestamp: number;
  status: "success";
}

export interface RoundData {
  roundId: string;
  feed: string;
  councils: CouncilSubmission[];
  median: number;
  timestamp: number;
}

export async function storeRoundData(data: RoundData): Promise<void> {
  const key = `round:${data.feed}:${data.roundId}`;
  console.log(` Storing round data to Redis with key: ${key}`);

  await redis.set(key, JSON.stringify(data), {
    ex: 60 * 60 * 24 * 7, // Expire after 7 days
  });

  console.log(` Successfully stored round data to Redis`);
}

export async function getRoundData(
  feed: string,
  roundId: string
): Promise<RoundData | null> {
  const key = `round:${feed}:${roundId}`;
  console.log(` Fetching round data from Redis with key: ${key}`);

  const data = await redis.get<RoundData>(key);

  if (!data) {
    console.log(` No round data found in Redis for key: ${key}`);
    return null;
  }

  console.log(` Found round data in Redis:`, data);
  return data;
}

export async function getAllRoundsForFeed(feed: string): Promise<RoundData[]> {
  const pattern = `round:${feed}:*`;
  console.log(` Fetching all rounds for feed: ${feed}`);

  const keys = await redis.keys(pattern);

  if (!keys || keys.length === 0) {
    console.log(` No rounds found for feed: ${feed}`);
    return [];
  }

  const rounds: RoundData[] = [];

  for (const key of keys) {
    const data = await redis.get<RoundData>(key);
    if (data) {
      rounds.push(data);
    }
  }

  console.log(` Found ${rounds.length} rounds for feed: ${feed}`);
  return rounds;
}

export async function getLatestRoundForFeed(
  feed: string
): Promise<RoundData | null> {
  const pattern = `round:${feed}:*`;
  console.log(` Fetching latest round for feed: ${feed}`);

  const keys = await redis.keys(pattern);

  if (!keys || keys.length === 0) {
    console.log(` No rounds found for feed: ${feed}`);
    return null;
  }

  let latestRound: RoundData | null = null;
  let latestTimestamp = 0;

  for (const key of keys) {
    const data = await redis.get<RoundData>(key);
    if (data && data.timestamp > latestTimestamp) {
      latestTimestamp = data.timestamp;
      latestRound = data;
    }
  }

  if (latestRound) {
    console.log(` Found latest round for ${feed}:`, latestRound.roundId);
  }

  return latestRound;
}

export interface Receipt {
  hash: string;
  oracle: string;
  oracleAddress: string;
  feed: string;
  price: string;
  timestamp: number;
  signature: string;
  merkleProof: string[];
  roundId: string;
  verified: boolean;
  txHash: string;
}

export async function getReceipt(receiptHash: string): Promise<Receipt | null> {
  const key = `receipt:${receiptHash}`;
  console.log(` Fetching receipt from Redis with key: ${key}`);

  const data = await redis.get<Receipt>(key);

  if (!data) {
    console.log(` No receipt found in Redis for hash: ${receiptHash}`);
    return null;
  }

  console.log(` Found receipt in Redis:`, data);
  return data;
}

export async function storeReceipt(receipt: Receipt): Promise<void> {
  const key = `receipt:${receipt.hash}`;
  console.log(` Storing receipt to Redis with key: ${key}`);

  await redis.set(key, JSON.stringify(receipt), {
    ex: 60 * 60 * 24 * 30, // Expire after 30 days
  });

  console.log(` Successfully stored receipt to Redis`);
}
