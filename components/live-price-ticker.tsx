"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { oracleClient } from "@/lib/oracle-client";

interface PriceData {
  pair: string;
  price: number;
  change: number;
}

const FEED_PAIRS = [
  "BNB/USD",
  "ETH/USD",
  "BTC/USD",
  "SOL/USD",
  "XRP/USD",
  "DOGE/USD",
  "LINK/USD",
];

export function LivePriceTicker() {
  const [prices, setPrices] = useState<PriceData[]>(
    FEED_PAIRS.map((pair) => ({ pair, price: 0, change: 0 }))
  );

  useEffect(() => {
    const fetchAllPrices = async () => {
      try {
        const pricePromises = FEED_PAIRS.map(async (pair) => {
          try {
            const { price, change } = await oracleClient.getPriceBySymbol(pair);
            return { pair, price, change };
          } catch (error) {
            console.error(` Failed to fetch ${pair} price:`, error);
            return { pair, price: 0, change: 0 };
          }
        });

        const allPrices = await Promise.all(pricePromises);
        setPrices(allPrices);
      } catch (error) {
        console.error(" Failed to fetch prices:", error);
      }
    };

    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden bg-muted/30 border-y border-border/50">
      <div className="flex animate-marquee whitespace-nowrap py-3">
        {[...prices, ...prices].map((price, index) => (
          <div key={index} className="inline-flex items-center gap-3 px-8">
            <span className="text-sm font-medium">{price.pair}</span>
            <span className="text-sm font-mono tabular-nums price-flicker">
              ${price.price.toFixed(2)}
            </span>
            <span
              className={`text-xs flex items-center gap-1 ${
                price.change >= 0 ? "text-primary" : "text-destructive"
              }`}
            >
              {price.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(price.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
