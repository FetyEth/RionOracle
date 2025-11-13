"use client";

import type React from "react";
import { Navigation } from "@/components/navigation";
import { Shield, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Footer } from "@/components/footer";

const BRAND = "#D0FF00";
const STROKE = "#151517";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const SCRUB_VH = 73;
const STICKY_VH = 70;

export default function ProofOfReservePage() {
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
    <div className="min-h-screen bg-black overflow-x-clip">
      <Navigation />

      {/* Hero Video Section */}
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
          <div ref={containerRef} className="relative overflow-hidden">
            <div style={{ height: `calc(${SCRUB_VH}vh)` }}>
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
                  autoPlay
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 85%), linear-gradient(180deg, rgba(0,0,0,0.00) 45%, rgba(0,0,0,0.75) 100%)",
                  }}
                />

                <div className="relative z-20 mx-auto h-full max-w-6xl px-5 md:px-10 flex flex-col justify-center items-start text-left pt-16 md:pt-20 overflow-visible">
                  <h1 className="font-extrabold tracking-tight text-left overflow-visible">
                    <span className="block text-[clamp(2.2rem,9vw,5.2rem)] leading-[1.22] mb-[0.18em] bg-gradient-to-r from-[#D0FF00] via-[#E9FF8F] to-white bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                      All custody.
                    </span>
                    <span className="block text-white text-[clamp(2.2rem,9vw,5.2rem)] leading-[1.12]">
                      One oracle.{" "}
                      <span className="text-white/95">No excuses.</span>
                    </span>
                  </h1>

                  <p className="mt-5 max-w-2xl text-[15px] md:text-base leading-relaxed text-white/85">
                    Multi-venue wallet snapshots notarized on-chain;
                    Merkle-verifiable by anyone. Committee-signed and
                    receipts-native for BNB—and beyond.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2.5">
                    <Link
                      href="/explorer"
                      className="group inline-flex h-11 items-center justify-center rounded-full px-6 text-[15px] font-medium text-black transition-[transform,box-shadow,background-color] duration-200 focus:outline-none focus:ring-2 focus:ring-[#D0FF00]/60"
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
                      className="group inline-flex h-11 items-center justify-center rounded-full px-6 text-[15px] font-medium text-white/90 transition-colors duration-200 backdrop-blur-[6px]"
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
                      className="inline-flex h-11 items-center justify-center rounded-full px-6 text-[15px] font-medium text-white/80 hover:text-white transition-colors duration-200"
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
          </div>

          {/* Custody Cards */}
          <div
            className="-mt-6 md:-mt-8 rounded-b-[2rem] md:rounded-b-[2.5rem]"
            style={{
              background: "var(--bg-surface)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div className="flex flex-wrap">
              <div
                className="group basis-full md:basis-1/2 border-t p-5 md:p-6 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02] focus-within:bg-white/[0.03]"
                style={{ borderColor: "var(--stroke)" }}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://chutes.ai/images/hyperscale/decentralised.jpg"
                    alt="Custody Coverage"
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
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[10.5px] font-medium text-white/90 bg-black/45 ring-1 ring-white/10 backdrop-blur-[2px]">
                      Custody
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
                        Custody Coverage
                      </div>
                      <div className="mt-1 font-mono text-[11.5px] text-white/75">
                        24/7 monitored
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

              <div
                className="group basis-full md:basis-1/2 border-t md:border-l p-5 md:p-6 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02] focus-within:bg-white/[0.03]"
                style={{ borderColor: "var(--stroke)" }}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://chutes.ai/images/hyperscale/hyperfast.jpg"
                    alt="Total Value"
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
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[10.5px] font-medium text-white/90 bg-black/45 ring-1 ring-white/10 backdrop-blur-[2px]">
                      PoR
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
                        Total Value Locked
                      </div>
                      <div className="mt-1 font-mono text-[11.5px] text-white/75">
                        $124.5M • Root Qm…
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

      <section className="relative py-16 md:py-20 px-3">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <div className="mb-10">
            <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
              How it Works
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
                  <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
                    Trustless{" "}
                    <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                      custody
                    </span>{" "}
                    verification
                  </span>
                </h2>
                <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
                  Every snapshot is cryptographically proven and independently
                  verifiable. Real-time monitoring with Merkle trees and
                  committee signatures.
                </p>
              </div>
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 rounded-full bg-[#D0FF00] px-6 py-3 text-[14px] font-semibold text-black hover:scale-105 transition-transform whitespace-nowrap"
              >
                Try the Proof Lab
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 12h10M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/[0.08] rounded-2xl overflow-hidden">
            {/* Large Feature - Multi-Venue Coverage */}
            <div className="md:col-span-7 bg-black p-8 md:p-10 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D0FF00]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D0FF00] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <h3 className="mt-6 text-[24px] md:text-[28px] font-bold text-white leading-tight">
                  Multi-Venue Coverage
                </h3>
                <p className="mt-3 text-[14px] md:text-[15px] leading-relaxed text-white/70 max-w-xl">
                  Monitor wallets across exchanges, bridges, and custody
                  solutions in a single dashboard.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[32px] font-bold text-[#D0FF00]">
                      42
                    </div>
                    <div className="text-[12px] text-white/60">
                      Wallets Monitored
                    </div>
                  </div>
                  <div>
                    <div className="text-[32px] font-bold text-[#D0FF00]">
                      24/7
                    </div>
                    <div className="text-[12px] text-white/60">
                      Real-Time Updates
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D0FF00]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Merkle Verification */}
            <div className="md:col-span-5 bg-black p-8 md:p-10 relative group">
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D0FF00]" />

              <div className="relative z-10">
                <h3 className="mt-6 text-[20px] md:text-[22px] font-bold text-white leading-tight">
                  Merkle Verification
                </h3>
                <p className="mt-3 text-[13.5px] md:text-[14.5px] leading-relaxed text-white/70">
                  Every balance is part of a Merkle tree, independently
                  verifiable by anyone at any time.
                </p>

                <div className="mt-6">
                  <code className="inline-block rounded bg-white/[0.04] px-3 py-2 text-[11px] font-mono text-[#D0FF00] border border-white/10">
                    Qm...a7f9
                  </code>
                </div>
              </div>
            </div>

            {/* Committee-Signed */}
            <div className="md:col-span-5 bg-black p-8 md:p-10 relative group">
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D0FF00] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <h3 className="mt-6 text-[20px] md:text-[22px] font-bold text-white leading-tight">
                  Committee-Signed
                </h3>
                <p className="mt-3 text-[13.5px] md:text-[14.5px] leading-relaxed text-white/70">
                  Attestations are signed by our decentralized committee for
                  maximum security and trust.
                </p>
              </div>
            </div>

            {/* Real-Time Updates */}
            <div className="md:col-span-7 bg-black p-8 md:p-10 relative group">
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D0FF00]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D0FF00] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mt-6 text-[20px] md:text-[22px] font-bold text-white leading-tight">
                      Real-Time Updates
                    </h3>
                    <p className="mt-3 text-[13.5px] md:text-[14.5px] leading-relaxed text-white/70 max-w-lg">
                      24/7 monitoring with instant snapshots and automatic
                      verification across all custody venues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration CTA */}
      <section className="relative py-12 pb-20 px-3">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <div className="border border-white/10 bg-black overflow-hidden rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-8 p-8 border-b md:border-r border-white/[0.08]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                    Integration
                  </h3>
                </div>
                <p className="text-2xl font-bold text-white mb-4">
                  Integrate PoR into your protocol
                </p>
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  Use our SDK to fetch real-time attestations and verify custody
                  reserves programmatically. Full TypeScript and Solidity
                  support included.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/sdk"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
                  >
                    View SDK Docs
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/api-docs"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
                  >
                    API Reference
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 p-8 border-b border-white/[0.08]">
                <div className="text-[11px] font-bold uppercase tracking-widest mb-3 text-white/60">
                  Quick Links
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Live Explorer", href: "/explorer" },
                    { label: "Proof Lab", href: "/lab" },
                    { label: "Documentation", href: "/docs" },
                    { label: "Contract Addresses", href: "/contracts" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-white/75 hover:text-white transition-colors underline underline-offset-2"
                      style={{
                        textDecorationColor: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
