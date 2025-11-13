import { type NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const simpleAggregatorABI = [
  "function submitValue(int256 value, uint256 timestamp) external",
  "function latestRoundData() external view returns (uint256 roundId, int256 answer, uint256 timestamp, uint256 observationCount)",
];

const FEED_CONFIGS = [
  {
    symbol: "BNB",
    address: process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS || "",
  },
  {
    symbol: "ETH",
    address: process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS || "",
  },
  {
    symbol: "BTC",
    address: process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS || "",
  },
  {
    symbol: "SOL",
    address: process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS || "",
  },
  {
    symbol: "XRP",
    address: process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS || "",
  },
  {
    symbol: "DOGE",
    address: process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS || "",
  },
  {
    symbol: "LINK",
    address: process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS || "",
  },
];

const ORACLES = [
  { name: "Council-01", key: process.env.COUNCIL_01_PRIVATE_KEY || "" },
  { name: "Council-02", key: process.env.COUNCIL_02_PRIVATE_KEY || "" },
  { name: "Council-03", key: process.env.COUNCIL_03_PRIVATE_KEY || "" },
];

export async function POST(req: NextRequest) {
  try {
    // Fetch current prices from Binance
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    const binanceData = await response.json();

    const symbolMap: Record<string, string> = {
      BNB: "BNBUSDT",
      ETH: "ETHUSDT",
      BTC: "BTCUSDT",
      SOL: "SOLUSDT",
      XRP: "XRPUSDT",
      DOGE: "DOGEUSDT",
      LINK: "LINKUSDT",
    };

    const results = [];

    // Setup provider
    const rpcUrl =
      process.env.NEXT_PUBLIC_RPC_URL ||
      "https://data-seed-prebsc-1-s1.binance.org:8545";
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Submit for each feed
    for (const feed of FEED_CONFIGS) {
      const binanceSymbol = symbolMap[feed.symbol];
      const priceData = binanceData.find(
        (item: any) => item.symbol === binanceSymbol
      );

      if (!priceData || !feed.address) continue;

      const price = Number.parseFloat(priceData.lastPrice);
      const timestamp = Math.floor(Date.now() / 1000) - 60;

      // Submit from all 3 oracles
      const oracleResults = [];
      for (const oracle of ORACLES) {
        if (!oracle.key) continue;

        try {
          const wallet = new ethers.Wallet(oracle.key, provider);
          const contract = new ethers.Contract(
            feed.address,
            simpleAggregatorABI,
            wallet
          );

          const value = Math.floor(price * 1e8);
          const tx = await contract.submitValue(value, timestamp);
          const receipt = await tx.wait();

          oracleResults.push({
            oracle: oracle.name,
            txHash: receipt.hash,
            status: "success",
          });

          console.log(
            `[AUTO-SUBMIT] ${oracle.name} ✅ ${feed.symbol}: $${price.toFixed(
              2
            )} - Tx: ${receipt.hash}`
          );
        } catch (error: any) {
          console.error(
            `[AUTO-SUBMIT] ${oracle.name} ❌ ${feed.symbol}:`,
            error.message
          );
          oracleResults.push({
            oracle: oracle.name,
            status: "error",
            error: error.message,
          });
        }

        // Small delay between oracle submissions
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Fetch the resulting round ID
      try {
        const contract = new ethers.Contract(
          feed.address,
          simpleAggregatorABI,
          provider
        );
        const roundData = await contract.latestRoundData();

        results.push({
          symbol: feed.symbol,
          price,
          roundId: `0x${roundData[0].toString(16)}`,
          timestamp: Date.now(),
          oracles: oracleResults,
        });
      } catch (error) {
        results.push({
          symbol: feed.symbol,
          price,
          roundId: null,
          timestamp: Date.now(),
          oracles: oracleResults,
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      results,
    });
  } catch (error: any) {
    console.error("[AUTO-SUBMIT] Error:", error.message);
    return NextResponse.json(
      {
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
