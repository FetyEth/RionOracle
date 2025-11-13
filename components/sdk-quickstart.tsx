"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { CopyButton } from "@/components/copy-button";

const BRAND = "#D0FF00";

// Same dynamic import pattern you use elsewhere
const CodeBlock = dynamic(
  () => import("@/components/ui/code-block").then((m) => m.CodeBlock),
  {
    ssr: false,
    loading: () => (
      <div className="w-full border border-white/10 bg-[#0A0A0A] p-4">
        <div className="h-5 w-28 bg-zinc-800/60 mb-3 animate-pulse" />
        <div className="h-[220px] bg-zinc-900/60 animate-pulse" />
      </div>
    ),
  }
);

export function SDKQuickstart() {
  const installCode = `npm i @rion/oracle`;

  const usageCodeTs = `import { getPrice, verifySig, assertFresh } from "@rion/oracle";

const r = await getPrice("BNB/USD");

if (!verifySig(r)) throw Error("bad signature");

assertFresh(r, 2000);

console.log(r.value);`;

  // minimal Solidity sample (on-chain read pattern)
  const usageCodeSol = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRionRegistry {
    function getPrice(string calldata pair) external view returns (uint256);
}

contract Example {
    IRionRegistry registry;

    constructor(address registry_) {
        registry = IRionRegistry(registry_);
    }

    function readBNBUSD() external view returns (uint256) {
        uint256 price = registry.getPrice("BNB/USD");
        require(price > 0, "stale");
        return price;
    }
}`;

  return (
    <section className="relative bg-black py-16 md:py-24">
      {/* Header (same rhythm as other sections) */}
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
        <div className="mb-8 md:mb-10">
          <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/45">
            TypeScript SDK
          </div>
          <h2 className="text-left font-extrabold tracking-tight text-white leading-[1.04]">
            <span className="block text-[clamp(2.2rem,5vw,3.4rem)]">
              SDK Quickstart
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-white/80">
            Get started in seconds with our TypeScript SDK.
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

      {/* Connected panel */}
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
        <div className="border border-white/10 bg-black overflow-hidden rounded-2xl!">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* INSTALL */}
            <Panel className="md:col-span-4 border-b md:border-b md:border-r border-white/[0.08]">
              <h3
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ color: BRAND }}
              >
                Install
              </h3>

              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-white/50">npm</span>
                <CopyButton text={installCode} />
              </div>

              <CodeBlock
                language="bash"
                filename="terminal"
                tabs={[
                  {
                    name: "npm",
                    code: installCode,
                    language: "bash",
                    highlightLines: [1],
                  },
                ]}
              />
            </Panel>

            {/* USAGE (tabbed: TypeScript / Solidity) */}
            <Panel className="md:col-span-8 border-b border-white/[0.08]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                  Usage
                </h3>
                {/* Keep copy for the default TS snippet; CodeBlock likely has its own copy too */}
                <CopyButton text={usageCodeTs} />
              </div>

              {/* Scroll-bounded code area */}
              <div className="relative max-h-[420px] overflow-auto rounded-lg [scrollbar-gutter:stable]">
                {/* soft fade masks */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black to-transparent" />

                <CodeBlock
                  language="ts"
                  filename="quickstart"
                  tabs={[
                    {
                      name: "Solidity",
                      code: usageCodeSol,
                      language: "solidity",
                      highlightLines: [6, 11, 15],
                    },
                    {
                      name: "TypeScript",
                      code: usageCodeTs,
                      language: "ts",
                      highlightLines: [1, 3, 5, 7],
                    },
                  ]}
                />
              </div>
            </Panel>

            {/* LINKS */}
            <Panel className="md:col-span-12">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/sdk"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
                >
                  API Reference
                </Link>
                <Link
                  href="/contracts"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/35 transition-colors"
                >
                  Contracts
                </Link>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Simple connected-panel wrapper (matches your PillarSections rows) */
function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`bg-black p-6 md:p-7 ${className}`}>{children}</div>;
}
