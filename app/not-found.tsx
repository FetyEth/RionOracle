"use client";

import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Home, Compass } from "lucide-react";

const BRAND = "#D0FF00";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navigation />

      <main className="relative flex flex-1 items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        {/* corner chrome */}
        <GridCorner position="tl" />
        <GridCorner position="tr" />
        <GridCorner position="bl" />
        <GridCorner position="br" />

        {/* brand glow */}
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div
            className="absolute left-1/2 top-[20%] h-[320px] w-[320px] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(208,255,0,0.35) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative w-full max-w-2xl text-center">
          {/* small pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: BRAND }}
            />
            Route not found
          </div>

          {/* 404 orb */}
          <div className="mb-8 flex justify-center">
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full border-2 shadow-[0_0_40px_rgba(208,255,0,0.55)]"
              style={{
                borderColor: BRAND,
                background:
                  "radial-gradient(circle at 30% 0%, rgba(208,255,0,0.32), transparent 55%)",
              }}
            >
              <span className="text-4xl font-black leading-none tracking-tight">
                404
              </span>
            </div>
          </div>

          {/* copy */}
          <div className="space-y-3 mb-8">
            <h1 className="font-display text-[2.1rem] md:text-[2.5rem] font-semibold tracking-tight">
              Page Not Found
            </h1>
            <p className="mx-auto max-w-lg text-sm md:text-base text-white/60">
              The oracle couldn&apos;t resolve this route. It may have been
              moved, deleted, or never existed. Jump back to a verified feed.
            </p>
          </div>

          {/* primary actions */}
          <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="flex items-center justify-center gap-2 border-0 text-black font-semibold px-6"
              style={{ backgroundColor: BRAND }}
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex items-center justify-center gap-2 border-white/16 bg-transparent text-white hover:bg-white/5 px-6"
            >
              <Link href="/explorer">
                <Compass className="h-4 w-4" />
                Explore Feeds
              </Link>
            </Button>
          </div>

          {/* popular pages row (mirrors nav) */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
              Popular pages
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <QuickLink href="/lab" label="The Lab" />
              <QuickLink href="/disputes" label="Disputes" />
              <QuickLink href="/sdk" label="SDK" />
              <QuickLink href="/status" label="Status" />
              <QuickLink href="/contracts" label="Contracts" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ---------- small chips for popular pages ---------- */

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      passHref
      className="inline-flex items-center gap-1 rounded-full border border-white/14 bg-white/[0.02] px-3 py-1 text-[13px] text-white/75 hover:border-[rgba(208,255,0,0.95)] hover:text-white transition-colors"
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: BRAND }}
      />
      <span>{label}</span>
    </Link>
  );
}

/* ---------- same dotted corner helper as your pillar section ---------- */

function GridCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos =
    position === "tl"
      ? "top-0 left-0"
      : position === "tr"
      ? "top-0 right-0"
      : position === "bl"
      ? "bottom-0 left-0"
      : "bottom-0 right-0";
  const id = `404-dots-${position}`;

  return (
    <div className={`pointer-events-none absolute ${pos} h-56 w-56 opacity-25`}>
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
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
