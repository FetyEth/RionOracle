"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* --------------------------- design tokens --------------------------- */
const BRAND = "#D0FF00";
const STROKE = "rgba(255,255,255,0.10)";
const MUTED = "rgba(255,255,255,0.66)";

/* ------------------------------ data ------------------------------ */
type Scene = {
  id: string;
  kicker: string;
  title: string;
  stat: string;
  statLabel: string;
  body: string;
  actions?: { label: string; href: string }[];
};

const SCENES: Scene[] = [
  {
    id: "insurance",
    kicker: "Protection",
    title: "User Insurance",
    stat: "1.5 BNB",
    statLabel: "Vault balance",
    body: "Actual compensation for users affected by bad data. InsuranceVault covers incidents—not just slashing.",
    actions: [{ label: "Insurance Vault", href: "/lab?tab=insurance" }],
  },
  {
    id: "proofs",
    kicker: "Verifiability",
    title: "Provable Reports",
    stat: "100%",
    statLabel: "Verifiable",
    body: "Committee BLS signatures + Merkle proofs. Verify any report on-chain with deterministic replay.",
    actions: [
      { label: "Open Explorer", href: "/explorer" },
      { label: "Proof Lab", href: "/lab?tab=verify" },
    ],
  },
  {
    id: "disputes",
    kicker: "Accountability",
    title: "Public Disputes",
    stat: "12",
    statLabel: "Resolved",
    body: "Stake to challenge incorrect rounds. Transparent evidence, DAO voting, and reproducible outcomes.",
    actions: [{ label: "All disputes", href: "/disputes" }],
  },
  {
    id: "delivery",
    kicker: "Delivery",
    title: "Dual Delivery",
    stat: "<1s",
    statLabel: "Median latency",
    body: "Push for DeFi protocols, HTTP-402 pull for agents. One network, multiple consumption patterns.",
    actions: [{ label: "Integrate SDK", href: "/sdk" }],
  },
];

/* ------------------------------ comp ------------------------------ */

export default function WhyRionPanels() {
  const [active, setActive] = useState(0);
  const refs = useRef<HTMLDivElement[]>([]);

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(SCENES.length - 1, index));
    const el = refs.current[clamped];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // observe which panel is centered, to sync the left narrative
  useEffect(() => {
    const nodes = refs.current.filter(Boolean);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = nodes.findIndex((n) => n === e.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.6 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // keyboard navigation for ↑ / ↓
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIndex(active + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(active - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const scene = useMemo(() => SCENES[active], [active]);

  return (
    <section className="relative bg-black py-16 md:py-24">
      <GridCorner position="tl" />
      <GridCorner position="tr" />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-5 md:px-10 lg:grid-cols-12">
        {/* LEFT: sticky narrative */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div
              className="text-[13px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {scene.kicker}
            </div>
            <h2 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-tight text-white">
              {scene.title}
            </h2>

            <div className="mt-6">
              <div className="text-[clamp(2.4rem,6vw,4.2rem)] font-black leading-none text-white">
                {scene.stat}
              </div>
              <div
                className="mt-1 text-xs uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {scene.statLabel}
              </div>
            </div>

            <p
              className="mt-6 max-w-md text-[15px] leading-relaxed"
              style={{ color: MUTED }}
            >
              {scene.body}
            </p>

            {scene.actions?.length ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {scene.actions.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="group inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white/90"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)",
                    }}
                  >
                    {a.label}
                    <svg
                      className="ml-2 h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-1"
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
                ))}
              </div>
            ) : null}

            {/* progress dots */}
            <div className="mt-10 flex items-center gap-2">
              {SCENES.map((scene, i) => (
                <button
                  key={scene.id}
                  onClick={() => scrollToIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-10" : "w-2"
                  }`}
                  style={{
                    background: i === active ? BRAND : "rgba(255,255,255,0.2)",
                  }}
                  aria-label={`Go to ${scene.title}`}
                />
              ))}
            </div>

            <div className="mt-4 text-[11px] text-white/40">
              Tip: use ↑ / ↓ to navigate panels
            </div>
          </div>
        </div>

        {/* RIGHT: panels */}
        <div className="lg:col-span-7">
          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{ borderColor: STROKE }}
          >
            {/* INSURANCE */}
            <Panel
              ref={(el) => {
                if (el) refs.current[0] = el;
              }}
              title="Insurance Vault"
              subtitle="Protection"
            >
              <div className="grid gap-6 md:grid-cols-3">
                <Stat label="Vault Balance" value="1.5 BNB" />
                <Stat label="Coverage Ratio" value="98%" accent />
                <Stat label="Payouts (30d)" value="$48.2k" />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Bar label="Total Deposits" value={0.84} />
                <Bar label="Outstanding Claims" value={0.12} tone="danger" />
              </div>
            </Panel>

            {/* PROOFS */}
            <Panel
              ref={(el) => {
                if (el) refs.current[1] = el;
              }}
              title="Provable Reports"
              subtitle="Verifiability"
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="mb-3 text-sm text-white/70">
                    Committee quorum
                  </div>
                  <QuorumRing signed={7} total={10} />
                  <div className="mt-3 text-xs text-white/60">
                    7 / 10 signers
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-sm text-white/70">
                    Merkle inclusion
                  </div>
                  <MerkleMini levels={4} highlightIndex={5} />
                  <div className="mt-3 text-xs text-white/60">
                    Wallet #5 included
                  </div>
                </div>
              </div>
              <Rail className="mt-8">
                <RailItem label="Open Explorer" href="/explorer" />
                <RailItem label="Verify in Lab" href="/lab?tab=verify" />
                <RailItem label="Docs: Proofs" href="/docs#proofs" />
              </Rail>
            </Panel>

            {/* DISPUTES */}
            <Panel
              ref={(el) => {
                if (el) refs.current[2] = el;
              }}
              title="Public Disputes"
              subtitle="Accountability"
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="mb-3 text-sm text-white/70">
                    Resolutions (last 90d)
                  </div>
                  <Sparkline values={[2, 1, 0, 3, 4, 2, 1, 0, 2, 3, 1, 1]} />
                  <div className="mt-3 text-xs text-white/60">
                    12 resolved • 0 open critical
                  </div>
                </div>
                <div className="space-y-3">
                  <BadgeRow label="BNB/USD deviation" status="Resolved" />
                  <BadgeRow label="Outcomes replay" status="Resolved" />
                  <BadgeRow
                    label="Operator timeout"
                    status="Investigating"
                    tone="warn"
                  />
                </div>
              </div>
              <Rail className="mt-8">
                <RailItem label="All disputes" href="/disputes" />
              </Rail>
            </Panel>

            {/* DELIVERY */}
            <Panel
              ref={(el) => {
                if (el) refs.current[3] = el;
              }}
              title="Dual Delivery"
              subtitle="Delivery"
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="mb-3 text-sm text-white/70">
                    Latency distribution (ms)
                  </div>
                  <Histogram
                    buckets={[4, 8, 16, 22, 18, 9, 4, 2]}
                    labels={[
                      "50",
                      "120",
                      "180",
                      "240",
                      "320",
                      "420",
                      "520",
                      "650",
                    ]}
                  />
                  <div className="mt-3 text-xs text-white/60">
                    &lt;1s median • p95 1.7s
                  </div>
                </div>
                <div className="space-y-4">
                  <Bar label="Push (DeFi)" value={0.64} />
                  <Bar label="Pull x402 (Agents)" value={0.36} />
                  <div className="text-xs text-white/60">
                    Share of last 24h updates
                  </div>
                </div>
              </div>
              <Rail className="mt-8">
                <RailItem label="SDK Quickstart" href="/sdk" />
                <RailItem label="HTTP-402 Receipts" href="/receipts" />
              </Rail>
            </Panel>
          </div>
        </div>
      </div>

      <GridCorner position="bl" />
      <GridCorner position="br" />
    </section>
  );
}

/* ---------------------------- primitives ---------------------------- */

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle: string;
};

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ title, subtitle, children, className = "", ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative border-t ${className}`}
        style={{ borderColor: STROKE }}
        {...rest}
      >
        <div className="p-6 md:p-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
            {subtitle}
          </div>
          <h3 className="mb-6 text-2xl font-bold text-white">{title}</h3>
          {children}
        </div>
      </div>
    );
  }
);
Panel.displayName = "Panel";

const Stat = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div>
    <div className="text-xs uppercase tracking-widest text-white/55">
      {label}
    </div>
    <div
      className={`mt-1 text-2xl font-bold ${
        accent ? "text-[--brand]" : "text-white"
      }`}
      style={accent ? ({ ["--brand" as any]: BRAND } as any) : undefined}
    >
      {value}
    </div>
  </div>
);

const Bar = ({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number; // 0..1
  tone?: "neutral" | "danger";
}) => {
  const fill = tone === "danger" ? "rgba(255,99,99,0.9)" : BRAND;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/70">
        <span>{label}</span>
        <span className="font-mono text-white/70">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="h-2 w-full rounded bg-white/10">
        <div
          className="h-2 rounded"
          style={{
            width: `${value * 100}%`,
            background: fill,
            boxShadow: `0 0 12px ${fill}33`,
          }}
        />
      </div>
    </div>
  );
};

const Rail = ({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-wrap items-center gap-3 border-t pt-5 ${className}`}
    style={{ borderColor: STROKE }}
  >
    {children}
  </div>
);

const RailItem = ({ label, href }: { label: string; href: string }) => (
  <Link
    href={href}
    className="text-[12.5px] font-medium text-white/85 underline underline-offset-4"
    style={{ textDecorationColor: "rgba(255,255,255,0.25)" }}
  >
    {label}
  </Link>
);

const QuorumRing = ({ signed, total }: { signed: number; total: number }) => {
  const pct = signed / total;
  const size = 132;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={BRAND}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="18"
        fontWeight={700}
        fill="#fff"
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
};

const MerkleMini = ({
  levels = 4,
  highlightIndex = 5,
}: {
  levels?: number;
  highlightIndex?: number;
}) => {
  const nodes: { x: number; y: number; idx: number }[] = [];
  const width = 280;
  const height = 160;
  let idx = 0;
  for (let l = 0; l < levels; l++) {
    const count = 2 ** (levels - 1 - l);
    for (let i = 0; i < count; i++) {
      const x = ((i + 0.5) / count) * width;
      const y = (l / (levels - 1)) * (height - 20) + 10;
      nodes.push({ x, y, idx: idx++ });
    }
  }
  const edges: { from: number; to: number }[] = [];
  let base = 0;
  for (let l = 0; l < levels - 1; l++) {
    const count = 2 ** (levels - 1 - l);
    for (let i = 0; i < count; i += 2) {
      const parent = base + count + i / 2;
      edges.push({ from: base + i, to: parent });
      edges.push({ from: base + i + 1, to: parent });
    }
    base += count;
  }
  return (
    <svg width={width} height={height}>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={nodes[e.from].x}
          y1={nodes[e.from].y}
          x2={nodes[e.to].x}
          y2={nodes[e.to].y}
          stroke="rgba(255,255,255,0.15)"
        />
      ))}
      {nodes.map((n) => (
        <circle
          key={n.idx}
          cx={n.x}
          cy={n.y}
          r={4.2}
          fill={n.idx === highlightIndex ? BRAND : "rgba(255,255,255,0.85)"}
          opacity={n.idx === highlightIndex ? 1 : 0.6}
        />
      ))}
    </svg>
  );
};

const Sparkline = ({ values }: { values: number[] }) => {
  const w = 280;
  const h = 88;
  const pad = 8;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={BRAND}
        strokeWidth={2}
      />
      {values.map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (w - pad * 2);
        const y = h - pad - (v / max) * (h - pad * 2);
        return (
          <circle key={i} cx={x} cy={y} r={2.2} fill="#fff" opacity={0.8} />
        );
      })}
    </svg>
  );
};

const Histogram = ({
  buckets,
  labels,
}: {
  buckets: number[];
  labels: string[];
}) => {
  const h = 120;
  const max = Math.max(...buckets, 1);
  return (
    <div className="grid grid-cols-8 gap-2">
      {buckets.map((v, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-full rounded bg-white/10">
            <div
              className="w-full rounded"
              style={{
                height: `${(v / max) * h}px`,
                background: `linear-gradient(180deg, ${BRAND}, ${BRAND}55)`,
                boxShadow: `0 0 10px ${BRAND}40`,
              }}
            />
          </div>
          <div className="mt-1 text-[10px] text-white/50">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
};

const BadgeRow = ({
  label,
  status,
  tone = "ok",
}: {
  label: string;
  status: string;
  tone?: "ok" | "warn";
}) => {
  const color =
    tone === "warn"
      ? "bg-white/6 text-white border-white/14 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      : "bg-white/6 text-white/80 border-white/14 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]";

  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <span className="text-sm text-white/80">{label}</span>
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide ${color}`}
      >
        {status}
      </span>
    </div>
  );
};

/* ------------------------ visual chrome helpers ------------------------ */

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
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.12)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
