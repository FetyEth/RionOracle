"use client";

import { useEffect, useRef } from "react";

const BRAND = "#D0FF00";

type Step = {
  title: string;
  description: string;
  highlight?: string;
};

const STEPS: Step[] = [
  {
    title: "Alpha aggregators collect data",
    description:
      "Independent aggregators fetch from exchanges/APIs and sign their reports with private keys.",
    highlight: "Real-time data collection",
  },
  {
    title: "Committee signs aggregate",
    description:
      "BLS threshold signatures compress individual reports into a single, verifiable aggregate (2/3+).",
    highlight: "Threshold signatures",
  },
  {
    title: "On-chain verification",
    description:
      "Contracts verify signatures and persist Merkle roots so every consumer query is fresh and provable.",
    highlight: "Cryptographic proof",
  },
  {
    title: "Continuous monitoring",
    description:
      "Challengers watch anomalies; Notaries audit. Disputes trigger DAO votes and insured payouts.",
    highlight: "24/7 security",
  },
];

export function HowItWorks() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (m.matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--gx", `${x * 24}px`);
      el.style.setProperty("--gy", `${y * 18}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative bg-black py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
            Provable Architecture
          </div>

          <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              How{" "}
              <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                RION
              </span>{" "}
              works
            </span>
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              end-to-end
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            A clean four-step flow: independent operators → threshold-signed
            aggregate → on-chain verification → continuous monitoring with
            insured dispute resolution.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={stageRef}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.08]"
          // @ts-ignore
          style={{ "--gx": "0px", "--gy": "0px" }}
        >
          {/* ambient brand glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-40 opacity-[0.12]"
            style={{
              background: `radial-gradient(55% 40% at calc(50% + var(--gx)) calc(50% + var(--gy)), ${BRAND}2b 0%, transparent 65%)`,
              filter: "blur(48px)",
            }}
          />

          {/* Step 1 - Large panel (spans 2 columns) */}
          <div className="relative md:col-span-2 bg-black p-6 md:p-8">
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-12 h-12">
              <div className="absolute top-0 left-0 w-3 h-[1px] bg-[#D0FF00]" />
              <div className="absolute top-0 left-0 w-[1px] h-3 bg-[#D0FF00]" />
            </div>

            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[13px] font-mono text-[#D0FF00]">
                STEP 01
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#D0FF00]/10 text-[#D0FF00] font-medium">
                {STEPS[0].highlight}
              </span>
            </div>

            <h3 className="text-[22px] md:text-[26px] font-bold text-white mb-3">
              {STEPS[0].title}
            </h3>

            <p className="text-[14px] md:text-[15px] leading-relaxed text-white/70 max-w-[65ch]">
              {STEPS[0].description}
            </p>

            {/* Bottom right corner accent */}
            <div className="absolute bottom-0 right-0 w-12 h-12">
              <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-white/10" />
              <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-white/10" />
            </div>
          </div>

          {/* Step 2 - Tall panel (spans 2 rows) */}
          <div className="relative md:row-span-2 bg-black p-6 md:p-8">
            <div className="absolute top-0 right-0 w-12 h-12">
              <div className="absolute top-0 right-0 w-3 h-[1px] bg-[#D0FF00]" />
              <div className="absolute top-0 right-0 w-[1px] h-3 bg-[#D0FF00]" />
            </div>

            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[13px] font-mono text-[#D0FF00]">
                STEP 02
              </span>
            </div>

            <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-3">
              {STEPS[1].title}
            </h3>

            <p className="text-[14px] leading-relaxed text-white/70">
              {STEPS[1].description}
            </p>

            <div className="mt-6 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <div className="text-[11px] text-white/40 mb-1">
                Signature type
              </div>
              <div className="text-[13px] text-[#D0FF00] font-mono">
                {STEPS[1].highlight}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-12 h-12">
              <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-white/10" />
              <div className="absolute bottom-0 left-0 w-[1px] h-3 bg-white/10" />
            </div>
          </div>

          {/* Step 3 - Regular panel */}
          <div className="relative bg-black p-6 md:p-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[13px] font-mono text-[#D0FF00]">
                STEP 03
              </span>
            </div>

            <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-3">
              {STEPS[2].title}
            </h3>

            <p className="text-[14px] leading-relaxed text-white/70">
              {STEPS[2].description}
            </p>

            <div className="mt-4 text-[12px] text-[#D0FF00]/80 font-medium">
              ✓ {STEPS[2].highlight}
            </div>
          </div>

          {/* Step 4 - Regular panel */}
          <div className="relative bg-black p-6 md:p-8">
            <div className="absolute top-0 left-0 w-12 h-12">
              <div className="absolute top-0 left-0 w-3 h-[1px] bg-white/10" />
              <div className="absolute top-0 left-0 w-[1px] h-3 bg-white/10" />
            </div>

            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[13px] font-mono text-[#D0FF00]">
                STEP 04
              </span>
            </div>

            <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-3">
              {STEPS[3].title}
            </h3>

            <p className="text-[14px] leading-relaxed text-white/70">
              {STEPS[3].description}
            </p>

            <div className="mt-4 text-[12px] text-[#D0FF00]/80 font-medium">
              → {STEPS[3].highlight}
            </div>

            <div className="absolute bottom-0 right-0 w-12 h-12">
              <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-[#D0FF00]" />
              <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-[#D0FF00]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
