"use client";

import type React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateDisputeForm } from "@/components/create-dispute-form";
import { CopyButton } from "@/components/copy-button";

const BRAND = "#D0FF00";

// Dynamically load CodeBlock (no SSR)
const CodeBlock = dynamic(
  () => import("@/components/ui/code-block").then((m) => m.CodeBlock),
  {
    ssr: false,
    loading: () => (
      <div className="w-full border border-white/10 bg-[#050505] rounded-xl p-4">
        <div className="h-4 w-24 bg-zinc-800/60 mb-3 animate-pulse" />
        <div className="h-[210px] bg-zinc-900/60 rounded-lg animate-pulse" />
      </div>
    ),
  }
);

type DisputeStats = {
  total: number;
  slashed: number;
  totalPayouts: number;
  avgResolution: number;
};

type DisputeOverviewVariant = "not-deployed" | "empty" | "live";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [activeDispute, setActiveDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [stats, setStats] = useState<DisputeStats>({
    total: 0,
    slashed: 0,
    totalPayouts: 0,
    avgResolution: 0,
  });

  useEffect(() => {
    fetchDisputes();
    checkWalletConnection();
  }, []);

  async function fetchDisputes() {
    if (!process.env.NEXT_PUBLIC_DISPUTE_MANAGER_ADDRESS) {
      setLoading(false);
      return;
    }

    // TODO: hook into DisputeManager + API
    setLoading(false);
  }

  async function checkWalletConnection() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }

        (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
          setWalletAddress(accounts.length > 0 ? accounts[0] : null);
        });
      } catch (error) {
        console.error("Failed to check wallet:", error);
      }
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const getTimeLeft = (votingEndsAt: number) => {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, votingEndsAt - now);
  };

  const getFeedName = (aggregatorAddress: string) => {
    const aggregators: Record<string, string> = {
      [process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS || ""]: "BNB/USD",
      [process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS || ""]: "ETH/USD",
      [process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS || ""]: "BTC/USD",
      [process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS || ""]: "SOL/USD",
      [process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS || ""]: "XRP/USD",
      [process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS || ""]: "DOGE/USD",
      [process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS || ""]: "LINK/USD",
    };
    return aggregators[aggregatorAddress] || "Unknown Feed";
  };

  // ───────────────────────────────────────────────────────────────
  // 1) DISPUTE SYSTEM NOT DEPLOYED
  // ───────────────────────────────────────────────────────────────
  if (!process.env.NEXT_PUBLIC_DISPUTE_MANAGER_ADDRESS) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <main className="w-full max-w-[1280px] mx-auto px-5 md:px-10 pt-32 pb-20">
          <DisputeOverviewSection
            variant="not-deployed"
            stats={stats}
            walletAddress={walletAddress}
            disputeManagerAddress={undefined}
          />

          {/* Not Deployed Message */}
          <div className="border border-white/[0.08] bg-[#111113] rounded-2xl p-8 md:p-12 mt-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Dispute System Not Deployed
                </h2>
                <p className="text-white/60">
                  Deploy the <span className="font-mono">DisputeManager</span>{" "}
                  contract to BNB Testnet to activate live accountability.
                </p>
              </div>
            </div>
            <div className="border border-white/[0.08] bg-black rounded-xl p-6 font-mono text-sm text-white/80">
              <div className="text-[#D0FF00]">
                $ forge script script/DeployDisputes.s.sol \
              </div>
              <div className="text-white/60 ml-4">
                --rpc-url $NEXT_PUBLIC_RPC_URL \
              </div>
              <div className="text-white/60 ml-4">--broadcast -vvvv</div>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16 border border-[#D0FF00]/20 bg-gradient-to-br from-[#D0FF00]/5 to-transparent rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Once deployed, every challenged round, vote, and payout will be
              visible here with full on-chain proof.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────
  // 2) NO DISPUTES YET
  // ───────────────────────────────────────────────────────────────
  // ───────────────────────────────────────────────────────────────
  // 2) NO DISPUTES YET
  // ───────────────────────────────────────────────────────────────
  if (disputes.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <main className="w-full max-w-[1280px] mx-auto px-5 md:px-10 pt-32 pb-20">
          <DisputeOverviewSection
            variant="empty"
            stats={stats}
            walletAddress={walletAddress}
            disputeManagerAddress={
              process.env.NEXT_PUBLIC_DISPUTE_MANAGER_ADDRESS
            }
          />

          {/* Create Dispute Form */}
          <div className="mb-16 mt-10">
            <CreateDisputeForm
              walletAddress={walletAddress}
              onSuccess={fetchDisputes}
            />
          </div>

          {/* Empty state bento grid */}
          <div className="mt-10 border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08]">
              {/* No disputes tile (bigger) */}
              <div className="bg-[#111113] p-10 md:col-span-2 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  No Disputes Filed Yet
                </h2>
                <p className="text-sm md:text-base text-white/60 max-w-md">
                  All oracle rounds are currently passing verification. If you
                  spot a bad report, use the form above to launch the very first
                  dispute.
                </p>
              </div>

              <div className="bg-[#111113] p-10 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Coming Soon
                </h3>
                <p className="text-sm text-white/60 max-w-sm">
                  Disputes will appear here soon.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────
  // 3) LIVE DISPUTES
  // ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="w-full max-w-[1280px] mx-auto px-5 md:px-10 pt-32 pb-20">
        <DisputeOverviewSection
          variant="live"
          stats={stats}
          walletAddress={walletAddress}
          disputeManagerAddress={
            process.env.NEXT_PUBLIC_DISPUTE_MANAGER_ADDRESS
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16 mt-10 border border-white/[0.08] rounded-2xl overflow-hidden">
          <StatTile label="Total Disputes" value={stats.total.toString()} />
          <StatTile label="Slashed Rounds" value={stats.slashed.toString()} />
          <StatTile
            label="Total Payouts (BNB)"
            value={stats.totalPayouts.toFixed(2)}
          />
          <StatTile
            label="Avg Resolution Time"
            value={`${stats.avgResolution.toFixed(1)}d`}
          />
        </div>

        {/* Create Dispute Form */}
        <div className="mb-16">
          <CreateDisputeForm
            walletAddress={walletAddress}
            onSuccess={fetchDisputes}
          />
        </div>

        {/* Active Dispute */}
        {activeDispute && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Active Dispute
            </h2>
            <div className="border border-white/[0.08] bg-[#111113] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/[0.08]">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="text-sm text-white/40 mb-2">
                      {getFeedName(activeDispute.aggregator)}
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Round #{activeDispute.roundId}
                    </h3>
                  </div>
                  <div className="px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10">
                    <span className="text-xs font-medium text-red-500 uppercase tracking-wider">
                      Voting Active
                    </span>
                  </div>
                </div>

                {/* Time Remaining */}
                <div className="bg-black rounded-xl p-6 border border-white/[0.08]">
                  <div className="text-sm text-white/40 mb-3">
                    Time Remaining
                  </div>
                  <div className="text-5xl font-bold text-white mb-4">
                    {formatTime(getTimeLeft(activeDispute.votingEndsAt))}
                  </div>
                  <Progress
                    value={
                      ((Date.now() / 1000 - activeDispute.createdAt) /
                        (activeDispute.votingEndsAt -
                          activeDispute.createdAt)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>

              {/* Voting Progress */}
              <div className="grid md:grid-cols-2 gap-px border-b border-white/[0.08]">
                <div className="bg-[#111113] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-white/60">
                      Votes to Slash
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {activeDispute.votesFor}
                    </span>
                  </div>
                  <Progress
                    value={
                      (activeDispute.votesFor /
                        (activeDispute.votesFor + activeDispute.votesAgainst ||
                          1)) *
                      100
                    }
                    className="h-3"
                  />
                  <div className="text-sm text-white/40 mt-2">
                    {(
                      (activeDispute.votesFor /
                        (activeDispute.votesFor + activeDispute.votesAgainst ||
                          1)) *
                      100
                    ).toFixed(1)}
                    % support
                  </div>
                </div>
                <div className="bg-[#111113] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-white/60">
                      Votes to Reject
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {activeDispute.votesAgainst}
                    </span>
                  </div>
                  <Progress
                    value={
                      (activeDispute.votesAgainst /
                        (activeDispute.votesFor + activeDispute.votesAgainst ||
                          1)) *
                      100
                    }
                    className="h-3"
                  />
                  <div className="text-sm text-white/40 mt-2">
                    {(
                      (activeDispute.votesAgainst /
                        (activeDispute.votesFor + activeDispute.votesAgainst ||
                          1)) *
                      100
                    ).toFixed(1)}
                    % against
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div className="p-6 md:p-8 border-b border-white/[0.08]">
                <div className="text-sm text-white/40 mb-3">Evidence</div>
                <p className="text-white/80">{activeDispute.evidence}</p>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-3 gap-px">
                <div className="bg-[#111113] p-6">
                  <div className="text-sm text-white/40 mb-2">Challenger</div>
                  <div className="font-mono text-white/80 text-sm">
                    {activeDispute.challenger.slice(0, 10)}...
                  </div>
                </div>
                <div className="bg-[#111113] p-6">
                  <div className="text-sm text-white/40 mb-2">Stake</div>
                  <div className="font-bold text-white">
                    {Number.parseFloat(activeDispute.stake).toFixed(4)} BNB
                  </div>
                </div>
                <div className="bg-[#111113] p-6">
                  <div className="text-sm text-white/40 mb-2">
                    Claimed Value
                  </div>
                  <div className="font-bold text-white">
                    $
                    {(activeDispute.claimedCorrectValue / 100000000).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Disputes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All Disputes</h2>
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="border border-white/[0.08] bg-[#111113] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-white/40 mb-1">
                        {getFeedName(dispute.aggregator)}
                      </div>
                      <div className="text-xl font-bold text-white">
                        Round #{dispute.roundId}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider",
                        !dispute.resolved
                          ? "border border-red-500/20 bg-red-500/10 text-red-500"
                          : dispute.slashed
                          ? "border border-[#D0FF00]/20 bg-[#D0FF00]/10 text-[#D0FF00]"
                          : "border border-white/10 bg-white/5 text-white/60"
                      )}
                    >
                      {!dispute.resolved
                        ? "Voting"
                        : dispute.slashed
                        ? "Slashed"
                        : "Rejected"}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-black rounded-lg p-4 border border-white/[0.08]">
                      <div className="text-xs text-white/40 mb-1">
                        Challenger
                      </div>
                      <div className="font-mono text-sm text-white/80">
                        {dispute.challenger.slice(0, 10)}...
                      </div>
                    </div>
                    <div className="bg-black rounded-lg p-4 border border-white/[0.08]">
                      <div className="text-xs text-white/40 mb-1">Stake</div>
                      <div className="font-bold text-white">
                        {Number.parseFloat(dispute.stake).toFixed(4)} BNB
                      </div>
                    </div>
                    <div className="bg-black rounded-lg p-4 border border-white/[0.08]">
                      <div className="text-xs text-white/40 mb-1">Votes</div>
                      <div className="font-bold text-white">
                        {dispute.votesFor} / {dispute.votesAgainst}
                      </div>
                    </div>
                    <div className="bg-black rounded-lg p-4 border border-white/[0.08]">
                      <div className="text-xs text-white/40 mb-1">
                        {!dispute.resolved ? "Time Left" : "Status"}
                      </div>
                      <div className="font-bold text-white">
                        {!dispute.resolved
                          ? formatTime(getTimeLeft(dispute.votingEndsAt))
                          : dispute.slashed
                          ? "Slashed"
                          : "Rejected"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 border border-[#D0FF00]/20 bg-gradient-to-br from-[#D0FF00]/5 to-transparent rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Real-Time Dispute Tracking
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            As more feeds and markets plug into RION, this surface becomes the
            public scoreboard for oracle accountability on BNB.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ───────────────────────────── sub components ───────────────────────────── */

function DisputeOverviewSection({
  variant,
  stats,
  walletAddress,
  disputeManagerAddress,
}: {
  variant: DisputeOverviewVariant;
  stats: DisputeStats;
  walletAddress: string | null;
  disputeManagerAddress?: string;
}) {
  const isOffline = variant === "not-deployed";
  const isEmpty = variant === "empty";

  const statusLabel = isOffline
    ? "Offline • Contract not deployed"
    : isEmpty
    ? "Ready • No disputes yet"
    : "Live • Disputes in progress";

  const statusClass = isOffline
    ? "border-red-500/30 bg-red-500/10 text-red-400"
    : isEmpty
    ? "border-white/20 bg-white/5 text-white/70"
    : "border-[#D0FF00]/40 bg-[#D0FF00]/10 text-[#D0FF00]";

  const soliditySnippet = `interface IDisputeManager {
    function raiseDispute(
        address aggregator,
        uint80 roundId,
        string calldata evidence
    ) external payable;
}`;

  const tsSnippet = `import { ethers } from "ethers";

const disputeManager = new ethers.Contract(
  process.env.NEXT_PUBLIC_DISPUTE_MANAGER_ADDRESS!,
  DISPUTE_MANAGER_ABI,
  signer
);

await disputeManager.raiseDispute(
  aggregator,
  roundId,
  "Reported price deviates from trusted sources",
  { value: stakeBnB }
);`;

  return (
    <section className="relative mb-10 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0b0b0b] via-black to-[#050805] p-6 md:p-10 overflow-hidden">
      {/* soft glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: BRAND }}
      />
      <div className="relative flex flex-col gap-10 md:flex-row md:items-stretch">
        {/* Left: narrative + basic stats */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RION ORACLE
            </span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-3">
              Oracle Disputes
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-xl">
              File a challenge when a feed goes wrong, stake BNB on your claim,
              and let the network vote. Slashing and payouts are enforced by the{" "}
              <span className="font-mono">DisputeManager</span> contract.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:max-w-md">
            <DisputeMetric
              label="Total disputes"
              value={stats.total.toString()}
              helper={variant === "not-deployed" ? "Awaiting deployment" : ""}
            />
            <DisputeMetric
              label="Rounds slashed"
              value={stats.slashed.toString()}
              helper="Bad data caught by challengers"
            />
            <DisputeMetric
              label="Payouts (BNB)"
              value={stats.totalPayouts.toFixed(2)}
              helper="Distributed to successful challengers"
            />
            <DisputeMetric
              label="Avg. resolution"
              value={`${stats.avgResolution.toFixed(1)}d`}
              helper="From dispute → final outcome"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mt-1">
            {walletAddress ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono">
                <span className="h-2 w-2 rounded-full bg-[#D0FF00]" />
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Connect a wallet to file a dispute
              </span>
            )}

            {disputeManagerAddress && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono">
                DisputeManager: {disputeManagerAddress.slice(0, 8)}...
                {disputeManagerAddress.slice(-4)}
              </span>
            )}
          </div>
        </div>

        {/* Right: How it works + dev snippet */}
        <div className="flex-1 flex flex-col gap-4 md:max-w-md">
          <div className="grid grid-cols-3 gap-2 mb-1">
            <DisputeStep index={1} label="Detect bad round" />
            <DisputeStep index={2} label="File dispute + stake" />
            <DisputeStep index={3} label="Vote, slash, payout" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/70 p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Developer View
                </p>
                <p className="text-xs text-white/50">
                  Raise a dispute directly from your dApp.
                </p>
              </div>
              <CopyButton text={`${soliditySnippet}\n\n// ---\n${tsSnippet}`} />
            </div>
            <CodeBlock
              language="solidity"
              filename="DisputeManager.sol / disputes.ts"
              tabs={[
                {
                  name: "Solidity",
                  code: soliditySnippet,
                  language: "solidity",
                  highlightLines: [1, 2, 3, 4, 5],
                },
                {
                  name: "TypeScript",
                  code: tsSnippet,
                  language: "tsx",
                  highlightLines: [1, 2, 4, 9, 10],
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DisputeMetric({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/60 p-3.5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 mb-1.5">
        {label}
      </div>
      <div className="text-xl md:text-2xl font-semibold text-white mb-0.5">
        {value}
      </div>
      {helper && (
        <div className="text-[11px] text-white/40 leading-snug">{helper}</div>
      )}
    </div>
  );
}

function DisputeStep({ index, label }: { index: number; label: string }) {
  return (
    <div className="flex flex-col items-start justify-center gap-1 rounded-xl border border-white/10 bg-black/70 px-3 py-2">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
        style={{ backgroundColor: BRAND, color: "#000" }}
      >
        {index}
      </span>
      <span className="text-[11px] text-white/60 leading-snug">{label}</span>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#111113] p-6 relative group">
      <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-[#D0FF00]/0 group-hover:border-[#D0FF00] transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-[#D0FF00]/0 group-hover:border-[#D0FF00] transition-all duration-300" />
      <div className="text-sm text-white/40 mb-2">{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
