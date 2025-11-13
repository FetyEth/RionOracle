"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Pillar = {
  title: string;
  metric: string;
  buttons: string[];
  href: string;
  slug: string;
  image?: string;
  tags?: string[];
};

const BRAND = "#D0FF00";
const STROKE = "#151517";

/* data (unchanged) */
const PILLARS: Pillar[] = [
  {
    title: "Prices (DeFi Push)",
    metric: "BNB/USD • p95 1.7s • Final",
    buttons: ["Verify round", "Download .rion"],
    href: "#prices",
    slug: "prices",
    image: "/img-1.jpg",
    tags: ["DeFi", "DEX"],
  },
  {
    title: "Outcomes (Prediction)",
    metric: "BTC 1m close > X@12:05 — Final",
    buttons: ["See evidence", "Replay dispute"],
    href: "#outcomes",
    slug: "outcomes",
    image: "/img-2.jpg",
    tags: ["Predictions"],
  },
  {
    title: "Proof-of-Reserve (PoR)",
    metric: "Custody set A — Root Qm…",
    buttons: ["Verify Merkle", "View wallets"],
    href: "#por",
    slug: "merkle",
    image: "/img-3.jpg",
    tags: ["Custody"],
  },
  {
    title: "Agents / x402 (Pull)",
    metric: "Funding rate (paid) — Receipt",
    buttons: ["Verify receipt", "Pull signed report"],
    href: "#agents",
    slug: "receipts",
    image: "/img-4.webp",
    tags: ["Agents"],
  },
  {
    title: "Attestations (Attention / Games)",
    metric: "PoA batch #281 — zk-summary",
    buttons: ["View summary", "How to use"],
    href: "#attestations",
    slug: "attestations",
    image: "/img-5.png",
    tags: ["Games"],
  },
  {
    title: "RWA / DePIN",
    metric: "RWA basket NAV — Stale 0.0%",
    buttons: ["Inspect sources", "Integrate"],
    href: "#rwa",
    slug: "rwa",
    image: "/img-6.webp",
    tags: ["RWA", "DePIN"],
  },
];

/* helpers */
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* tighter values */
const SCRUB_VH = 73; // total scroll distance
const STICKY_VH = 70; // visible hero height

export default function HeroMultiPillar() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [reduced, setReduced] = useState(false);

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

  return (
    <section
      className="relative px-3 pb-12 bg-black" /* was pb-16 */
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
        {/* HERO */}
        <div ref={containerRef} className="relative overflow-hidden">
          <div style={{ height: `calc(${SCRUB_VH}vh)` }}>
            <div
              className="sticky top-0 overflow-hidden"
              style={{ height: `calc(${STICKY_VH}vh)` }}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="/testnew.mp4"
                poster="/hero-poster.webp"
                muted
                playsInline
                style={{ objectPosition: "50% 0%" }} // was "50% 75%"
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
              {/* TEXT + CTA (always visible) */}
              {/* TEXT + CTA (left on lg+, centered on mobile) */}
              {/* TEXT + CTAs */}
              <div
                className="
    relative z-20 mx-auto h-full max-w-6xl
    px-5 md:px-10
    flex flex-col justify-center items-start
    text-left
    pt-16 md:pt-20
    overflow-visible        /* make sure glyphs can extend slightly */
  "
              >
                <h1
                  className="
    font-extrabold tracking-tight text-left
    overflow-visible                        /* ensure no self-clipping */
  "
                >
                  {/* line 1 — more generous leading + bottom margin */}
                  <span
                    className="
      block
      text-[clamp(2.2rem,9vw,5.2rem)]
      leading-[1.22]                        /* <- was ~1.05/1.08 */
      mb-[0.18em]                           /* room for descenders */
      bg-gradient-to-r from-[#D0FF00] via-[#E9FF8F] to-white
      bg-clip-text text-transparent
      [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]
    "
                  >
                    All signals.
                  </span>

                  {/* line 2 — normal leading */}
                  <span
                    className="
      block
      text-white
      text-[clamp(2.2rem,9vw,5.2rem)]
      leading-[1.12]
    "
                  >
                    One oracle.{" "}
                    <span className="text-white/95">No excuses.</span>
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-[15px] md:text-base leading-relaxed text-white/85">
                  Prices, outcomes, reserves, predictions and agent data that
                  prove themselves on BNB and beyond. Committee-signed,
                  receipts-native, and insured.
                </p>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  <Link
                    href="/explorer"
                    className="
        group inline-flex h-11 items-center justify-center rounded-full
        px-6 text-[15px] font-medium text-black
        transition-[transform,box-shadow,background-color] duration-200
        focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/60
      "
                    style={{
                      backgroundColor: "var(--brand)",
                      boxShadow:
                        "0 8px 24px rgba(208,255,0,0.16), 0 2px 8px rgba(208,255,0,0.18)",
                    }}
                  >
                    <span>Launch Explorer</span>
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
                  </Link>

                  <Link
                    href="/lab"
                    className="
        group inline-flex h-11 items-center justify-center rounded-full
        px-6 text-[15px] font-medium text-white/90
        transition-colors duration-200
        backdrop-blur-[6px]
      "
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                    }}
                  >
                    <span>Open Proof Lab</span>
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
                  </Link>

                  <Link
                    href="/sdk"
                    className="
        inline-flex h-11 items-center justify-center rounded-full
        px-6 text-[15px] font-medium
        text-white/80 hover:text-white
        transition-colors duration-200
      "
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                    }}
                  >
                    Install SDK
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* removed the old spacer div */}
        </div>

        {/* GRID — pulled up to kiss the hero */}
        <div
          className="-mt-6 md:-mt-8 rounded-b-[2rem] md:rounded-b-[2.5rem]" /* key: negative margin */
          style={{
            background: "var(--bg-surface)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <div className="flex flex-wrap">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="group basis-full md:basis-1/2 lg:basis-1/3 border-t p-5 md:p-6 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02] focus-within:bg-white/[0.03]"
                style={{ borderColor: "var(--stroke)" }}
              >
                <style jsx>{`
                  @media (min-width: 1024px) {
                    .group:not(:nth-child(3n + 1)) {
                      border-left: 1px solid ${STROKE};
                    }
                  }
                `}</style>

                {p.image && (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={p.title}
                      className="block w-full h-auto object-cover aspect-[16/9] select-none grayscale transition-[filter] duration-500 ease-in-out group-hover:grayscale-0"
                      draggable={false}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 85%)",
                      }}
                    />
                    {p.tags?.length ? (
                      <div className="absolute left-3 top-3 flex gap-2">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full px-2.5 py-1 text-[10.5px] font-medium text-white/90 bg-black/45 ring-1 ring-white/10 backdrop-blur-[2px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

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
                          {p.title}
                        </div>
                        <div className="mt-1 font-mono text-[11.5px] text-white/75">
                          {p.metric}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 relative h-px">
                  <span className="absolute inset-0 rounded bg-white/10" />
                  <span
                    className="absolute inset-y-0 left-0 w-0 rounded transition-all duration-300 group-hover:w-3/5 group-focus-within:w-3/5"
                    style={{ background: "var(--brand)" }}
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
