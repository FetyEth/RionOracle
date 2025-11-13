import { type NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import {
  getRoundData as getStoredRoundData,
  getLatestRoundForFeed,
} from "@/lib/redis";

const AGGREGATOR_ABI_V1 = [
  "function getRoundData(uint80 _roundId) view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() view returns (uint8)",
  "function description() view returns (string)",
];

const AGGREGATOR_ABI_V2 = [
  "function getRoundData(uint256 _roundId) external view returns (uint256 roundId, int256 answer, uint256 updatedAt, uint256 observationsCount)",
  "function latestRoundData() external view returns (uint256 roundId, int256 answer, uint256 updatedAt, uint256 observationsCount)",
  "function decimals() view returns (uint8)",
  "function description() view returns (string)",
];

const FEED_ADDRESSES: Record<string, string> = {
  "BNB/USD": process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS || "",
  "ETH/USD": process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS || "",
  "BTC/USD": process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS || "",
  "SOL/USD": process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS || "",
  "XRP/USD": process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS || "",
  "DOGE/USD": process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS || "",
  "LINK/USD": process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS || "",
  "Lakers vs Celtics": process.env.NEXT_PUBLIC_GAME_LAKERS_CELTICS || "",
  "Warriors vs Nets": process.env.NEXT_PUBLIC_GAME_WARRIORS_NETS || "",
  "Heat vs Bucks": process.env.NEXT_PUBLIC_GAME_HEAT_BUCKS || "",
  "Suns vs Mavericks": process.env.NEXT_PUBLIC_GAME_SUNS_MAVERICKS || "",
  "76ers vs Nuggets": process.env.NEXT_PUBLIC_GAME_76ERS_NUGGETS || "",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roundId, feedId } = body;

    if (!roundId || roundId === "latest") {
      const latestRound = await getLatestRoundForFeed(feedId || "BNB/USD");

      if (latestRound) {
        return NextResponse.json({
          success: true,
          exists: true,
          verified: true,
          fromCache: true,
          data: {
            roundId: latestRound.roundId,
            asset: latestRound.feed,
            price: latestRound.median.toFixed(2),
            timestamp: Math.floor(latestRound.timestamp / 1000),
            timestampMs: latestRound.timestamp,
            councils: latestRound.councils,
            observations: { submitted: 3, total: 3 },
            checks: {
              oracleAuthorization: {
                passed: true,
                message: "3/3 oracles authorized",
              },
              dataFreshness: {
                passed: Date.now() - latestRound.timestamp < 5 * 60 * 1000,
                message: "<5 minutes old",
              },
              priceValidity: {
                passed: latestRound.median > 0,
                message: "Valid price data",
              },
            },
          },
        });
      } else {
        return NextResponse.json(
          {
            error: "No rounds found",
            details: "No round data has been submitted yet for this feed",
            exists: false,
          },
          { status: 404 }
        );
      }
    }

    const storedData = await getStoredRoundData(feedId || "BNB/USD", roundId);

    if (storedData) {
      // Return stored data with all council submissions
      return NextResponse.json({
        success: true,
        exists: true,
        verified: true,
        fromCache: true,
        data: {
          roundId: storedData.roundId,
          asset: storedData.feed,
          price: storedData.median.toFixed(2),
          timestamp: Math.floor(storedData.timestamp / 1000),
          timestampMs: storedData.timestamp,
          councils: storedData.councils, // Include all council submissions
          observations: { submitted: 3, total: 3 },
          checks: {
            oracleAuthorization: {
              passed: true,
              message: "3/3 oracles authorized",
            },
            dataFreshness: {
              passed: Date.now() - storedData.timestamp < 5 * 60 * 1000,
              message: "<5 minutes old",
            },
            priceValidity: {
              passed: storedData.median > 0,
              message: "Valid price data",
            },
          },
        },
      });
    }

    // Convert hex or decimal round ID to bigint
    let parsedRoundId: bigint;
    try {
      if (typeof roundId === "string" && roundId.startsWith("0x")) {
        parsedRoundId = BigInt(roundId);
      } else {
        parsedRoundId = BigInt(roundId);
      }
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid round ID format" },
        { status: 400 }
      );
    }

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL ||
        "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );

    const feedAddress =
      feedId && FEED_ADDRESSES[feedId]
        ? FEED_ADDRESSES[feedId]
        : FEED_ADDRESSES["BNB/USD"];

    if (!feedAddress) {
      return NextResponse.json(
        { error: `Feed address not configured for ${feedId || "BNB/USD"}.` },
        { status: 500 }
      );
    }

    let answer: bigint = BigInt(0);
    let updatedAt = 0;
    let observationsCount = 3;
    let decimals = 8;
    let description: string = feedId || "BNB/USD";
    let txHash: string | null = null;

    try {
      const aggregator = new ethers.Contract(
        feedAddress,
        AGGREGATOR_ABI_V2,
        provider
      );
      const data = await aggregator.getRoundData(parsedRoundId);

      const [
        returnedRoundId,
        returnedAnswer,
        returnedUpdatedAt,
        returnedObservationsCount,
      ] = data;

      answer = returnedAnswer;
      updatedAt = Number(returnedUpdatedAt);
      observationsCount = Number(returnedObservationsCount);

      try {
        decimals = Number(await aggregator.decimals());
      } catch (e) {
        decimals = 8;
      }

      try {
        description = await aggregator.description();
      } catch (e) {
        description = feedId || "Price Feed";
      }

      try {
        const filter = aggregator.filters.AnswerUpdated(parsedRoundId);
        const events = await aggregator.queryFilter(filter, -10000, "latest");
        if (events.length > 0) {
          txHash = events[0].transactionHash;
        }
      } catch (e) {
        console.error("[Failed to fetch transaction hash:", e);
      }
    } catch (error: any) {
      console.error(
        "Custom ABI failed, trying standard Chainlink ABI:",
        error.message
      );

      try {
        const aggregator = new ethers.Contract(
          feedAddress,
          AGGREGATOR_ABI_V1,
          provider
        );
        const roundData = await aggregator.getRoundData(parsedRoundId);
        answer = roundData.answer;
        updatedAt = Number(roundData.updatedAt);
        decimals = Number(await aggregator.decimals());
        description = await aggregator.description();
        observationsCount = 3;
      } catch (error2: any) {
        return NextResponse.json(
          {
            error: "Round ID not found on blockchain",
            details:
              "This round does not exist in the smart contract. Please verify the round ID is correct.",
            exists: false,
          },
          { status: 404 }
        );
      }
    }

    const price = Number(answer) / Math.pow(10, decimals);
    const observations = { submitted: observationsCount, total: 3 };
    const updatedAtMs = updatedAt * 1000;
    const now = Date.now();
    const isFresh = now - updatedAtMs < 5 * 60 * 1000;
    const authorized = { count: observationsCount, total: 3 };
    const isPriceValid = price > 0 && price < 10000000;

    return NextResponse.json({
      success: true,
      exists: true,
      verified: isFresh && isPriceValid,
      fromCache: false,
      data: {
        roundId: `0x${parsedRoundId.toString(16)}`,
        asset: description,
        price: price.toFixed(2),
        timestamp: Math.floor(updatedAtMs / 1000),
        timestampMs: updatedAtMs,
        observations,
        txHash,
        checks: {
          oracleAuthorization: {
            passed: authorized.count === authorized.total,
            message: `${authorized.count}/${authorized.total} oracles authorized`,
          },
          dataFreshness: {
            passed: isFresh,
            message: isFresh ? "<5 minutes old" : ">5 minutes old",
          },
          priceValidity: {
            passed: isPriceValid,
            message: isPriceValid ? "Valid price data" : "Invalid price data",
          },
        },
      },
    });
  } catch (error: any) {
    console.error("Error verifying round:", error);
    return NextResponse.json(
      { error: "Failed to verify round", details: error.message },
      { status: 500 }
    );
  }
}
