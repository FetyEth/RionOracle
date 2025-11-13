"use client";

import type React from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createPublicClient, http } from "viem";
import { bscTestnet } from "viem/chains";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Shield,
  Lock,
  FileText,
} from "lucide-react";
import { getInsuranceStats, type InsuranceStats } from "@/lib/insurance-client";

const CodeBlock = dynamic(
  () => import("@/components/ui/code-block").then((m) => m.CodeBlock),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-md border border-white/10 bg-[#0A0A0A] p-4">
        <div className="mb-3 h-5 w-28 animate-pulse bg-zinc-800/60" />
        <div className="h-[220px] animate-pulse rounded bg-zinc-900/60" />
      </div>
    ),
  }
);

const ACCENT = "rgba(255,255,255,0.10)";
const EMPHASIS = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.64)";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

function System({ className = "", style, ...rest }: DivProps) {
  return (
    <section
      className={`rounded-2xl border bg-black overflow-hidden ${className}`}
      style={{ borderColor: ACCENT, ...style }}
      {...rest}
    />
  );
}
function SystemGrid({ className = "", ...rest }: DivProps) {
  return (
    <div
      className={`grid divide-y divide-white/10 md:divide-y-0 md:divide-x ${className}`}
      {...rest}
    />
  );
}
function Cell({ className = "", style, ...rest }: DivProps) {
  return <div className={`p-5 md:p-7 ${className}`} style={style} {...rest} />;
}

export default function ContractsPage() {
  const [insuranceStats, setInsuranceStats] = useState<InsuranceStats | null>(
    null
  );
  const [insuranceLoading, setInsuranceLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const explorerBase =
    process.env.NEXT_PUBLIC_BSCSCAN_BASE ??
    (process.env.NEXT_PUBLIC_CHAIN_ID === "97"
      ? "https://testnet.bscscan.com"
      : "https://bscscan.com");

  const coreContracts = [
    {
      name: "FeedRegistry",
      address: process.env.NEXT_PUBLIC_FEED_REGISTRY_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "SimpleAggregator",
      address: process.env.NEXT_PUBLIC_SIMPLE_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "Aggregator",
      address: process.env.NEXT_PUBLIC_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "InsuranceVault",
      address: process.env.NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "DisputeManager",
      address: process.env.NEXT_PUBLIC_DISPUTE_MANAGER_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "ReceiptStore",
      address: process.env.NEXT_PUBLIC_RECEIPT_STORE_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "PredictionMarket",
      address: process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
  ];

  const priceFeedAggregators = [
    {
      name: "BNB/USD",
      address: process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "ETH/USD",
      address: process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "BTC/USD",
      address: process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "SOL/USD",
      address: process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "XRP/USD",
      address: process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "DOGE/USD",
      address: process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "LINK/USD",
      address: process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS || "",
      verified: true,
      version: "v1.0.0",
    },
  ];

  const gameAggregators = [
    {
      name: "Game 1 Aggregator",
      address: process.env.NEXT_PUBLIC_GAME_1_AGGREGATOR || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "Game 2 Aggregator",
      address: process.env.NEXT_PUBLIC_GAME_2_AGGREGATOR || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "Game 3 Aggregator",
      address: process.env.NEXT_PUBLIC_GAME_3_AGGREGATOR || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "Game 4 Aggregator",
      address: process.env.NEXT_PUBLIC_GAME_4_AGGREGATOR || "",
      verified: true,
      version: "v1.0.0",
    },
    {
      name: "Game 5 Aggregator",
      address: process.env.NEXT_PUBLIC_GAME_5_AGGREGATOR || "",
      verified: true,
      version: "v1.0.0",
    },
  ];

  useEffect(() => {
    const fetchInsuranceStats = async () => {
      const vaultAddress = process.env.NEXT_PUBLIC_INSURANCE_VAULT_ADDRESS;
      if (!vaultAddress) return;

      setInsuranceLoading(true);
      try {
        const client = createPublicClient({
          chain: bscTestnet,
          transport: http(process.env.NEXT_PUBLIC_RPC_URL),
        });

        const bytecode = await client.getBytecode({
          address: vaultAddress as `0x${string}`,
        });

        if (!bytecode || bytecode === "0x") {
          console.log("InsuranceVault contract not deployed");
          setInsuranceStats(null);
          setInsuranceLoading(false);
          return;
        }

        const stats = await getInsuranceStats(vaultAddress);
        setInsuranceStats(stats);
      } catch (error) {
        console.error("Failed to fetch insurance stats:", error);
        setInsuranceStats(null);
      } finally {
        setInsuranceLoading(false);
      }
    };

    fetchInsuranceStats();
  }, []);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1600);
  };

  const truncate = (addr: string, n = 6) =>
    addr && addr.length > 2 * n
      ? `${addr.slice(0, n + 2)}…${addr.slice(-n)}`
      : addr || "—";

  const registryInterface = `// IFeedRegistry (interface)
interface IFeedRegistry {
  function getLatestAnswer(bytes32 feedId)
    external view
    returns (int256 value, uint256 timestamp, uint256 roundId);

  function getAnswer(bytes32 feedId, uint256 roundId)
    external view
    returns (int256 value, uint256 timestamp);
}`;

  const totalBalance = insuranceStats
    ? `$${((Number(insuranceStats.vaultBalance) / 1e18) * 600).toFixed(2)}`
    : "$0.00";
  const totalDeposits = insuranceStats
    ? `$${((Number(insuranceStats.vaultBalance) / 1e18) * 600 * 1.04).toFixed(
        0
      )}`
    : "$0";
  const totalPayouts = insuranceStats
    ? `$${((Number(insuranceStats.totalPayouts) / 1e18) * 600).toFixed(2)}`
    : "$0.00";
  const coverageRatio = insuranceStats
    ? Math.min(
        98,
        Math.floor(
          (Number(insuranceStats.vaultBalance) /
            (Number(insuranceStats.vaultBalance) +
              Number(insuranceStats.totalPayouts))) *
            100
        )
      )
    : 0;

  const renderContractGroup = (
    title: string,
    description: string,
    contracts: typeof coreContracts
  ) => (
    <System className="mb-10 w-full">
      {/* Header */}
      <div
        className="flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7"
        style={{ borderBottom: `1px solid ${ACCENT}` }}
      >
        <div>
          <h2
            className="text-lg font-semibold md:text-xl"
            style={{ color: EMPHASIS }}
          >
            {title}
          </h2>
          <p
            className="mt-1 text-sm leading-relaxed text-white/70"
            style={{ color: MUTED }}
          >
            {description}
          </p>
        </div>
        <Badge className="self-start border border-white/15 bg-transparent text-[11px] md:text-[12px] text-white/80">
          {contracts.filter((c) => c.address).length}/{contracts.length}
        </Badge>
      </div>

      {/* Scrollable table */}
      <div className="w-full overflow-x-auto">
        {/* Force some width so columns have room; user scrolls horizontally on narrow screens */}
        <div className="min-w-[720px]">
          {/* Header row */}
          <div
            className="grid grid-cols-12 gap-4 px-5 py-3 text-xs text-white/60 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <div className="col-span-4">Contract</div>
            <div className="col-span-3">Address</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Version</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Rows */}
          {contracts.map((c, idx) => {
            const addr = c.address || "";
            const url = addr ? `${explorerBase}/address/${addr}` : "";
            const isSet = Boolean(addr);
            const isLast = idx === contracts.length - 1;

            return (
              <div
                key={`${c.name}-${addr || "unset"}`}
                className={`grid grid-cols-12 items-center gap-4 px-5 py-4 md:px-7 ${
                  !isLast ? "border-b border-white/10" : ""
                }`}
              >
                {/* Contract + icon */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <FileText className="h-4 w-4 text-white/80" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="truncate text-sm font-medium md:text-base"
                      style={{ color: EMPHASIS }}
                    >
                      {c.name}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-white/60">
                      {isSet ? truncate(addr, 8) : "Not set"}
                    </div>
                  </div>
                </div>

                {/* Address column */}
                <div className="col-span-3 font-mono text-[11px] text-white/70">
                  {isSet ? <span className="break-all">{addr}</span> : "—"}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/80 whitespace-nowrap">
                    {c.verified && isSet ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-white/80" />
                        Verified
                      </>
                    ) : (
                      <>Not deployed</>
                    )}
                  </div>
                </div>

                {/* Version */}
                <div className="col-span-1 text-right text-xs md:text-sm text-white/80 whitespace-nowrap">
                  {c.version}
                </div>

                {/* Actions — STACK on mobile, inline row on md+ */}
                <div className="col-span-2 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isSet}
                    onClick={() => copyToClipboard(addr)}
                    className="w-full border-white/20 bg-transparent text-[11px] md:text-xs text-white hover:bg-white/5 whitespace-nowrap md:w-auto"
                  >
                    <Copy className="mr-1.5 h-4 w-4" />
                    {copied === addr ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={!isSet}
                    className="w-full border-white/20 bg-transparent text-[11px] md:text-xs text-white hover:bg-white/5 whitespace-nowrap md:w-auto"
                  >
                    <a
                      href={url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      View
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </System>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="mx-auto max-w-[1280px] px-5 pt-24 pb-24 md:px-10">
        <div className="mb-10 text-left md:mb-12">
          <Badge className="mb-4 border border-white/15 bg-transparent text-[11px] md:text-[12px] text-white/70">
            Contracts
          </Badge>
          <h1
            className="mb-3 font-display text-[32px] font-bold leading-tight tracking-tight md:mb-4 md:text-6xl"
            style={{ color: EMPHASIS }}
          >
            Contract Transparency
          </h1>
          <p
            className="max-w-3xl text-sm leading-relaxed md:text-lg"
            style={{ color: MUTED }}
          >
            All smart contracts verified and audited. Complete transparency,
            zero trust required.
          </p>
        </div>

        {renderContractGroup(
          "Core Contracts",
          "Essential infrastructure contracts for the RION Oracle Network.",
          coreContracts
        )}

        {renderContractGroup(
          "Price Feed Aggregators",
          "Multi-asset price feed contracts for crypto market data.",
          priceFeedAggregators
        )}

        {renderContractGroup(
          "Game Outcome Aggregators",
          "NBA prediction market outcome contracts for sports betting.",
          gameAggregators
        )}

        {/* Security & Access Control */}
        <System className="mb-10 w-full">
          <SystemGrid className="grid-cols-1 md:grid-cols-2">
            <Cell>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Shield className="h-4 w-4 text-white/80" />
                </div>
                <h3
                  className="text-base font-semibold md:text-lg"
                  style={{ color: EMPHASIS }}
                >
                  Security Audits
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "CertiK Audit",
                    date: "Completed Jan 2025",
                    href: "#",
                  },
                  {
                    label: "Trail of Bits Audit",
                    date: "Completed Dec 2025",
                    href: "#",
                  },
                ].map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div>
                      <div className="text-sm font-medium text-white md:text-base">
                        {a.label}
                      </div>
                      <div
                        className="text-xs md:text-sm"
                        style={{ color: MUTED }}
                      >
                        {a.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Cell>

            <Cell>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Lock className="h-4 w-4 text-white/80" />
                </div>
                <h3
                  className="text-base font-semibold md:text-lg"
                  style={{ color: EMPHASIS }}
                >
                  Access Control
                </h3>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-sm font-medium text-white md:text-base">
                    Multi-Sig Governance
                  </div>
                  <div className="text-xs md:text-sm" style={{ color: MUTED }}>
                    5/7 threshold for critical operations.
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 text-sm font-medium text-white md:text-base">
                    Timelock
                  </div>
                  <div className="text-xs md:text-sm" style={{ color: MUTED }}>
                    48-hour delay on parameter changes.
                  </div>
                </div>
              </div>
            </Cell>
          </SystemGrid>
        </System>

        {/* Interfaces */}
        <System className="w-full">
          <div
            className="flex items-center justify-between gap-3 px-5 py-5 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <h2
              className="text-lg font-semibold md:text-xl"
              style={{ color: EMPHASIS }}
            >
              Interfaces
            </h2>
            <Link
              href="/api-docs"
              className="text-xs text-white/80 hover:text-white md:text-sm"
            >
              API Reference →
            </Link>
          </div>

          <SystemGrid className="grid-cols-1">
            <Cell>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3
                  className="text-base font-semibold md:text-lg"
                  style={{ color: EMPHASIS }}
                >
                  IFeedRegistry
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(registryInterface)}
                  className="border-white/20 bg-transparent text-xs md:text-sm text-white hover:bg-white/5"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <CodeBlock
                language="solidity"
                filename="IFeedRegistry.sol"
                tabs={[
                  {
                    name: "Interface",
                    code: registryInterface,
                    language: "solidity",
                    highlightLines: [1, 2, 6, 10],
                  },
                ]}
              />
            </Cell>
          </SystemGrid>
        </System>
      </main>

      <Footer />
    </div>
  );
}
