"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type React from "react";

const BRAND = "#D0FF00";

export function CTASection() {
  return (
    <section className="relative bg-black py-0">
      {/* Grid corners decoration */}
      <GridCorner position="tl" />
      <GridCorner position="tr" />

      {/* FULL-WIDTH CONTAINER */}
      <div className="relative mx-auto w-full max-w-none">
        {/* Header section with max-width */}
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 py-16 md:py-20">
          <div className="mb-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm mb-6">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ backgroundColor: BRAND }}
              />
              Ready to Ship
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Start Building
            </h2>
            <p className="text-white/50 text-xs md:text-sm font-medium mt-2 tracking-wide uppercase">
              Developer Resources
            </p>
          </div>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl">
            Deploy trustless oracle infrastructure in minutes. Get insured price
            feeds, prediction markets, and proof-of-reserve with a single SDK on
            BNB Chain.
          </p>
        </div>

        {/* FULL-WIDTH GRID (edge-to-edge) */}
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 border-y border-white/[0.08] bg-black">
            {/* PRIMARY CTA (LEFT SIDE) */}
            <ConnectedCard className="relative md:row-span-2 min-h-[400px] p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/[0.08]">
              <div
                className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: BRAND }}
              />
              <div className="relative flex flex-col justify-between h-full">
                <div>
                  <div
                    className="text-[11px] font-bold uppercase tracking-widest mb-5"
                    style={{ color: BRAND }}
                  >
                    Quick Start
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Build with RION Oracle
                  </h3>
                  <p className="text-white/70 text-base leading-relaxed mb-8">
                    Access real-time price feeds, prediction markets, and
                    proof-of-reserve data with our developer-friendly SDK.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/sdk"
                    className="inline-flex items-center justify-center h-12 rounded-full text-black font-semibold text-sm hover:scale-[1.02] transition-transform px-7 w-full"
                    style={{ backgroundColor: BRAND }}
                  >
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center justify-center h-12 rounded-full border border-white/20 text-white/90 font-medium text-sm hover:bg-white/5 transition-colors px-7 w-full"
                  >
                    View Documentation
                  </Link>
                </div>
              </div>
            </ConnectedCard>

            {/* FEATURE - Simple Integration */}
            <ConnectedCard className="min-h-[200px] p-8 md:p-10 border-b border-white/[0.08]">
              <h3 className="font-semibold text-xl md:text-2xl text-white mb-3">
                Simple Integration
              </h3>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                One SDK for prices, predictions, PoR, and attestations
              </p>
            </ConnectedCard>

            {/* FEATURE - Battle Tested */}
            <ConnectedCard className="min-h-[200px] p-8 md:p-10 border-b border-white/[0.08]">
              <h3 className="font-semibold text-xl md:text-2xl text-white mb-3">
                Battle Tested
              </h3>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                1.2M+ rounds delivered with 99.98% uptime
              </p>
            </ConnectedCard>

            {/* FEATURE - Documentation */}
            <ConnectedCard className="min-h-[200px] p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/[0.08]">
              <h3 className="font-semibold text-xl md:text-2xl text-white mb-3">
                Full Documentation
              </h3>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                Examples, tutorials, and comprehensive API references
              </p>
            </ConnectedCard>

            {/* FEATURE - Fast Performance */}
            <ConnectedCard className="min-h-[200px] p-8 md:p-10">
              <h3 className="font-semibold text-xl md:text-2xl text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                1.7s p95 latency with instant to final confirmation
              </p>
            </ConnectedCard>
          </div>

          {/* SECONDARY CTA (FULL WIDTH BOTTOM ROW) */}
          <div className="border-b border-white/[0.08]">
            <ConnectedCard className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 p-7 md:p-10">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  Join our developer community or explore the interactive
                  playground
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* <Link
                  href="/playground"
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
                  Try Playground
                </Link> */}
                <Link
                  href="/sdk"
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
                  View Docs
                </Link>
              </div>
            </ConnectedCard>
          </div>
        </div>
      </div>

      <GridCorner position="bl" />
      <GridCorner position="br" />
    </section>
  );
}

/* ------------------------- Helper Components ------------------------- */

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
        color="rgba(208,255,0,0.16)"
        className="top-6 left-6"
      />
      {children}
    </div>
  );
}

export function GridCorner({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const pos =
    position === "tl"
      ? "top-0 left-0"
      : position === "tr"
      ? "top-0 right-0"
      : position === "bl"
      ? "bottom-0 left-0"
      : "bottom-0 right-0";
  const id = `dots-cta-${position}`;
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
