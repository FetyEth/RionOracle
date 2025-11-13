"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, ArrowUpRight, Github } from "lucide-react";
import { useState } from "react";
import WalletConnect from "./wallet-connect";

const BRAND = "#D0FF00";

type Item = {
  href: string;
  title: string;
  desc: string;
};

const SOLUTIONS: Item[] = [
  {
    href: "/explorer",
    title: "Prices",
    desc: "DeFi push feeds with insurance",
  },
  { href: "/predictions", title: "Predictions", desc: "Outcomes & markets" },
  { href: "/lab", title: "Proof Lab", desc: "Forensic tools for verification" },
  {
    href: "/receipts",
    title: "Receipts / x402",
    desc: "Pull feeds with HTTP-402",
  },
  {
    href: "/disputes",
    title: "Disputes",
    desc: "Challenge incorrect oracle data",
  },
  {
    href: "/por",
    title: "Proof-of-Reserve",
    desc: "Wallet custody attestations",
  },
];

const DEVELOPERS: Item[] = [
  { href: "/sdk", title: "SDK", desc: "Quick start integration guide" },
  {
    href: "/api-docs",
    title: "API Reference",
    desc: "Complete API documentation",
  },
  { href: "/docs", title: "Docs", desc: "Full technical documentation" },
  {
    href: "/contracts",
    title: "Contracts",
    desc: "Deployed contract addresses",
  },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [developersOpen, setDevelopersOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60]">
      <div className="mx-auto w-full max-w-[1280px] px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 pl-2">
            <img
              src="/logo.png"
              alt="RION"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full px-1.5 py-1 bg-[#0f0f0f]">
            {/* Solutions */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-[#E5E5E5]/85 hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/6 transition-colors">
                Solutions
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${
                    solutionsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {solutionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                  <div className="w-[680px] max-w-[calc(100vw-2rem)] rounded-2xl p-6 bg-[#101010] ring-1 ring-white/10 shadow-2xl">
                    <div className="grid grid-cols-2 gap-2">
                      {SOLUTIONS.map(({ href, title, desc }) => (
                        <Link
                          key={href}
                          href={href}
                          className="group rounded-xl px-4 py-3 hover:bg-white/[0.06] transition-colors"
                          onClick={() => setSolutionsOpen(false)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h4 className="mb-0.5 text-sm font-semibold text-[#E5E5E5]">
                                {title}
                              </h4>
                              <p className="text-xs leading-relaxed text-[#E5E5E5]/70">
                                {desc}
                              </p>
                            </div>
                            {/* ALWAYS visible icon on the right */}
                            <ArrowUpRight
                              className="mt-0.5 h-4.5 w-4.5 text-[#E5E5E5]/70 group-hover:text-[#E5E5E5] transition-colors"
                              aria-hidden
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/lab"
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#E5E5E5]/85 hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/6 transition-colors"
            >
              Proof Lab
            </Link>
            <Link
              href="/explorer"
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#E5E5E5]/85 hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/6 transition-colors"
            >
              Explorer
            </Link>
            <Link
              href="/disputes"
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#E5E5E5]/85 hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/6 transition-colors"
            >
              Disputes
            </Link>
            {/* Developers */}
            <div
              className="relative"
              onMouseEnter={() => setDevelopersOpen(true)}
              onMouseLeave={() => setDevelopersOpen(false)}
            >
              <button className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-[#E5E5E5]/85 hover:text-[#E5E5E5] hover:bg-[#E5E5E5]/6 transition-colors">
                Developers
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${
                    developersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {developersOpen && (
                <div className="absolute top-full right-0 pt-3">
                  <div className="w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl p-5 bg-[#101010] ring-1 ring-white/10 shadow-2xl">
                    <div className="grid grid-cols-1 gap-1.5">
                      {DEVELOPERS.map(({ href, title, desc }) => (
                        <Link
                          key={href}
                          href={href}
                          className="group rounded-xl px-3 py-3 hover:bg-white/[0.06] transition-colors"
                          onClick={() => setDevelopersOpen(false)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h4 className="mb-0.5 text-sm font-semibold text-[#E5E5E5]">
                                {title}
                              </h4>
                              <p className="text-xs leading-relaxed text-[#E5E5E5]/70">
                                {desc}
                              </p>
                            </div>
                            <ArrowUpRight
                              className="mt-0.5 h-4.5 w-4.5 text-[#E5E5E5]/70 group-hover:text-[#E5E5E5] transition-colors"
                              aria-hidden
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="mx-1 h-4 w-px"
              style={{ backgroundColor: "rgba(208,255,0,0.15)" }}
            />
            <div className="flex items-center gap-2 px-1.5">
              <a
                href="https://github.com/rionoracle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-gray-400 transition-all hover:border-white hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://x.com/rionoracle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-gray-400 transition-all hover:border-white hover:text-white"
                aria-label="X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4.5 w-4.5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M22.25 2h-4.9l-5.2 7.22L8.57 2H1l7.8 11.02L1.5 22h4.9l5.52-7.66L15.93 22H23l-8.1-11.37L22.25 2z" />
                </svg>
              </a>
            </div>
            <div
              className="mx-1 h-4 w-px"
              style={{ backgroundColor: "rgba(208,255,0,0.15)" }}
            />
            <div className="px-1.5">
              <WalletConnect />
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-[#E5E5E5] pr-3"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden rounded-b-2xl bg-[#101010]/95 backdrop-blur-lg ring-1 ring-[#E5E5E5]/10 py-6 shadow-2xl">
            <div className="flex flex-col gap-6 px-5">
              {/* Navigation Links */}
              <div className="flex flex-col gap-4">
                <div className="text-xs font-semibold text-[#E5E5E5]/50 uppercase tracking-wider px-1">
                  Navigation
                </div>
                <MobileDisclosure
                  label="Solutions"
                  open={solutionsOpen}
                  onToggle={() => setSolutionsOpen((v) => !v)}
                  items={SOLUTIONS}
                  onSelect={() => {
                    setSolutionsOpen(false);
                    setMobileMenuOpen(false);
                  }}
                />

                <Link
                  href="/lab"
                  className="text-sm font-medium text-[#E5E5E5] px-1 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Proof Lab
                </Link>
                <Link
                  href="/explorer"
                  className="text-sm font-medium text-[#E5E5E5] px-1 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explorer
                </Link>
                <Link
                  href="/disputes"
                  className="text-sm font-medium text-[#E5E5E5] px-1 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Disputes
                </Link>

                <MobileDisclosure
                  label="Developers"
                  open={developersOpen}
                  onToggle={() => setDevelopersOpen((v) => !v)}
                  items={DEVELOPERS}
                  onSelect={() => {
                    setDevelopersOpen(false);
                    setMobileMenuOpen(false);
                  }}
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-[#E5E5E5]/10" />

              {/* Wallet Connect */}
              <div className="flex flex-col gap-3">
                <div className="text-xs font-semibold text-[#E5E5E5]/50 uppercase tracking-wider px-1">
                  Connect
                </div>
                <WalletConnect />
              </div>

              {/* Divider */}
              <div className="h-px bg-[#E5E5E5]/10" />

              {/* Social Links */}
              <div className="flex flex-col gap-3">
                <div className="text-xs font-semibold text-[#E5E5E5]/50 uppercase tracking-wider px-1">
                  Follow Us
                </div>
                <div className="flex items-center gap-3 px-1">
                  <a
                    href="https://github.com/rionoracle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-gray-400 transition-all hover:border-white hover:text-white"
                    aria-label="GitHub"
                  >
                    <Github className="h-4.5 w-4.5" />
                  </a>
                  <a
                    href="https://x.com/rionoracle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#111111] text-gray-400 transition-all hover:border-white hover:text-white"
                    aria-label="X"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-4.5 w-4.5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M22.25 2h-4.9l-5.2 7.22L8.57 2H1l7.8 11.02L1.5 22h4.9l5.52-7.66L15.93 22H23l-8.1-11.37L22.25 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ---------- Mobile disclosure with right icon ---------- */
function MobileDisclosure({
  label,
  open,
  onToggle,
  items,
  onSelect,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  items: Item[];
  onSelect: () => void;
}) {
  return (
    <div className="relative px-1">
      <button
        className="flex items-center gap-1 text-sm font-medium text-[#E5E5E5] hover:text-white transition-colors"
        onClick={onToggle}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-[#E5E5E5]/12 bg-[#0f0f0f]/80 p-4">
          <div className="grid grid-cols-1 gap-1">
            {items.map(({ href, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg p-3 text-[#E5E5E5] hover:bg-white/[0.06] transition-colors"
                onClick={onSelect}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="text-xs text-[#E5E5E5]/70 mt-0.5">{desc}</p>
                  </div>
                  <ArrowUpRight
                    className="mt-0.5 h-4 w-4 text-[#E5E5E5]/70 flex-shrink-0"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
