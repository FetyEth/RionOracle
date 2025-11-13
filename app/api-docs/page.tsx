"use client";

import type React from "react";

import { useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";

import { Code2, Zap, Shield, Database } from "lucide-react";

/* ------------------------------- SSR-safe code block -------------------------------- */
const CodeBlock = dynamic(
  () => import("@/components/ui/code-block").then((m) => m.CodeBlock),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-md border border-white/10 bg-[#0A0A0A] p-4">
        <div className="mb-3 h-5 w-28 animate-pulse bg-zinc-800/60" />
        <div className="h-[220px] animate-pulse rounded bg-zinc-900/60" />
      </div>
    ),
  }
);

/* ------------------------------- neutral design tokens ------------------------------ */
const ACCENT = "rgba(255,255,255,0.10)";
const EMPHASIS = "rgba(255,255,255,0.90)";
const MUTED = "rgba(255,255,255,0.62)";

/* ----------------------------- tiny presentational helpers -------------------------- */
type DivProps = React.HTMLAttributes<HTMLDivElement>;

function System({ className = "", style, children, ...rest }: DivProps) {
  return (
    <section
      className={`rounded-2xl border bg-black ${className}`}
      style={{ borderColor: ACCENT, ...style }}
      {...rest}
    >
      {children}
    </section>
  );
}

function SystemGrid({ className = "", children, ...rest }: DivProps) {
  return (
    <div
      className={`grid divide-y divide-white/10 md:divide-y-0 md:divide-x ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

function Cell({ className = "", style, children, ...rest }: DivProps) {
  return (
    <div className={`p-6 md:p-7 ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------- Page ------------------------------------------- */
export default function APIDocsPage() {
  const nowUnix = useMemo(() => Math.floor(Date.now() / 1000), []);

  /* ---- small utilities ---- */
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---- snippets ---- */
  const wsClient = `// Connect to WebSocket
const ws = new WebSocket('wss://api.rion/v1/stream')

// Subscribe to feeds
ws.onopen = () => {
  ws.send(JSON.stringify({
    action: 'subscribe',
    feeds: ['BNB/USD', 'ETH/USD']
  }))
}

// Receive updates
ws.onmessage = (event) => {
  const update = JSON.parse(event.data)
  console.log(update.pair, update.price)
}`;

  const feedsListResp = `{
  "feeds": [
    {
      "pair": "BNB/USD",
      "address": "0x...",
      "heartbeat": 12,
      "deviation": 0.5,
      "status": "active"
    }
  ]
}`;

  const feedLatestResp = `{
  "pair": "BNB/USD",
  "price": "9.79",
  "timestamp": ${nowUnix},
  "roundId": 204,
  "verified": true,
  "observationCount": 3,
  "aggregator": "0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F"
}`;

  const roundByIdResp = `{
  "roundId": 204,
  "feed": "BNB/USD",
  "answer": 979000000,
  "timestamp": ${nowUnix},
  "observationCount": 3,
  "aggregator": "0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F"
}`;

  const createDisputeReq = `POST /api/v1/disputes
{
  "feedId": "0x...",
  "roundId": 204,
  "reason": "Price deviation > 5%",
  "stake": "100000000000000000"
}`;
  const createDisputeResp = `{
  "disputeId": 1,
  "status": "Evidence",
  "votingEnds": ${nowUnix + 3600}
}`;

  const verifyReceiptReq = `POST /api/v1/receipts/verify
{
  "receiptId": "0x4a2f8d1b",
  "merkleProof": [...],
  "signature": "0x..."
}`;
  const verifyReceiptResp = `{
  "valid": true,
  "provider": "Binance",
  "timestamp": 1704067200,
  "merkleRoot": "0x..."
}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="mx-auto max-w-[1280px] px-5 md:px-10 pt-24 pb-20">
        <div className="mb-10 max-w-3xl">
          <Badge className="mb-4 border border-white/15 bg-transparent text-[12px] text-white/70">
            API Reference
          </Badge>
          <h1
            className="mb-4 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl"
            style={{ color: EMPHASIS }}
          >
            Complete API Documentation
          </h1>
          <p
            className="max-w-2xl text-lg leading-relaxed"
            style={{ color: MUTED }}
          >
            REST and WebSocket APIs for querying oracle data, verifying proofs,
            and managing disputes.
          </p>
        </div>

        <System className="mb-12 w-full">
          <SystemGrid className="grid-cols-1 md:grid-cols-4">
            <Cell
              className="cursor-pointer hover:bg-white/[0.03]"
              onClick={() => scrollTo("rest")}
            >
              <div className="mb-2 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-white/70" />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: EMPHASIS }}
                >
                  REST API
                </h3>
              </div>
              <p className="text-xs" style={{ color: MUTED }}>
                HTTP endpoints
              </p>
            </Cell>

            <Cell
              className="cursor-pointer hover:bg-white/[0.03]"
              onClick={() => scrollTo("ws")}
            >
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-white/70" />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: EMPHASIS }}
                >
                  WebSocket
                </h3>
              </div>
              <p className="text-xs" style={{ color: MUTED }}>
                Real-time feeds
              </p>
            </Cell>

            <Cell
              className="cursor-pointer hover:bg-white/[0.03]"
              onClick={() => scrollTo("auth")}
            >
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-white/70" />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: EMPHASIS }}
                >
                  Authentication
                </h3>
              </div>
              <p className="text-xs" style={{ color: MUTED }}>
                API keys & JWT
              </p>
            </Cell>

            <Cell
              className="cursor-pointer hover:bg-white/[0.03]"
              onClick={() => scrollTo("limits")}
            >
              <div className="mb-2 flex items-center gap-2">
                <Database className="h-5 w-5 text-white/70" />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: EMPHASIS }}
                >
                  Rate Limits
                </h3>
              </div>
              <p className="text-xs" style={{ color: MUTED }}>
                Usage tiers
              </p>
            </Cell>
          </SystemGrid>
        </System>

        <System id="rest" className="mb-12 w-full">
          <div
            className="flex items-center justify-between px-6 py-5 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <div>
              <h2 className="text-xl font-semibold" style={{ color: EMPHASIS }}>
                REST Endpoints
              </h2>
              <p className="mt-1 text-sm" style={{ color: MUTED }}>
                Versioned at <code className="font-mono">/api/v1</code>
              </p>
            </div>
            <div className="hidden text-xs text-white/60 md:block">
              Base URL: <span className="font-mono">https://api.rion</span>
            </div>
          </div>

          <div style={{ borderBottom: `1px solid ${ACCENT}` }}>
            <Tabs defaultValue="feeds" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none bg-transparent p-0">
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="feeds"
                >
                  Price Feeds
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="rounds"
                >
                  Rounds
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="disputes"
                >
                  Disputes
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="receipts"
                >
                  Receipts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feeds" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center gap-3">
                      <Badge className="border border-white/15 bg-transparent font-mono text-xs text-white/80">
                        GET
                      </Badge>
                      <code className="text-sm font-mono">/api/v1/feeds</code>
                      <CopyButton text="GET /api/v1/feeds" />
                    </div>
                    <p className="mb-3 text-sm" style={{ color: MUTED }}>
                      List available price feeds.
                    </p>
                    <CodeBlock
                      language="json"
                      filename="response.json"
                      tabs={[
                        {
                          name: "Response",
                          code: feedsListResp,
                          language: "json",
                        },
                      ]}
                    />
                  </Cell>

                  <Cell>
                    <div className="mb-3 flex items-center gap-3">
                      <Badge className="border border-white/15 bg-transparent font-mono text-xs text-white/80">
                        GET
                      </Badge>
                      <code className="text-sm font-mono">
                        /api/v1/feeds/:pair
                      </code>
                      <CopyButton text="GET /api/v1/feeds/BNB-USD" />
                    </div>
                    <p className="mb-3 text-sm" style={{ color: MUTED }}>
                      Latest price and metadata for a specific pair.
                    </p>
                    <CodeBlock
                      language="json"
                      filename="response.json"
                      tabs={[
                        {
                          name: "Response",
                          code: feedLatestResp,
                          language: "json",
                          highlightLines: [3, 4, 5],
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>

              <TabsContent value="rounds" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center gap-3">
                      <Badge className="border border-white/15 bg-transparent font-mono text-xs text-white/80">
                        GET
                      </Badge>
                      <code className="text-sm font-mono">
                        /api/v1/rounds/:id
                      </code>
                      <CopyButton text="GET /api/v1/rounds/204" />
                    </div>
                    <p className="mb-3 text-sm" style={{ color: MUTED }}>
                      Detailed round data with proofs.
                    </p>
                    <CodeBlock
                      language="json"
                      filename="response.json"
                      tabs={[
                        {
                          name: "Response",
                          code: roundByIdResp,
                          language: "json",
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>

              <TabsContent value="disputes" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center gap-3">
                      <Badge className="border border-white/15 bg-transparent font-mono text-xs text-white/80">
                        POST
                      </Badge>
                      <code className="text-sm font-mono">
                        /api/v1/disputes
                      </code>
                      <CopyButton text="/api/v1/disputes" />
                    </div>
                    <p className="mb-3 text-sm" style={{ color: MUTED }}>
                      Create a new dispute.
                    </p>
                    <CodeBlock
                      language="json"
                      filename="request.json"
                      tabs={[
                        {
                          name: "Request",
                          code: createDisputeReq,
                          language: "json",
                        },
                        {
                          name: "Response",
                          code: createDisputeResp,
                          language: "json",
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>

              <TabsContent value="receipts" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center gap-3">
                      <Badge className="border border-white/15 bg-transparent font-mono text-xs text-white/80">
                        POST
                      </Badge>
                      <code className="text-sm font-mono">
                        /api/v1/receipts/verify
                      </code>
                      <CopyButton text="/api/v1/receipts/verify" />
                    </div>
                    <p className="mb-3 text-sm" style={{ color: MUTED }}>
                      Verify an HTTP-402 receipt.
                    </p>
                    <CodeBlock
                      language="json"
                      filename="request.json"
                      tabs={[
                        {
                          name: "Request",
                          code: verifyReceiptReq,
                          language: "json",
                        },
                        {
                          name: "Response",
                          code: verifyReceiptResp,
                          language: "json",
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>
            </Tabs>
          </div>
        </System>

        <System id="auth" className="mb-12 w-full">
          <SystemGrid className="grid-cols-1 md:grid-cols-2">
            <Cell>
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: EMPHASIS }}
              >
                Authentication
              </h3>
              <p className="mb-4 text-sm" style={{ color: MUTED }}>
                Authenticate with an API key via header:
              </p>
              <CodeBlock
                language="bash"
                filename="curl"
                tabs={[
                  {
                    name: "curl",
                    code: `curl -H "Authorization: Bearer <API_KEY>" https://api.rion/api/v1/feeds`,
                    language: "bash",
                  },
                ]}
              />
              <p className="mt-4 text-xs" style={{ color: MUTED }}>
                JWTs are also supported for short-lived sessions. Include as{" "}
                <code className="font-mono">
                  Authorization: Bearer &lt;JWT&gt;
                </code>
                .
              </p>
            </Cell>

            <Cell id="limits">
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: EMPHASIS }}
              >
                Rate Limits
              </h3>
              <p className="mb-4 text-sm" style={{ color: MUTED }}>
                Default tier: 60 req/min per IP & key. Higher tiers available on
                request.
              </p>
              <CodeBlock
                language="json"
                filename="headers.json"
                tabs={[
                  {
                    name: "Response Headers",
                    code: `X-RateLimit-Limit: 60
X-RateLimit-Remaining: 57
X-RateLimit-Reset: ${nowUnix + 30}`,
                    language: "bash",
                  },
                ]}
              />
            </Cell>
          </SystemGrid>
        </System>

        <System id="ws" className="w-full">
          <div
            className="flex items-center justify-between px-6 py-5 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <div>
              <h2 className="text-xl font-semibold" style={{ color: EMPHASIS }}>
                WebSocket Streaming
              </h2>
              <p className="mt-1 text-sm" style={{ color: MUTED }}>
                Real-time price updates with subscription semantics.
              </p>
            </div>
            <div className="hidden text-xs text-white/60 md:block">
              wss://api.rion/v1/stream
            </div>
          </div>

          <SystemGrid className="grid-cols-1">
            <Cell>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold" style={{ color: EMPHASIS }}>
                  Subscribe & receive messages
                </h3>
                <CopyButton text={wsClient} />
              </div>
              <CodeBlock
                language="ts"
                filename="ws.ts"
                tabs={[{ name: "Client", code: wsClient, language: "ts" }]}
              />
            </Cell>
          </SystemGrid>
        </System>

        <div className="mt-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sdk"
              className="rounded-md border px-4 py-2 text-sm text-white/80 hover:text-white"
              style={{ borderColor: ACCENT }}
            >
              SDK Quickstart
            </Link>
            <Link
              href="/explorer"
              className="rounded-md border px-4 py-2 text-sm text-white/80 hover:text-white"
              style={{ borderColor: ACCENT }}
            >
              Explorer
            </Link>
            <Link
              href="/status"
              className="rounded-md border px-4 py-2 text-sm text-white/80 hover:text-white"
              style={{ borderColor: ACCENT }}
            >
              Status
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
