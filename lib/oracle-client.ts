export interface PriceData {
  price: number;
  change24h: number;
  timestamp: number;
  roundId?: string;
}

export interface SubmissionResult {
  txHash: string;
  oracle: string;
  price: number;
  timestamp: number;
  status: "success" | "pending" | "error" | any;
  error?: string;
}

export const FEED_CONFIGS = [
  {
    name: "BNB/USD",
    symbol: "BNB",
    aggregatorAddress:
      process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS ||
      "0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F",
  },
  {
    name: "ETH/USD",
    symbol: "ETH",
    aggregatorAddress:
      process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS ||
      "0xf20340BaA91b93C773E5F1db8e296D46D1fec994",
  },
  {
    name: "BTC/USD",
    symbol: "BTC",
    aggregatorAddress:
      process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS ||
      "0x34c5E550c9048293c5Ea0908c9EDF5A2Dd7411aC",
  },
  {
    name: "SOL/USD",
    symbol: "SOL",
    aggregatorAddress:
      process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS ||
      "0x5713E03e9C93ABB7b4ee6eff36514dAc5a3cE4b9",
  },
  {
    name: "XRP/USD",
    symbol: "XRP",
    aggregatorAddress:
      process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS ||
      "0x2B4D6eb2Fb9DABB7b4ee6eff36514dAc5a3cE4b9",
  },
  {
    name: "DOGE/USD",
    symbol: "DOGE",
    aggregatorAddress:
      process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS ||
      "0x5EA49AdD76cfdB62Ed6835C110e815C246b37BF9",
  },
  {
    name: "LINK/USD",
    symbol: "LINK",
    aggregatorAddress:
      process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS ||
      "0x34DBd587708163694bc10f90Db61F67d63546152",
  },
];

class OracleClient {
  async getAllPrices(): Promise<Map<string, PriceData>> {
    const prices = new Map<string, PriceData>();

    try {
      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr"
      );
      const data = await response.json();

      const symbols = [
        "BNBUSDT",
        "ETHUSDT",
        "BTCUSDT",
        "SOLUSDT",
        "XRPUSDT",
        "DOGEUSDT",
        "LINKUSDT",
      ];

      // Fetch on-chain round data in parallel for all feeds
      const onChainDataPromises = FEED_CONFIGS.map(async (config) => {
        try {
          const response = await fetch(
            `/api/get-latest-round?symbol=${config.symbol}`
          );

          if (!response.ok) {
            return { symbol: config.symbol, roundId: null, median: null };
          }

          const data = await response.json();
          return {
            symbol: config.symbol,
            roundId: data.roundId,
            median: data.median,
          };
        } catch (error) {
          return { symbol: config.symbol, roundId: null, median: null };
        }
      });

      const onChainData = await Promise.all(onChainDataPromises);

      // Combine Binance price data with on-chain round IDs
      data.forEach((item: any) => {
        if (symbols.includes(item.symbol)) {
          const asset = item.symbol.replace("USDT", "");
          const onChainInfo = onChainData.find((d) => d.symbol === asset);

          prices.set(asset, {
            price: Number.parseFloat(item.lastPrice),
            change24h: Number.parseFloat(item.priceChangePercent),
            timestamp: Date.now(),
            roundId: onChainInfo?.roundId || null,
          });
        }
      });
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    }

    return prices;
  }

  async submitPriceToOracle(
    symbol: string,
    price: number,
    oracleName: string
  ): Promise<SubmissionResult> {
    console.log(
      ` Submitting ${symbol} price $${price.toFixed(2)} from ${oracleName}`
    );

    try {
      const response = await fetch("/api/submit-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          price,
          oracleName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      console.log(` ${oracleName} ✅ ${symbol} submitted - Tx: ${data.txHash}`);

      return {
        txHash: data.txHash,
        oracle: oracleName,
        price,
        timestamp: Date.now(),
        status: "success",
      };
    } catch (error: any) {
      console.error(` ${oracleName} ❌ ${symbol} error:`, error.message);

      return {
        txHash: "",
        oracle: oracleName,
        price,
        timestamp: Date.now(),
        status: "error",
        error: error.message,
      };
    }
  }
}

export const oracleClient = new OracleClient();
