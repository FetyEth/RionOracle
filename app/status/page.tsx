"use client";

import { useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Shield,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

/* ------------------------------ neutral tokens & helpers ------------------------------ */
const ACCENT = "rgba(255,255,255,0.10)";
const EMPHASIS = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.64)";

/** Accept ALL div props so inline `style` is allowed */
type DivProps = React.HTMLAttributes<HTMLDivElement>;

function System({ className = "", style, ...rest }: DivProps) {
  return (
    <section
      className={`relative rounded-2xl border bg-black ${className}`}
      style={{ borderColor: ACCENT, ...style }}
      {...rest}
    />
  );
}
function SystemGrid({ className = "", ...rest }: DivProps) {
  return (
    <div
      className={`grid divide-y divide-white/10 md:divide-y-0 md:divide-x ${className}`}
      {...rest}
    />
  );
}
function Cell({ className = "", style, ...rest }: DivProps) {
  return <div className={`p-6 md:p-7 ${className}`} style={style} {...rest} />;
}

/* --------------------------------------------- Page --------------------------------------------- */
export default function StatusPage() {
  /* data (yours, with tiny sparkline arrays added) */
  const uptimeData = [
    { time: "00:00", uptime: 100 },
    { time: "04:00", uptime: 99.98 },
    { time: "08:00", uptime: 99.99 },
    { time: "12:00", uptime: 100 },
    { time: "16:00", uptime: 99.97 },
    { time: "20:00", uptime: 99.99 },
    { time: "24:00", uptime: 100 },
  ];

  const operators = [
    {
      name: "Binance",
      slo: 99.98,
      rounds: 124530,
      missed: 2,
      status: "operational",
      series: [99.97, 99.98, 99.99, 100, 100, 99.99, 99.98],
    },
    {
      name: "OKX",
      slo: 99.95,
      rounds: 124501,
      missed: 5,
      status: "operational",
      series: [99.94, 99.95, 99.93, 99.96, 99.95, 99.95, 99.95],
    },
    {
      name: "PancakeSwap",
      slo: 99.92,
      rounds: 124482,
      missed: 8,
      status: "operational",
      series: [99.9, 99.92, 99.91, 99.93, 99.92, 99.92, 99.92],
    },
    {
      name: "Bybit",
      slo: 99.89,
      rounds: 124445,
      missed: 11,
      status: "degraded",
      series: [99.9, 99.88, 99.86, 99.89, 99.9, 99.88, 99.89],
    },
    {
      name: "Gate.io",
      slo: 99.87,
      rounds: 124442,
      missed: 13,
      status: "operational",
      series: [99.85, 99.87, 99.86, 99.88, 99.87, 99.87, 99.87],
    },
  ];

  const incidents = [
    {
      id: 1,
      title: "Bybit API Latency Spike",
      status: "investigating",
      time: "2 hours ago",
      severity: "minor",
      details:
        "Elevated P99 latency from Bybit public API affecting ingestion pipeline.",
    },
    {
      id: 2,
      title: "Scheduled Maintenance - Aggregator Upgrade",
      status: "completed",
      time: "1 day ago",
      severity: "maintenance",
      details:
        "BNB/USD aggregator upgraded; no data loss, < 2 min read-only window.",
    },
    {
      id: 3,
      title: "BNB/USD Feed Deviation Alert",
      status: "resolved",
      time: "3 days ago",
      severity: "major",
      details:
        "Transient upstream deviation triggered guard; automatically failed over.",
    },
  ];

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 pt-28 pb-24">
        {/* ---------------------------------------- Header + Summary (connected) ---------------------------------------- */}
        <System className="mx-auto mb-10 w-full max-w-6xl">
          <div className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <h1
                className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl"
                style={{ color: EMPHASIS }}
              >
                System <span className="text-white/80">Status</span>
              </h1>
              <p className="mt-1 text-sm" style={{ color: MUTED }}>
                Real-time health and SLA monitoring • Last updated {lastUpdated}
              </p>
            </div>
            <Badge className="border border-white/15 bg-transparent text-[12px] text-white/80">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              All systems operational
            </Badge>
          </div>

          <SystemGrid className="grid-cols-1 md:grid-cols-4">
            <Cell>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm" style={{ color: MUTED }}>
                  Network Uptime
                </span>
                <CheckCircle2 className="h-4 w-4 text-white/80" />
              </div>
              <div className="text-3xl font-bold tabular-nums text-white">
                99.98%
              </div>
              <div className="text-xs" style={{ color: MUTED }}>
                Last 30 days
              </div>
            </Cell>
            <Cell>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm" style={{ color: MUTED }}>
                  Avg Response Time
                </span>
                <Clock className="h-4 w-4 text-white/80" />
              </div>
              <div className="text-3xl font-bold tabular-nums text-white">
                1.2s
              </div>
              <div className="text-xs text-white/80">−0.3s vs target</div>
            </Cell>
            <Cell>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm" style={{ color: MUTED }}>
                  Active Feeds
                </span>
                <Activity className="h-4 w-4 text-white/80" />
              </div>
              <div className="text-3xl font-bold tabular-nums text-white">
                24
              </div>
              <div className="text-xs text-white/80">+2 this week</div>
            </Cell>
            <Cell>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm" style={{ color: MUTED }}>
                  Security Score
                </span>
                <Shield className="h-4 w-4 text-white/80" />
              </div>
              <div className="text-3xl font-bold tabular-nums text-white">
                A+
              </div>
              <div className="text-xs" style={{ color: MUTED }}>
                Audited & verified
              </div>
            </Cell>
          </SystemGrid>
        </System>

        {/* ---------------------------------------- Uptime (connected) ---------------------------------------- */}
        <System className="mx-auto mb-12 w-full max-w-6xl">
          <div
            className="px-6 py-5 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <h2 className="text-xl font-semibold" style={{ color: EMPHASIS }}>
              24-Hour Uptime
            </h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              Target SLO band highlighted at 99.95% – 100%
            </p>
          </div>

          <Cell className="pt-6">
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={uptimeData}
                  margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
                >
                  <ReferenceArea
                    y1={99.95}
                    y2={100}
                    fill="rgba(255,255,255,0.06)"
                    stroke="none"
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.55)"
                    tickMargin={8}
                  />
                  <YAxis
                    domain={[99.9, 100]}
                    allowDecimals
                    ticks={[99.9, 99.95, 100]}
                    stroke="rgba(255,255,255,0.55)"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: `1px solid ${ACCENT}`,
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "rgba(255,255,255,0.85)" }}
                    formatter={(val: any) => [
                      `${Number(val).toFixed(3)}%`,
                      "Uptime",
                    ]}
                  />
                  <defs>
                    <linearGradient
                      id="uptimeStroke"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="white" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="white" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="uptime"
                    stroke="url(#uptimeStroke)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Cell>
        </System>

        {/* ---------------------------------------- Operators (connected) ---------------------------------------- */}
        <System className="mx-auto mb-12 w-full max-w-6xl">
          <div
            className="px-6 py-5 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <h2 className="text-xl font-semibold" style={{ color: EMPHASIS }}>
              Operator SLO Performance
            </h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              SLO shown with a progress bar and 7-point uptime sparkline
            </p>
          </div>

          <div className="space-y-0">
            <div
              className="hidden grid-cols-12 gap-4 px-6 py-3 text-xs text-white/60 md:grid"
              style={{ borderBottom: `1px solid ${ACCENT}` }}
            >
              <div className="col-span-5">Operator</div>
              <div className="col-span-3">SLO</div>
              <div className="col-span-2">Rounds</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {operators.map((op, idx) => {
              const spark = op.series.map((v, i) => ({ x: i, y: v }));
              const statusChip =
                op.status === "operational"
                  ? "bg-white/10 text-white/90"
                  : "bg-white/5 text-white/80";
              const sloPct = Math.max(0, Math.min(100, op.slo));

              return (
                <div
                  key={op.name}
                  className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-12"
                  style={{
                    borderBottom:
                      idx === operators.length - 1
                        ? "none"
                        : `1px solid ${ACCENT}`,
                  }}
                >
                  {/* Operator + sparkline */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <span className="font-bold text-white/85">
                        {op.name[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate font-medium"
                        style={{ color: EMPHASIS }}
                      >
                        {op.name}
                      </div>
                      <div className="mt-1 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={spark}
                            margin={{ left: 0, right: 0, top: 6, bottom: 0 }}
                          >
                            <YAxis hide domain={[99.8, 100]} />
                            <XAxis hide dataKey="x" />
                            <Line
                              type="monotone"
                              dataKey="y"
                              stroke="rgba(255,255,255,0.75)"
                              strokeWidth={2}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* SLO progress */}
                  <div className="col-span-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-white/60">
                      <span>SLO</span>
                      <span className="font-mono text-white/80">
                        {op.slo.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-white/80"
                        style={{ width: `${sloPct}%` }}
                        aria-label={`SLO ${op.slo}%`}
                      />
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      {op.missed} missed • {op.rounds.toLocaleString()} rounds
                    </div>
                  </div>

                  {/* Rounds (md+) */}
                  <div className="col-span-2 hidden items-center md:flex">
                    <div className="text-sm text-white/80">
                      {op.rounds.toLocaleString()}
                    </div>
                  </div>

                  {/* Status chip */}
                  <div className="col-span-2 flex items-center justify-end">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ${statusChip}`}
                    >
                      {op.status === "operational" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      )}
                      {op.status}
                    </span>
                  </div>

                  {/* mobile-only rounds */}
                  <div className="col-span-12 font-mono text-xs text-white/60 md:hidden">
                    {op.rounds.toLocaleString()} rounds • {op.missed} missed
                  </div>
                </div>
              );
            })}
          </div>
        </System>

        {/* ---------------------------------------- Incidents timeline (connected) ---------------------------------------- */}
        <System className="mx-auto w-full max-w-6xl">
          <div
            className="px-6 py-5 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <h2 className="text-xl font-semibold" style={{ color: EMPHASIS }}>
              Recent Incidents
            </h2>
          </div>

          <div className="relative">
            {/* timeline spine */}
            <div
              className="absolute left-[20px] top-0 h-full w-px bg-white/10 md:left-[28px]"
              aria-hidden
            />

            <div className="space-y-0">
              {incidents.map((inc, idx) => {
                const severityChip =
                  inc.severity === "major"
                    ? "bg-white/10 text-white"
                    : inc.severity === "minor"
                    ? "bg-white/10 text-white"
                    : "bg-white/10 text-white/80";

                const icon =
                  inc.status === "investigating" ? (
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        inc.severity === "major"
                          ? "text-white"
                          : inc.severity === "minor"
                          ? "text-white/90"
                          : "text-white/80"
                      }`}
                    />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-white/85" />
                  );

                return (
                  <div
                    key={inc.id}
                    className="grid grid-cols-[56px_1fr] gap-4 px-4 py-5 md:grid-cols-[72px_1fr]"
                    style={{
                      borderBottom:
                        idx === incidents.length - 1
                          ? "none"
                          : `1px solid ${ACCENT}`,
                    }}
                  >
                    {/* bullet */}
                    <div className="relative flex justify-center">
                      <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                        {icon}
                      </div>
                    </div>

                    {/* content */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3
                          className="font-semibold"
                          style={{ color: EMPHASIS }}
                        >
                          {inc.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm" style={{ color: MUTED }}>
                            {inc.time}
                          </span>
                          <Badge
                            variant="outline"
                            className="border-white/20 text-[11px] text-white/80"
                          >
                            {inc.status}
                          </Badge>
                          <Badge
                            className={`text-[11px] ${severityChip} border border-white/15`}
                          >
                            {inc.severity}
                          </Badge>
                        </div>
                      </div>
                      <p className="mt-2 text-sm" style={{ color: MUTED }}>
                        {inc.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </System>
      </main>

      <Footer />
    </div>
  );
}
