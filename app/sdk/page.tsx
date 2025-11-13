"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { Download, Terminal, Zap, Shield, Code2 } from "lucide-react";

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
      className={`rounded-2xl border bg-[rgb(0,0,0)] ${className}`}
      style={{ borderColor: ACCENT, ...style }}
      {...rest}
    >
      {children}
    </section>
  );
}

/** The inner grid that draws the connecting dividers between cells */
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

/** A system "cell" that accepts all div props */
function Cell({ className = "", style, children, ...rest }: DivProps) {
  return (
    <div className={`p-6 md:p-7 ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}

/* ---------------------------------------- page -------------------------------------- */
export default function SDKPage() {
  const [bnbPrice, setBnbPrice] = useState<string>("0.00");

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RPC_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS,
                data: "0xfeaf968c", // latestRoundData()
              },
              "latest",
            ],
            id: 1,
          }),
        });
        const data = await response.json();
        if (data?.result) {
          const price = Number.parseInt(data.result.slice(66, 130), 16) / 1e8;
          if (Number.isFinite(price)) setBnbPrice(price.toFixed(2));
        }
      } catch {
        setBnbPrice("9.79");
      }
    };
    fetchPrice();
  }, []);

  const nowUnix = useMemo(() => Math.floor(Date.now() / 1000), []);

  /* -------------------------------- snippets -------------------------------- */
  const installCmd = `npm i @rion/sdk`;
  const initClient = `import { RionClient } from '@rion/sdk'

const client = new RionClient({
  network: 'bnb-testnet',
  apiKey: process.env.RION_API_KEY
})`;

  const tsQueryPrice = `const price = await client.getPrice('BNB/USD')

console.log(price.value)      // ${bnbPrice}
console.log(price.timestamp)  // ${nowUnix}
console.log(price.verified)   // true`;

  const verifyRound = `// BNB Aggregator: ${process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS}
const round = await client.getRound('BNB/USD')

const isValid = await client.verifySignature(
  round.signature,
  round.data,
  round.committee
)

const isFresh = round.timestamp > Date.now() - 5000

console.log({ isValid, isFresh })`;

  const subscribeCode = `client.subscribe('BNB/USD', (price) => {
  console.log('New price:', price.value)
  console.log('Verified:', price.verified)
})

client.unsubscribe('BNB/USD')`;

  const disputeCode = `// DisputeManager: ${process.env.NEXT_PUBLIC_DISPUTE_MANAGER_ADDRESS}
const dispute = await client.createDispute({
  feedId: 'BNB/USD',
  roundId: 204,
  reason: 'Price deviation > 5%',
  stake: '0.1' // BNB
})

const status = await client.getDisputeStatus(dispute.id)
console.log(status.votes, status.resolution)`;

  const receiptCode = `const receipt = await client.verifyReceipt({
  receiptId: '0x4a2f8d1b',
  merkleProof: [...],
  signature: '0x...'
})

console.log('Valid:', receipt.valid)
console.log('Provider:', receipt.provider)
console.log('Timestamp:', receipt.timestamp)`;

  /* -------------------------------- anchor scroll -------------------------------- */
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-5 md:px-10 pt-28 pb-24">
        {/* ------------------------------------ HERO ------------------------------------ */}
        <div className="mx-auto mb-14 max-w-[1280px] text-left">
          <Badge className="mb-4 border border-white/15 bg-transparent text-[12px] text-white/70">
            TypeScript SDK
          </Badge>

          <h1
            className="mb-4 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl"
            style={{ color: EMPHASIS }}
          >
            Install in 60 seconds
          </h1>

          <p
            className="mx-auto mb-8  text-[17px] leading-relaxed text-left"
            style={{ color: MUTED }}
          >
            Type-safe, lightweight, and production-ready. Query prices, verify
            proofs, and manage disputes with a clean API.
          </p>

          <div className="flex items-center justify-start gap-3">
            <Button
              size="lg"
              className="h-11 rounded-md bg-white text-black hover:bg-white/90"
              onClick={() => scrollTo("quickstart")}
            >
              <Download className="mr-2 h-4 w-4" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-md border-white/20 bg-transparent text-white hover:bg-white/5"
              onClick={() => scrollTo("examples")}
            >
              <Terminal className="mr-2 h-4 w-4" />
              View Examples
            </Button>
          </div>
        </div>

        {/* --------------------------- QUICK START SYSTEM --------------------------- */}
        <System id="quickstart" className="mx-auto mb-12 w-full max-w-[1280px]">
          {/* System header bar (part of the same border) */}
          <div
            className="flex items-center justify-between px-6 py-5 md:px-7"
            style={{ borderBottom: `1px solid ${ACCENT}` }}
          >
            <div>
              <h2 className="text-xl font-semibold" style={{ color: EMPHASIS }}>
                Quick Start
              </h2>
              <p className="mt-1 text-sm" style={{ color: MUTED }}>
                Install, initialize, and read a verified price.
              </p>
            </div>
            <div className="hidden md:block">
              <span className="text-xs text-white/50">SDK v1</span>
            </div>
          </div>

          {/* Connected grid */}
          <SystemGrid className="grid-cols-1 md:grid-cols-12">
            {/* INSTALL */}
            <Cell className="md:col-span-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-white/60">
                  Install
                </h3>
                <CopyButton text={installCmd} />
              </div>
              <CodeBlock
                language="bash"
                filename="terminal"
                tabs={[
                  {
                    name: "npm",
                    code: installCmd,
                    language: "bash",
                    highlightLines: [1],
                  },
                ]}
              />
            </Cell>

            {/* USAGE */}
            <Cell className="md:col-span-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-white/60">
                  Usage
                </h3>
                <CopyButton text={`${initClient}\n\n${tsQueryPrice}`} />
              </div>
              <CodeBlock
                language="ts"
                filename="quickstart"
                tabs={[
                  {
                    name: "Initialize",
                    code: initClient,
                    language: "ts",
                    highlightLines: [1, 3, 4, 5],
                  },
                  {
                    name: "Query Price",
                    code: tsQueryPrice,
                    language: "ts",
                    highlightLines: [1, 3, 4, 5],
                  },
                ]}
              />
            </Cell>

            {/* LINKS (full width, still connected) */}
            <Cell className="md:col-span-12">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/sdk"
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-white/80 hover:text-white"
                  style={{ borderColor: ACCENT }}
                >
                  Full SDK Docs
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
                <Link
                  href="/api-docs"
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-white/80 hover:text-white"
                  style={{ borderColor: ACCENT }}
                >
                  API Reference
                </Link>
                <Link
                  href="/contracts"
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-white/80 hover:text-white"
                  style={{ borderColor: ACCENT }}
                >
                  Solidity Helpers
                </Link>
              </div>
            </Cell>
          </SystemGrid>
        </System>

        {/* ------------------------------ SUITE SYSTEM (features + status) ------------------------------ */}
        <System className="mx-auto mb-12 w-full max-w-[1280px]">
          <SystemGrid className="grid-cols-1 md:grid-cols-12">
            {/* FEATURE 1 */}
            <Cell className="md:col-span-4">
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-6 w-6 text-white/70" />
                <div>
                  <h3
                    className="mb-1 font-semibold"
                    style={{ color: EMPHASIS }}
                  >
                    Lightning Fast
                  </h3>
                  <p className="text-sm" style={{ color: MUTED }}>
                    Caching + connection pooling for low-latency reads.
                  </p>
                </div>
              </div>
            </Cell>
            {/* FEATURE 2 */}
            <Cell className="md:col-span-4">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-6 w-6 text-white/70" />
                <div>
                  <h3
                    className="mb-1 font-semibold"
                    style={{ color: EMPHASIS }}
                  >
                    Type Safe
                  </h3>
                  <p className="text-sm" style={{ color: MUTED }}>
                    End-to-end TypeScript types with strict mode support.
                  </p>
                </div>
              </div>
            </Cell>
            {/* FEATURE 3 */}
            <Cell className="md:col-span-4">
              <div className="flex items-start gap-3">
                <Code2 className="mt-0.5 h-6 w-6 text-white/70" />
                <div>
                  <h3
                    className="mb-1 font-semibold"
                    style={{ color: EMPHASIS }}
                  >
                    Developer Friendly
                  </h3>
                  <p className="text-sm" style={{ color: MUTED }}>
                    Minimal API surface, pragmatic defaults, clear errors.
                  </p>
                </div>
              </div>
            </Cell>
          </SystemGrid>
        </System>

        {/* -------------------------------- EXAMPLES SYSTEM -------------------------------- */}
        <System id="examples" className="mx-auto mb-12 w-full max-w-[1280px]">
          {/* Tabs bar as part of the same container */}
          <div style={{ borderBottom: `1px solid ${ACCENT}` }}>
            <Tabs defaultValue="verify" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none bg-transparent p-0">
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="verify"
                >
                  Verify Proof
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="subscribe"
                >
                  Subscribe
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="dispute"
                >
                  Disputes
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-none border-0 data-[state=active]:bg-white/5"
                  value="receipt"
                >
                  Receipts
                </TabsTrigger>
              </TabsList>

              {/* Each content is a connected cell (no extra borders around it) */}
              <TabsContent value="verify" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold" style={{ color: EMPHASIS }}>
                        Verify a Round Proof
                      </h3>
                      <CopyButton text={verifyRound} />
                    </div>
                    <CodeBlock
                      language="ts"
                      filename="verify.ts"
                      tabs={[
                        {
                          name: "TypeScript",
                          code: verifyRound,
                          language: "ts",
                          highlightLines: [1, 3, 9],
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>

              <TabsContent value="subscribe" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold" style={{ color: EMPHASIS }}>
                        Real-time Price Updates
                      </h3>
                      <CopyButton text={subscribeCode} />
                    </div>
                    <CodeBlock
                      language="ts"
                      filename="subscribe.ts"
                      tabs={[
                        {
                          name: "TypeScript",
                          code: subscribeCode,
                          language: "ts",
                          highlightLines: [1, 6],
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>

              <TabsContent value="dispute" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold" style={{ color: EMPHASIS }}>
                        Challenge a Round
                      </h3>
                      <CopyButton text={disputeCode} />
                    </div>
                    <CodeBlock
                      language="ts"
                      filename="dispute.ts"
                      tabs={[
                        {
                          name: "TypeScript",
                          code: disputeCode,
                          language: "ts",
                          highlightLines: [2, 10],
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>

              <TabsContent value="receipt" className="m-0">
                <SystemGrid className="grid-cols-1">
                  <Cell>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold" style={{ color: EMPHASIS }}>
                        Verify HTTP-402 Receipt
                      </h3>
                      <CopyButton text={receiptCode} />
                    </div>
                    <CodeBlock
                      language="ts"
                      filename="receipts.ts"
                      tabs={[
                        {
                          name: "TypeScript",
                          code: receiptCode,
                          language: "ts",
                          highlightLines: [1, 6],
                        },
                      ]}
                    />
                  </Cell>
                </SystemGrid>
              </TabsContent>
            </Tabs>
          </div>
        </System>

        {/* -------------------------------- CALL TO ACTION (connected look kept) ---------- */}
        <System className="mx-auto mt-14 w-full max-w-[1280px]">
          <div className="px-6 py-10 text-center md:px-7">
            <h2
              className="mb-2 text-2xl font-semibold"
              style={{ color: EMPHASIS }}
            >
              Ready to integrate?
            </h2>
            <p
              className="mx-auto mb-6 max-w-2xl text-base"
              style={{ color: MUTED }}
            >
              Join protocols using RION for reliable, provable oracle data.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                passHref
                href="/docs"
                className="h-11 rounded-md bg-white  flex items-center justify-center px-5 text-black hover:bg-white/90"
              >
                Read Full Docs
              </Link>
              <a
                href="https://github.com/rionoracle"
                target="_blank"
                className="h-11 rounded-md flex items-center justify-center border-white/20 bg-transparent px-5 text-white hover:bg-white/5"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </System>
      </main>

      <Footer />
    </div>
  );
}
