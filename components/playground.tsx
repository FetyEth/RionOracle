"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Play, ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { oracleClient } from "@/lib/oracle-client";

const BRAND = "#D0FF00";

const CodeBlock = dynamic(
  () => import("@/components/ui/code-block").then((m) => m.CodeBlock),
  {
    ssr: false,
    loading: () => (
      <div className="w-full border border-white/10 bg-[#0A0A0A] p-4 rounded-lg">
        <div className="h-5 w-28 bg-zinc-800/60 mb-3 animate-pulse" />
        <div className="h-[220px] bg-zinc-900/60 animate-pulse rounded" />
      </div>
    ),
  }
);

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`bg-black p-6 md:p-7 ${className}`}>{children}</div>;
}

const codeExample = `import { RionClient } from '@rion/sdk'

const client = new RionClient({
  network: 'bnb-testnet'
})

// Get latest price with proof
const result = await client.getPrice('BNB/USD')

console.log({
  price: result.price,
  timestamp: result.timestamp,
  signatures: result.signatures,
  merkleProof: result.merkleProof
})`;

export default function Playground() {
  const [output, setOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    setTxHash("");

    try {
      const prices = await oracleClient.getAllPrices();
      const bnbPrice = prices.get("BNB");

      if (!bnbPrice) {
        throw new Error("Failed to fetch BNB price");
      }

      const result = await oracleClient.submitPriceToOracle(
        "BNB",
        bnbPrice.price,
        "Council-01"
      );

      if (result.status === "error") {
        throw new Error(result.error || "Submission failed");
      }

      setTxHash(result.txHash);
      setOutput({
        pair: "BNB/USD",
        price: `$${bnbPrice.price.toFixed(2)}`,
        timestamp: Math.floor(result.timestamp / 1000),
        txHash: result.txHash,
        oracle: result.oracle,
        status: result.status,
        blockchainUrl: `https://testnet.bscscan.com/tx/${result.txHash}`,
      });
    } catch (error: any) {
      setOutput({
        error: error.message || "Failed to execute",
        timestamp: Math.floor(Date.now() / 1000),
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="relative bg-black py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
        <div className="mb-8 md:mb-10">
          <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Playground
          </div>
          <h2 className="text-left font-extrabold tracking-tight text-white leading-[1.04]">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              Try It <span style={{ color: BRAND }}>Live</span>
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
            Test RION in your browser. Real blockchain transactions, no setup
            required.
          </p>
          <div
            className="mt-8 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
        <div className="border border-white/10 bg-black overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <Panel className="md:col-span-6 border-b md:border-r border-white/[0.08]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                  Code
                </h3>
                <CopyButton text={codeExample} />
              </div>

              <div className="relative max-h-[420px] overflow-auto rounded-lg [scrollbar-gutter:stable]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black to-transparent" />

                <CodeBlock
                  language="ts"
                  filename="example.ts"
                  tabs={[
                    {
                      name: "TypeScript",
                      code: codeExample,
                      language: "ts",
                      highlightLines: [1, 5, 9, 14],
                    },
                  ]}
                />
              </div>

              <div className="mt-5">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/90 hover:text-white hover:border-white/35 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" />
                  {running ? "Running…" : "Run Code"}
                </button>
                <span className="ml-3 text-xs text-white/45">
                  Real blockchain transaction
                </span>
              </div>
            </Panel>

            <Panel className="md:col-span-6 border-b border-white/[0.08]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                  Output
                </h3>
                {txHash && (
                  <a
                    href={`https://testnet.bscscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
                  >
                    View on BscScan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="rounded-lg bg-[#111113] p-4 min-h-[264px]">
                {output ? (
                  <pre className="overflow-x-auto text-sm">
                    <code className="font-mono text-white/90">
                      {JSON.stringify(output, null, 2)}
                    </code>
                  </pre>
                ) : (
                  <div className="flex h-48 items-center justify-center text-white/45">
                    Click{" "}
                    <span className="mx-1 font-medium text-white">
                      Run Code
                    </span>{" "}
                    to see output
                  </div>
                )}
              </div>
            </Panel>

            <Panel className="md:col-span-12">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
                >
                  Read the docs
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
                  href="/explorer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
                >
                  Launch Explorer
                </Link>
                <Link
                  href="/lab"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
                >
                  Open Proof Lab
                </Link>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}
