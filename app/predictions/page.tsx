"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Clock,
  DollarSign,
  ExternalLink,
  Activity,
  ChevronDown,
  Github,
  Flame,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  BookOpen,
  Code2,
  Menu,
  X,
  TrendingUp,
  ArrowRight,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { nbaApi } from "@/lib/nba-api-client";
import WalletConnect from "@/components/wallet-connect";
import {
  PredictionMarket,
  getAggregatorForGame,
} from "@/lib/prediction-market";

type BettingMarket = "moneyline" | "spread" | "totals";

interface Bookmaker {
  name: string;
  odds: number;
  isBest?: boolean;
}

interface NBAGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  homeOdds: number;
  awayOdds: number;
  spread?: { home: number; away: number; homeOdds: number; awayOdds: number };
  totals?: { over: number; under: number; overOdds: number; underOdds: number };
  bookmakers?: {
    moneyline: { home: Bookmaker[]; away: Bookmaker[] };
    spread?: { home: Bookmaker[]; away: Bookmaker[] };
    totals?: { over: Bookmaker[]; under: Bookmaker[] };
  };
  startTime: Date;
  status: "upcoming" | "live" | "final";
  homeScore?: number;
  awayScore?: number;
  quarter?: string;
  timeRemaining?: string;
  homeForm?: string[];
  awayForm?: string[];
  popularPick?: { team: string; percentage: number };
  oddsMovement?: {
    home: "up" | "down" | "stable";
    away: "up" | "down" | "stable";
  };
  oddsHistory?: { timestamp: Date; homeOdds: number; awayOdds: number }[];
  venue?: string;
  headToHead?: { homeWins: number; awayWins: number };
  winProbability?: { home: number; away: number };
  teamStats?: {
    home: { ppg: number; oppg: number; record: string };
    away: { ppg: number; oppg: number; record: string };
  };
  aggregatorAddress?: string;
}

interface PredictionSlipItem {
  gameId: string;
  selectedTeam: string;
  odds: number;
  market: BettingMarket;
  betType: string;
  gameIndex: number;
}

interface Prediction {
  id: string;
  gameId: string;
  selectedTeam: string;
  amount: number;
  potentialWin: number;
  status: "pending" | "won" | "lost" | "claimed";
  timestamp: Date;
  market: BettingMarket;
  txHash: string;
  homeTeam: string;
  awayTeam: string;
  betType: string;
  odds: number;
}

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState<
    "matches" | "slip" | "my-predictions"
  >("matches");
  const [bettingMarket, setBettingMarket] =
    useState<BettingMarket>("moneyline");
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [developersOpen, setDevelopersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictionSlip, setPredictionSlip] = useState<PredictionSlipItem[]>(
    []
  );
  const [betAmount, setBetAmount] = useState("");
  const [parlayMode, setParlayMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "live">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"time" | "odds">("time");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [games, setGames] = useState<NBAGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingBet, setPlacingBet] = useState(false);
  const [betError, setBetError] = useState<string | null>(null);
  const [betSuccess, setBetSuccess] = useState<string | null>(null);
  const [claimingBet, setClaimingBet] = useState<string | null>(null);

  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const fetchedGames = await nbaApi.fetchGames();
      setGames(fetchedGames);
    } catch (error) {
      console.error("Failed to fetch NBA games:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPredictions = () => {
      const stored = localStorage.getItem("nba_predictions");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPredictions(
          parsed.map((p: any) => ({
            ...p,
            timestamp: new Date(p.timestamp),
          }))
        );
      }
    };

    loadGames();
    loadPredictions();

    const interval = setInterval(loadGames, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeUntil = (date: Date | string) => {
    const diff = new Date(date).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const addToPredictionSlip = (
    gameId: string,
    team: string,
    odds: number,
    market: BettingMarket,
    betType: string,
    gameIndex: number
  ) => {
    if (parlayMode) {
      const existing = predictionSlip.find((p) => p.gameId === gameId);
      if (existing) {
        setPredictionSlip(
          predictionSlip.map((p) =>
            p.gameId === gameId
              ? { gameId, selectedTeam: team, odds, market, betType, gameIndex }
              : p
          )
        );
      } else {
        setPredictionSlip([
          ...predictionSlip,
          { gameId, selectedTeam: team, odds, market, betType, gameIndex },
        ]);
      }
    } else {
      setPredictionSlip([
        { gameId, selectedTeam: team, odds, market, betType, gameIndex },
      ]);
    }
    setActiveTab("slip");
  };

  const removeFromSlip = (gameId: string) => {
    setPredictionSlip(predictionSlip.filter((p) => p.gameId !== gameId));
  };

  const calculateTotalOdds = () => {
    if (predictionSlip.length === 0) return 0;
    if (parlayMode) {
      return predictionSlip.reduce((acc, item) => acc * item.odds, 1);
    }
    return predictionSlip[0]?.odds || 0;
  };

  const calculatePotentialWin = () => {
    if (!betAmount || predictionSlip.length === 0) return 0;
    return Number.parseFloat(betAmount) * calculateTotalOdds();
  };

  const checkBetStatus = async (
    prediction: Prediction
  ): Promise<"won" | "lost" | "pending"> => {
    try {
      const market = new PredictionMarket();
      const gameIndex = games.findIndex((g) => g.id === prediction.gameId);
      const aggregator = getAggregatorForGame(gameIndex);

      const game = games.find((g) => g.id === prediction.gameId);
      if (!game || game.status !== "final") return "pending";

      if (prediction.market === "moneyline") {
        const homeWon = (game.homeScore || 0) > (game.awayScore || 0);
        const userPickedHome = prediction.selectedTeam === game.homeTeam;
        return (homeWon && userPickedHome) || (!homeWon && !userPickedHome)
          ? "won"
          : "lost";
      }

      return "pending";
    } catch (error) {
      console.error(error);
      return "pending";
    }
  };

  const claimWinnings = async (prediction: Prediction) => {
    setClaimingBet(prediction.id);
    try {
      const market = new PredictionMarket();
      const gameIndex = games.findIndex((g) => g.id === prediction.gameId);
      const aggregator = getAggregatorForGame(gameIndex);

      if (!aggregator || aggregator === "undefined") {
        throw new Error(
          `Game aggregator not configured. Please add NEXT_PUBLIC_GAME_${
            gameIndex + 1
          } to your environment variables.`
        );
      }

      const txHash = await market.claimWinnings(prediction.txHash, aggregator);

      const updatedPredictions = predictions.map((p) =>
        p.id === prediction.id ? { ...p, status: "claimed" as const } : p
      );
      setPredictions(updatedPredictions);
      localStorage.setItem(
        "nba_predictions",
        JSON.stringify(updatedPredictions)
      );

      setBetSuccess(`Winnings claimed! TX: ${txHash.slice(0, 10)}...`);
      setTimeout(() => setBetSuccess(null), 5000);
    } catch (error: any) {
      console.error("[v0] Claim error:", error);
      setBetError(error.message || "Failed to claim winnings");
      setTimeout(() => setBetError(null), 5000);
    } finally {
      setClaimingBet(null);
    }
  };

  const placeBet = async () => {
    if (!betAmount || predictionSlip.length === 0) return;

    setBetError(null);
    setBetSuccess(null);
    setPlacingBet(true);

    try {
      const market = new PredictionMarket();

      const bet = predictionSlip[0];
      const game = games.find((g) => g.id === bet.gameId);

      if (!game) throw new Error("Game not found");

      const aggregator = getAggregatorForGame(bet.gameIndex);

      if (!aggregator || aggregator === "undefined") {
        throw new Error(
          `Game aggregator not configured. Please add NEXT_PUBLIC_GAME_${
            bet.gameIndex + 1
          } to your environment variables.`
        );
      }

      const outcome = bet.selectedTeam === game.homeTeam ? 0 : 1;

      const placedBet = await market.placeBet(
        bet.gameId,
        bet.selectedTeam,
        outcome,
        betAmount,
        bet.odds,
        bet.market,
        bet.betType,
        aggregator
      );

      const newPrediction: Prediction = {
        id: placedBet.txHash,
        gameId: bet.gameId,
        selectedTeam: bet.selectedTeam,
        amount: Number.parseFloat(betAmount),
        potentialWin: Number.parseFloat(betAmount) * bet.odds,
        status: "pending",
        timestamp: new Date(),
        market: bet.market,
        txHash: placedBet.txHash,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        betType: bet.betType,
        odds: bet.odds,
      };

      const updatedPredictions = [newPrediction, ...predictions];
      setPredictions(updatedPredictions);
      localStorage.setItem(
        "nba_predictions",
        JSON.stringify(updatedPredictions)
      );

      setBetSuccess(
        `Bet placed successfully! TX: ${placedBet.txHash.slice(0, 10)}...`
      );
      setPredictionSlip([]);
      setBetAmount("");

      setTimeout(() => {
        setBetSuccess(null);
        setActiveTab("my-predictions");
      }, 2000);
    } catch (error: any) {
      console.error("[v0] Bet placement error:", error);
      setBetError(
        error.message ||
          "Failed to place bet. Please check console for details."
      );
    } finally {
      setPlacingBet(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedPredictions = await Promise.all(
        predictions.map(async (p) => {
          if (p.status === "pending") {
            const status = await checkBetStatus(p);
            return { ...p, status };
          }
          return p;
        })
      );
      if (JSON.stringify(updatedPredictions) !== JSON.stringify(predictions)) {
        setPredictions(updatedPredictions);
        localStorage.setItem(
          "nba_predictions",
          JSON.stringify(updatedPredictions)
        );
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [predictions]);

  const filteredGames = games
    .filter((game) => {
      const matchesSearch =
        game.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || game.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return (
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      }
      if (sortBy === "odds") {
        const minOddsA = Math.min(
          a.homeOdds,
          a.awayOdds,
          a.spread?.homeOdds || Number.POSITIVE_INFINITY,
          a.spread?.awayOdds || Number.POSITIVE_INFINITY,
          a.totals?.overOdds || Number.POSITIVE_INFINITY,
          a.totals?.underOdds || Number.POSITIVE_INFINITY
        );
        const minOddsB = Math.min(
          b.homeOdds,
          b.awayOdds,
          b.spread?.homeOdds || Number.POSITIVE_INFINITY,
          b.spread?.awayOdds || Number.POSITIVE_INFINITY,
          b.totals?.overOdds || Number.POSITIVE_INFINITY,
          b.totals?.underOdds || Number.POSITIVE_INFINITY
        );
        return minOddsA - minOddsB;
      }
      return 0;
    });

  const quickBetAmounts = [0.01, 0.05, 0.1, 0.5];

  const setQuickBet = (amount: number) => {
    setBetAmount(amount.toString());
  };

  const FormIndicator = ({ form }: { form: string[] }) => (
    <div className="flex items-center gap-1">
      {form.map((result, i) => (
        <div
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            result === "W" ? "bg-[#D0FF00]" : "bg-white/30"
          }`}
          title={result === "W" ? "Win" : "Loss"}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-82 bg-black/40 backdrop-blur-xl border-r border-white/5
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.sologo.ai/2025/0424/20250424031403894.png"
              alt="NBA"
              className="h-12 w-12 object-cover rounded-2xl"
            />
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                NBA Predictions
              </h1>
              <p className="text-xs text-white/40 mt-0.5">
                Decentralized Markets
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-white/5">
          <WalletConnect />
        </div>

        <div className="border-b border-white/5">
          <button
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-white/10 transition-colors">
                <AlertCircle className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                Disclaimer
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/30 transition-transform ${
                disclaimerOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {disclaimerOpen && (
            <div className="px-4 pb-4 text-xs text-white/40 leading-relaxed">
              Educational purposes only. All predictions use testnet BNB with no
              real monetary value.
            </div>
          )}
        </div>

        <div className="border-b border-white/5">
          <button
            onClick={() => setDevelopersOpen(!developersOpen)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-white/10 transition-colors">
                <Code2 className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                Developers
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/30 transition-transform ${
                developersOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {developersOpen && (
            <div className="px-4 pb-4">
              <p className="text-xs text-white/40 leading-relaxed mb-3">
                Build Your Own Prediction Market This demo showcases how to
                build trustless, automated prediction markets using RION Oracle.
                Fork this project and customize it for any sport, event, or
                outcome.{" "}
              </p>
              <div className="space-y-2">
                <Link
                  href="/docs"
                  className="flex items-center gap-2.5 p-3 rounded-lg hover:bg-white/[0.02] transition-all text-xs font-medium text-white/70 hover:text-white border border-white/5 hover:border-white/10 group"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#D0FF00]/60 group-hover:text-[#D0FF00]" />
                  <span className="flex-1">Documentation</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </Link>
                <Link
                  href="https://github.com/rionoracle"
                  target="_blank"
                  className="flex items-center gap-2.5 p-3 rounded-lg hover:bg-white/[0.02] transition-all text-xs font-medium text-white/70 hover:text-white border border-white/5 hover:border-white/10 group"
                >
                  <Github className="h-3.5 w-3.5 text-[#D0FF00]/60 group-hover:text-[#D0FF00]" />
                  <span className="flex-1">GitHub</span>
                  <ExternalLink className="h-3 w-3 opacity-40" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-b border-white/5">
          <Link
            href="https://testnet.bnbchain.org/faucet-smart"
            target="_blank"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-all border border-white/5 hover:border-[#D0FF00]/20 text-sm font-medium text-white/70 hover:text-white group"
          >
            <div className="h-8 w-8 rounded-lg bg-[#D0FF00]/5 border border-[#D0FF00]/10 flex items-center justify-center group-hover:bg-[#D0FF00]/10 transition-colors">
              <DollarSign className="h-4 w-4 text-[#D0FF00]" />
            </div>
            <span className="flex-1">Get testnet BNB</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-40" />
          </Link>
        </div>

        <div className="mt-auto p-4 border-t border-white/5">
          <p className="text-[10px] text-white/30 mb-3 uppercase tracking-widest font-bold">
            Powered By
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
              <Activity className="h-3.5 w-3.5 text-[#D0FF00]/80" />
              <span className="text-xs text-white/70 font-semibold tracking-wide">
                RION ORACLE
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
              <Flame className="h-3.5 w-3.5 text-[#D0FF00]/80" />
              <span className="text-xs text-white/70 font-semibold tracking-wide">
                BNB CHAIN
              </span>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="h-9 w-9 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center hover:bg-white/[0.02] hover:border-[#D0FF00]/20 transition-all"
              >
                <ArrowLeft className="h-4 w-4 text-white/70" />
              </Link>
              <img
                src="https://cdn.sologo.ai/2025/0424/20250424031403894.png"
                alt="NBA"
                className="h-12 w-12 object-cover rounded-2xl"
              />
              <h1 className="text-base font-bold text-white">
                NBA Predictions
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden h-9 w-9 p-0 hover:bg-white/[0.02]"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/10 bg-black/40 hover:bg-white/[0.02] hover:border-[#D0FF00]/20 transition-all text-white/70 hover:text-white text-sm font-medium group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:text-[#D0FF00] transition-colors" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/docs"
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/10 bg-black/40 hover:bg-white/[0.02] hover:border-[#D0FF00]/20 transition-all text-white/70 hover:text-white text-sm font-medium group"
            >
              <BookOpen className="h-4 w-4 group-hover:text-[#D0FF00] transition-colors" />
              <span>Docs</span>
            </Link>
            <Link
              href="https://github.com/rionoracle"
              target="_blank"
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/10 bg-black/40 hover:bg-white/[0.02] hover:border-[#D0FF00]/20 transition-all text-white/70 hover:text-white text-sm font-medium group"
            >
              <Github className="h-4 w-4 group-hover:text-[#D0FF00] transition-colors" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("matches")}
              className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap relative ${
                activeTab === "matches"
                  ? "text-white border-[#D0FF00]"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              Markets
              {activeTab === "matches" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0FF00] shadow-[0_0_10px_rgba(208,255,0,0.5)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("slip")}
              className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all relative whitespace-nowrap ${
                activeTab === "slip"
                  ? "text-white border-[#D0FF00]"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              Bet Slip
              {predictionSlip.length > 0 && (
                <span className="absolute -top-1 -right-6 h-5 w-5 rounded-full bg-[#D0FF00] text-black text-[10px] flex items-center justify-center font-bold shadow-lg">
                  {predictionSlip.length}
                </span>
              )}
              {activeTab === "slip" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0FF00] shadow-[0_0_10px_rgba(208,255,0,0.5)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("my-predictions")}
              className={`py-4 px-1 text-sm font-semibold border-b-2 transition-all whitespace-nowrap relative ${
                activeTab === "my-predictions"
                  ? "text-white border-[#D0FF00]"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              My Bets
              {activeTab === "my-predictions" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0FF00] shadow-[0_0_10px_rgba(208,255,0,0.5)]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#0a0a0a]">
          {activeTab === "matches" && (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">
              <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-1 border border-white/10 rounded-lg p-1 bg-black/30">
                  <button
                    onClick={() => setBettingMarket("moneyline")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      bettingMarket === "moneyline"
                        ? "bg-[#D0FF00] text-black shadow-md"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Moneyline
                  </button>
                  <button
                    onClick={() => setBettingMarket("spread")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      bettingMarket === "spread"
                        ? "bg-[#D0FF00] text-black shadow-md"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Spread
                  </button>
                  <button
                    onClick={() => setBettingMarket("totals")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      bettingMarket === "totals"
                        ? "bg-[#D0FF00] text-black shadow-md"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Totals
                  </button>
                </div>

                <button
                  onClick={() => setParlayMode(!parlayMode)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all shadow-sm ${
                    parlayMode
                      ? "bg-[#D0FF00] text-black border-[#D0FF00]"
                      : "text-white/70 border-white/10 hover:border-white/20 bg-black/30"
                  }`}
                >
                  {parlayMode ? "Parlay Mode" : "Single Bet"}
                </button>
              </div>

              <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D0FF00]/50 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setFilterStatus(
                        filterStatus === "all"
                          ? "upcoming"
                          : filterStatus === "upcoming"
                          ? "live"
                          : "all"
                      )
                    }
                    className="px-4 py-2.5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-black/[0.1] hover:border-white/20 transition-colors bg-black/30"
                  >
                    {filterStatus === "all"
                      ? "All"
                      : filterStatus === "upcoming"
                      ? "Upcoming"
                      : "Live"}
                  </button>

                  <button
                    onClick={() =>
                      setSortBy(sortBy === "time" ? "odds" : "time")
                    }
                    className="px-4 py-2.5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-black/[0.1] hover:border-white/20 transition-colors bg-black/30"
                  >
                    {sortBy === "time" ? "By Time" : "By Odds"}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="h-10 w-10 border-2 border-white/20 border-t-[#D0FF00] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/50 text-sm">Loading markets...</p>
                  </div>
                </div>
              ) : games.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-white/60">No games available</p>
                  <p className="text-sm text-white/30 mt-2">Check back later</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGames.map((game, index) => (
                    <div
                      key={game.id}
                      className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all bg-black/30"
                    >
                      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/5 bg-black/40">
                        <div className="flex items-center gap-3 text-xs">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              game.status === "live"
                                ? "bg-[#D0FF00] animate-pulse"
                                : "bg-white/30"
                            }`}
                          />
                          <Clock className="h-3.5 w-3.5 text-white/40" />
                          <span className="text-white/60">
                            {game.status === "live"
                              ? "LIVE"
                              : game.status === "final"
                              ? "Final"
                              : new Date(game.startTime).toLocaleString()}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            game.status === "live"
                              ? "bg-[#D0FF00]/10 text-[#D0FF00] border-[#D0FF00]/20"
                              : "border-white/10 text-white/50"
                          } text-[10px] uppercase tracking-wider px-2 py-0.5`}
                        >
                          {game.status}
                        </Badge>
                      </div>

                      <div className="p-8">
                        {bettingMarket === "moneyline" && (
                          <div className="grid grid-cols-2 gap-6">
                            <button
                              onClick={() =>
                                game.status === "upcoming" &&
                                addToPredictionSlip(
                                  game.id,
                                  game.homeTeam,
                                  game.homeOdds,
                                  "moneyline",
                                  `${game.homeTeam} to Win`,
                                  index
                                )
                              }
                              disabled={game.status !== "upcoming"}
                              className={`group relative transition-all ${
                                game.status === "upcoming"
                                  ? "cursor-pointer"
                                  : "opacity-40 cursor-not-allowed"
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <div
                                  className={`relative mb-4 ${
                                    predictionSlip.some(
                                      (p) =>
                                        p.gameId === game.id &&
                                        p.selectedTeam === game.homeTeam
                                    )
                                      ? "ring-2 ring-[#D0FF00] ring-offset-4 ring-offset-[#0a0a0a]"
                                      : ""
                                  } transition-all rounded-full`}
                                >
                                  <div className="h-32 w-32 rounded-full border-2 border-white/10 bg-black/40 flex items-center justify-center overflow-hidden p-6 group-hover:border-[#D0FF00]/50 transition-all">
                                    {game.homeTeamLogo ? (
                                      <img
                                        src={
                                          game.homeTeamLogo ||
                                          "/placeholder.svg"
                                        }
                                        alt={game.homeTeam}
                                        className="h-full w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                      />
                                    ) : (
                                      <span className="text-4xl font-bold text-white/60">
                                        {game.homeTeam[0]}
                                      </span>
                                    )}
                                  </div>
                                  {predictionSlip.some(
                                    (p) =>
                                      p.gameId === game.id &&
                                      p.selectedTeam === game.homeTeam
                                  ) && (
                                    <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-[#D0FF00] flex items-center justify-center shadow-lg">
                                      <Check
                                        className="h-5 w-5 text-black"
                                        strokeWidth={3}
                                      />
                                    </div>
                                  )}
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-1">
                                  {game.homeTeam}
                                </h3>
                                <p className="text-sm text-white/40 mb-3 uppercase text-[10px] tracking-wider">
                                  Home Team
                                </p>

                                <div className="text-center">
                                  <p className="text-2xl font-bold font-mono text-white mb-1">
                                    {game.homeOdds.toFixed(2)}x
                                  </p>
                                </div>
                              </div>
                            </button>

                            <button
                              onClick={() =>
                                game.status === "upcoming" &&
                                addToPredictionSlip(
                                  game.id,
                                  game.awayTeam,
                                  game.awayOdds,
                                  "moneyline",
                                  `${game.awayTeam} to Win`,
                                  index
                                )
                              }
                              disabled={game.status !== "upcoming"}
                              className={`group relative transition-all ${
                                game.status === "upcoming"
                                  ? "cursor-pointer"
                                  : "opacity-40 cursor-not-allowed"
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <div
                                  className={`relative mb-4 ${
                                    predictionSlip.some(
                                      (p) =>
                                        p.gameId === game.id &&
                                        p.selectedTeam === game.awayTeam
                                    )
                                      ? "ring-2 ring-[#D0FF00] ring-offset-4 ring-offset-[#0a0a0a]"
                                      : ""
                                  } transition-all rounded-full`}
                                >
                                  <div className="h-32 w-32 rounded-full border-2 border-white/10 bg-black/40 flex items-center justify-center overflow-hidden p-6 group-hover:border-[#D0FF00]/50 transition-all">
                                    {game.awayTeamLogo ? (
                                      <img
                                        src={
                                          game.awayTeamLogo ||
                                          "/placeholder.svg"
                                        }
                                        alt={game.awayTeam}
                                        className="h-full w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                      />
                                    ) : (
                                      <span className="text-4xl font-bold text-white/60">
                                        {game.awayTeam[0]}
                                      </span>
                                    )}
                                  </div>
                                  {predictionSlip.some(
                                    (p) =>
                                      p.gameId === game.id &&
                                      p.selectedTeam === game.awayTeam
                                  ) && (
                                    <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-[#D0FF00] flex items-center justify-center shadow-lg">
                                      <Check
                                        className="h-5 w-5 text-black"
                                        strokeWidth={3}
                                      />
                                    </div>
                                  )}
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-1">
                                  {game.awayTeam}
                                </h3>
                                <p className="text-sm text-white/40 mb-3 uppercase text-[10px] tracking-wider">
                                  Away Team
                                </p>

                                <div className="text-center">
                                  <p className="text-2xl font-bold font-mono text-white mb-1">
                                    {game.awayOdds.toFixed(2)}x
                                  </p>
                                </div>
                              </div>
                            </button>
                          </div>
                        )}

                        {bettingMarket === "spread" && game.spread && (
                          <div className="grid grid-cols-2 gap-6">
                            <button
                              onClick={() =>
                                game.status === "upcoming" &&
                                game.spread &&
                                addToPredictionSlip(
                                  game.id,
                                  game.homeTeam,
                                  game.spread.homeOdds,
                                  "spread",
                                  `${game.homeTeam} ${
                                    game.spread.home > 0 ? "+" : ""
                                  }${game.spread.home}`,
                                  index
                                )
                              }
                              disabled={game.status !== "upcoming"}
                              className={`p-6 rounded-xl border border-white/10 transition-all text-center bg-black/40 ${
                                game.status === "upcoming"
                                  ? "hover:border-[#D0FF00]/50 cursor-pointer"
                                  : "opacity-30 cursor-not-allowed"
                              } ${
                                predictionSlip.some(
                                  (p) =>
                                    p.gameId === game.id &&
                                    p.market === "spread" &&
                                    p.selectedTeam === game.homeTeam
                                )
                                  ? "border-[#D0FF00] bg-[#D0FF00]/5"
                                  : ""
                              }`}
                            >
                              <p className="font-semibold text-base text-white mb-2">
                                {game.homeTeam}
                              </p>
                              <p className="text-3xl font-bold text-white mb-2">
                                {game.spread.home > 0 ? "+" : ""}
                                {game.spread.home}
                              </p>
                              <p className="text-sm text-white/50 font-mono">
                                @ {game.spread.homeOdds.toFixed(2)}x
                              </p>
                            </button>

                            <button
                              onClick={() =>
                                game.status === "upcoming" &&
                                game.spread &&
                                addToPredictionSlip(
                                  game.id,
                                  game.awayTeam,
                                  game.spread.awayOdds,
                                  "spread",
                                  `${game.awayTeam} ${
                                    game.spread.away > 0 ? "+" : ""
                                  }${game.spread.away}`,
                                  index
                                )
                              }
                              disabled={game.status !== "upcoming"}
                              className={`p-6 rounded-xl border border-white/10 transition-all text-center bg-black/40 ${
                                game.status === "upcoming"
                                  ? "hover:border-[#D0FF00]/50 hover:bg-white/[0.01] cursor-pointer"
                                  : "opacity-30 cursor-not-allowed"
                              } ${
                                predictionSlip.some(
                                  (p) =>
                                    p.gameId === game.id &&
                                    p.market === "spread" &&
                                    p.selectedTeam === game.awayTeam
                                )
                                  ? "border-[#D0FF00] bg-[#D0FF00]/5"
                                  : ""
                              }`}
                            >
                              <p className="font-semibold text-base text-white mb-2">
                                {game.awayTeam}
                              </p>
                              <p className="text-3xl font-bold text-white mb-2">
                                {game.spread.away > 0 ? "+" : ""}
                                {game.spread.away}
                              </p>
                              <p className="text-sm text-white/50 font-mono">
                                @ {game.spread.awayOdds.toFixed(2)}x
                              </p>
                            </button>
                          </div>
                        )}

                        {bettingMarket === "totals" && game.totals && (
                          <div className="grid grid-cols-2 gap-6">
                            <button
                              onClick={() =>
                                game.status === "upcoming" &&
                                game.totals &&
                                addToPredictionSlip(
                                  game.id,
                                  "Over",
                                  game.totals.overOdds,
                                  "totals",
                                  `Over ${game.totals.over}`,
                                  index
                                )
                              }
                              disabled={game.status !== "upcoming"}
                              className={`p-6 rounded-xl border border-white/10 transition-all text-center bg-black/40 ${
                                game.status === "upcoming"
                                  ? "hover:border-[#D0FF00]/50 hover:bg-white/[0.01] cursor-pointer"
                                  : "opacity-30 cursor-not-allowed"
                              } ${
                                predictionSlip.some(
                                  (p) =>
                                    p.gameId === game.id &&
                                    p.market === "totals" &&
                                    p.selectedTeam === "Over"
                                )
                                  ? "border-[#D0FF00] bg-[#D0FF00]/5"
                                  : ""
                              }`}
                            >
                              <p className="font-semibold text-base text-white/70 mb-2 uppercase text-xs tracking-wider">
                                Over
                              </p>
                              <p className="text-3xl font-bold text-white mb-2">
                                {game.totals.over}
                              </p>
                              <p className="text-sm text-white/50 font-mono">
                                @ {game.totals.overOdds.toFixed(2)}x
                              </p>
                            </button>

                            <button
                              onClick={() =>
                                game.status === "upcoming" &&
                                game.totals &&
                                addToPredictionSlip(
                                  game.id,
                                  "Under",
                                  game.totals.underOdds,
                                  "totals",
                                  `Under ${game.totals.under}`,
                                  index
                                )
                              }
                              disabled={game.status !== "upcoming"}
                              className={`p-6 rounded-xl border border-white/10 transition-all text-center bg-black/40 ${
                                game.status === "upcoming"
                                  ? "hover:border-[#D0FF00]/50 hover:bg-white/[0.01] cursor-pointer"
                                  : "opacity-30 cursor-not-allowed"
                              } ${
                                predictionSlip.some(
                                  (p) =>
                                    p.gameId === game.id &&
                                    p.market === "totals" &&
                                    p.selectedTeam === "Under"
                                )
                                  ? "border-[#D0FF00] bg-[#D0FF00]/5"
                                  : ""
                              }`}
                            >
                              <p className="font-semibold text-base text-white/70 mb-2 uppercase text-xs tracking-wider">
                                Under
                              </p>
                              <p className="text-3xl font-bold text-white mb-2">
                                {game.totals.under}
                              </p>
                              <p className="text-sm text-white/50 font-mono">
                                @ {game.totals.underOdds.toFixed(2)}x
                              </p>
                            </button>
                          </div>
                        )}
                      </div>

                      {game.popularPick && game.status === "upcoming" && (
                        <div className="px-8 pb-6">
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <div className="flex items-center justify-between text-xs mb-2.5">
                              <span className="text-white/50">
                                Picked by {game.popularPick.percentage}% of
                                users
                              </span>
                              <span className="text-white font-medium">
                                {game.popularPick.team}
                              </span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#D0FF00] transition-all duration-500 rounded-full"
                                style={{
                                  width: `${game.popularPick.percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "slip" && (
            <div className="flex-1 flex items-center justify-center p-8">
              {predictionSlip.length === 0 ? (
                <div className="text-center max-w-md">
                  <div className="h-20 w-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <Trophy className="h-10 w-10 text-white/20" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Bet Slip Empty
                  </h2>
                  <p className="text-white/40 text-sm mb-8">
                    Select outcomes from markets to build your slip
                  </p>
                  <Button
                    onClick={() => setActiveTab("matches")}
                    className="bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90 px-6 font-medium"
                  >
                    View Markets
                  </Button>
                </div>
              ) : (
                <div className="w-full max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      Bet Slip
                    </h2>
                    {parlayMode && predictionSlip.length > 1 && (
                      <Badge className="bg-[#D0FF00]/10 text-[#D0FF00] border border-[#D0FF00]/20 text-xs">
                        {predictionSlip.length}-Leg Parlay
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-6">
                    {predictionSlip.map((item) => {
                      const game = games.find((g) => g.id === item.gameId);
                      if (!game) return null;

                      return (
                        <div
                          key={`${item.gameId}-${item.market}`}
                          className="p-4 border border-white/10 rounded-lg hover:border-white/20 transition-all bg-black/30"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white text-sm mb-1 truncate">
                                {game.homeTeam} vs {game.awayTeam}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-white/10 text-white/40 uppercase tracking-wider"
                                >
                                  {item.market}
                                </Badge>
                                <span className="text-xs text-white/70">
                                  {item.betType} @ {item.odds.toFixed(2)}x
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPredictionSlip(
                                  predictionSlip.filter(
                                    (p) => p.gameId !== item.gameId
                                  )
                                );
                              }}
                              className="text-white/40 hover:text-white hover:bg-white/[0.03] border border-white/10 h-8 w-8 p-0"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-6 border border-white/10 rounded-lg space-y-4 bg-black/30">
                    {betError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-red-300 leading-relaxed">
                            {betError}
                          </p>
                        </div>
                      </div>
                    )}

                    {betSuccess && (
                      <div className="p-3 rounded-lg bg-[#D0FF00]/10 border border-[#D0FF00]/20">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-[#D0FF00] mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[#D0FF00] leading-relaxed">
                            {betSuccess}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wider">
                        Stake Amount (tBNB)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="bg-black/30 border-white/10 text-white font-mono text-base h-12 focus:border-[#D0FF00]/50"
                      />
                      <div className="flex gap-2 mt-3">
                        {[0.01, 0.05, 0.1, 0.5].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setBetAmount(amount.toString())}
                            className="flex-1 border-white/10 text-white/70 hover:bg-[#D0FF00] hover:text-[#D0FF00] hover:border-[#D0FF00] text-xs"
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Total Odds</span>
                        <span className="font-mono font-bold text-white text-base">
                          {predictionSlip
                            .reduce((acc, item) => acc * item.odds, 1)
                            .toFixed(2)}
                          x
                        </span>
                      </div>
                      <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">
                            Potential Return
                          </span>
                          <div className="text-right">
                            <p className="font-mono font-bold text-white text-xl">
                              {(
                                Number.parseFloat(betAmount || "0") *
                                predictionSlip.reduce(
                                  (acc, item) => acc * item.odds,
                                  1
                                )
                              ).toFixed(3)}
                            </p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">
                              tBNB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={placeBet}
                      disabled={
                        placingBet || !betAmount || predictionSlip.length === 0
                      }
                      className="w-full bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90 font-medium py-5 text-sm"
                    >
                      {placingBet ? "Placing Bet..." : "Place Bet"}
                      {!placingBet && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "my-predictions" && (
            <div className="flex-1 flex items-center justify-center p-8">
              {predictions.length === 0 ? (
                <div className="text-center max-w-md">
                  <div className="h-20 w-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-10 w-10 text-white/20" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    No Bets Yet
                  </h2>
                  <p className="text-white/40 text-sm mb-8">
                    Place your first bet to start tracking
                  </p>
                  <Button
                    onClick={() => setActiveTab("matches")}
                    className="bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90 px-6 font-medium"
                  >
                    View Markets
                  </Button>
                </div>
              ) : (
                <div className="w-full max-w-4xl">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Your Bets
                  </h2>
                  <div className="space-y-3">
                    {predictions.map((prediction) => (
                      <div
                        key={prediction.id}
                        className="p-5 border border-white/10 rounded-lg hover:border-white/20 transition-all bg-black/30"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-base text-white mb-1">
                              {prediction.homeTeam} vs {prediction.awayTeam}
                            </h3>
                            <p className="text-sm text-white/50 mb-2">
                              Pick:{" "}
                              <span className="text-white font-medium">
                                {prediction.betType}
                              </span>
                            </p>
                            <a
                              href={`https://testnet.bscscan.com/tx/${prediction.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-[#D0FF00] transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View on BSCScan
                            </a>
                          </div>
                          <Badge
                            variant={
                              prediction.status === "won"
                                ? "default"
                                : prediction.status === "lost"
                                ? "destructive"
                                : prediction.status === "claimed"
                                ? "default"
                                : "outline"
                            }
                            className={`${
                              prediction.status === "won"
                                ? "bg-[#D0FF00]/10 text-[#D0FF00] border-[#D0FF00]/20"
                                : prediction.status === "claimed"
                                ? "bg-green-500/10 text-green-300 border-green-500/20"
                                : prediction.status === "lost"
                                ? "bg-red-500/10 text-red-300 border-red-500/20"
                                : "border-white/10 text-white/50"
                            } text-xs uppercase`}
                          >
                            {prediction.status === "won" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {prediction.status === "lost" && (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {prediction.status === "pending" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {prediction.status === "claimed" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {prediction.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                          <div>
                            <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wider">
                              Stake
                            </p>
                            <p className="font-mono text-sm text-white">
                              {prediction.amount.toFixed(3)} tBNB
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wider">
                              Odds
                            </p>
                            <p className="font-mono text-sm text-white">
                              {prediction.odds.toFixed(2)}x
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wider">
                              To Win
                            </p>
                            <p className="font-mono text-sm text-white">
                              {prediction.potentialWin.toFixed(3)} tBNB
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wider">
                              Date
                            </p>
                            <p className="text-sm text-white/70">
                              {new Date(
                                prediction.timestamp
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-white/10 text-white/40 uppercase tracking-wider"
                          >
                            {prediction.market}
                          </Badge>

                          {prediction.status === "won" && (
                            <Button
                              onClick={() => claimWinnings(prediction)}
                              disabled={claimingBet === prediction.id}
                              size="sm"
                              className="bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90 font-medium"
                            >
                              {claimingBet === prediction.id
                                ? "Claiming..."
                                : "Claim Winnings"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
