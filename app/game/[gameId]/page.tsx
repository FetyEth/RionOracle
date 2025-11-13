"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import {
  nbaStatsApi,
  type GameDetail,
  type PlayByPlayAction,
  type BoxScorePlayer,
} from "@/lib/nba-stats-api";

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<
    "summary" | "playbyplay" | "boxscore"
  >("summary");
  const [gameDetail, setGameDetail] = useState<GameDetail | null>(null);
  const [playByPlay, setPlayByPlay] = useState<PlayByPlayAction[]>([]);
  const [boxScore, setBoxScore] = useState<{
    home: BoxScorePlayer[];
    away: BoxScorePlayer[];
  }>({ home: [], away: [] });
  const [teamStats, setTeamStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "ALL" | "Q1" | "Q2" | "Q3" | "Q4"
  >("ALL");

  useEffect(() => {
    async function loadGameData() {
      setLoading(true);
      const [detail, plays, box, stats] = await Promise.all([
        nbaStatsApi.fetchGameDetail(resolvedParams.gameId),
        nbaStatsApi.fetchPlayByPlay(resolvedParams.gameId),
        nbaStatsApi.fetchBoxScore(resolvedParams.gameId),
        nbaStatsApi.fetchTeamStats(resolvedParams.gameId),
      ]);

      setGameDetail(detail);
      setPlayByPlay(plays);
      setBoxScore(box);
      setTeamStats(stats);
      setLoading(false);
    }

    loadGameData();
  }, [resolvedParams.gameId]);

  const filteredPlays = playByPlay.filter(
    (play) => selectedPeriod === "ALL" || `Q${play.period}` === selectedPeriod
  );

  const leadingPlayers = {
    home: boxScore.home.sort((a, b) => b.points - a.points).slice(0, 3),
    away: boxScore.away.sort((a, b) => b.points - a.points).slice(0, 3),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (!gameDetail) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-lg">Game not found</p>
          <Link href="/">
            <Button className="mt-4 bg-white text-black hover:bg-white/90">
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Back Button */}
          <Link href="/" className="inline-block mb-12">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>

          {/* Main Score Display */}
          <div className="max-w-4xl mx-auto">
            {/* Teams and Score */}
            <div className="flex items-center justify-between gap-8 mb-8">
              {/* Away Team */}
              <div className="flex-1 flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center p-4 shrink-0">
                  <img
                    src={gameDetail.awayTeam.logo || "/placeholder.svg"}
                    alt={gameDetail.awayTeam.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-3xl font-bold text-white mb-1 truncate">
                    {gameDetail.awayTeam.name}
                  </h2>
                  <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
                    {gameDetail.awayTeam.abbreviation}
                  </p>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <span className="text-6xl font-bold text-white tracking-tight">
                    {gameDetail.awayTeam.score}
                  </span>
                </div>
                <div className="h-16 w-px bg-white/[0.08]" />
                <div className="text-left">
                  <span className="text-6xl font-bold text-white tracking-tight">
                    {gameDetail.homeTeam.score}
                  </span>
                </div>
              </div>

              {/* Home Team */}
              <div className="flex-1 flex items-center gap-6 justify-end">
                <div className="min-w-0 text-right">
                  <h2 className="text-3xl font-bold text-white mb-1 truncate">
                    {gameDetail.homeTeam.name}
                  </h2>
                  <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
                    {gameDetail.homeTeam.abbreviation}
                  </p>
                </div>
                <div className="h-20 w-20 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center p-4 shrink-0">
                  <img
                    src={gameDetail.homeTeam.logo || "/placeholder.svg"}
                    alt={gameDetail.homeTeam.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Game Status and Info */}
            <div className="flex items-center justify-center gap-6">
              <Badge className="bg-white/5 text-white/90 border border-white/[0.08] text-sm px-4 py-1.5 font-medium">
                {gameDetail.status}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(gameDetail.gameDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="h-4 w-4" />
                <span>
                  {gameDetail.arena}, {gameDetail.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06] sticky top-0 bg-black z-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("summary")}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === "summary"
                  ? "text-white border-white"
                  : "text-white/40 border-transparent hover:text-white/60"
              }`}
            >
              <Activity className="inline-block h-4 w-4 mr-2" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab("playbyplay")}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === "playbyplay"
                  ? "text-white border-white"
                  : "text-white/40 border-transparent hover:text-white/60"
              }`}
            >
              <Clock className="inline-block h-4 w-4 mr-2" />
              Play-by-Play
            </button>
            <button
              onClick={() => setActiveTab("boxscore")}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === "boxscore"
                  ? "text-white border-white"
                  : "text-white/40 border-transparent hover:text-white/60"
              }`}
            >
              <Users className="inline-block h-4 w-4 mr-2" />
              Box Score
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {activeTab === "summary" && teamStats && (
          <div className="space-y-8">
            {/* Leading Players */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Leading Players
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Home Team Leaders */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-black">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {gameDetail.homeTeam.name}
                  </h4>
                  <div className="space-y-4">
                    {leadingPlayers.home.map((player, idx) => (
                      <div
                        key={player.personId}
                        className="flex items-center gap-4"
                      >
                        <div className="h-12 w-12 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/60 font-semibold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">
                            {player.name}
                          </p>
                          <p className="text-sm text-white/50">
                            {player.position}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            {player.points}
                          </p>
                          <p className="text-xs text-white/40">PTS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Away Team Leaders */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-black">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {gameDetail.awayTeam.name}
                  </h4>
                  <div className="space-y-4">
                    {leadingPlayers.away.map((player, idx) => (
                      <div
                        key={player.personId}
                        className="flex items-center gap-4"
                      >
                        <div className="h-12 w-12 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/60 font-semibold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">
                            {player.name}
                          </p>
                          <p className="text-sm text-white/50">
                            {player.position}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            {player.points}
                          </p>
                          <p className="text-xs text-white/40">PTS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Team Comparison */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">
                Team Comparison
              </h3>
              <div className="p-8 rounded-2xl border border-white/[0.08] bg-black">
                <div className="space-y-6">
                  {/* Points */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-bold text-white">
                        {teamStats.home.pts}
                      </span>
                      <span className="text-white/50 uppercase tracking-wider text-xs">
                        PTS
                      </span>
                      <span className="font-bold text-white">
                        {teamStats.away.pts}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-2 bg-red-500 rounded-l transition-all"
                        style={{
                          width: `${
                            (teamStats.home.pts /
                              (teamStats.home.pts + teamStats.away.pts)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="h-2 bg-green-700 rounded-r transition-all"
                        style={{
                          width: `${
                            (teamStats.away.pts /
                              (teamStats.home.pts + teamStats.away.pts)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Rebounds */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-bold text-white">
                        {teamStats.home.reb}
                      </span>
                      <span className="text-white/50 uppercase tracking-wider text-xs">
                        REB
                      </span>
                      <span className="font-bold text-white">
                        {teamStats.away.reb}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-2 bg-red-500 rounded-l transition-all"
                        style={{
                          width: `${
                            (teamStats.home.reb /
                              (teamStats.home.reb + teamStats.away.reb)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="h-2 bg-green-700 rounded-r transition-all"
                        style={{
                          width: `${
                            (teamStats.away.reb /
                              (teamStats.home.reb + teamStats.away.reb)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Assists */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-bold text-white">
                        {teamStats.home.ast}
                      </span>
                      <span className="text-white/50 uppercase tracking-wider text-xs">
                        AST
                      </span>
                      <span className="font-bold text-white">
                        {teamStats.away.ast}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-2 bg-red-500 rounded-l transition-all"
                        style={{
                          width: `${
                            (teamStats.home.ast /
                              (teamStats.home.ast + teamStats.away.ast)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="h-2 bg-green-700 rounded-r transition-all"
                        style={{
                          width: `${
                            (teamStats.away.ast /
                              (teamStats.home.ast + teamStats.away.ast)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* FG% */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-bold text-white">
                        {teamStats.home.fgPct}%
                      </span>
                      <span className="text-white/50 uppercase tracking-wider text-xs">
                        FG%
                      </span>
                      <span className="font-bold text-white">
                        {teamStats.away.fgPct}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-2 bg-red-500 rounded-l transition-all"
                        style={{
                          width: `${
                            (teamStats.home.fgPct /
                              (teamStats.home.fgPct + teamStats.away.fgPct)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="h-2 bg-green-700 rounded-r transition-all"
                        style={{
                          width: `${
                            (teamStats.away.fgPct /
                              (teamStats.home.fgPct + teamStats.away.fgPct)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 3P% */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-bold text-white">
                        {teamStats.home.fg3Pct}%
                      </span>
                      <span className="text-white/50 uppercase tracking-wider text-xs">
                        3P%
                      </span>
                      <span className="font-bold text-white">
                        {teamStats.away.fg3Pct}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-2 bg-red-500 rounded-l transition-all"
                        style={{
                          width: `${
                            (teamStats.home.fg3Pct /
                              (teamStats.home.fg3Pct + teamStats.away.fg3Pct)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="h-2 bg-green-700 rounded-r transition-all"
                        style={{
                          width: `${
                            (teamStats.away.fg3Pct /
                              (teamStats.home.fg3Pct + teamStats.away.fg3Pct)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "playbyplay" && (
          <div className="space-y-6">
            {/* Period Filter */}
            <div className="flex items-center gap-2 border border-white/[0.06] rounded-lg p-1 w-fit">
              {(["ALL", "Q1", "Q2", "Q3", "Q4"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? "bg-white text-black"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Play by Play List */}
            <div className="space-y-2">
              {filteredPlays.map((play, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-white/[0.06] hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-xs text-white/50 font-mono w-16">
                        {play.clock}
                      </div>
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center">
                        <span className="text-xs text-white/60 font-semibold">
                          Q{play.period}
                        </span>
                      </div>
                      <p className="text-sm text-white flex-1">
                        {play.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-white/70">
                        {play.scoreAway} - {play.scoreHome}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "boxscore" && (
          <div className="space-y-8">
            {/* Home Team Box Score */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                {gameDetail.homeTeam.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        Player
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        MIN
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        PTS
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        REB
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        AST
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        STL
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        BLK
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        FG
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        3P
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        FT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {boxScore.home.map((player) => (
                      <tr
                        key={player.personId}
                        className="border-b border-white/[0.04]"
                      >
                        <td className="py-3 text-sm text-white font-medium">
                          {player.name}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.minutes}
                        </td>
                        <td className="py-3 text-sm text-white font-semibold text-center">
                          {player.points}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.rebounds}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.assists}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.steals}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.blocks}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.fieldGoalsMade}/{player.fieldGoalsAttempted}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.threePointersMade}/
                          {player.threePointersAttempted}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.freeThrowsMade}/{player.freeThrowsAttempted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Away Team Box Score */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                {gameDetail.awayTeam.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        Player
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        MIN
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        PTS
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        REB
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        AST
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        STL
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        BLK
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        FG
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        3P
                      </th>
                      <th className="text-center text-xs text-white/50 font-medium uppercase tracking-wider pb-3">
                        FT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {boxScore.away.map((player) => (
                      <tr
                        key={player.personId}
                        className="border-b border-white/[0.04]"
                      >
                        <td className="py-3 text-sm text-white font-medium">
                          {player.name}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.minutes}
                        </td>
                        <td className="py-3 text-sm text-white font-semibold text-center">
                          {player.points}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.rebounds}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.assists}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.steals}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center">
                          {player.blocks}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.fieldGoalsMade}/{player.fieldGoalsAttempted}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.threePointersMade}/
                          {player.threePointersAttempted}
                        </td>
                        <td className="py-3 text-sm text-white/70 text-center font-mono">
                          {player.freeThrowsMade}/{player.freeThrowsAttempted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
