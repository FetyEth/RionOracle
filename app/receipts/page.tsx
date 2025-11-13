"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { CheckCircle2, ExternalLink, Copy, Download } from "lucide-react";
import Link from "next/link";

const BRAND = "#D0FF00";
const STROKE = "#151517";

export default function ReceiptsPage() {
  const [activeTab, setActiveTab] = useState<"paste" | "example">("example");

  const providers = [
    {
      name: "Binance",
      address: "0x4a2f...8d1b",
      receipts: 124530,
      uptime: 99.98,
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Binance_Logo.svg/768px-Binance_Logo.svg.png",
    },
    {
      name: "OKX",
      address: "0x7f3e...2b9a",
      receipts: 124501,
      uptime: 99.95,
      src: "https://images.seeklogo.com/logo-png/45/2/okx-logo-png_seeklogo-459094.png",
    },
    {
      name: "PancakeSwap",
      address: "0x2b4c...1a5f",
      receipts: 124482,
      uptime: 99.92,
      src: "https://images.seeklogo.com/logo-png/44/2/pancakeswap-cake-logo-png_seeklogo-441402.png",
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-clip">
      <Navigation />

      {/* Hero Section */}
      <section className="relative px-3 pt-20 md:pt-24 pb-12 bg-black">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <h1 className="font-extrabold tracking-tight text-left leading-[1.06]">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              HTTP-402{" "}
              <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                Receipts
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
            Cryptographic proof of data delivery. Verifiable receipts for AI
            agents and micropayments with pay-per-query protocol.
          </p>

          <div
            className="mt-10 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
            }}
          />
        </div>
      </section>

      {/* What is HTTP-402 - Cards Section */}
      <section className="relative px-3 bg-black">
        <div className="relative mx-auto w-full max-w-[1280px]">
          <div className="relative z-10 px-5 md:px-10">
            <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
              Protocol Overview
            </div>

            <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
              <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
                What is{" "}
                <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                  HTTP-402
                </span>
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
              Payment Required status code that enables cryptographic receipts
              for data delivery and instant verification.
            </p>

            <div
              className="mt-10 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
              }}
            />
          </div>

          <div className="relative z-10 px-5 md:px-10 pb-16 md:pb-20">
            <ul className="mt-6 grid gap-2 md:grid-cols-3">
              {[
                {
                  title: "Payment Required",
                  description:
                    "HTTP status code 402 signals that payment is required before accessing the resource.",
                },
                {
                  title: "Cryptographic Receipt",
                  description:
                    "Provider signs the data with their private key, creating verifiable proof of delivery.",
                },
                {
                  title: "Instant Verification",
                  description:
                    "Verify receipts on-chain using Merkle proofs anchored in oracle rounds.",
                },
              ].map((f, i) => (
                <li key={f.title} className="relative">
                  <div className="group relative overflow-visible rounded-xl py-6 md:py-7 pl-0 pr-0 md:pl-2 md:pr-2">
                    {i >= 3 && (
                      <div className="absolute -top-px left-0 right-0 h-px bg-white/8" />
                    )}

                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(60% 40% at 30% 40%, rgba(208,255,0,0.14) 0%, transparent 70%)",
                        filter: "blur(24px)",
                      }}
                    />

                    <span className="select-none pointer-events-none absolute -top-2 -right-1 text-7xl md:text-8xl font-black leading-none tracking-tighter text-white/[0.06]">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>

                    <div className="pr-6">
                      <h3 className="text-[17px] md:text-[18px] font-semibold text-white">
                        {f.title}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] md:text-[14px] leading-relaxed text-white/70 max-w-[48ch]">
                        {f.description}
                      </p>

                      <div className="mt-4 relative h-px">
                        <span className="absolute inset-0 bg-white/10" />
                        <span
                          className="absolute inset-y-0 left-0 w-0 transition-all duration-300 group-hover:w-3/5"
                          style={{ background: BRAND }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative py-0 px-3 bg-black">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <div className="mb-8 md:mb-10">
            <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Process Flow
            </div>
            <h2 className="text-left font-extrabold tracking-tight text-white leading-[1.04]">
              <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
                How it works
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
              Complete pay-per-query flow with cryptographic receipts.
            </p>
            <div
              className="mt-8 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
              }}
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 mb-16 md:mb-24">
          <div className="border border-white/10 bg-black overflow-hidden rounded-2xl">
            <div className="grid grid-cols-1">
              {[
                {
                  num: "01",
                  title: "Agent Requests Data",
                  description:
                    "AI agent queries RION API endpoint for price data: GET /price/BNB-USD",
                  span: 4,
                },
                {
                  num: "02",
                  title: "Server Returns 402",
                  description:
                    "Response includes payment address and amount required: 0.001 BNB to proceed",
                  span: 4,
                },
                {
                  num: "03",
                  title: "Agent Pays",
                  description:
                    "Agent sends payment on-chain and includes transaction hash in retry request header",
                  span: 4,
                },
                {
                  num: "04",
                  title: "Provider Signs & Delivers",
                  description:
                    "Provider returns data along with cryptographic receipt signed with their private key",
                  span: 6,
                },
                {
                  num: "05",
                  title: "Verify On-Chain",
                  description:
                    "Agent verifies receipt against Merkle root published in the next oracle round",
                  span: 6,
                },
              ].map((step, idx, arr) => {
                // Determine border classes
                const isTopRow = idx < 3;
                const isBottomRow = idx >= 3;
                const isLastInTopRow = idx === 2;
                const needsRightBorder =
                  (isTopRow && !isLastInTopRow) || (isBottomRow && idx === 3);
                const needsBottomBorder = isTopRow;

                return (
                  <div
                    key={step.num}
                    className={`
                      bg-black p-6 md:p-8 lg:p-10 md:col-span-${step.span}
                      ${needsBottomBorder ? "border-b border-white/[0.08]" : ""}
                      ${
                        needsRightBorder
                          ? "md:border-r border-white/[0.08]"
                          : ""
                      }
                    `}
                  >
                    <div className="relative">
                      <span
                        className="text-[11px] font-bold uppercase tracking-widest mb-4 block"
                        style={{ color: BRAND }}
                      >
                        Step {step.num}
                      </span>
                      <h3 className="text-[17px] md:text-[18px] font-semibold text-white mb-2.5 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-[13.5px] md:text-[14px] leading-relaxed text-white/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Receipt Verifier Section - Full Width Grid */}
      <section className="relative py-0 px-0 bg-black hidden">
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 border-y border-white/[0.08] bg-black">
            {/* Header Section - Full Width */}
            <div className="relative md:col-span-12 p-8 md:p-12 border-b border-white/[0.08]">
              <div className="relative max-w-[1280px] mx-auto">
                <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Verification Tool
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Verify Receipt
                </h2>
                <p className="text-[15px] text-white/60 max-w-2xl">
                  Validate cryptographic receipts against on-chain Merkle proofs
                  published in oracle rounds.
                </p>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="relative md:col-span-12 border-b border-white/[0.08] bg-black">
              <div className="max-w-[1280px] mx-auto flex gap-0">
                <button
                  onClick={() => setActiveTab("paste")}
                  className={`relative px-8 py-4 text-sm font-medium transition-all border-r border-white/[0.08] ${
                    activeTab === "paste"
                      ? "text-white bg-white/[0.02]"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  Paste Receipt
                  {activeTab === "paste" && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ backgroundColor: BRAND }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("example")}
                  className={`relative px-8 py-4 text-sm font-medium transition-all ${
                    activeTab === "example"
                      ? "text-white bg-white/[0.02]"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  Example Receipt
                  {activeTab === "example" && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ backgroundColor: BRAND }}
                    />
                  )}
                </button>
              </div>
            </div>

            {activeTab === "paste" && (
              <>
                {/* Input Section */}
                <div className="relative md:col-span-8 p-8 md:p-10 border-b md:border-b md:border-r border-white/[0.08] min-h-[240px]">
                  <div className="relative">
                    <label className="text-sm text-white/70 mb-3 block font-medium uppercase tracking-wider text-[11px]">
                      Receipt Hash
                    </label>
                    <input
                      type="text"
                      placeholder="0x7f3e9a2b4c8d1a5f..."
                      className="w-full px-5 py-4 rounded-lg bg-[#0a0a0a] border border-white/[0.12] font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative md:col-span-4 p-8 md:p-10 border-b border-white/[0.08] flex items-center justify-center min-h-[240px]">
                  <button
                    className="w-full inline-flex h-12 items-center justify-center rounded-lg px-6 text-[15px] font-semibold text-black transition-all duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: BRAND }}
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Verify Receipt
                  </button>
                </div>
              </>
            )}

            {activeTab === "example" && (
              <>
                {/* Receipt Details - Left Column */}
                <div className="relative md:col-span-6 md:row-span-2 p-8 md:p-10 border-b md:border-b md:border-r border-white/[0.08]">
                  <div className="relative space-y-7">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-3">
                        Receipt Hash
                      </div>
                      <div className="flex items-center justify-between bg-[#0a0a0a] p-4 rounded-lg border border-white/[0.08]">
                        <span className="font-mono text-sm text-white/90 truncate">
                          0x7f3e9a2b4c8d1a5f3e7b9c2d4a6f8e1b3c5d7a9f
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-3">
                          Provider
                        </div>
                        <div className="font-semibold text-lg text-white">
                          Binance
                        </div>
                        <div className="text-sm text-white/50 font-mono mt-1">
                          0x4a2f...8d1b
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-3">
                          Status
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.06] border border-white/[0.12]">
                          <span className="h-2 w-2 rounded-full bg-white" />
                          <span className="text-sm font-medium text-white">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-3">
                        Data Payload
                      </div>
                      <div className="p-4 font-mono text-xs rounded-lg border border-white/[0.08] bg-[#0a0a0a] text-white/80 leading-relaxed">
                        {`{ "pair": "BNB/USD", "price": 612.45, "timestamp": 1704067200 }`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature - Top Right */}
                <div className="relative md:col-span-6 p-8 md:p-10 border-b border-white/[0.08] min-h-[240px]">
                  <div className="relative">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-3">
                      Cryptographic Signature
                    </div>
                    <div className="font-mono text-xs text-white/60 break-all bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.08]">
                      0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c
                    </div>
                  </div>
                </div>

                {/* Merkle Proof - Bottom Right */}
                <div className="relative md:col-span-6 p-8 md:p-10 border-b border-white/[0.08] min-h-[240px]">
                  <div className="relative">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-3">
                      Merkle Proof Path
                    </div>
                    <div className="space-y-2.5 font-mono text-xs bg-[#0a0a0a] p-5 rounded-lg border border-white/[0.08]">
                      <div className="flex items-center gap-2.5 text-white/90">
                        <span className="text-white/50">L0</span>
                        <span>0x7f3e9a2b...</span>
                      </div>
                      <div className="ml-8 flex items-center gap-2.5 text-white/70">
                        <span className="text-white/40">L1</span>
                        <span>→ 0x2b4c8d1a...</span>
                      </div>
                      <div className="ml-16 flex items-center gap-2.5 text-white/70">
                        <span className="text-white/40">L2</span>
                        <span>→ 0x9e1f3c7b...</span>
                      </div>
                      <div className="ml-24 flex items-center gap-2.5 text-white/90">
                        <span className="text-white/50">Root</span>
                        <span>→ receiptsRoot</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions - Full Width Bottom */}
                <div className="relative md:col-span-12 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">
                      Export & Verify
                    </div>
                    <p className="text-sm text-white/70">
                      Download receipt data or view on blockchain explorer.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-[14px] font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200 border border-white/[0.12]">
                      <Download className="mr-2 h-4 w-4" />
                      Export JSON
                    </button>
                    <button className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-[14px] font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200 border border-white/[0.12]">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Explorer
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Verified Providers Section */}
      <section className="relative py-16 md:py-24 bg-black overflow-hidden">
        {/* subtle top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D0FF00]/60 to-transparent" />

        {/* background glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[820px] -translate-x-1/2 rounded-full bg-[#D0FF00]/10 blur-3xl" />

        {/* HEADER (still constrained for readability) */}
        <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D0FF00]" />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60">
              Verified Providers
            </span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Provider Directory
              </h2>
              <p className="mt-3 text-sm md:text-[15px] text-white/60 max-w-xl">
                Enterprise-grade data providers with on-chain receipts,
                Merkle-verifiable proofs and 99.9%+ uptime SLAs.
              </p>
            </div>

            <div className="mt-3 md:mt-0 text-xs md:text-sm text-white/50 flex flex-col items-start md:items-end gap-1">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#BDE70D]" />
                <span>Active & insured via RION</span>
              </span>
              <span className="text-white/40">
                Receipts → Merkle root → anchored on BNB Chain
              </span>
            </div>
          </div>
        </div>

        {/* FULL-BLEED TABLE WRAPPER */}
        <div className="relative mt-10 w-full border-y border-white/10 bg-black/80 backdrop-blur-sm">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 lg:px-10 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="col-span-4 lg:col-span-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Provider
            </div>
            <div className="col-span-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Address
            </div>
            <div className="col-span-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45 text-right">
              Total Receipts
            </div>
            <div className="col-span-3 lg:col-span-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45 text-right">
              Uptime / Status
            </div>
          </div>

          {/* Provider Rows – full width, no max-w */}
          {providers.map((provider, idx) => (
            <div
              key={provider.address}
              className={`group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center px-5 sm:px-6 lg:px-10 py-6 md:py-5 transition-colors duration-200 ${
                idx < providers.length - 1 ? "border-b border-white/[0.06]" : ""
              } hover:bg-white/[0.02]`}
            >
              {/* Provider Logo & Name */}
              <div className="col-span-1 md:col-span-4 lg:col-span-5 flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/90 group-hover:shadow-[0_0_32px_rgba(208,255,0,0.35)] transition-shadow">
                  <img
                    src={provider.src}
                    alt={`${provider.name} logo`}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <div>
                  <div className="font-semibold text-base text-white">
                    {provider.name}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    Oracle Data Provider
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-3">
                <div className="md:hidden text-[11px] text-white/40 mb-1 font-medium uppercase tracking-[0.16em]">
                  Address
                </div>
                <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-white/70 break-all">
                  <span className="hidden sm:inline">
                    {provider.address.slice(0, 6)}…{provider.address.slice(-4)}
                  </span>
                  <span className="sm:hidden">{provider.address}</span>
                </div>
              </div>

              {/* Receipts */}
              <div className="col-span-1 md:col-span-2 md:text-right">
                <div className="md:hidden text-[11px] text-white/40 mb-1 font-medium uppercase tracking-[0.16em]">
                  Total Receipts
                </div>
                <div className="text-lg font-semibold tabular-nums text-white">
                  {provider.receipts.toLocaleString()}
                </div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  Signed reports
                </div>
              </div>

              {/* Uptime & Status */}
              <div className="col-span-1 md:col-span-3 lg:col-span-2 md:text-right flex md:flex-col md:items-end items-start gap-3 md:gap-2">
                <div className="md:hidden text-[11px] text-white/40 mb-1 font-medium uppercase tracking-[0.16em]">
                  Uptime
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <span className="text-lg font-semibold tabular-nums text-white/90">
                    {provider.uptime}%
                  </span>
                  <span className="text-[11px] text-white/40">30d</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BDE70D] animate-[pulse_1.8s_ease-in-out_infinite]" />
                  <span className="text-xs font-medium text-white/80">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10 mt-6">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full border border-white/[0.16] flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#D0FF00]" />
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              All providers are continuously monitored. Every response can be
              tied back to a signed receipt, aggregated into a Merkle tree and
              anchored on-chain for trustless verification.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
