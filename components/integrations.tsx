"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const BRAND = "#D0FF00";

const resources = [
  {
    title: "SDK Documentation",
    description:
      "Complete API reference and integration guides for TypeScript, Python, and Solidity.",
    link: "/sdk",
  },
  {
    title: "Smart Contract Examples",
    description:
      "Production-ready contract templates for common DeFi use cases.",
    link: "contracts",
  },
  {
    title: "Quick Start Guide",
    description:
      "Get your first oracle integration running in under 5 minutes.",
    link: "/docs",
  },
];

export function Integrations() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-black">
      {/* Grid corner decorations */}
      <GridCorner position="tl" />
      <GridCorner position="tr" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Start{" "}
            <span className="gradient-text" style={{ color: BRAND }}>
              Building
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl text-balance">
            Everything you need to integrate RION into your protocol.
          </p>
        </div>

        {/* Connected grid layout */}
        <div className="relative w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 border-y border-white/[0.08] bg-black">
            {/* Resource cards - 3 columns on desktop */}
            {resources.map((resource, index) => (
              <ConnectedCard
                key={index}
                className={`md:col-span-4 min-h-[240px] p-8 border-b md:border-b-0 ${
                  index < resources.length - 1 ? "md:border-r" : ""
                } border-white/[0.08]`}
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {resource.title}
                </h3>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">
                  {resource.description}
                </p>
                <Link
                  href={resource.link}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium group"
                >
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 12h10M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Learn More
                </Link>
              </ConnectedCard>
            ))}

            {/* CTA section - full width row */}
            <ConnectedCard className="md:col-span-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 border-t border-white/[0.08]">
              <div className="flex-1">
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: BRAND }}
                >
                  Ready to Integrate?
                </h3>
                <p className="text-white/70 text-base leading-relaxed max-w-2xl">
                  Join the growing ecosystem of protocols building on RION. Get
                  started today with our comprehensive SDK and documentation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full text-black font-semibold hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: BRAND }}
                  asChild
                >
                  <Link href="/docs">View Documentation</Link>
                </Button>
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
  size = 72,
  thickness = 4,
  color = "rgba(208,255,0,0.16)",
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

function GridCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos =
    position === "tl"
      ? "top-0 left-0"
      : position === "tr"
      ? "top-0 right-0"
      : position === "bl"
      ? "bottom-0 left-0"
      : "bottom-0 right-0";
  const id = `integrations-dots-${position}`;
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
