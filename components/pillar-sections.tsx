"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CopyButton } from "@/components/copy-button";

// ✅ Dynamically import your CodeBlock so SSR never renders the highlighter
const CodeBlock = dynamic(
  () => import("@/components/ui/code-block").then((m) => m.CodeBlock),
  {
    ssr: false,
    loading: () => (
      <div className="w-full border border-white/10 bg-[#0A0A0A] p-4">
        <div className="h-5 w-28 bg-zinc-800/60 mb-3 animate-pulse" />
        <div className="h-[220px] bg-zinc-900/60 animate-pulse" />
      </div>
    ),
  }
);

const BRAND = "#D0FF00";

/* ------------------------------- DATA ------------------------------- */

type Pillar = {
  id: string;
  title: string;
  subtitle: string;
  stat: string;
  statLabel: string;
  tagline: string;
  proof: {
    title: string;
    data: string;
    actions: { label: string; href: string }[];
  };
  demo: { title: string; description: string; href?: string };
  integrate: { solidity: string; sdk: string };
  cta: { label: string; href: string };
};

const PILLARS: Pillar[] = [
  {
    id: "prices",
    title: "Prices",
    subtitle: "DeFi Push",
    stat: "1.7s",
    statLabel: "p95 latency",
    tagline:
      "Hybrid price feeds with deviation/staleness guards, instant → final with insured disputes.",
    proof: {
      title: "Latest BNB/USD Round",
      data: "Round #12,847 • $962.89U.34 • 3/3 signers • Final",
      actions: [
        { label: "Verify in browser", href: "/lab?tab=verify" },
        { label: "Artifacts", href: "/explorer" },
      ],
    },
    demo: {
      title: "Deviation Trigger Simulator",
      description: "Slide a price, watch when a new round fires.",
      href: "/explorer",
    },
    integrate: {
      solidity: `// Staleness + deviation checks
uint256 price = registry.getPrice("BNB/USD");
require(price > 0, "stale");`,
      sdk: `const { price, fresh } = await rion.getPrice("BNB/USD");
await rion.verifySig(report);`,
    },
    cta: { label: "Add BNB/USD to my app", href: "/sdk" },
  },
  {
    id: "outcomes",
    title: "Outcomes",
    subtitle: "Prediction",
    stat: "24/7",
    statLabel: "Event coverage",
    tagline:
      "Evidence-backed results for sports/crypto/governance—challengeable with insurance on fault.",
    proof: {
      title: "Current Outcome",
      data: "BTC 1m close > $95k@12:05 — Final",
      actions: [
        { label: "View evidence", href: "/lab?tab=diff" },
        { label: "Sources bundle", href: "/explorer" },
      ],
    },
    demo: {
      title: "Dispute Viewer",
      description: "Hourly scripted 'bad round' → slash + payout tx.",
      href: "/disputes",
    },
    integrate: {
      solidity: `// Event schema + settle market
bytes32 outcome = registry.getOutcome(eventId);
market.settle(outcome);`,
      sdk: `const outcome = await rion.getOutcome(eventId);
const evidence = await rion.getEvidence(outcome);`,
    },
    cta: { label: "Create an outcome feed", href: "/sdk" },
  },
  {
    id: "por",
    title: "Proof-of-Reserve",
    subtitle: "PoR",
    stat: "42",
    statLabel: "Wallets tracked",
    tagline:
      "Multi-venue wallet snapshots notarized on-chain; Merkle-verifiable by anyone.",
    proof: {
      title: "Verify PoR Root",
      data: "Custody set A — Root Qm7x... — 42 wallets",
      actions: [{ label: "Show inclusion", href: "/por" }],
    },
    demo: {
      title: "Inclusion Verifier",
      description:
        "Paste wallet → see inclusion path. Edit address → watch it fail.",
      // href: "/lab?tab=merkle",
    },
    integrate: {
      solidity: `// Verify PoR snapshot
bytes32 root = registry.getPorRoot(setId);
require(verifyMerkle(wallet, proof, root));`,
      sdk: `const por = await rion.getPoR(setId);
const proof = await rion.getInclusionProof(wallet);`,
    },
    cta: { label: "Register my PoR set", href: "/sdk" },
  },
  {
    id: "agents",
    title: "Agents / x402",
    subtitle: "Pull",
    stat: "$0.001",
    statLabel: "Per request",
    tagline:
      "Pay-per-request signed reports for agents—receipts or it didn't happen.",
    proof: {
      title: "Receipt Verification",
      data: "Funding rate (paid) — Receipt ✓ — Provider signed",
      actions: [
        { label: "Verify receipt", href: "/lab?tab=receipts" },
        { label: "Provider directory", href: "/receipts" },
      ],
    },
    demo: {
      title: "In-Browser Playground",
      description:
        "getPrice('BNB/USD', { pull: true }) → verifySig → assertFresh",
      href: "/explorer",
    },
    integrate: {
      solidity: `// Verify receipt on-chain
bytes32 receiptHash = keccak256(receipt);
require(store.verifyReceipt(receiptHash));`,
      sdk: `const report = await rion.pullPrice("BNB/USD");
const receipt = await rion.verifyReceipt(report);`,
    },
    cta: { label: "Pull a signed report", href: "/sdk" },
  },
  {
    id: "attestations",
    title: "Attestations",
    subtitle: "Attention / Games",
    stat: "#281",
    statLabel: "Latest batch",
    tagline: "zk/minimized summaries for fair rewards without PII.",
    proof: {
      title: "PoA Batch Summary",
      data: "Batch #281 — zk-summary — Hash chain verified",
      actions: [{ label: "Hash chain", href: "/explorer" }],
    },
    demo: {
      title: "Anti-Fraud Simulator",
      description:
        "Flip on anti-fraud checks → see how noisy viewers are filtered.",
    },
    integrate: {
      solidity: `// Mint rewards off PoA signals
bytes32 summary = registry.getPoA(batchId);
rewardContract.mint(user, summary);`,
      sdk: `const poa = await rion.getPoA(batchId);
const verified = await rion.verifyPoA(poa);`,
    },
    cta: { label: "Use PoA for rewards", href: "/sdk" },
  },
  {
    id: "rwa",
    title: "RWA / DePIN",
    subtitle: "Real World Assets",
    stat: "$1.02",
    statLabel: "Basket NAV",
    tagline:
      "Basket NAVs, FX/commodity refs, device/work proofs with receipts.",
    proof: {
      title: "Example NAV Round",
      data: "RWA basket NAV — $1.02 — Stale 0.0%",
      actions: [
        { label: "Inspect sources", href: "/explorer" },
        { label: "Receipts", href: "/receipts" },
      ],
    },
    demo: {
      title: "Composite Index Builder",
      description: "Register a composite index or device feed.",
    },
    integrate: {
      solidity: `// Get RWA basket NAV
uint256 nav = registry.getRWA(basketId);
require(nav > 0, "stale");`,
      sdk: `const rwa = await rion.getRWA(basketId);
const sources = await rion.getSources(rwa);`,
    },
    cta: { label: "Launch an RWA/DePIN feed", href: "/sdk" },
  },
];

/* --------------------------- COMPONENT --------------------------- */

export function PillarSections() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PILLARS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PILLARS.length - 1 ? 0 : prev + 1));
  };

  const pillar = PILLARS[currentIndex];

  return (
    <section
      className="relative px-0 md:px-0 py-16 md:py-24 overflow-hidden md:pt-[293px] pb-0 md:pb-0"
      style={{ backgroundColor: "#000" }}
    >
      {/* full-bleed bg video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-[140px] md:top-[-180px]  w-full min-w-screen md:h-svw"
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

      {/* edge decorations */}
      <GridCorner position="tl" />
      <GridCorner position="tr" />

      {/* FULL-WIDTH CONTAINER */}
      <div className="relative mx-auto w-full max-w-none">
        {/* header row */}
        <div className="mb-10 md:mb-12 flex items-center justify-between mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all"
              aria-label="Previous pillar"
            >
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all"
              aria-label="Next pillar"
            >
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* dots */}
          <div className="flex items-center gap-2">
            {PILLARS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-[#D0FF00]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to ${PILLARS[index].title}`}
              />
            ))}
          </div>
        </div>

        {/* section content */}
        <div key={pillar.id} id={pillar.id} className="relative">
          <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
            <header className="mb-6 md:mb-8">
              <div className="mb-3">
                <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                  {pillar.title}
                </h2>
                <p className="text-white/50 text-xs md:text-sm font-medium mt-2 tracking-wide uppercase">
                  {pillar.subtitle}
                </p>
              </div>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-4xl">
                {pillar.tagline}
              </p>
            </header>
          </div>
        </div>

        {/* FULL-WIDTH GRID (edge-to-edge) */}
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 border-y border-white/10 bg-black">
            {/* STAT (TALL) */}
            <ConnectedCard className="relative md:col-span-4 md:row-span-2 min-h-[360px] p-10 border-b md:border-b md:border-r border-white/[0.08]">
              <div
                className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: BRAND }}
              />
              <div className="relative">
                <div
                  className="text-[11px] font-bold uppercase tracking-widest mb-5"
                  style={{ color: BRAND }}
                >
                  {pillar.statLabel}
                </div>
                <div className="text-[min(18vw,8rem)] md:text-[8rem] font-black leading-none tracking-tighter mb-6 text-white">
                  {pillar.stat}
                </div>
                <Link
                  href={pillar.cta.href}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium group"
                >
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  Details
                </Link>
              </div>
            </ConnectedCard>

            {/* PROOF */}
            <ConnectedCard className="md:col-span-4 min-h-[180px] p-8 border-b md:border-r border-white/[0.08]">
              <h3
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ color: BRAND }}
              >
                Proof
              </h3>
              <p className="font-mono text-sm text-white/80 mb-4 leading-relaxed">
                {pillar.proof.data}
              </p>
              <div className="space-y-2">
                {pillar.proof.actions.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="block text-xs text-white/50 hover:text-white transition-colors font-medium"
                  >
                    → {a.label}
                  </Link>
                ))}
              </div>
            </ConnectedCard>

            {/* DEMO */}
            <ConnectedCard className="md:col-span-4 min-h-[180px] p-8 border-b border-white/[0.08]">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-4">
                Demo
              </h3>
              <p className="font-semibold text-xl text-white mb-2">
                {pillar.demo.title}
              </p>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                {pillar.demo.description}
              </p>
              {pillar.demo.href && (
                <Link
                  href={pillar.demo.href}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium group"
                >
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M8 5v14l11-7L8 5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Try Demo
                </Link>
              )}
            </ConnectedCard>

            {/* CODE (WIDE) */}
            <ConnectedCard className="md:col-span-8 p-7 border-b border-white/[0.08]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                  Developer
                </h3>
                <CopyButton
                  text={`${pillar.integrate.solidity}\n\n// ---\n${pillar.integrate.sdk}`}
                />
              </div>
              <CodeBlock
                language="solidity"
                filename={`${pillar.id}.sol / ${pillar.id}.ts`}
                tabs={[
                  {
                    name: "Solidity",
                    code: pillar.integrate.solidity,
                    language: "solidity",
                    highlightLines: [1, 2],
                  },
                  {
                    name: "TypeScript",
                    code: pillar.integrate.sdk,
                    language: "tsx",
                    highlightLines: [1, 2, 3],
                  },
                ]}
              />
            </ConnectedCard>

            {/* CTA (FULL ROW) */}
            <ConnectedCard className="md:col-span-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 p-7">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">
                  Get Started
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {pillar.cta.label}
                </p>
              </div>
              <Link
                href={pillar.cta.href}
                className="inline-flex h-12 items-center justify-center rounded-full text-black font-semibold text-sm hover:scale-[1.02] transition-transform px-7 whitespace-nowrap"
                style={{ backgroundColor: BRAND }}
              >
                Start Building
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 12h10M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </ConnectedCard>
          </div>
        </div>
      </div>

      <GridCorner position="bl" />
      <GridCorner position="br" />
    </section>
  );
}

/* ------------------------- tiny presentational bits ------------------------- */

/** inside-box “L” corner */
function CornerInBox({
  size = 64,
  thickness = 4,
  color = "rgba(255,255,255,0.12)",
  className = "",
}: {
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`absolute ${className}`}
      aria-hidden
    >
      <path
        d={`M0 ${thickness / 2} H ${size}`}
        stroke={color}
        strokeWidth={thickness}
      />
      <path
        d={`${thickness / 2} 0 V ${size}`}
        stroke={color}
        strokeWidth={thickness}
      />
    </svg>
  );
}

function ConnectedCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative bg-black ${className}`}>
      {/* subtle inner corner accent */}
      <CornerInBox
        size={72}
        thickness={4}
        color="rgba(208,255,0,0.16)" // BRAND-tinted
        className="top-6 left-6"
      />
      {children}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black p-5 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function GridCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos =
    position === "tl"
      ? "top-0 left-0"
      : position === "tr"
      ? "top-0 right-0"
      : position === "bl"
      ? "bottom-0 left-0"
      : "bottom-0 right-0";
  const id = `dots-${position}`;
  return (
    <div className={`pointer-events-none absolute ${pos} h-64 w-64 opacity-30`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
