"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ExternalLink,
  Download,
  X,
  Copy,
  Play,
  Loader2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReportType } from "@/lib/types";
import {
  oracleClient,
  FEED_CONFIGS,
  type PriceData,
  type SubmissionResult,
} from "@/lib/oracle-client";

function TileBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 85%, rgba(48,56,20,0.25) 0%, rgba(29,33,14,0.15) 35%, rgba(12,12,12,0.08) 60%, rgba(0,0,0,0) 85%)",
        }}
      />
      <div
        className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 h-[260px] w-[260px] rounded-full blur-[42px] opacity-[0.06]"
        style={{ background: "#D0FF00" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.20) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}

export default function ExplorerPage() {
  const { toast } = useToast();
  const [selectedFeed, setSelectedFeed] = useState("BNB/USD");
  const [livePrices, setLivePrices] = useState<Map<string, PriceData>>(
    new Map()
  );
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [oracleSubmissions, setOracleSubmissions] = useState<{
    [key: string]: number;
  }>({});

  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<
    SubmissionResult[]
  >([]);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState(-1);

  const [roundTxHashes, setRoundTxHashes] = useState<{
    [oracle: string]: string;
  }>({});

  const [latestRoundDetails, setLatestRoundDetails] = useState<{
    roundId: string;
    median: number;
    timestamp: number;
    txHash?: string;
  } | null>(null);

  const [roundDetailsFromRedis, setRoundDetailsFromRedis] = useState<{
    councils: Array<{
      oracle: string;
      price: number;
      txHash: string;
      bscScanLink: string;
    }>;
    median: number;
  } | null>(null);

  const [isLoadingRoundDetails, setIsLoadingRoundDetails] = useState(false);

  const storeRoundDataToUpstash = async (
    roundId: string,
    feed: string,
    results: SubmissionResult[],
    median: number
  ) => {
    try {
      const councils = results
        .filter((r) => r.status === "success" && r.txHash)
        .map((r) => ({
          oracle: r.oracle,
          price: r.price,
          txHash: r.txHash!,
          bscScanLink: `https://testnet.bscscan.com/tx/${r.txHash}`,
          timestamp: r.timestamp || Date.now(),
          status: "success" as const,
        }));

      if (councils.length === 0) {
        console.log("No successful submissions to store");
        return;
      }

      const roundData = {
        roundId,
        feed,
        councils,
        median,
        timestamp: Date.now(),
      };

      const response = await fetch("/api/store-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roundData),
      });

      if (response.ok) {
        console.log("OK");
      } else {
        const errorText = await response.text();
        console.error(errorText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const autoSubmit = async () => {
      if (isAutoSubmitting) return;

      const selectedSymbol = selectedFeed.split("/")[0];
      const priceData = livePrices.get(selectedSymbol);

      if (!priceData || priceData.price === 0) return;

      setIsAutoSubmitting(true);
      const oracles = ["Council-01", "Council-02", "Council-03"];
      const txHashes: { [oracle: string]: string } = {};
      const autoResults: SubmissionResult[] = [];

      for (let i = 0; i < oracles.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const result = await oracleClient.submitPriceToOracle(
          selectedSymbol,
          priceData.price,
          oracles[i]
        );

        if (result.status === "success" && result.txHash) {
          txHashes[oracles[i]] = result.txHash;
          autoResults.push(result);
        } else {
          autoResults.push({
            oracle: oracles[i],
            price: priceData.price,
            status: "skipped",
          } as SubmissionResult);
        }
      }

      setRoundTxHashes(txHashes);
      setIsAutoSubmitting(false);

      setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/get-latest-round?symbol=${selectedSymbol}`
          );
          if (response.ok) {
            const data = await response.json();
            setLatestRoundDetails({
              roundId: data.roundId,
              median: data.median,
              timestamp: data.timestamp,
            });
            // Store to Upstash with the fetched round data
            await storeRoundDataToUpstash(
              data.roundId,
              selectedFeed,
              autoResults,
              data.median
            );
          }
        } catch (error) {
          console.error(error);
        }
      }, 5000);
    };

    const timer = setTimeout(autoSubmit, 5000);

    const interval = setInterval(autoSubmit, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [selectedFeed, livePrices, isAutoSubmitting]);

  useEffect(() => {
    const fetchLatestRoundDetails = async () => {
      try {
        const selectedSymbol = selectedFeed.split("/")[0];
        const response = await fetch(
          `/api/get-latest-round?symbol=${selectedSymbol}`
        );
        if (response.ok) {
          const data = await response.json();
          setLatestRoundDetails({
            roundId: data.roundId,
            median: data.median,
            timestamp: data.timestamp,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLatestRoundDetails();
    const interval = setInterval(fetchLatestRoundDetails, 60000);
    return () => clearInterval(interval);
  }, [selectedFeed]);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const prices = await oracleClient.getAllPrices();
        setLivePrices(prices);

        const selectedSymbol = selectedFeed.split("/")[0];
        const priceData = prices.get(selectedSymbol);
        if (priceData) {
          const median = priceData.price;
          setOracleSubmissions({
            "Council-01": median,
            "Council-02": median,
            "Council-03": median,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 5000);
    return () => clearInterval(interval);
  }, [selectedFeed]);

  const handleTryItNow = async () => {
    setIsManualSubmitting(true);
    setSubmissionResults([]);
    setShowSubmissionDialog(true);
    setCurrentLoadingIndex(0);

    const selectedSymbol = selectedFeed.split("/")[0];
    const priceData = livePrices.get(selectedSymbol);

    if (!priceData) {
      toast({
        title: "Error",
        description: "Price data not available",
        variant: "destructive",
      });
      setIsManualSubmitting(false);
      setCurrentLoadingIndex(-1);
      return;
    }

    const oracles = ["Council-01", "Council-02", "Council-03"];
    const results: SubmissionResult[] = [];
    const txHashes: { [oracle: string]: string } = {};

    for (let i = 0; i < oracles.length; i++) {
      setCurrentLoadingIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await oracleClient.submitPriceToOracle(
        selectedSymbol,
        priceData.price,
        oracles[i]
      );

      if (result.status === "error") {
        results.push({
          oracle: oracles[i],
          price: priceData.price,
          status: "skipped",
          error: undefined,
        } as SubmissionResult);
      } else {
        results.push(result);
        if (result.txHash) {
          txHashes[oracles[i]] = result.txHash;
        }
      }

      setSubmissionResults([...results]);
    }

    setCurrentLoadingIndex(-1);
    setRoundTxHashes(txHashes);
    setIsManualSubmitting(false);

    const successCount = results.filter((r) => r.status === "success").length;

    if (successCount > 0) {
      toast({
        title: "Submission Complete!",
        description: `Successfully submitted ${selectedFeed} price from ${successCount} oracle(s)`,
      });

      setTimeout(async () => {
        try {
          const selectedSymbol = selectedFeed.split("/")[0];
          const response = await fetch(
            `/api/get-latest-round?symbol=${selectedSymbol}`
          );
          if (response.ok) {
            const data = await response.json();
            setLatestRoundDetails({
              roundId: data.roundId,
              median: data.median,
              timestamp: data.timestamp,
            });

            // Store to Upstash
            await storeRoundDataToUpstash(
              data.roundId,
              selectedFeed,
              results,
              data.median
            );
          }
        } catch (error) {
          console.error(error);
        }
      }, 5000);
    }
  };

  const handleToggleAutoSubmit = async () => {
    // Auto-submit logic handled by useEffect
  };

  const handleViewDetails = async (roundId: string) => {
    setSelectedRound(roundId);
    setRoundDetailsFromRedis(null);
    setIsLoadingRoundDetails(true);

    try {
      const response = await fetch("/api/get-round-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId: "latest", feedId: selectedFeed }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {
          if (result.fromCache && result.data.councils) {
            setRoundDetailsFromRedis({
              councils: result.data.councils,
              median: Number.parseFloat(result.data.price),
            });
            setSelectedRound(result.data.roundId);
            toast({
              title: "Latest Round Loaded",
              description: "Council submission data retrieved from database",
            });
          } else {
            toast({
              title: "Round Data Retrieved",
              description:
                "Showing blockchain data. Council details may not be available.",
            });
          }
        } else {
          toast({
            title: "No Data Found",
            description:
              "No round data found in database. Submit prices to create a round.",
            variant: "destructive",
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to fetch latest round data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load latest round details",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRoundDetails(false);
    }
  };

  const handleCopyRoundId = async () => {
    if (selectedRound) {
      try {
        await navigator.clipboard.writeText(selectedRound);
        toast({
          title: "Copied!",
          description: "Round ID copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleCopyTxHash = async (txHash: string) => {
    try {
      await navigator.clipboard.writeText(txHash);
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewOnBscScan = (txHash: string) => {
    const bscScanUrl = `https://testnet.bscscan.com/tx/${txHash}`;
    window.open(bscScanUrl, "_blank");
  };

  const handleDownloadRion = () => {
    if (!selectedRound) return;

    const roundData = {
      roundId: selectedRound,
      feed: selectedFeed,
      price: roundDetailsFromRedis?.median || currentPrice,
      timestamp: new Date().toISOString(),
      council: ["Council-01", "Council-02", "Council-03"],
      submissions: oracleSubmissions,
      median: roundDetailsFromRedis?.median || currentPrice,
      councils: roundDetailsFromRedis?.councils || [],
    };

    const blob = new Blob([JSON.stringify(roundData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `round-${selectedRound}.rion`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerifyInLab = () => {
    if (!selectedRound) return;

    const labUrl = `/lab?roundId=${encodeURIComponent(
      selectedRound
    )}&feed=${encodeURIComponent(selectedFeed)}`;
    window.open(labUrl, "_blank");
  };

  const feeds = FEED_CONFIGS.filter((config) => config.aggregatorAddress).map(
    (config) => {
      const priceData = livePrices.get(config.symbol);
      return {
        pair: config.name,
        symbol: config.symbol,
        price: priceData?.price || 0,
        change: priceData?.change24h || 0,
        //@ts-ignore
        roundId: priceData?.roundId || null,
        status: "active" as const,
        heartbeat: "30s",
        pillar: "price" as ReportType,
      };
    }
  );

  const selectedFeedData = feeds.find((f) => f.pair === selectedFeed);
  const currentPrice = selectedFeedData?.price || 0;
  const currentChange = selectedFeedData?.change || 0;
  const currentRoundId =
    latestRoundDetails?.roundId ||
    `0x${Math.floor(Date.now() / 1000).toString(16)}`;

  const rounds =
    currentPrice > 0 && latestRoundDetails
      ? [
          {
            id: latestRoundDetails.roundId,
            timestamp: new Date(
              latestRoundDetails.timestamp * 1000
            ).toLocaleString(),
            median: latestRoundDetails.median,
            signers: 3,
            status: "verified",
            deviation: 0.02,
          },
        ]
      : [];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full hidden md:block">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-[140px] md:top-[-180px] w-full min-w-screen md:h-svw"
        >
          <source src="/hero.mp4" type="video/mp4" className="w-full" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgb(0, 0, 0) 0%, rgb(0 0 0 / 0%) 20%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%)",
          }}
        />
      </div>

      <Navigation />

      <main className="relative z-10 pt-32 pb-20">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-3 md:mt-[253px]">
            Feed Explorer
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-4xl">
            Real-time oracle price feeds with full transparency and verification
          </p>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 border-y border-white/[0.08] bg-black">
            <div className="md:col-span-4 border-r border-white/[0.08] p-6 md:p-8 min-h-[600px] bg-black">
              <div className="mb-6">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#D0FF00] mb-4">
                  Available Feeds
                </h3>
                <p className="text-sm text-white/60 mb-6">
                  {feeds.length} active price feeds
                </p>
              </div>

              <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                {feeds.map((feed) => {
                  const isActive = selectedFeed === feed.pair;
                  return (
                    <button
                      key={feed.pair}
                      onClick={() => setSelectedFeed(feed.pair)}
                      className={cn(
                        "w-full p-5 rounded-lg transition-all duration-300 text-left relative overflow-hidden",
                        isActive ? "" : "bg-black"
                      )}
                    >
                      {isActive && <TileBackdrop />}

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-white text-base uppercase tracking-wide">
                            {feed.pair}
                          </span>
                          <span className="text-[11px] font-medium uppercase tracking-widest text-white/40">
                            {feed.status}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-2xl font-bold text-white tabular-nums">
                            ${feed.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span>{feed.heartbeat}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-8 bg-black">
              <div className="relative">
                <div className="border-b border-white/[0.08] p-8 md:p-12">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#D0FF00] mb-6">
                    Live Price
                  </div>

                  <div className="mb-6">
                    <div className="text-[min(20vw,10rem)] md:text-[10rem] font-black leading-none tracking-tighter text-white tabular-nums">
                      ${currentPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      className="bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90 font-semibold"
                      onClick={handleTryItNow}
                      disabled={isManualSubmitting || currentPrice === 0}
                    >
                      {isManualSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Try It Now
                        </>
                      )}
                    </Button>
                    <button
                      className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium group"
                      onClick={() => {
                        window.open("/sdk", "_blank");
                      }}
                    >
                      <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#D0FF00]/40 transition-colors">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      Integrate Feed
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="border-b md:border-r border-white/[0.08] p-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6">
                      Feed Details
                    </h4>
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-sm">Heartbeat</span>
                        <span className="text-white font-semibold text-base">
                          30s
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-sm">Status</span>
                        <span className="flex items-center gap-2 text-[#D0FF00]">
                          <span className="w-2 h-2 rounded-full bg-[#D0FF00] animate-pulse" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] p-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6">
                      Latest Round
                    </h4>
                    {rounds.length > 0 ? (
                      <div className="space-y-5">
                        <div>
                          <span className="text-[#D0FF00] font-mono text-xs block mb-2">
                            {rounds[0].id}
                          </span>
                          <span className="text-white/50 text-xs">
                            {rounds[0].timestamp}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 text-sm">Median</span>
                          <span className="text-white font-bold text-xl tabular-nums">
                            ${rounds[0].median.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 text-sm">Signers</span>
                          <span className="text-white font-semibold">3/3</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent border-white/[0.08] hover:bg-[#D0FF00]/10 hover:border-[#D0FF00]/40 text-white mt-2"
                          onClick={() => handleViewDetails(rounds[0].id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    ) : (
                      <div className="text-white/40 text-sm">
                        Waiting for data...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showSubmissionDialog && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-in fade-in duration-300">
          <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-[#111113] border-l border-white/[0.08] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="border-b border-white/[0.08] p-8">
              <div className="flex items-center justify-between mt-[40px]">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Submission Results
                  </h2>
                  <p className="text-sm text-white/50 mt-1">
                    Real-time oracle price submission tracking
                  </p>
                </div>
                <button
                  onClick={() => setShowSubmissionDialog(false)}
                  className="hover:bg-white/10 text-white h-10 w-10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-white/[0.08] p-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6">
                  FEED
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {selectedFeed}
                </div>
                <div className="text-5xl font-bold text-[#D0FF00] tabular-nums">
                  ${currentPrice.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {["Council-01", "Council-02", "Council-03"].map(
                  (oracleName, i) => {
                    const result = submissionResults[i];
                    const isLoading = currentLoadingIndex === i;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "border-b lg:border-r lg:last:border-r-0 border-white/[0.08] p-8",
                          i % 2 === 1 && "lg:border-r-0"
                        )}
                      >
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-[#D0FF00] mb-4" />
                            <span className="text-white/70 font-medium text-sm">
                              Submitting {oracleName}...
                            </span>
                          </div>
                        ) : result ? (
                          <>
                            <div className="flex items-center justify-between mb-6">
                              <span className="font-bold text-white text-lg">
                                {result.oracle}
                              </span>
                              {result.status === "success" ? (
                                <CheckCircle2 className="h-6 w-6 text-[#D0FF00]" />
                              ) : result.status === "skipped" ? (
                                <span className="text-xs text-white/40 uppercase tracking-wider">
                                  Skipped
                                </span>
                              ) : null}
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span className="text-white/50 text-sm">
                                  Price
                                </span>
                                <span className="text-white font-mono font-bold text-lg">
                                  ${result.price.toFixed(2)}
                                </span>
                              </div>

                              {result.status === "success" && result.txHash && (
                                <>
                                  <div>
                                    <div className="text-white/50 text-sm mb-2">
                                      Transaction Hash
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleCopyTxHash(result.txHash)
                                      }
                                      className="flex items-center gap-2 text-[#D0FF00] hover:text-[#D0FF00]/80 font-mono text-sm group"
                                    >
                                      <span>
                                        {result.txHash.slice(0, 12)}...
                                        {result.txHash.slice(-8)}
                                      </span>
                                      <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleViewOnBscScan(result.txHash)
                                    }
                                    className="w-full flex items-center justify-center gap-2 text-sm text-black font-semibold bg-[#D0FF00] hover:bg-[#D0FF00]/90 rounded py-3 transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    View on BscScan
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <span className="text-white/30 font-medium text-sm">
                              Waiting...
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {submissionResults.length === 3 &&
                submissionResults.every((r) => r.status === "success") && (
                  <div className="border-t border-[#D0FF00]/30 bg-[#D0FF00]/5 p-8">
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-3">
                      FINAL MEDIAN PRICE
                    </div>
                    <div className="text-6xl font-bold text-[#D0FF00] tabular-nums mb-4">
                      ${currentPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-white/70 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      All 3 council members submitted successfully
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {selectedRound && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-in fade-in duration-300">
          <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-[#111113] border-l border-white/[0.08] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="border-b border-white/[0.08] p-8">
              <div className="flex items-center justify-between mt-[40px]">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Round Details
                  </h2>
                  <p className="text-sm text-white/50 mt-1">
                    Cryptographically verified oracle submission
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRound(null);
                    setRoundDetailsFromRedis(null);
                  }}
                  className="hover:bg-white/10 text-white h-10 w-10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {isLoadingRoundDetails ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-[#D0FF00]" />
                  <p className="text-white/70">Loading round details...</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="border-b border-white/[0.08] p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6">
                    ROUND ID
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-mono text-base text-[#D0FF00] break-all">
                      {selectedRound}
                    </div>
                    <button
                      onClick={handleCopyRoundId}
                      className="bg-transparent border border-white/20 hover:bg-[#D0FF00]/10 hover:border-[#D0FF00]/40 text-white shrink-0 px-4 py-2 rounded transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="border-b lg:border-r border-white/[0.08] p-8">
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6">
                      COUNCIL SIGNATURES
                    </div>
                    <div className="space-y-4">
                      {["Council-01", "Council-02", "Council-03"].map(
                        (name, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium text-white">
                              {name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/50">
                                Verified
                              </span>
                              <CheckCircle2 className="h-5 w-5 text-[#D0FF00]" />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="border-b border-white/[0.08] p-8">
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6">
                      STATISTICS
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-white/50 text-sm">
                          Median Price
                        </span>
                        <span className="text-[#D0FF00] font-bold text-xl tabular-nums">
                          $
                          {roundDetailsFromRedis?.median.toFixed(2) ||
                            latestRoundDetails?.median.toFixed(2) ||
                            currentPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Signers</span>
                        <span className="text-white font-semibold">3/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Status</span>
                        <span className="flex items-center gap-2 text-[#D0FF00]">
                          <span className="w-2 h-2 rounded-full bg-[#D0FF00] animate-pulse" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-white/[0.08] p-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-6">
                    SOURCE ARTIFACTS
                  </div>
                  <div className="bg-black border border-white/[0.08] p-6 rounded space-y-4">
                    {roundDetailsFromRedis ? (
                      <>
                        {roundDetailsFromRedis.councils.map((council) => (
                          <div key={council.oracle} className="space-y-2">
                            <div className="flex items-center justify-between text-[#D0FF00]">
                              <span className="flex items-center gap-2 font-mono text-sm">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {council.oracle}
                              </span>
                              <span className="font-bold">
                                ${council.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyTxHash(council.txHash)}
                                className="flex items-center gap-2 text-white/50 hover:text-[#D0FF00] font-mono text-xs group flex-1"
                              >
                                <span>
                                  {council.txHash.slice(0, 10)}...
                                  {council.txHash.slice(-8)}
                                </span>
                                <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                              <button
                                onClick={() =>
                                  handleViewOnBscScan(council.txHash)
                                }
                                className="flex items-center gap-1 text-xs text-[#D0FF00] hover:text-[#D0FF00]/80 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                                BscScan
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-white/[0.08] pt-4 mt-4 flex items-center justify-between text-[#D0FF00] font-bold text-lg">
                          <span>→ Median</span>
                          <span>
                            ${roundDetailsFromRedis.median.toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {["Council-01", "Council-02", "Council-03"].map(
                          (name) => {
                            const txHash = roundTxHashes[name];
                            const price =
                              oracleSubmissions[name] || currentPrice;

                            return (
                              <div key={name} className="space-y-2">
                                <div className="flex items-center justify-between text-[#D0FF00]">
                                  <span className="flex items-center gap-2 font-mono text-sm">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {name}
                                  </span>
                                  <span className="font-bold">
                                    ${price.toFixed(2)}
                                  </span>
                                </div>
                                {txHash && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCopyTxHash(txHash)}
                                      className="flex items-center gap-2 text-white/50 hover:text-[#D0FF00] font-mono text-xs group flex-1"
                                    >
                                      <span>
                                        {txHash.slice(0, 10)}...
                                        {txHash.slice(-8)}
                                      </span>
                                      <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleViewOnBscScan(txHash)
                                      }
                                      className="flex items-center gap-1 text-xs text-[#D0FF00] hover:text-[#D0FF00]/80 transition-colors"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      BscScan
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}

                        <div className="border-t border-white/[0.08] pt-4 mt-4 flex items-center justify-between text-[#D0FF00] font-bold text-lg">
                          <span>→ Median</span>
                          <span>
                            $
                            {latestRoundDetails?.median.toFixed(2) ||
                              currentPrice.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleDownloadRion}
                      className="bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90 font-semibold h-12 rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                      Download .rion
                    </button>
                    <button
                      onClick={handleVerifyInLab}
                      className="bg-transparent border border-white/20 hover:bg-white/10 hover:border-white/30 text-white h-12 rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Verify in Lab
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
