import { type NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const AGGREGATOR_ABI_V1 = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
];

// Custom ABI for contracts that return fewer fields
const AGGREGATOR_ABI_V2 = [
  "function latestRoundData() external view returns (uint256 roundId, int256 answer, uint256 updatedAt, uint256 observationsCount)",
];

// Simple read functions as fallback
const SIMPLE_ABI = [
  "function latestAnswer() external view returns (int256)",
  "function latestRound() external view returns (uint256)",
  "function latestTimestamp() external view returns (uint256)",
];

const FEED_CONFIGS: { [key: string]: string } = {
  BNB:
    process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS ||
    "0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F",
  ETH:
    process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS ||
    "0xf20340BaA91b93C773E5F1db8e296D46D1fec994",
  BTC:
    process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS ||
    "0x34c5E550c9048293c5Ea0908c9EDF5A2Dd7411aC",
  SOL:
    process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS ||
    "0x5713E03e9C93ABB7b4ee6eff36514dAc5a3cE4b9",
  XRP:
    process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS ||
    "0x2B4D6eb2Fb9DABB7b4ee6eff36514dAc5a3cE4b9",
  DOGE:
    process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS ||
    "0x5EA49AdD76cfdB62Ed6835C110e815C246b37BF9",
  LINK:
    process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS ||
    "0x34DBd587708163694bc10f90Db61F67d63546152",
};

async function fetchRoundData(
  address: string,
  provider: ethers.JsonRpcProvider
) {
  // Try standard Chainlink ABI first
  try {
    const aggregator = new ethers.Contract(
      address,
      AGGREGATOR_ABI_V1,
      provider
    );
    const [roundId, answer, , updatedAt] = await aggregator.latestRoundData();

    return {
      roundId: `0x${roundId.toString(16)}`,
      median: Number(answer) / 1e8,
      timestamp: Number(updatedAt),
    };
  } catch (error1) {
    // Try custom ABI variant
    try {
      const aggregator = new ethers.Contract(
        address,
        AGGREGATOR_ABI_V2,
        provider
      );
      const [roundId, answer, updatedAt, observationsCount] =
        await aggregator.latestRoundData();

      return {
        roundId: `0x${roundId.toString(16)}`,
        median: Number(answer) / 1e8,
        timestamp: Number(updatedAt),
        observationsCount: Number(observationsCount),
      };
    } catch (error2) {
      // Try simple individual function calls as last resort
      try {
        const aggregator = new ethers.Contract(address, SIMPLE_ABI, provider);
        const [answer, roundId, timestamp] = await Promise.all([
          aggregator.latestAnswer(),
          aggregator.latestRound(),
          aggregator.latestTimestamp(),
        ]);

        return {
          roundId: `0x${roundId.toString(16)}`,
          median: Number(answer) / 1e8,
          timestamp: Number(timestamp),
        };
      } catch (error3) {
        throw new Error(
          `Failed to fetch round data with all ABI variants. Last error: ${error3}`
        );
      }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol || !FEED_CONFIGS[symbol]) {
      return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL ||
        "https://data-seed-prebsc-1-s1.binance.org:8545"
    );

    const data = await fetchRoundData(FEED_CONFIGS[symbol], provider);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(" Error fetching latest round:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch round data",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedAddress, symbol } = body;

    let address = feedAddress;
    if (!address && symbol && FEED_CONFIGS[symbol]) {
      address = FEED_CONFIGS[symbol];
    }

    if (!address) {
      return NextResponse.json(
        { error: "Feed address or valid symbol required" },
        { status: 400 }
      );
    }

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL ||
        "https://data-seed-prebsc-1-s1.binance.org:8545"
    );

    const data = await fetchRoundData(address, provider);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching latest round:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch round data",
      },
      { status: 500 }
    );
  }
}
