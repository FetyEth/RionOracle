"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const BRAND = "#D0FF00";
const STROKE = "#151517";

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function PredictionsShowcase() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  const slides = [
    "https://s.yimg.com/ny/api/res/1.2/CdA6DHi6qDQ8lcu.ZL6N3g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA7Y2Y9d2VicA--/https://media.zenfs.com/en/homerun/feed_manager_auto_publish_494/c591e2853e23e950ae96ce13648ee62f",
    "https://media.npr.org/assets/img/2018/10/30/rtx6h345-7b5021027ef002e3ba4a01cdf9617f1e2848a1bd.jpg",
    "https://www.rockstaracademy.com/lib/images/news/basketball.jpeg",
    "https://www.mercurynews.com/wp-content/uploads/2018/10/Warriors-Bulls-Basketball-4.jpg?w=620",
  ];

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mq.matches;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;

        const visibleTravel = r.height + vh;
        const start = vh * 0.1;
        const end = vh * 0.9;
        const p = clamp(
          1 - (r.bottom - start) / (visibleTravel - (start + (vh - end))),
          0,
          1
        );
        setProgress(reduced ? 0 : p);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const exact = progress * (slides.length - 1);
  const baseIndex = Math.floor(exact);
  const blend = exact - baseIndex;

  return (
    <section className="relative bg-black">
      {/* Header */}
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="px-5 md:px-10 pt-16 md:pt-20 pb-6">
          <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              NBA{" "}
              <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                Predictions
              </span>
            </span>
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              Market
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
            A fully functional prediction market powered by RION Oracle Network.
            Real NBA data, trustless betting, and automatic payouts on BNB
            Chain.
          </p>

          <div
            className="mt-10 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
            }}
          />
        </div>
      </div>

      {/* Scroll-driven image showcase */}
      <div className="relative">
        <div
          className="border-t p-6 md:p-10 mx-auto w-full max-w-[1280px]"
          style={{ borderColor: STROKE }}
        >
          <div className="relative w-full">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative h-fit">
                <div className="sticky top-[10vh]">
                  <div
                    ref={stageRef}
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#0E0E11] group"
                  >
                    {slides.map((src, i) => {
                      let o = 0;
                      if (i === baseIndex) o = 1 - blend;
                      else if (i === baseIndex + 1) o = blend;

                      return (
                        <div
                          key={src + i}
                          className="absolute inset-0 will-change-transform"
                          style={{
                            opacity: o,
                            transition: "opacity 120ms linear",
                            transform: `translate3d(0, ${(
                              (i - exact) *
                              6
                            ).toFixed(1)}px, 0)`,
                          }}
                        >
                          <img
                            src={src || "/placeholder.svg"}
                            alt={`NBA scene ${i + 1}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                            draggable={false}
                          />
                          <img
                            src={src || "/placeholder.svg"}
                            alt=""
                            aria-hidden
                            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                            style={{
                              filter:
                                "grayscale(100%) contrast(1.05) brightness(0.9)",
                            }}
                            draggable={false}
                          />
                        </div>
                      );
                    })}

                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_70%,rgba(0,0,0,0.45)_100%)]" />

                    {/* CTA overlay */}
                    <div className="absolute left-4 right-4 bottom-4">
                      <div
                        className="rounded-2xl p-5 backdrop-blur-md"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.10)",
                        }}
                      >
                        <div className="text-[16px] font-semibold text-white">
                          Live Production Demo
                        </div>
                        <div className="mt-1 font-mono text-[12px] text-white/75">
                          Real-time NBA odds • Auto resolution • BNB Testnet
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Link
                            href="/predictions"
                            className="inline-flex h-10 items-center rounded-xl px-5 text-[14px] font-semibold text-black transition-all duration-200 hover:scale-[1.02]"
                            style={{
                              backgroundColor: BRAND,
                            }}
                          >
                            Launch demo
                          </Link>
                          <Link
                            href="/docs"
                            className="inline-flex h-10 items-center rounded-xl px-5 text-[14px] font-medium text-white/90 transition-all duration-200 hover:bg-white/[0.12]"
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.15)",
                            }}
                          >
                            View docs
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Progress dots */}
                    <div className="absolute right-4 top-4 flex gap-2">
                      {slides.map((_, i) => {
                        const active =
                          i === baseIndex ||
                          (i === baseIndex + 1 && blend > 0.5);
                        return (
                          <span
                            key={i}
                            className="h-2 w-2 rounded-full transition-all"
                            style={{
                              background: active
                                ? BRAND
                                : "rgba(255,255,255,0.35)",
                              transform: active ? "scale(1.15)" : "scale(1)",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1280px]">
          <div
            className="border-t border-b"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  title: "Real-Time NBA Data",
                  subtitle: "The Odds API • Live updates",
                  description:
                    "Multiple bookmakers and betting markets with real-time odds delivered on-chain",
                },
                {
                  title: "Automatic Payouts",
                  subtitle: "Smart contracts • Trustless",
                  description:
                    "Bets resolve automatically when games end with instant token distribution",
                },
                {
                  title: "Open Source & Forkable",
                  subtitle: "MIT License • Full stack",
                  description:
                    "Clone and customize for any sport, election, or prediction outcome",
                },
              ].map((feature, i) => (
                <div
                  key={feature.title}
                  className="relative bg-black px-5 md:px-10 py-8 md:py-10 transition-colors duration-200 hover:bg-white/[0.02] group md:border-l first:border-l-0"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none">
                    <div
                      className="absolute top-0 left-0 w-3 h-px transition-all duration-300 group-hover:w-6"
                      style={{ backgroundColor: BRAND }}
                    />
                    <div
                      className="absolute top-0 left-0 w-px h-3 transition-all duration-300 group-hover:h-6"
                      style={{ backgroundColor: BRAND }}
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-[22px] font-bold text-white mb-2 leading-tight">
                      {feature.title}
                    </h3>
                    <p
                      className="font-mono text-[13px]"
                      style={{ color: BRAND }}
                    >
                      {feature.subtitle}
                    </p>
                  </div>

                  <p className="text-[15px] leading-relaxed text-white/70">
                    {feature.description}
                  </p>

                  <div className="relative mt-8 h-px">
                    <span className="absolute inset-0 rounded bg-white/10" />
                    <span
                      className="absolute inset-y-0 left-0 w-12 rounded transition-all duration-300 group-hover:w-20"
                      style={{ background: BRAND }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="border-t mx-auto w-full max-w-[1280px]"
          style={{ borderColor: STROKE }}
        >
          <div className="px-5 md:px-10 py-16 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="text-[28px] md:text-[32px] font-bold text-white leading-tight">
                Deploy Your Own Prediction Market
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-white/70">
                Fork the complete stack. Swap NBA for any sport, election, or
                outcome. Deploy to any EVM chain with smart contract templates
                included.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="https://github.com/rionoracle"
                  target="_blank"
                  className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-[15px] font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
                  style={{
                    backgroundColor: BRAND,
                  }}
                >
                  View on GitHub
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

                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-[15px] font-medium text-white/90 transition-colors duration-200 hover:bg-white/[0.10]"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                  }}
                >
                  Read Documentation
                </Link>

                <Link
                  href="/predictions"
                  className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-[15px] font-medium text-white/80 transition-colors duration-200 hover:text-white hover:bg-white/[0.05]"
                  style={{
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                  }}
                >
                  Try Live Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
