"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { oracleClient, FEED_CONFIGS } from "@/lib/oracle-client";

/* ------------------------------------------------------------------ */
/* brand + tiny presentational bits (match Pillar grid)                */
/* ------------------------------------------------------------------ */

const BRAND = "#D0FF00";

function ConnectedCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`relative bg-black ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* types + helpers                                                     */
/* ------------------------------------------------------------------ */

type FeedItem = {
  pair: string;
  symbol: string;
  price: number;
  lastUpdate: number;
  icon: string;
};

function formatPrice(p: number) {
  if (!p || Number.isNaN(p)) return "—";
  if (p < 1) return p.toFixed(4);
  if (p < 1000) return p.toFixed(2);
  return p.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/* ------------------------------------------------------------------ */
/* sparkline                                                           */
/* ------------------------------------------------------------------ */

function generateContinuousPricePath(
  basePrice: number,
  offset: number,
  points = 40
): number[] {
  const result: number[] = [];
  let current = basePrice;
  const vol = basePrice * 0.02;

  for (let i = 0; i < points; i++) {
    const t = (i + offset) * 0.15;
    const trend = Math.sin(t) * vol * 0.4;
    const noise = Math.cos(t * 3.7 + offset) * vol * 0.3;
    current = Math.max(
      basePrice * 0.94,
      Math.min(basePrice * 1.06, current + trend + noise)
    );
    result.push(current);
  }
  return result;
}

function buildPath(values: number[], w: number, h: number, pad = 12) {
  const n = values.length;
  if (!n) return { d: "" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = Math.max(1, w - pad * 2);
  const innerH = Math.max(1, h - pad * 2);
  const step = innerW / Math.max(1, n - 1);
  const yOf = (v: number) => h - pad - ((v - min) / span) * innerH;

  let d = "";
  for (let i = 0; i < n; i++) {
    const x = pad + i * step;
    const y = yOf(values[i]);
    d += i ? ` L ${x} ${y}` : `M ${x} ${y}`;
  }
  return { d };
}

function Sparkline({
  values,
  width = 360,
  height = 180,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  const { d } = useMemo(
    () => buildPath(values, width, height),
    [values, width, height]
  );
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d) return;
    path.animate([{ opacity: 0.7 }, { opacity: 1 }], {
      duration: 500,
      easing: "ease-out",
      fill: "forwards",
    });
  }, [d]);

  const lastPoint = useMemo(() => {
    if (!values.length) return null;
    const n = values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const pad = 12;
    const innerW = Math.max(1, width - pad * 2);
    const innerH = Math.max(1, height - pad * 2);
    const x = pad + (n - 1) * (innerW / Math.max(1, n - 1));
    const y = height - pad - ((values[n - 1] - min) / span) * innerH;
    return { x, y };
  }, [values, width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      aria-hidden
    >
      {d && (
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="4"
          fill="rgba(255,255,255,0.9)"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* olive vignette for each marquee card                                */
/* ------------------------------------------------------------------ */

const OLIVE_A = "rgba(31,41,12,0.85)";
const OLIVE_B = "rgba(22,24,13,0.65)";

/* --- bottom-origin olive vignette (replaces your TileBackdrop) --- */
function TileBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* strong glow from the bottom, fading upward */}
      <div
        className="absolute inset-0"
        style={{
          background:
            // big, soft olive dome that starts near the bottom
            "radial-gradient(120% 90% at 50% 85%, rgba(48,56,20,0.85) 0%, rgba(29,33,14,0.55) 35%, rgba(12,12,12,0.22) 60%, rgba(0,0,0,0) 85%)",
        }}
      />
      {/* subtle brand tint near bottom center */}
      <div
        className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 h-[260px] w-[260px] rounded-full blur-[42px] opacity-[0.18]"
        style={{ background: BRAND }}
      />
      {/* moody edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
}

/* --- marquee card (replaces your FeedCard) --- */
function FeedCard({ item, series }: { item: FeedItem; series: number[] }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-black transition-all duration-300 hover:border-white/[0.12]">
      <TileBackdrop />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10"
              style={{ backgroundColor: "#0C0C0F" }}
            >
              <img
                src={item.icon || "/placeholder.svg"}
                alt={item.symbol}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-white/90">
                {item.pair}
              </div>
              <div className="mt-0.5 font-mono text-xs text-white/40">
                {item.symbol}
              </div>
            </div>
          </div>
          <Link
            href={"/explorer"}
            passHref
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] bg-white/[0.03] backdrop-blur-[2px] transition-all hover:border-white/[0.18] hover:bg-white/[0.06]"
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-white/60" />
          </Link>
        </div>

        {/* sparkline */}
        <div className="relative mb-8 h-[180px] w-full">
          <Sparkline values={series} />
          <div className="pointer-events-none absolute -bottom-10 right-1">
            <span
              className="tabular-nums font-mono font-semibold tracking-tight"
              style={{ color: "#F2F2F2", fontSize: 26 }}
            >
              ${formatPrice(item.price)}
            </span>
          </div>
        </div>

        {/* base hairline */}
        <div
          className="mt-auto h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* icons map                                                           */
/* ------------------------------------------------------------------ */

export const CRYPTO_ICONS: Record<string, string> = {
  BTC: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/768px-Bitcoin.svg.png",
  ETH: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png",
  BNB: "https://altcoinsbox.com/wp-content/uploads/2023/01/bnb-chain-binance-smart-chain-logo-300x300.webp",
  SOL: "https://images.seeklogo.com/logo-png/42/2/solana-sol-logo-png_seeklogo-423095.png",
  USDT: "https://upload.wikimedia.org/wikipedia/commons/0/01/USDT_Logo.png",
  USDC: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-usd-coin-usdc-digital-stablecoin-icon-technology-pay-web-vector-png-image_37843734.png",
  XRP: "https://altcoinsbox.com/wp-content/uploads/2023/01/xrp-logo.webp",
  ADA: "https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png",
  LINK: "https://images.seeklogo.com/logo-png/42/1/chainlink-link-logo-png_seeklogo-423097.png",
  DOGE: "https://brandlogos.net/wp-content/uploads/2021/12/dogecoin-brandlogo.net_-512x512.png",
};

/* ------------------------------------------------------------------ */
/* main section                                                        */
/* ------------------------------------------------------------------ */

export function LivePricesSection() {
  /* derive base items from FEED_CONFIGS */
  const baseFeeds = useMemo<FeedItem[]>(
    () =>
      FEED_CONFIGS.filter((f) => f.aggregatorAddress)
        .slice(0, 8)
        .map((f) => {
          const baseSymbol = f.symbol.split("/")[0];
          return {
            pair: f.name,
            symbol: f.symbol,
            price: 0,
            lastUpdate: Date.now(),
            icon:
              CRYPTO_ICONS[baseSymbol] ||
              "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
          };
        }),
    []
  );

  const [feeds, setFeeds] = useState<FeedItem[]>(baseFeeds);
  const [series, setSeries] = useState<Record<string, number[]>>(
    Object.fromEntries(baseFeeds.map((f) => [f.symbol, []]))
  );

  /* per-feed animation offset so lines look different */
  const animOffsets = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    baseFeeds.forEach((f) => {
      if (!animOffsets.current.has(f.symbol))
        animOffsets.current.set(f.symbol, Math.random() * 50);
    });
  }, [baseFeeds]);

  /* update series with staggered timers (no tight loops) */
  useEffect(() => {
    let alive = true;
    const timers: number[] = [];

    baseFeeds.forEach((feed, i) => {
      const tick = () => {
        if (!alive) return;
        setSeries((prev) => {
          const current = feeds.find((x) => x.symbol === feed.symbol);
          if (!current) return prev;
          const basePrice = current.price || 50000;
          const off = (animOffsets.current.get(feed.symbol) || 0) + 1;
          animOffsets.current.set(feed.symbol, off);
          return {
            ...prev,
            [feed.symbol]: generateContinuousPricePath(basePrice, off, 40),
          };
        });
        timers[i] = window.setTimeout(tick, 1500 + Math.random() * 1000);
      };
      timers[i] = window.setTimeout(tick, Math.random() * 800);
    });

    return () => {
      alive = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [baseFeeds, feeds]);

  /* poll backend once every ~3s (pause when tab hidden) */
  useEffect(() => {
    let alive = true;
    let timer: number | null = null;

    const poll = async () => {
      if (!alive) return;
      try {
        if (document.visibilityState === "visible") {
          const map = await oracleClient.getAllPrices();
          if (!alive) return;
          setFeeds((prev) =>
            prev.map((f) => {
              const p = map.get(f.symbol);
              return p
                ? { ...f, price: p.price, lastUpdate: p.timestamp * 1000 }
                : f;
            })
          );
        }
      } finally {
        if (alive) timer = window.setTimeout(poll, 3000);
      }
    };

    poll();
    const onVis = () => {
      if (!alive) return;
      if (timer) clearTimeout(timer);
      if (document.visibilityState === "visible")
        timer = window.setTimeout(poll, 250);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /* marquee animation */
  const railRef = useRef<HTMLDivElement | null>(null);
  const cardWidth = 400 + 24; // card width + gap
  const setSize = feeds.length * cardWidth; // one set of cards

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    let raf = 0;
    let scrollX = 0;
    const speed = 40; // px/sec

    const loop = () => {
      if (!el) return;
      scrollX += speed / 60;
      if (scrollX >= setSize) scrollX = scrollX % setSize;
      el.style.transform = `translate3d(-${scrollX}px, 0, 0)`;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [feeds.length]);

  /* duplicated items for seamless scroll */
  const items = [...feeds, ...feeds, ...feeds];

  return (
    <section className="relative overflow-hidden bg-black py-20">
      {/* Header */}
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
        <div className="mb-8 md:mb-10">
          <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
            Live Prices
          </div>

          <h2 className="text-left font-extrabold leading-[1.06] tracking-tight text-white">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              Explore{" "}
              <span className="bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                price feeds
              </span>
            </span>
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              like never before
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
            Real-time feeds with cryptographic proofs and disputeability.
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

      {/* Top connected cards */}
      <div className="relative mx-auto w-full max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-12 border-y border-white/10 bg-black border-b-0">
          <ConnectedCard className="md:col-span-4 p-7 border-b md:border-r border-white/[0.08]">
            <div
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: BRAND }}
            >
              Coverage
            </div>
            <p className="text-4xl font-black text-white tracking-tight">7+</p>
            <p className="mt-2 text-sm text-white/60">
              Feeds across crypto, FX, and more.
            </p>
          </ConnectedCard>

          <ConnectedCard className="md:col-span-4 p-7 border-b md:border-r border-white/[0.08]">
            <div
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: BRAND }}
            >
              Cadence
            </div>
            <p className="text-4xl font-black text-white tracking-tight">~3s</p>
            <p className="mt-2 text-sm text-white/60">
              Typical refresh interval per feed.
            </p>
          </ConnectedCard>

          <ConnectedCard className="md:col-span-4 p-7 border-b border-white/[0.08]">
            <div className="text-[11px] font-bold uppercase tracking-widest mb-3 text-white/60">
              Explorer
            </div>
            <p className="text-lg font-semibold text-white mb-3">
              Browse rounds & proofs
            </p>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
            >
              Open Oracle Explorer
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </ConnectedCard>
        </div>
      </div>

      {/* Marquee rail */}
      <div className="relative mt-8">
        <div className="overflow-hidden py-6">
          <div
            ref={railRef}
            className="flex gap-6 will-change-transform"
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {items.map((item, idx) => (
              <div
                key={`${item.symbol}-${idx}`}
                className="h-[420px] w-[400px] shrink-0"
              >
                <FeedCard item={item} series={series[item.symbol] || []} />
              </div>
            ))}
          </div>
        </div>

        {/* fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* Footer line */}
      <div className="relative z-10 mt-10 px-6 md:px-10">
        <div
          className="mx-auto h-px max-w-[1280px]"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
          }}
        />
      </div>
    </section>
  );
}

export { LivePricesSection as LiveFeeds };
