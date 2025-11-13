"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const BRAND = "#D0FF00";

type Feature = { title: string; description: string };

export function WhyRion() {
  const features: Feature[] = [
    {
      title: "All-terrain coverage",
      description:
        "Prices, outcomes, proof-of-reserve, agent/pull data—everything you need in one oracle network.",
    },
    {
      title: "Provable provenance",
      description:
        "On-chain HTTP-402 receipts for paywalled sources. Every data point is traceable and verifiable.",
    },
    {
      title: "Instant → final",
      description:
        "Challenge window, public disputes, and insurance that actually pays users—not just slashing.",
    },
    {
      title: "Two delivery modes",
      description:
        "Push for DeFi protocols, Pull for AI agents—both fully verifiable with committee signatures.",
    },
  ];

  // tiny ambient glow that follows the mouse (disabled with reduced-motion)
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
    <section className="relative px-3 bg-black">
      {/* no background panel; just content constrained to hero width */}
      <div
        ref={stageRef}
        className="relative mx-auto w-full max-w-[1280px]"
        // @ts-ignore
        style={{ "--gx": "0px", "--gy": "0px" }}
      >
        {/* subtle ambient brand glow (very faint) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-40 opacity-[0.12]"
          style={{
            background: `radial-gradient(55% 40% at calc(18% + var(--gx)) calc(8% + var(--gy)), ${BRAND}2b 0%, transparent 65%)`,
            filter: "blur(48px)",
          }}
        />

        {/* header */}
        <div className="relative z-10 px-5 md:px-10">
          <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
            RION Serverless Oracle
          </div>

          <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              Made for{" "}
              <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                hyperscaling
              </span>{" "}
              AI
            </span>
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              powered products
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
            High-performance, receipt-native oracle data for DeFi, games, and
            agents. Push or Pull, instant→final, with public disputes and real
            insurance. Bring your code; we’ll prove the rest.
          </p>

          <Link
            href="/explorer"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-white/90 hover:text-white"
          >
            Get started in seconds
            <svg
              className="h-4 w-4 translate-x-0 transition-transform hover:translate-x-0.5"
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
          </Link>

          {/* hairline */}
          <div
            className="mt-10 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
            }}
          />
        </div>

        {/* FEATURE RAIL — borderless rows w/ big numbers */}
        <div className="relative z-10 px-5 md:px-10 pb-16 md:pb-20">
          <ul className="mt-6 grid gap-2 md:grid-cols-2">
            {features.map((f, i) => (
              <li key={f.title} className="relative">
                {/* row */}
                <div className="group relative overflow-visible rounded-xl py-6 md:py-7 pl-0 pr-0 md:pl-2 md:pr-2">
                  {/* faint separator (top), skip for first row in each column */}
                  {i >= 2 && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-white/8" />
                  )}

                  {/* hover glow (no card, sits under text) */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(60% 40% at 30% 40%, rgba(208,255,0,0.14) 0%, transparent 70%)",
                      filter: "blur(24px)",
                    }}
                  />

                  {/* BIG, translucent corner number (01, 02, …) */}
                  <span className="select-none pointer-events-none absolute -top-2 -right-1 text-7xl md:text-8xl font-black leading-none tracking-tighter text-white/[0.06]">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>

                  {/* content */}
                  <div className="pr-6">
                    <h3 className="text-[17px] md:text-[18px] font-semibold text-white">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] md:text-[14px] leading-relaxed text-white/70 max-w-[48ch]">
                      {f.description}
                    </p>

                    {/* brand underline that grows on hover */}
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
  );
}
