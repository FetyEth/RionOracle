"use client";

import Link from "next/link";
import { Github, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function GridCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const positionClasses = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} h-4 w-4 pointer-events-none z-10`}
    >
      <svg
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            position === "tl"
              ? "M16 0H4C1.79086 0 0 1.79086 0 4V16"
              : position === "tr"
              ? "M0 0H12C14.2091 0 16 1.79086 16 4V16"
              : position === "bl"
              ? "M16 16H4C1.79086 16 0 14.2091 0 12V0"
              : "M0 16H12C14.2091 16 16 14.2091 16 12V0"
          }
          stroke="rgba(208, 255, 0, 0.3)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-[#0f0f0f]/80">
      <GridCorner position="tl" />
      <GridCorner position="tr" />

      <div className="relative border-b border-white/10">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 py-20 md:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <p className="mb-6 text-[13px] font-medium uppercase tracking-[0.18em] text-white/40">
              MEET FOR A DISCOVERY CALL
            </p>
            <h2 className="text-center font-extrabold leading-[0.95] tracking-tight text-white mb-12">
              <span className="block text-[clamp(4rem,12vw,9rem)] uppercase">
                BUILD
              </span>
              <span className="block text-[clamp(4rem,12vw,9rem)] uppercase bg-[linear-gradient(90deg,#D0FF00_0%,#ccff3d_40%,#f1ffe6_85%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                WITH RION
              </span>
              <span className="block text-[clamp(4rem,12vw,9rem)] uppercase">
                NOW
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://calendly.com/hello-rion-oracle/rion-oracle-integration-meeting
"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full px-8 h-14 text-base font-medium"
                >
                  SCHEDULE NOW <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link href="/docs">
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full px-8 h-14 text-base font-medium"
                >
                  READY TO WORK
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-b border-white/10">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="RION"
                className="h-10 w-auto object-contain brightness-110"
              />
            </div>

            {/* Email */}
            <div className="text-white/70 text-sm md:text-base uppercase tracking-wider">
              hello@rion-oracle.com
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/rionoracle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-gray-400 transition-all hover:border-white hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/rionoracle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-gray-400 transition-all hover:border-white hover:text-white"
                aria-label="X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M22.25 2h-4.9l-5.2 7.22L8.57 2H1l7.8 11.02L1.5 22h4.9l5.52-7.66L15.93 22H23l-8.1-11.37L22.25 2z" />
                </svg>
              </a>
            </div>
            <a
              href="https://calendly.com/hello-rion-oracle/rion-oracle-integration-meeting"
              target="_blank"
              className="bg-transparent flex items-center gap-2 border-2 border-[#D0FF00]/30 text-[#D0FF00] hover:bg-[#D0FF00]/10 hover:border-[#D0FF00] rounded-full px-6 h-10 text-sm font-medium uppercase tracking-wider"
            >
              LET'S CONNECT <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xs text-white/40">
              © 2025, Copyright RION Network
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs uppercase tracking-wider">
              <Link
                href="/"
                className="text-white/50 hover:text-[#D0FF00] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/lab"
                className="text-white/50 hover:text-[#D0FF00] transition-colors"
              >
                Lab
              </Link>
              <Link
                href="/disputes"
                className="text-white/50 hover:text-[#D0FF00] transition-colors"
              >
                Disputes
              </Link>
              <Link
                href="/explorer"
                className="text-white/50 hover:text-[#D0FF00] transition-colors"
              >
                Explorer
              </Link>
              <Link
                href="/predictions"
                className="text-white/50 hover:text-[#D0FF00] transition-colors"
              >
                Predictions
              </Link>
              <Link
                href="/docs"
                className="text-white/50 hover:text-[#D0FF00] transition-colors"
              >
                Docs
              </Link>
            </div>

            {/* Back to Top Arrow */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white/60 transition-all hover:border-[#D0FF00]/30 hover:bg-[#D0FF00]/5 hover:text-[#D0FF00]"
              aria-label="Back to top"
            >
              <ArrowRight className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      <GridCorner position="bl" />
      <GridCorner position="br" />
    </footer>
  );
}
