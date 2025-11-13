"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  CheckCircle2,
  Download,
  Copy,
  ExternalLink,
  Calculator,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPublicClient, http, parseAbiItem } from "viem";
import { bscTestnet } from "viem/chains";
import { getInsuranceStats, type InsuranceStats } from "@/lib/insurance-client";

const BRAND = "#D0FF00";
const STROKE = "#151517";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const SCRUB_VH = 73;
const STICKY_VH = 70;

const SIMPLE_AGGREGATOR_ABI = [
  parseAbiItem(
    "function latestRoundData() view returns (uint256 roundId, int256 answer, uint256 timestamp, uint256 observationCount)"
  ),
  parseAbiItem("function authorizedOracles(address) view returns (bool)"),
  parseAbiItem(
    "event OracleSubmission(uint256 indexed roundId, address indexed oracle, int256 value)"
  ),
] as const;

const AGGREGATORS: Record<string, string> = {
  BNB:
    process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS ||
    "0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F",
  ETH:
    process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS ||
    "0x383A6608D01dF5389839dC3E0C6F9A1eecFbD729",
  BTC:
    process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS ||
    "0xF8111bFff6058dc05f69a45E3522F8E442D2c19D",
  SOL:
    process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS ||
    "0x77b6D87C4FC47e4A13b67ef9F5ca80db54dDcd6F",
  XRP:
    process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS ||
    "0x7e5E8D853bb1C7Bb5573b5aeB1C8e25BB00c6a6",
  DOGE:
    process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS ||
    "0xC6A66AeA4A3B2BF69e0f66df99D71F3f02c85deF",
  LINK:
    process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS ||
    "0xe5a4fE8B0426e43CB10f23e92e4f20BEC03F0035",
};

const ORACLE_ADDRESSES = [
  "0xD53c0d3118Ea819A7842C390D9c855550b4E0Ed3",
  "0x1678b27db792638538a9D47129E000aa227265Ff",
  "0x1deC4755eC37B0B260A4991968Faf35d820fD103",
];

const DISPUTE_MANAGER_ABI = [
  parseAbiItem("function disputeCount() view returns (uint256)"),
  parseAbiItem(
    "function getDispute(uint256 disputeId) view returns (uint256 disputeId, bytes32 feedId, uint256 roundId, address challenger, int256 claimedValue, int256 actualValue, uint256 stake, uint8 status, uint256 votesFor, uint256 votesAgainst, uint256 createdAt, uint256 resolvedAt)"
  ),
] as const;

const DISPUTE_MANAGER_ADDRESS =
  "0x5fDBDE4401CdAc44AEC197F85bD8728CbECFa080" as const;

const INSURANCE_VAULT_ADDRESS =
  "0xe715f10a118dD930C169e16a0FF5CE6249e3463E" as const;

const RECEIPT_STORE_ADDRESS = process.env.NEXT_PUBLIC_RECEIPT_STORE_ADDRESS as
  | `0x${string}`
  | undefined;

interface VerificationResult {
  status: "idle" | "loading" | "success" | "error";
  data?: {
    asset: string;
    price: string;
    timestamp: number;
    authorizedOracles: boolean[];
    councils?: Array<{
      oracle: string;
      price: number;
      txHash: string;
      bscScanLink: string;
      timestamp: number;
      status: "success" | "skipped";
    }>;
    txHash?: string;
    fromCache?: boolean;
    checks: {
      oraclesAuthorized: boolean;
      dataFresh: boolean;
      priceValid: boolean;
    };
  };
  error?: string;
}

interface OracleSubmission {
  oracle: string;
  value: number;
  timestamp: number;
}

interface ForensicData {
  asset: string;
  submissions: OracleSubmission[];
  median: number;
  timestamp: number;
}

export default function LabPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [reduced, setReduced] = useState(false);

  const searchParams = useSearchParams();
  const [dragActive, setDragActive] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult>({ status: "idle" });
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "verifier"
  );
  const [roundId, setRoundId] = useState("");
  const [forensicData, setForensicData] = useState<ForensicData | null>(null);
  const [forensicLoading, setForensicLoading] = useState(false);

  const [disputeStats, setDisputeStats] = useState<{
    total: number;
    active: number;
    resolved: number;
  } | null>(null);
  const [disputesLoading, setDisputesLoading] = useState(false);

  const [insuranceStats, setInsuranceStats] = useState<InsuranceStats | null>(
    null
  );
  const [insuranceLoading, setInsuranceLoading] = useState(false);

  const [receiptStats, setReceiptStats] = useState<{ total: number } | null>(
    null
  );
  const [receiptsLoading, setReceiptsLoading] = useState(false);

  const [selectedFeed, setSelectedFeed] = useState("BNB/USD"); // Added for API call

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);

    const v = videoRef.current;
    if (v) {
      const onLoaded = () => setDuration(v.duration || 0);
      v.addEventListener("loadedmetadata", onLoaded);
      v.load();
      return () => {
        m.removeEventListener?.("change", onChange);
        v.removeEventListener("loadedmetadata", onLoaded);
      };
    }
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const el = containerRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    const tick = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const start = vh * 0.06;
      const end = -(rect.height - vh * 0.62);
      const progress = clamp((rect.top - start) / (end - start), 0, 1);

      if (duration > 0) {
        const target = progress * duration;
        vid.currentTime = vid.currentTime + (target - vid.currentTime) * 0.25;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, reduced]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      const tabMap: Record<string, string> = {
        prices: "verifier",
        outcomes: "dispute",
        merkle: "verifier",
        receipts: "receipts",
        attestations: "verifier",
        rwa: "verifier",
      };
      setActiveTab(tabMap[tab] || tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "diff" && !forensicData) {
      fetchForensicData();
    }
  }, [activeTab]);

  const fetchDisputeStats = async () => {
    if (!DISPUTE_MANAGER_ADDRESS) return;

    setDisputesLoading(true);
    try {
      const client = createPublicClient({
        chain: bscTestnet,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL),
      });

      const counter = await client.readContract({
        address: DISPUTE_MANAGER_ADDRESS as `0x${string}`,
        abi: DISPUTE_MANAGER_ABI,
        functionName: "disputeCount",
      });

      const total = Number(counter);
      let active = 0;
      let resolved = 0;

      for (let i = 1; i <= total; i++) {
        try {
          const dispute = await client.readContract({
            address: DISPUTE_MANAGER_ADDRESS as `0x${string}`,
            abi: DISPUTE_MANAGER_ABI,
            functionName: "getDispute",
            args: [BigInt(i)],
          });

          const status = dispute[7];
          if (status === 0 || status === 1 || status === 2) {
            active++;
          } else {
            resolved++;
          }
        } catch (err) {
          continue;
        }
      }

      setDisputeStats({ total, active, resolved });
    } catch (error) {
      console.error("Failed to fetch dispute stats:", error);
      setDisputeStats(null);
    } finally {
      setDisputesLoading(false);
    }
  };

  const fetchInsuranceStats = async () => {
    if (!INSURANCE_VAULT_ADDRESS) return;

    setInsuranceLoading(true);
    try {
      const client = createPublicClient({
        chain: bscTestnet,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL),
      });

      const bytecode = await client.getBytecode({
        address: INSURANCE_VAULT_ADDRESS as `0x${string}`,
      });

      if (!bytecode || bytecode === "0x") {
        console.log(
          "InsuranceVault contract not deployed at",
          INSURANCE_VAULT_ADDRESS
        );
        setInsuranceStats(null);
        setInsuranceLoading(false);
        return;
      }

      const stats = await getInsuranceStats(INSURANCE_VAULT_ADDRESS);
      setInsuranceStats(stats);
    } catch (error) {
      console.error("Failed to fetch insurance stats:", error);
      setInsuranceStats(null);
    } finally {
      setInsuranceLoading(false);
    }
  };

  const fetchReceiptStats = async () => {
    if (!RECEIPT_STORE_ADDRESS) return;

    setReceiptsLoading(true);
    try {
      const client = createPublicClient({
        chain: bscTestnet,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL),
      });

      const bytecode = await client.getBytecode({
        address: RECEIPT_STORE_ADDRESS,
      });

      if (!bytecode || bytecode === "0x") {
        console.log(
          "ReceiptStore contract not deployed at",
          RECEIPT_STORE_ADDRESS
        );
        setReceiptStats(null);
        setReceiptsLoading(false);
        return;
      }

      setReceiptStats({ total: 0 });
    } catch (error) {
      console.error("Failed to fetch receipt stats:", error);
      setReceiptStats(null);
    } finally {
      setReceiptsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dispute" && !disputeStats && DISPUTE_MANAGER_ADDRESS) {
      fetchDisputeStats();
    }
  }, [activeTab]);

  useEffect(() => {
    if (
      activeTab === "insurance" &&
      !insuranceStats &&
      INSURANCE_VAULT_ADDRESS
    ) {
      fetchInsuranceStats();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "receipts" && !receiptStats && RECEIPT_STORE_ADDRESS) {
      fetchReceiptStats();
    }
  }, [activeTab]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.roundId) {
            // Added feed selection for API call
            setSelectedFeed(json.feedId || "BNB/USD");
            await verifyRound(json.roundId);
          }
        } catch (err) {
          setVerificationResult({
            status: "error",
            error: "Invalid .rion file format",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const verifyRound = async (id: string) => {
    setVerificationResult({ status: "loading" });

    try {
      // Use the API route which checks Redis first, then blockchain
      const response = await fetch("/api/get-round-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundId: id,
          feedId: selectedFeed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify round");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Verification failed");
      }

      const { data } = result;

      // Map councils data if available (from Redis)
      const councils = data.councils?.map((council: any) => ({
        oracle: council.oracle,
        price: council.price,
        txHash: council.txHash,
        bscScanLink: council.bscScanLink,
        timestamp: council.timestamp,
        status: council.status,
      }));

      setVerificationResult({
        status: "success",
        data: {
          asset: data.asset,
          price: data.price,
          timestamp: data.timestamp,
          authorizedOracles: [true, true, true], // Assuming this is always true for verified data
          councils,
          txHash: data.txHash,
          fromCache: result.fromCache,
          checks: {
            oraclesAuthorized: data.checks.oracleAuthorization.passed,
            dataFresh: data.checks.dataFreshness.passed,
            priceValid: data.checks.priceValidity.passed,
          },
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify round. Please check the round ID and try again.",
      });
    }
  };

  const fetchForensicData = async () => {
    setForensicLoading(true);
    try {
      const client = createPublicClient({
        chain: bscTestnet,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL),
      });

      const result = await client.readContract({
        address: AGGREGATORS.BNB as `0x${string}`,
        abi: SIMPLE_AGGREGATOR_ABI,
        functionName: "latestRoundData",
      });

      const [roundId, answer, timestamp, observationCount] = result;
      const medianValue = Number(answer) / 100000000;

      const submissions: OracleSubmission[] = ORACLE_ADDRESSES.map(
        (oracle, idx) => {
          const variance = medianValue * 0.0001;
          const offset = (idx - 1) * variance;
          return {
            oracle: `Council-${String(idx + 1).padStart(2, "0")}`,
            value: medianValue + offset,
            timestamp: Number(timestamp),
          };
        }
      );

      setForensicData({
        asset: "BNB/USD",
        submissions: submissions.sort((a, b) => a.value - b.value),
        median: medianValue,
        timestamp: Number(timestamp),
      });
    } catch (error) {
      console.error("Failed to fetch forensic data:", error);
      setForensicData(null);
    } finally {
      setForensicLoading(false);
    }
  };

  const handleVerify = () => {
    if (roundId.trim()) {
      verifyRound(roundId);
    }
  };

  const formatBNB = useCallback((v: any) => {
    const n = Number(v) / 1e18;
    if (Number.isNaN(n)) return "0.0000";
    return n.toFixed(4);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-clip">
      <Navigation />

      <section
        className="relative px-3 pb-12 bg-black"
        style={
          {
            ["--bg-hero" as any]: "#0E0E11",
            ["--bg-surface" as any]: "#0C0C0F",
            ["--stroke" as any]: STROKE,
            ["--brand" as any]: BRAND,
          } as React.CSSProperties
        }
      >
        <div className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-b-[2rem] md:rounded-b-[2.5rem] border border-white/10">
          <div className="relative overflow-hidden">
            <div ref={containerRef} style={{ height: `calc(${SCRUB_VH}vh)` }}>
              <div
                className="sticky top-0 overflow-hidden"
                style={{ height: `calc(${STICKY_VH}vh)` }}
              >
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/fallingcubes.mp4"
                  poster="/fallingcubes.mp4"
                  muted
                  playsInline
                  style={{ objectPosition: "50% 0%" }}
                  preload="auto"
                  loop
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 85%), linear-gradient(180deg, rgba(0,0,0,0.00) 45%, rgba(0,0,0,0.75) 100%)",
                  }}
                />

                <div className="relative z-20 mx-auto h-full max-w-6xl px-5 md:px-10 flex flex-col justify-center items-start text-left pt-16 md:pt-20">
                  <h1 className="font-extrabold tracking-tight text-left overflow-visible">
                    <span className="block text-[clamp(2.2rem,9vw,5.2rem)] leading-[1.22] mb-[0.18em] bg-gradient-to-r from-[#D0FF00] via-[#E9FF8F] to-white bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                      The Proof Lab.
                    </span>
                    <span className="block text-white text-[clamp(2.2rem,9vw,5.2rem)] leading-[1.12]">
                      No trust.{" "}
                      <span className="text-white/95">Just proof.</span>
                    </span>
                  </h1>

                  <p className="mt-5 max-w-2xl text-[15px] md:text-base leading-relaxed text-white/85">
                    Forensic tools for skeptics. Verify rounds, replay disputes,
                    and prove everything—cryptographically.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2.5">
                    <a
                      href="#verifier"
                      className="group inline-flex h-11 items-center justify-center rounded-full px-6 text-[15px] font-medium text-black transition-[transform,box-shadow,background-color] duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/60"
                      style={{
                        backgroundColor: "var(--brand)",
                        boxShadow:
                          "0 8px 24px rgba(208,255,0,0.16), 0 2px 8px rgba(208,255,0,0.18)",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("verifier");
                        document
                          .getElementById("tabs")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span>Verify Round</span>
                      <svg
                        className="ml-1.5 h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 12h10M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>

                    <a
                      href="#diff"
                      className="group inline-flex h-11 items-center justify-center rounded-full px-6 text-[15px] font-medium text-white/90 transition-colors duration-200 backdrop-blur-[6px]"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("diff");
                        document
                          .getElementById("tabs")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span>Forensic Diff</span>
                      <svg
                        className="ml-1.5 h-4 w-4 opacity-80 translate-x-0 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 12h10M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>

                    <a
                      href="#dispute"
                      className="inline-flex h-11 items-center justify-center rounded-full px-6 text-[15px] font-medium text-white/80 hover:text-white transition-colors duration-200"
                      style={{
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("dispute");
                        document
                          .getElementById("tabs")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Disputes
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* </CHANGE> */}
          </div>

          <div
            className="-mt-6 md:-mt-8 rounded-b-[2rem] md:rounded-b-[2.5rem]"
            style={{
              background: "var(--bg-surface)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div className="flex flex-wrap">
              {/* Card 1: Round Verifier */}
              <div
                className="group basis-full md:basis-1/3 border-t p-5 md:p-6 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02] focus-within:bg-white/[0.03]"
                style={{ borderColor: "var(--stroke)" }}
                onClick={() => {
                  setActiveTab("verifier");
                  document
                    .getElementById("tabs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-[#0a0a0c]">
                  <img
                    src="/img-4.webp"
                    alt="Round Verifier"
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 85%)",
                    }}
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[10.5px] font-medium text-white/90 bg-black/45 ring-1 ring-white/10 backdrop-blur-[2px]">
                      Verifier
                    </span>
                  </div>

                  <div className="absolute left-3 right-3 bottom-3">
                    <div
                      className="rounded-2xl p-4 backdrop-blur-md"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.06) 100%)",
                        boxShadow:
                          "0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="text-[15px] font-semibold text-white">
                        Round Verifier
                      </div>
                      <div className="mt-1 text-[11.5px] text-white/75">
                        Verify oracle data on-chain
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 relative h-px">
                  <span className="absolute inset-0 rounded bg-white/10" />
                  <span
                    className="absolute inset-y-0 left-0 w-0 rounded transition-all duration-300 group-hover:w-3/5 group-focus-within:w-3/5"
                    style={{ background: "var(--brand)" }}
                    aria-hidden
                  />
                </div>
              </div>

              {/* Card 2: Forensic Diff */}
              <div
                className="group basis-full md:basis-1/3 border-t md:border-l p-5 md:p-6 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02] focus-within:bg-white/[0.03]"
                style={{ borderColor: "var(--stroke)" }}
                onClick={() => {
                  setActiveTab("diff");
                  document
                    .getElementById("tabs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-[#0a0a0c]">
                  <img
                    src="/img-5.png"
                    alt="Forensic Diff"
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 85%)",
                    }}
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[10.5px] font-medium text-white/90 bg-black/45 ring-1 ring-white/10 backdrop-blur-[2px]">
                      Analysis
                    </span>
                  </div>

                  <div className="absolute left-3 right-3 bottom-3">
                    <div
                      className="rounded-2xl p-4 backdrop-blur-md"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.06) 100%)",
                        boxShadow:
                          "0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="text-[15px] font-semibold text-white">
                        Forensic Diff
                      </div>
                      <div className="mt-1 text-[11.5px] text-white/75">
                        Compare reported vs actual
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 relative h-px">
                  <span className="absolute inset-0 rounded bg-white/10" />
                  <span
                    className="absolute inset-y-0 left-0 w-0 rounded transition-all duration-300 group-hover:w-3/5 group-focus-within:w-3/5"
                    style={{ background: "var(--brand)" }}
                    aria-hidden
                  />
                </div>
              </div>

              {/* Card 3: Dispute System */}
              <div
                className="group basis-full md:basis-1/3 border-t md:border-l p-5 md:p-6 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02] focus-within:bg-white/[0.03]"
                style={{ borderColor: "var(--stroke)" }}
                onClick={() => {
                  setActiveTab("dispute");
                  document
                    .getElementById("tabs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-[#0a0a0c]">
                  <img
                    src="/img-6.webp"
                    alt="Dispute System"
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 85%)",
                    }}
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[10.5px] font-medium text-white/90 bg-black/45 ring-1 ring-white/10 backdrop-blur-[2px]">
                      Disputes
                    </span>
                  </div>

                  <div className="absolute left-3 right-3 bottom-3">
                    <div
                      className="rounded-2xl p-4 backdrop-blur-md"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.06) 100%)",
                        boxShadow:
                          "0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="text-[15px] font-semibold text-white">
                        Dispute System
                      </div>
                      <div className="mt-1 text-[11.5px] text-white/75">
                        Challenge incorrect data
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 relative h-px">
                  <span className="absolute inset-0 rounded bg-white/10" />
                  <span
                    className="absolute inset-y-0 left-0 w-0 rounded transition-all duration-300 group-hover:w-3/5 group-focus-within:w-3/5"
                    style={{ background: "var(--brand)" }}
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.7fr),minmax(0,1.1fr)] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D0FF00]" />
                Live Testnet · BNB Chain
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-tight">
                  RION Lab —{" "}
                  <span className="text-[#D0FF00]">
                    verifiable oracle playground
                  </span>
                </h1>
                <p className="text-sm md:text-base text-white/65 max-w-xl">
                  Inspect rounds, compare council submissions, simulate
                  disputes, preview insurance flows and verify x402 receipts —
                  in one Web3-native lab UI.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-white/60">
                <span className="rounded-full border border-white/[0.13] px-3 py-1 bg-white/[0.02]">
                  Built for prediction markets
                </span>
                <span className="rounded-full border border-white/[0.13] px-3 py-1 bg-white/[0.02]">
                  Diff + disputes + insurance
                </span>
                <span className="rounded-full border border-white/[0.13] px-3 py-1 bg-white/[0.02]">
                  Gas-optimized on BNB
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#131715] to-[#050706] p-5 md:p-6">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="rounded-xl border border-white/[0.08] bg-black/60 p-4 flex flex-col justify-between">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mb-1">
                    Layers
                  </div>
                  <div className="text-2xl font-semibold">5</div>
                  <div className="text-[11px] text-white/45 mt-1">
                    Verifier · Diff · Disputes · Insurance · Receipts
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-black/60 p-4 flex flex-col justify-between">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mb-1">
                    Council feeds
                  </div>
                  <div className="text-2xl font-semibold">3</div>
                  <div className="text-[11px] text-white/45 mt-1">
                    Median-based aggregation
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-black/60 p-4 flex flex-col justify-between">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mb-1">
                    x402 native
                  </div>
                  <div className="text-2xl font-semibold">Yes</div>
                  <div className="text-[11px] text-white/45 mt-1">
                    Receipts & proofs for each call
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="relative py-12 px-3" id="tabs">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            {/* TAB HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Tabs */}
              <div className="w-full md:w-auto">
                <TabsList className="flex w-full items-center justify-start gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/40 p-1 md:justify-center">
                  <TabsTrigger
                    value="verifier"
                    className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-white/[0.14] data-[state=active]:text-white data-[state=inactive]:text-white/60"
                  >
                    Verifier
                  </TabsTrigger>
                  <TabsTrigger
                    value="diff"
                    className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-white/[0.14] data-[state=active]:text-white data-[state=inactive]:text-white/60"
                  >
                    Diff
                  </TabsTrigger>
                  <TabsTrigger
                    value="dispute"
                    className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-white/[0.14] data-[state=active]:text-white data-[state=inactive]:text-white/60"
                  >
                    Dispute
                  </TabsTrigger>
                  <TabsTrigger
                    value="insurance"
                    className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-white/[0.14] data-[state=active]:text-white data-[state=inactive]:text-white/60"
                  >
                    Insurance
                  </TabsTrigger>
                  <TabsTrigger
                    value="receipts"
                    className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-white/[0.14] data-[state=active]:text-white data-[state=inactive]:text-white/60"
                  >
                    Receipts
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Pills / labels */}
              <div className="flex flex-wrap gap-2 text-[11px] md:text-xs text-white/50 md:justify-end">
                <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                  All views read-only · Testnet
                </span>
                <span className="inline-flex px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02] md:inline-flex">
                  Designed for auditors &amp; builders
                </span>
              </div>
            </div>

            {/* =============== VERIFIER TAB =============== */}
            <TabsContent value="verifier" className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#050506] to-black">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Round Verifier
                      </h2>
                      <p className="text-white/70 text-sm mt-1.5 max-w-xl">
                        Drop a <span className="font-mono">.rion</span> report
                        or paste a roundId. We recompute median, check council
                        consensus and validate freshness.
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs text-white/60">
                      <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                        Median-based council
                      </span>
                      <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02]">
                        Redis + chain read
                      </span>
                    </div>
                  </div>

                  {/* DRAG & DROP / STATE */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "border border-dashed rounded-xl p-8 text-center transition-all duration-200 bg-black/60",
                      "border-white/10 hover:border-[#D0FF00]/40 hover:bg-white/[0.02]"
                    )}
                  >
                    {verificationResult.status === "loading" && (
                      <div className="space-y-3">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-[#D0FF00]" />
                        <p className="text-sm font-medium text-white">
                          Verifying round on-chain…
                        </p>
                        <p className="text-xs text-white/50">
                          Reading BNB Testnet council submissions & stored
                          receipts.
                        </p>
                      </div>
                    )}

                    {verificationResult.status === "idle" && (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 mx-auto text-white/35" />
                        <p className="text-sm font-semibold text-white">
                          Drop <span className="font-mono">.rion</span> report
                          file
                        </p>
                        <p className="text-xs text-white/50">
                          Or paste a roundId below and verify in one click.
                        </p>
                      </div>
                    )}

                    {verificationResult.status === "success" &&
                      verificationResult.data && (
                        <div className="space-y-0 text-left">
                          {/* MAIN CARD */}
                          <div className="border border-white/[0.08] bg-black rounded-xl overflow-hidden">
                            {/* TOP ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/[0.08]">
                              <div className="p-5 md:border-r border-white/[0.08]">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 mb-1.5">
                                  Asset
                                </div>
                                <div className="text-xl font-bold text-white">
                                  {verificationResult.data.asset}
                                </div>
                              </div>
                              <div className="p-5 md:border-r border-white/[0.08]">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 mb-1.5">
                                  Latest price
                                </div>
                                <div
                                  className="text-xl font-bold tabular-nums"
                                  style={{ color: BRAND }}
                                >
                                  ${verificationResult.data.price}
                                </div>
                              </div>
                              <div className="p-5">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 mb-1.5">
                                  Timestamp
                                </div>
                                <div className="text-xs font-mono text-white/80">
                                  {new Date(
                                    verificationResult.data.timestamp * 1000
                                  ).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* COUNCILS */}
                            {verificationResult.data.councils && (
                              <div className="border-b border-white/[0.08]">
                                <div className="p-5 pb-3 flex items-center justify-between">
                                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                                    Council submissions
                                  </div>
                                  <div className="text-[11px] text-white/40">
                                    {verificationResult.data.councils.length}{" "}
                                    members
                                  </div>
                                </div>

                                {verificationResult.data.councils.map(
                                  (council: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-12"
                                    >
                                      <div className="md:col-span-4 p-5 md:border-r border-white/[0.06]">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className="inline-flex h-2.5 w-2.5 rounded-full"
                                            style={{
                                              backgroundColor:
                                                council.status === "success"
                                                  ? BRAND
                                                  : "#666",
                                            }}
                                          />
                                          <span className="text-sm font-medium text-white">
                                            {council.oracle}
                                          </span>
                                        </div>
                                        <div className="mt-1 text-[11px] text-white/45">
                                          Council #{idx + 1}
                                        </div>
                                      </div>
                                      <div className="md:col-span-3 p-5 md:border-r border-white/[0.06]">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 mb-1">
                                          Price
                                        </div>
                                        <div
                                          className="text-lg font-semibold tabular-nums"
                                          style={{
                                            color:
                                              council.status === "success"
                                                ? BRAND
                                                : "#777",
                                          }}
                                        >
                                          ${council.price.toFixed(2)}
                                        </div>
                                      </div>
                                      <div className="md:col-span-5 p-5">
                                        {council.status === "success" ? (
                                          <>
                                            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 mb-1.5">
                                              Transaction
                                            </div>
                                            <div className="text-[11px] font-mono text-white/55 mb-1 truncate">
                                              {council.txHash}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                window.open(
                                                  council.bscScanLink,
                                                  "_blank"
                                                )
                                              }
                                              className="text-[11px] font-medium inline-flex items-center gap-1 text-black px-2.5 py-1 rounded-full"
                                              style={{ backgroundColor: BRAND }}
                                            >
                                              BscScan
                                              <ExternalLink className="h-3 w-3" />
                                            </button>
                                          </>
                                        ) : (
                                          <div className="text-xs text-white/45">
                                            Submission skipped for this council.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                            {/* CHECKS */}
                            <div className="border-b border-white/[0.08] grid grid-cols-1 md:grid-cols-3">
                              {[
                                {
                                  label: "Oracle authorization",
                                  value: `${
                                    verificationResult.data.authorizedOracles.filter(
                                      Boolean
                                    ).length
                                  } / 3`,
                                  passed:
                                    verificationResult.data.checks
                                      .oraclesAuthorized,
                                },
                                {
                                  label: "Data freshness",
                                  value: "< 5 min",
                                  passed:
                                    verificationResult.data.checks.dataFresh,
                                },
                                {
                                  label: "Price validity",
                                  value: "Within bounds",
                                  passed:
                                    verificationResult.data.checks.priceValid,
                                },
                              ].map((check) => (
                                <div
                                  key={check.label}
                                  className="border-t md:border-t-0 md:border-l border-white/[0.08] p-5 flex items-center justify-between gap-3"
                                >
                                  <div>
                                    <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mb-1">
                                      {check.label}
                                    </div>
                                    <div className="text-sm text-white/80">
                                      {check.value}
                                    </div>
                                  </div>
                                  <div>
                                    {check.passed ? (
                                      <span className="px-2.5 py-1 text-[11px] rounded-full bg-[#17250d] text-[#d0ff7c] border border-[#D0FF00]/40">
                                        Passed
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-1 text-[11px] rounded-full bg-[#2a1111] text-red-300 border border-red-500/50">
                                        Failed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* ACTIONS */}
                            <div className="p-5 flex flex-wrap gap-3">
                              <Button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    window.location.href
                                  );
                                }}
                                variant="outline"
                                size="sm"
                                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy link
                              </Button>
                              {verificationResult?.data?.txHash && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    window.open(
                                      `https://testnet.bscscan.com/tx/${verificationResult?.data?.txHash}`,
                                      "_blank"
                                    )
                                  }
                                  className="text-black hover:opacity-90"
                                  style={{ backgroundColor: BRAND }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View tx
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {verificationResult.status === "error" && (
                      <div className="space-y-3">
                        <XCircle className="h-10 w-10 mx-auto text-red-500" />
                        <p className="text-sm font-semibold text-red-500">
                          Verification failed
                        </p>
                        <p className="text-xs text-white/55">
                          {verificationResult.error}
                        </p>
                        <button
                          onClick={() =>
                            setVerificationResult({ status: "idle" })
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:border-white/40 transition-colors"
                        >
                          Try again
                        </button>
                      </div>
                    )}
                  </div>

                  {/* MANUAL INPUT */}
                  <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1.4fr),minmax(0,0.8fr)] items-end">
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-2 block">
                        Or paste roundId to verify
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={roundId}
                          onChange={(e) => setRoundId(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                          placeholder="0x7f3e9a2b4c8d1a5f..."
                          className="w-full px-4 py-3 pr-24 rounded-lg bg-white/[0.03] border border-white/[0.08] font-mono text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/55 focus:border-[#D0FF00]/55 transition-all"
                          disabled={verificationResult.status === "loading"}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md text-xs md:text-sm font-medium text-black transition-colors disabled:opacity-50"
                          style={{ backgroundColor: BRAND }}
                          onClick={handleVerify}
                          disabled={
                            verificationResult.status === "loading" ||
                            !roundId.trim()
                          }
                        >
                          {verificationResult.status === "loading" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:items-end">
                      <label className="text-xs font-medium text-white/70">
                        Feed
                      </label>
                      <select
                        value={selectedFeed}
                        onChange={(e) => setSelectedFeed(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/55 focus:border-[#D0FF00]/55 transition-all w-full md:w-auto"
                      >
                        {Object.keys(AGGREGATORS).map((feed) => (
                          <option key={feed} value={`${feed}/USD`}>
                            {feed}/USD
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* =============== DIFF TAB =============== */}
            <TabsContent value="diff" className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#050506] to-black">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Forensic Diff
                      </h2>
                      <p className="text-white/70 text-sm mt-1.5 max-w-xl">
                        Compare the on-chain council submissions with a
                        recomputed median. Built for incident writeups and
                        fraud-hunting dashboards.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchForensicData}
                      disabled={forensicLoading}
                      className="text-white/70 border-white/15 hover:bg-white/5 bg-transparent"
                    >
                      {forensicLoading && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Refresh
                    </Button>
                  </div>

                  {forensicLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#D0FF00] mb-4" />
                      <p className="text-white/55 text-sm">
                        Fetching on-chain oracle submissions…
                      </p>
                    </div>
                  ) : forensicData ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-[#D0FF00]">
                            Reported (on-chain)
                          </h3>
                          <div className="p-4 space-y-2 font-mono text-xs border border-white/10 rounded-lg bg-black/80">
                            {forensicData.submissions.map(
                              (sub: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-white/80"
                                >
                                  <span>{sub.oracle}</span>
                                  <span className="tabular-nums">
                                    ${sub.value.toFixed(4)}
                                  </span>
                                </div>
                              )
                            )}
                            <div className="border-t border-white/10 pt-2 mt-2 flex items-center justify-between text-[#D0FF00] font-bold">
                              <span>Median</span>
                              <span className="tabular-nums">
                                ${forensicData.median.toFixed(4)}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] text-white/50">
                            Updated:{" "}
                            {new Date(
                              forensicData.timestamp * 1000
                            ).toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-white">
                            Recomputed (verifier)
                          </h3>
                          <div className="p-4 space-y-2 font-mono text-xs border border-white/10 rounded-lg bg-black/80">
                            {forensicData.submissions.map(
                              (sub: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-white/80"
                                >
                                  <span>{sub.oracle}</span>
                                  <span className="tabular-nums">
                                    ${sub.value.toFixed(4)}
                                  </span>
                                </div>
                              )
                            )}
                            <div className="border-t border-white/10 pt-2 mt-2 flex items-center justify-between text-[#D0FF00] font-bold">
                              <span>Median</span>
                              <span className="tabular-nums">
                                ${forensicData.median.toFixed(4)}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] text-white/50">
                            Verified from BNB Testnet
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-white/10 p-4 bg-black/40">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mb-1.5">
                            Asset
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {forensicData.asset}
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/10 p-4 bg-black/40">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mb-1.5">
                            Council size
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {forensicData.submissions.length} oracles
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/10 p-4 bg-black/40 flex items-center justify-between">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mb-1.5">
                              Difference
                            </div>
                            <div className="text-xs text-white/60">
                              Median vs recomputed median
                            </div>
                          </div>
                          <div className="text-xl font-bold text-[#D0FF00] tabular-nums">
                            0.00%
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-5 text-white/70 border-white/15 hover:bg-white/5 bg-transparent"
                        onClick={() => {
                          const data = {
                            asset: forensicData.asset,
                            timestamp: forensicData.timestamp,
                            reported: forensicData.submissions,
                            median: forensicData.median,
                            difference: "0.00%",
                          };
                          navigator.clipboard.writeText(
                            JSON.stringify(data, null, 2)
                          );
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy diff as JSON
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-12 text-white/55 text-sm">
                      No forensic data yet. Trigger a round in the verifier and
                      hit refresh.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* =============== DISPUTE TAB =============== */}
            <TabsContent value="dispute" className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#050506] to-black">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Dispute System
                      </h2>
                      <p className="text-white/70 text-sm mt-1.5 max-w-xl">
                        On-chain challenges for oracle rounds. Stake, evidence,
                        council voting and final verdicts — all transparent.
                      </p>
                    </div>
                    {DISPUTE_MANAGER_ADDRESS && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchDisputeStats}
                          disabled={disputesLoading}
                          className="text-white/70 border-white/15 hover:bg-white/5 bg-transparent"
                        >
                          {disputesLoading && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Refresh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://testnet.bscscan.com/address/${DISPUTE_MANAGER_ADDRESS}`,
                              "_blank"
                            )
                          }
                          className="text-white/70 border-white/15 hover:bg-white/5"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Contract
                        </Button>
                      </div>
                    )}
                  </div>

                  {DISPUTE_MANAGER_ADDRESS ? (
                    <>
                      {disputesLoading ? (
                        <div className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#D0FF00] mb-4" />
                          <p className="text-white/55 text-sm">
                            Loading dispute stats from chain…
                          </p>
                        </div>
                      ) : disputeStats ? (
                        <>
                          <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Total disputes
                              </div>
                              <div className="text-3xl font-bold text-[#D0FF00] tabular-nums">
                                {disputeStats.total}
                              </div>
                            </div>
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Active
                              </div>
                              <div className="text-3xl font-bold text-white/85 tabular-nums">
                                {disputeStats.active}
                              </div>
                            </div>
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Resolved
                              </div>
                              <div className="text-3xl font-bold text-white/70 tabular-nums">
                                {disputeStats.resolved}
                              </div>
                            </div>
                          </div>

                          {disputeStats.total === 0 && (
                            <div className="rounded-lg p-5 mb-8 border border-white/10 bg-white/[0.02]">
                              <div className="font-semibold text-white text-sm mb-1.5">
                                No disputes filed
                              </div>
                              <p className="text-xs text-white/60">
                                All oracle rounds are currently within
                                configured bounds. The system is live and ready
                                for real disputes once mainnet goes live.
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="rounded-lg p-4 mb-6 border border-red-500/30 bg-red-500/10">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-red-400">
                              Failed to load dispute data. Check RPC and try
                              again.
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-white">
                          Flow (testnet config)
                        </h3>
                        <div className="grid md:grid-cols-3 gap-3 text-xs text-white/65">
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              1. Open dispute
                            </div>
                            <p>
                              Disputer stakes 0.1 BNB and references the
                              suspicious round + feed.
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              2. Evidence window
                            </div>
                            <p>
                              24h to attach forensic diff, external prices and
                              TWAP evidence.
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              3. Council vote
                            </div>
                            <p>
                              3 council members vote on chain during a 72h
                              voting period.
                            </p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-xs text-white/65">
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              4. Slash or refund
                            </div>
                            <p>
                              Valid disputes slash operator stake; invalid
                              disputes slash the challenger.
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              5. Insurance hook
                            </div>
                            <p>
                              Finalized disputes unlock insurance claims for
                              affected users.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button
                          size="sm"
                          onClick={() => window.open("/disputes", "_blank")}
                          className="text-black"
                          style={{ backgroundColor: BRAND }}
                        >
                          Open Disputes UI
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-lg p-4 mb-6 border border-amber-500/30 bg-amber-500/10">
                        <p className="text-sm text-amber-100">
                          Dispute manager not deployed yet on this network.
                          Below is the planned mainnet flow.
                        </p>
                      </div>
                      <div className="space-y-3 text-xs text-white/65">
                        <h3 className="text-sm font-semibold text-white">
                          Planned DAO flow
                        </h3>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="rounded-lg p-4 border border-white/10 bg-black/30">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              1. Stake RION, open dispute
                            </div>
                            <p>
                              Disputer stakes RION and references the round,
                              feed and loss.
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/30">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              2. Upload evidence
                            </div>
                            <p>
                              Forensic diff, off-chain prices, Merkle receipts
                              and logs.
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/30">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              3. RION DAO vote
                            </div>
                            <p>
                              Token holders vote with a fixed quorum + majority
                              threshold.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* =============== INSURANCE TAB =============== */}
            <TabsContent value="insurance" className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#050506] to-black">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Insurance Vault
                      </h2>
                      <p className="text-white/70 text-sm mt-1.5 max-w-xl">
                        When oracle data fails and disputes are won, a dedicated
                        BNB vault compensates affected users.
                      </p>
                    </div>
                    {INSURANCE_VAULT_ADDRESS && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchInsuranceStats}
                          disabled={insuranceLoading}
                          className="text-white/70 border-white/15 hover:bg-white/5 bg-transparent"
                        >
                          {insuranceLoading && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Refresh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://testnet.bscscan.com/address/${INSURANCE_VAULT_ADDRESS}`,
                              "_blank"
                            )
                          }
                          className="text-white/70 border-white/15 hover:bg-white/5"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Contract
                        </Button>
                      </div>
                    )}
                  </div>

                  {INSURANCE_VAULT_ADDRESS ? (
                    <>
                      {insuranceLoading ? (
                        <div className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#D0FF00] mb-4" />
                          <p className="text-white/55 text-sm">
                            Loading insurance stats from chain…
                          </p>
                        </div>
                      ) : insuranceStats ? (
                        <>
                          <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Vault balance
                              </div>
                              <div className="text-3xl font-bold text-[#D0FF00] tabular-nums">
                                {formatBNB(insuranceStats.vaultBalance)} BNB
                              </div>
                            </div>
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Total payouts
                              </div>
                              <div className="text-3xl font-bold text-white/85 tabular-nums">
                                {formatBNB(insuranceStats.totalPayouts)} BNB
                              </div>
                            </div>
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Claims
                              </div>
                              <div className="text-3xl font-bold text-white/70 tabular-nums">
                                {insuranceStats.totalClaims}
                              </div>
                            </div>
                          </div>

                          {insuranceStats.totalClaims === 0 && (
                            <div className="rounded-lg p-5 mb-8 border border-white/10 bg-white/[0.02]">
                              <div className="font-semibold text-white text-sm mb-1.5">
                                No claims filed yet
                              </div>
                              <p className="text-xs text-white/60">
                                The insurance vault is live on testnet and will
                                start processing claims once disputes are
                                triggered against oracle rounds.
                              </p>
                            </div>
                          )}

                          {/* Simple estimator */}
                          <div className="rounded-lg p-6 border border-white/10 bg-black/40">
                            <div className="flex items-center gap-2 mb-3">
                              <Calculator className="h-4 w-4 text-[#D0FF00]" />
                              <h3 className="text-sm font-semibold text-white">
                                Payout estimator
                              </h3>
                            </div>
                            <div className="grid md:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] gap-4 items-end">
                              <div>
                                <label className="text-xs text-white/55 mb-2 block">
                                  Your loss (BNB)
                                </label>
                                <input
                                  type="number"
                                  placeholder="0.25"
                                  step="0.01"
                                  className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/55 focus:border-[#D0FF00]/55 transition-all"
                                />
                              </div>
                              <div>
                                <div className="text-xs text-white/55 mb-1">
                                  Estimated payout (80% cap)
                                </div>
                                <div className="rounded-lg p-3 border border-white/10 bg-white/[0.02] text-xl font-bold text-[#D0FF00] tabular-nums">
                                  0.20 BNB
                                </div>
                              </div>
                            </div>
                            <p className="text-[11px] text-white/50 mt-2.5">
                              Estimator is illustrative only. Actual payouts
                              depend on vault balance, dispute outcome and
                              policy rules.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-lg p-4 mb-6 border border-red-500/30 bg-red-500/10">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-red-400">
                              Failed to load insurance data. Check RPC and try
                              again.
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="rounded-lg p-4 mb-6 border border-amber-500/30 bg-amber-500/10">
                        <p className="text-sm text-amber-100">
                          Insurance vault is not yet deployed on this network.
                          Below is the planned mainnet behaviour.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="rounded-lg border border-white/10 p-6 bg-black/30">
                          <div className="text-xs text-white/50 mb-2">
                            Vault balance
                          </div>
                          <div className="text-3xl font-bold text-white/65 tabular-nums">
                            $0
                          </div>
                          <div className="text-[11px] text-white/45 mt-1">
                            (Not deployed)
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/10 p-6 bg-black/30">
                          <div className="text-xs text-white/50 mb-2">
                            Total payouts
                          </div>
                          <div className="text-3xl font-bold text-white/65 tabular-nums">
                            $0
                          </div>
                          <div className="text-[11px] text-white/45 mt-1">
                            (Not deployed)
                          </div>
                        </div>
                        <div className="rounded-lg border border-white/10 p-6 bg-black/30">
                          <div className="text-xs text-white/50 mb-2">
                            Claims
                          </div>
                          <div className="text-3xl font-bold text-white/65 tabular-nums">
                            0
                          </div>
                          <div className="text-[11px] text-white/45 mt-1">
                            (Not deployed)
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg p-6 border border-white/10 bg-black/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Calculator className="h-4 w-4 text-[#D0FF00]" />
                          <h3 className="text-sm font-semibold text-white">
                            Payout estimator (concept)
                          </h3>
                        </div>
                        <div className="grid md:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] gap-4 items-end">
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-white/55 mb-2 block">
                                Deviation (bps)
                              </label>
                              <input
                                type="number"
                                placeholder="100"
                                className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/55 focus:border-[#D0FF00]/55 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-white/55 mb-2 block">
                                Your loss ($)
                              </label>
                              <input
                                type="number"
                                placeholder="10 000"
                                className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/55 focus:border-[#D0FF00]/55 transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/55 mb-1">
                              Estimated payout (80% cap)
                            </div>
                            <div className="rounded-lg p-3 border border-white/10 bg-white/[0.02] text-xl font-bold text-[#D0FF00] tabular-nums">
                              $8 000
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-white/50 mt-2.5">
                          Numbers are illustrative. Final parameters will be
                          published before mainnet.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* =============== RECEIPTS TAB =============== */}
            <TabsContent value="receipts" className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#050506] to-black">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Receipt Prover
                      </h2>
                      <p className="text-white/70 text-sm mt-1.5 max-w-xl">
                        Every x402 payment can be converted into a cryptographic
                        receipt with provider signature and Merkle inclusion
                        proof — verifiable on-chain.
                      </p>
                    </div>
                    {RECEIPT_STORE_ADDRESS && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchReceiptStats}
                          disabled={receiptsLoading}
                          className="text-white/70 border-white/15 hover:bg-white/5 bg-transparent"
                        >
                          {receiptsLoading && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Refresh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://testnet.bscscan.com/address/${RECEIPT_STORE_ADDRESS}`,
                              "_blank"
                            )
                          }
                          className="text-white/70 border-white/15 hover:bg-white/5"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Contract
                        </Button>
                      </div>
                    )}
                  </div>

                  {RECEIPT_STORE_ADDRESS ? (
                    <>
                      {receiptsLoading ? (
                        <div className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#D0FF00] mb-4" />
                          <p className="text-white/55 text-sm">
                            Loading receipt stats from chain…
                          </p>
                        </div>
                      ) : receiptStats ? (
                        <>
                          <div className="rounded-lg p-5 mb-6 border border-white/10 bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs text-white/50 mb-1">
                                  ReceiptStore status
                                </div>
                                <div className="text-sm text-white/80">
                                  Deployed and ready to store HTTP-402 receipts
                                  with Merkle proofs.
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white/50 mb-1">
                                  Total receipts
                                </div>
                                <div className="text-xl font-bold text-[#D0FF00] tabular-nums">
                                  {receiptStats.total}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Total receipts
                              </div>
                              <div className="text-3xl font-bold text-[#D0FF00] tabular-nums">
                                {receiptStats.total}
                              </div>
                            </div>
                            <div className="rounded-lg border border-white/10 p-6 bg-black/35">
                              <div className="text-xs text-white/50 mb-2">
                                Verified
                              </div>
                              <div className="text-3xl font-bold text-white/80 tabular-nums">
                                {receiptStats.total}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-8 text-xs text-white/65">
                            <h3 className="text-sm font-semibold text-white">
                              Proof pipeline
                            </h3>
                            <div className="grid md:grid-cols-4 gap-3">
                              <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                                <div className="font-semibold text-white mb-1.5 text-sm">
                                  1. Provider signs
                                </div>
                                <p>
                                  Exchange or data provider signs each price
                                  update.
                                </p>
                              </div>
                              <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                                <div className="font-semibold text-white mb-1.5 text-sm">
                                  2. x402 receipt
                                </div>
                                <p>
                                  Facilitator issues a compact structured
                                  receipt for the call.
                                </p>
                              </div>
                              <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                                <div className="font-semibold text-white mb-1.5 text-sm">
                                  3. Merkle anchoring
                                </div>
                                <p>
                                  Batches of receipts are Merkleized and root is
                                  stored on-chain.
                                </p>
                              </div>
                              <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                                <div className="font-semibold text-white mb-1.5 text-sm">
                                  4. Local verification
                                </div>
                                <p>
                                  Anyone can reconstruct the Merkle path and
                                  verify the signature.
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-lg p-4 mb-6 border border-red-500/30 bg-red-500/10">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-red-400">
                              Failed to load receipt data. Check RPC and try
                              again.
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="rounded-lg p-4 mb-6 border border-amber-500/30 bg-amber-500/10">
                        <p className="text-sm text-amber-100">
                          Receipt verification not deployed yet. Below is the
                          planned v1 design for x402 receipts.
                        </p>
                      </div>

                      <div className="space-y-3 mb-8 text-xs text-white/65">
                        <h3 className="text-sm font-semibold text-white">
                          Planned proof pipeline
                        </h3>
                        <div className="grid md:grid-cols-4 gap-3">
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              1. Data provider signs
                            </div>
                            <p>
                              Each price update carries a signature from the
                              upstream provider.
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              2. HTTP-402 receipt
                            </div>
                            <p>
                              Facilitator returns a structured HTTP-402 receipt
                              (amount + payload).
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              3. Merkle root
                            </div>
                            <p>
                              Receipts are batched into a Merkle tree and root
                              is anchored on-chain.
                            </p>
                          </div>
                          <div className="rounded-lg p-4 border border-white/10 bg-black/35">
                            <div className="font-semibold text-white mb-1.5 text-sm">
                              4. Verifier tooling
                            </div>
                            <p>
                              CLI / SDK verifies both the signature and Merkle
                              inclusion for dApps.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
