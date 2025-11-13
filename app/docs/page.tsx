"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  ExternalLink,
  Github,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Code2,
  Rocket,
  Blocks,
  Zap,
  Shield,
  Database,
} from "lucide-react";
import Link from "next/link";

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

interface NavSection {
  title: string;
  id: string;
  items: { title: string; id: string }[];
}

export default function DeveloperPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navSections: NavSection[] = [
    {
      title: "GET STARTED",
      id: "get-started",
      items: [
        { title: "Overview", id: "overview" },
        { title: "Prerequisites", id: "prerequisites" },
        { title: "Quick Start", id: "quickstart" },
        { title: "Installation", id: "installation" },
      ],
    },
    {
      title: "CONFIGURATION",
      id: "configuration",
      items: [
        { title: "Environment Setup", id: "env-setup" },
        { title: "Network Configuration", id: "network-config" },
        { title: "Wallet Management", id: "wallet-management" },
        { title: "API Keys", id: "api-keys" },
      ],
    },
    {
      title: "DEPLOYMENT",
      id: "deployment",
      items: [
        { title: "Deployment Guide", id: "deployment-guide" },
        { title: "Smart Contracts", id: "smart-contracts" },
        { title: "Oracle Node", id: "oracle-node" },
        { title: "Frontend Setup", id: "frontend-setup" },
      ],
    },
    {
      title: "CONTRACTS",
      id: "contracts",
      items: [
        { title: "Core Contracts", id: "core-contracts" },
        { title: "Price Aggregators", id: "price-aggregators" },
        { title: "Prediction Markets", id: "prediction-markets" },
        { title: "Game Aggregators", id: "game-aggregators" },
      ],
    },
    {
      title: "ADVANCED",
      id: "advanced",
      items: [
        { title: "SDK Quickstart", id: "sdk-quickstart" },
        { title: "API Reference", id: "api-reference" },
      ],
    },
  ];

  const allSections = navSections.flatMap((section) => section.items);

  const getCurrentIndex = () =>
    allSections.findIndex((section) => section.id === activeSection);
  const getPreviousSection = () => {
    const index = getCurrentIndex();
    return index > 0 ? allSections[index - 1] : null;
  };
  const getNextSection = () => {
    const index = getCurrentIndex();
    return index < allSections.length - 1 ? allSections[index + 1] : null;
  };

  const navigateToSection = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden rounded-md p-2 transition-colors hover:bg-white/5"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
            <Link href="/" className="flex items-center gap-3 pl-2">
              <img
                src="/logo.png"
                alt="RION"
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-white hover:bg-white/5 hover:text-white/70"
              onClick={() =>
                window.open("https://github.com/rionoracle", "_blank")
              }
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
            <Link
              className="gap-1.5 text-xs text-white flex items-center gap-2 border hover:bg-white/5 hover:text-white/70"
              href={"/"}
              passHref
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-screen-2xl">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-14 z-40 w-56 transform border-r border-white/10 bg-black transition-transform duration-200 ease-in-out lg:sticky lg:block lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto py-6 px-3">
            <nav className="space-y-6">
              {navSections.map((section) => (
                <div key={section.id}>
                  <h4 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    {section.title}
                  </h4>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => navigateToSection(item.id)}
                          className={`block w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                            activeSection === item.id
                              ? "font-medium text-black"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          }`}
                          style={
                            activeSection === item.id
                              ? { backgroundColor: "#D0FF00" }
                              : undefined
                          }
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-4xl">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div>
                <div className="mb-6">
                  <img src="/thumbnail.png" className="rounded-2xl mb-5" />

                  <Badge
                    variant="secondary"
                    className="mb-4 border-white/20 bg-white/10 text-xs font-medium text-white"
                  >
                    Developer Documentation
                  </Badge>
                  <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl text-pretty">
                    RION Oracle Documentation
                  </h1>
                  <p className="text-lg leading-relaxed text-white/70">
                    Complete guide to deploying, configuring, and integrating
                    with the RION Oracle Network on BNB Chain. Get started in
                    minutes with our comprehensive documentation and deploy
                    production-ready oracle infrastructure.
                  </p>
                </div>

                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Zap className="mb-3 h-5 w-5 text-white" />
                    <h3 className="mb-1 font-semibold text-white">
                      Fast Setup
                    </h3>
                    <p className="text-sm text-white/60">
                      Deploy in under 30 minutes
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Shield className="mb-3 h-5 w-5 text-white" />
                    <h3 className="mb-1 font-semibold text-white">Secure</h3>
                    <p className="text-sm text-white/60">
                      BLS signatures & dispute resolution
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Database className="mb-3 h-5 w-5 text-white" />
                    <h3 className="mb-1 font-semibold text-white">
                      Testnet Ready
                    </h3>
                    <p className="text-sm text-white/60">
                      Full BNB testnet support
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    What is RION Oracle?
                  </h3>
                  <p className="mb-4 leading-relaxed text-white/70">
                    RION Oracle is a decentralized oracle network built
                    specifically for BNB Chain that provides secure, real-time
                    data feeds for smart contracts. Our infrastructure supports
                    price feeds, prediction markets, gaming applications, and
                    custom data requests.
                  </p>
                  <p className="leading-relaxed text-white/70">
                    Built with security and reliability at its core, RION Oracle
                    uses BLS signature aggregation for efficient data
                    verification and includes a comprehensive dispute resolution
                    system to ensure data integrity.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Prerequisites Section */}
            {activeSection === "prerequisites" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Prerequisites
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Before you begin, ensure you have the following tools and
                  resources ready. These prerequisites are essential for
                  deploying and running the RION Oracle infrastructure.
                </p>
                <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D0FF00]" />
                    <div>
                      <p className="font-medium text-white">BNB Testnet BNB</p>
                      <p className="mt-1 text-sm text-white/60">
                        Get testnet BNB from{" "}
                        <a
                          href="https://testnet.bnbchain.org/faucet-smart"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-white underline underline-offset-4 hover:text-white/80"
                        >
                          BNB Faucet
                          <ExternalLink className="h-3 w-3" />
                        </a>{" "}
                        (minimum 1 BNB recommended)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D0FF00]" />
                    <div>
                      <p className="font-medium text-white">Foundry</p>
                      <p className="mt-1 text-sm text-white/60">
                        Install from{" "}
                        <a
                          href="https://getfoundry.sh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-white underline underline-offset-4 hover:text-white/80"
                        >
                          getfoundry.sh
                          <ExternalLink className="h-3 w-3" />
                        </a>{" "}
                        for smart contract deployment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D0FF00]" />
                    <div>
                      <p className="font-medium text-white">Node.js 18+</p>
                      <p className="mt-1 text-sm text-white/60">
                        Required for running the oracle node and frontend
                        application
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D0FF00]" />
                    <div>
                      <p className="font-medium text-white">Git</p>
                      <p className="mt-1 text-sm text-white/60">
                        To clone the repository and manage version control
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Start Section */}
            {activeSection === "quickstart" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Quick Start
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Get started with RION Oracle in three simple steps. This guide
                  will walk you through cloning the repository, configuring your
                  environment, and deploying your first oracle instance on BNB
                  testnet.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                        style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      >
                        1
                      </div>
                      <h3 className="font-semibold text-white">
                        Clone the repository
                      </h3>
                    </div>
                    <p className="mb-3 text-sm text-white/60">
                      Clone the RION Oracle repository and navigate to the
                      project directory.
                    </p>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="git clone https://github.com/RionOracle/RionOracle
cd rion-oracle"
                      highlightLines={[1]}
                    />
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                        style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      >
                        2
                      </div>
                      <h3 className="font-semibold text-white">
                        Install dependencies
                      </h3>
                    </div>
                    <p className="mb-3 text-sm text-white/60">
                      Install all required npm packages for the oracle node and
                      smart contracts.
                    </p>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="npm install
cd contracts && forge install"
                    />
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                        style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      >
                        3
                      </div>
                      <h3 className="font-semibold text-white">
                        Configure environment
                      </h3>
                    </div>
                    <p className="mb-3 text-sm text-white/60">
                      Copy the example environment file and add your private key
                      and RPC endpoint.
                    </p>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="cp .env.example .env
nano .env"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Installation Section */}
            {activeSection === "installation" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Installation
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Detailed installation instructions for setting up the RION
                  Oracle development environment on your local machine.
                </p>

                <div className="mb-6 space-y-6">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-white">
                      <Terminal className="h-5 w-5" />
                      System Setup
                    </h3>
                    <p className="mb-4 text-white/70">
                      First, ensure your system has all required tools
                      installed:
                    </p>
                    <CodeBlock
                      language="bash"
                      filename="setup.sh"
                      code="# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
cast --version"
                      highlightLines={[2, 5, 6]}
                    />
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-white">
                      <Code2 className="h-5 w-5" />
                      Project Installation
                    </h3>
                    <p className="mb-4 text-white/70">
                      Clone and set up the project structure:
                    </p>
                    <CodeBlock
                      language="bash"
                      filename="install.sh"
                      code="# Clone repository
git clone https://github.com/RionOracle/RionOracle
cd rion-oracle

# Install Node.js dependencies
npm install

# Install Foundry dependencies
cd contracts
forge install"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Environment Setup Section */}
            {activeSection === "env-setup" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Environment Setup
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Configure your environment variables to connect to the BNB
                  testnet and set up your wallet.
                </p>

                <div className="mb-6 space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Required Environment Variables
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <code className="text-sm font-semibold text-white">
                          PRIVATE_KEY
                        </code>
                        <p className="mt-2 text-sm text-white/60">
                          Your wallet private key for signing transactions.
                          Never commit this to version control.
                        </p>
                        <CodeBlock
                          language="bash"
                          filename=".env"
                          code="PRIVATE_KEY=0x1234567890abcdef..."
                        />
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <code className="text-sm font-semibold text-white">
                          RPC_URL
                        </code>
                        <p className="mt-2 text-sm text-white/60">
                          BNB Chain RPC endpoint for blockchain connection.
                        </p>
                        <CodeBlock
                          language="bash"
                          filename=".env"
                          code="RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545"
                        />
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <code className="text-sm font-semibold text-white">
                          CHAIN_ID
                        </code>
                        <p className="mt-2 text-sm text-white/60">
                          Network chain ID (97 for BNB testnet, 56 for mainnet).
                        </p>
                        <CodeBlock
                          language="bash"
                          filename=".env"
                          code="CHAIN_ID=97"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Network Configuration Section */}
            {activeSection === "network-config" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Network Configuration
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Configure your oracle node to connect to the BNB Chain
                  network.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      BNB Testnet Configuration
                    </h3>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-white">
                            Network Name:
                          </span>
                          <span className="text-white/60">
                            BNB Smart Chain Testnet
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-white">
                            Chain ID:
                          </span>
                          <span className="text-white/60">97</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-white">
                            Currency Symbol:
                          </span>
                          <span className="text-white/60">tBNB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Node Configuration File
                    </h3>
                    <CodeBlock
                      language="json"
                      filename="config.json"
                      code={`{
  "network": {
    "chainId": 97,
    "rpcUrl": "https://data-seed-prebsc-1-s1.bnbchain.org:8545"
  },
  "oracle": {
    "updateInterval": 60000,
    "minConfirmations": 3,
    "gasLimit": 500000
  }
}`}
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Wallet Management Section */}
            {activeSection === "wallet-management" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Wallet Management
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Learn how to properly manage your oracle wallet, including
                  funding and security best practices.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Creating a Wallet
                    </h3>
                    <p className="mb-4 text-white/70">
                      Generate a new wallet specifically for oracle operations:
                    </p>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="cast wallet new"
                    />
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Check Balance
                    </h3>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="cast balance YOUR_ADDRESS --rpc-url https://data-seed-prebsc-1-s1.bnbchain.org:8545"
                    />
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <h4 className="mb-3 font-semibold text-white">
                      Security Best Practices
                    </h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D0FF00]" />
                        Use a dedicated wallet for oracle operations only
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D0FF00]" />
                        Never share your private key or seed phrase
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D0FF00]" />
                        Store private keys in secure environment variables
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* API Keys Section */}
            {activeSection === "api-keys" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  API Keys
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Configure API keys for external data sources and services used
                  by the oracle network.
                </p>

                <div className="space-y-6">
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    Required API Keys
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="mb-1 font-semibold text-white">
                            CoinGecko API
                          </h4>
                          <p className="mb-3 text-sm text-white/60">
                            For cryptocurrency price feeds
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="border-white/20 bg-white/10 text-white"
                        >
                          Required
                        </Badge>
                      </div>
                      <CodeBlock
                        language="bash"
                        filename=".env"
                        code="COINGECKO_API_KEY=your_api_key_here"
                      />
                      <a
                        href="https://www.coingecko.com/en/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm text-white underline underline-offset-4 hover:text-white/80"
                      >
                        Get API Key
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="mb-1 font-semibold text-white">
                            BscScan API
                          </h4>
                          <p className="mb-3 text-sm text-white/60">
                            For blockchain data verification
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="border-white/20 bg-white/10 text-white"
                        >
                          Required
                        </Badge>
                      </div>
                      <CodeBlock
                        language="bash"
                        filename=".env"
                        code="BSCSCAN_API_KEY=your_api_key_here"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Deployment Guide Section */}
            {activeSection === "deployment-guide" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Deployment Guide
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Complete step-by-step guide to deploying the RION Oracle
                  infrastructure to BNB testnet.
                </p>

                <div className="space-y-6">
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-white">
                    <Rocket className="h-5 w-5" />
                    Deployment Steps
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#D0FF00",
                            color: "#000000",
                          }}
                        >
                          1
                        </div>
                        <h4 className="font-semibold text-white">
                          Deploy Smart Contracts
                        </h4>
                      </div>
                      <CodeBlock
                        language="bash"
                        filename="deploy.sh"
                        code="cd contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast"
                      />
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#D0FF00",
                            color: "#000000",
                          }}
                        >
                          2
                        </div>
                        <h4 className="font-semibold text-white">
                          Start Oracle Node
                        </h4>
                      </div>
                      <CodeBlock
                        language="bash"
                        filename="terminal"
                        code="npm run oracle:start"
                      />
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#D0FF00",
                            color: "#000000",
                          }}
                        >
                          3
                        </div>
                        <h4 className="font-semibold text-white">
                          Deploy Frontend
                        </h4>
                      </div>
                      <CodeBlock
                        language="bash"
                        filename="terminal"
                        code="npm run build
npm run deploy"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Smart Contracts Section */}
            {activeSection === "smart-contracts" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Smart Contracts
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Detailed overview of the core smart contracts powering the
                  RION Oracle network.
                </p>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Oracle.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Main oracle contract handling data requests and responses
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Oracle.sol
                    </code>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Aggregator.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Aggregates responses from multiple oracle nodes
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Aggregator.sol
                    </code>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Registry.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Manages registered oracle nodes and permissions
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Registry.sol
                    </code>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Disputes.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Handles dispute resolution and data verification
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Disputes.sol
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Deployed Addresses
                  </h3>
                  <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Simple Aggregator
                      </span>
                      <code className="text-xs text-white/60">
                        0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Feed Registry
                      </span>
                      <code className="text-xs text-white/60">
                        0x764dA9aeFC10B9AF61720FeFE9F802FF243D3ad7
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Insurance Vault
                      </span>
                      <code className="text-xs text-white/60">
                        0xB7174029bf1d6c34e49321c2b1Bc7B18554Da554
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Dispute Manager
                      </span>
                      <code className="text-xs text-white/60">
                        0x84fC1d72A07c41D8d636f969d5C6d5Bc24c7DE1C
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Receipt Store
                      </span>
                      <code className="text-xs text-white/60">
                        0x9618Ed04423Bf2d3a87e090868227B540Ec0396E
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Main Aggregator
                      </span>
                      <code className="text-xs text-white/60">
                        0xa53d9482d0414D4F1a9EB185d6210Eb3950bf5BA
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Contract Interaction Example
                  </h3>
                  <CodeBlock
                    language="solidity"
                    filename="Example.sol"
                    code={`// Request price data
function requestPrice(string memory pair) external returns (uint256) {
  return oracle.requestData(pair, address(this));
}

// Receive oracle response
function fulfillRequest(
  uint256 requestId,
  uint256 price
) external onlyOracle {
  prices[requestId] = price;
  emit PriceReceived(requestId, price);
}`}
                    highlightLines={[2, 7, 11]}
                  />
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Oracle Node Section */}
            {activeSection === "oracle-node" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Oracle Node
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Set up and run your own oracle node to participate in the RION
                  Oracle network.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Starting the Node
                    </h3>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="npm run oracle:start"
                    />
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Node Status
                    </h3>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="curl http://localhost:3001/health"
                    />
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Monitoring
                    </h3>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="npm run oracle:logs"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Frontend Setup Section */}
            {activeSection === "frontend-setup" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Frontend Setup
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Deploy and configure the RION Oracle dashboard for monitoring
                  and management.
                </p>
                <CodeBlock
                  language="bash"
                  filename="terminal"
                  code="npm run dev
# Open http://localhost:3000"
                />

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Core Contracts Section */}
            {activeSection === "core-contracts" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Core Contracts
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  In-depth documentation of core contract architecture and
                  functions.
                </p>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Oracle.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Main oracle contract handling data requests and responses
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Oracle.sol
                    </code>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Aggregator.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Aggregates responses from multiple oracle nodes
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Aggregator.sol
                    </code>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Registry.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Manages registered oracle nodes and permissions
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Registry.sol
                    </code>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <Blocks className="mb-3 h-6 w-6 text-white" />
                    <h3 className="mb-2 font-semibold text-white">
                      Disputes.sol
                    </h3>
                    <p className="mb-3 text-sm text-white/60">
                      Handles dispute resolution and data verification
                    </p>
                    <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/80">
                      contracts/core/Disputes.sol
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Deployed Addresses
                  </h3>
                  <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Simple Aggregator
                      </span>
                      <code className="text-xs text-white/60">
                        0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Feed Registry
                      </span>
                      <code className="text-xs text-white/60">
                        0x764dA9aeFC10B9AF61720FeFE9F802FF243D3ad7
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Insurance Vault
                      </span>
                      <code className="text-xs text-white/60">
                        0xB7174029bf1d6c34e49321c2b1Bc7B18554Da554
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Dispute Manager
                      </span>
                      <code className="text-xs text-white/60">
                        0x84fC1d72A07c41D8d636f969d5C6d5Bc24c7DE1C
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Receipt Store
                      </span>
                      <code className="text-xs text-white/60">
                        0x9618Ed04423Bf2d3a87e090868227B540Ec0396E
                      </code>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-white">
                        Main Aggregator
                      </span>
                      <code className="text-xs text-white/60">
                        0xa53d9482d0414D4F1a9EB185d6210Eb3950bf5BA
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Contract Interaction Example
                  </h3>
                  <CodeBlock
                    language="solidity"
                    filename="Example.sol"
                    code={`// Request price data
function requestPrice(string memory pair) external returns (uint256) {
  return oracle.requestData(pair, address(this));
}

// Receive oracle response
function fulfillRequest(
  uint256 requestId,
  uint256 price
) external onlyOracle {
  prices[requestId] = price;
  emit PriceReceived(requestId, price);
}`}
                    highlightLines={[2, 7, 11]}
                  />
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Price Aggregators Section */}
            {activeSection === "price-aggregators" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Price Aggregators
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Multi-asset price aggregators providing real-time
                  cryptocurrency price feeds on BNB Chain.
                </p>

                <div className="mb-6 space-y-6">
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Deployed Price Aggregators
                    </h3>
                    <p className="mb-4 text-sm text-white/60">
                      Each aggregator provides price feeds for a specific
                      cryptocurrency pair against USD.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            BNB Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            BNB/USD
                          </Badge>
                        </div>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            ETH Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            ETH/USD
                          </Badge>
                        </div>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0xf20340BaA91b93C773E5F1db8e296D46D1fec994
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            BTC Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            BTC/USD
                          </Badge>
                        </div>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x34c5E550c9048293c5Ea0908c9EDF5A2Dd7411aC
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            SOL Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            SOL/USD
                          </Badge>
                        </div>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x5713E03e9C938Ea5C117014bDEf215070f1402De
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            XRP Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            XRP/USD
                          </Badge>
                        </div>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x2B4D6eb2Fb9DABB7b4ee6eff36514dAc5a3cE4b9
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            DOGE Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            DOGE/USD
                          </Badge>
                        </div>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x5EA49AdD76cfdB62Ed6835C110e815C246b37BF9
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            LINK Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            LINK/USD
                          </Badge>
                        </div>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x34DBd587708163694bc10f90Db61F67d63546152
                        </code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Usage Example
                    </h3>
                    <CodeBlock
                      language="solidity"
                      filename="PriceConsumer.sol"
                      code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPriceAggregator {
    function latestAnswer() external view returns (int256);
    function latestTimestamp() external view returns (uint256);
}

contract PriceConsumer {
    IPriceAggregator public bnbAggregator;
    
    constructor(address _aggregator) {
        bnbAggregator = IPriceAggregator(_aggregator);
    }
    
    function getBNBPrice() external view returns (int256) {
        return bnbAggregator.latestAnswer();
    }
}`}
                      highlightLines={[5, 6, 10, 17]}
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Prediction Markets Section */}
            {activeSection === "prediction-markets" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Prediction Markets
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Build decentralized prediction markets powered by RION Oracle
                  data feeds for sports outcomes and events.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Prediction Market Contract
                    </h3>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h4 className="mb-2 font-semibold text-white">
                            PredictionMarket.sol
                          </h4>
                          <p className="mb-3 text-sm text-white/60">
                            Main prediction market contract for creating and
                            resolving markets based on oracle data.
                          </p>
                        </div>
                      </div>
                      <div className="rounded bg-black/40 p-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-xs font-medium text-white">
                            Contract Address:
                          </span>
                          <code className="text-xs text-white/60">
                            0x2d55B7461d9FA899D188eb7F9d754Bb8bfbB2b64
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Integration Example
                    </h3>
                    <CodeBlock
                      language="solidity"
                      filename="MarketExample.sol"
                      code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPredictionMarket {
    function createMarket(
        string calldata question,
        uint256 closingTime,
        address oracleAggregator
    ) external returns (uint256 marketId);
    
    function placeBet(
        uint256 marketId,
        bool outcome
    ) external payable;
}

contract MyMarket {
    IPredictionMarket market;
    
    constructor(address _market) {
        market = IPredictionMarket(_market);
    }
    
    function createBNBMarket() external {
        market.createMarket(
            "Will BNB price exceed $1000?",
            block.timestamp + 7 days,
            0x2aB75641Dccb39a7E3ed9790CcCd223B9EA4009F
        );
    }
}`}
                      highlightLines={[5, 11, 25]}
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Game Aggregators Section */}
            {activeSection === "game-aggregators" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  Game Aggregators
                </h2>
                <p className="mb-6 leading-relaxed text-white/70">
                  Sports and gaming data aggregators for building prediction
                  markets, fantasy games, and betting applications.
                </p>

                <div className="space-y-6">
                  <div className="rounded-lg border border-[#D0FF00]/20 bg-[#D0FF00]/5 p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-white">
                      <Rocket className="h-5 w-5 text-[#D0FF00]" />
                      Deploy Your Own Game Aggregators
                    </h3>
                    <p className="mb-4 text-sm text-white/70">
                      Deploy fresh game aggregator contracts and prediction
                      market infrastructure to BNB testnet.
                    </p>

                    <div className="mb-4 rounded-lg border border-white/10 bg-black/40 p-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                        <Github className="h-4 w-4" />
                        Installation
                      </h4>
                      <p className="mb-3 text-xs text-white/60">
                        Clone the game aggregator repository from GitHub:
                      </p>
                      <a
                        href="https://github.com/your-org/rion-game-aggregators"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-[#D0FF00] underline underline-offset-4 hover:text-[#D0FF00]/80"
                      >
                        View on GitHub
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <CodeBlock
                        language="bash"
                        filename="terminal"
                        code={`git clone https://github.com/RionOracle/rion-game-aggregators
cd rion-game-aggregators
npm install`}
                      />
                    </div>

                    <div className="mb-4 rounded-lg border border-white/10 bg-black/40 p-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                        <Terminal className="h-4 w-4" />
                        Deployment Script
                      </h4>
                      <p className="mb-3 text-xs text-white/60">
                        The main deployment file is{" "}
                        <code className="rounded bg-white/10 px-1 py-0.5 text-xs">
                          scripts/deploy.js
                        </code>
                        . This script deploys 5 GameOutcomeAggregator contracts
                        and 1 PredictionMarket contract.
                      </p>
                      <CodeBlock
                        language="bash"
                        filename="terminal"
                        code="npm run deploy"
                        highlightLines={[1]}
                      />
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                      <h4 className="mb-3 text-sm font-semibold text-white">
                        What Gets Deployed
                      </h4>
                      <ul className="space-y-2 text-xs text-white/70">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D0FF00]" />
                          <span>
                            <strong className="text-white">
                              5 GameOutcomeAggregator contracts
                            </strong>{" "}
                            for different sports/events
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D0FF00]" />
                          <span>
                            <strong className="text-white">
                              1 PredictionMarket contract
                            </strong>{" "}
                            that manages all betting logic
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D0FF00]" />
                          <span>
                            All aggregators are automatically registered to the
                            PredictionMarket
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D0FF00]" />
                          <span>
                            Contract addresses are output for adding to your
                            environment variables
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Deployed Game Aggregators
                    </h3>
                    <p className="mb-4 text-sm text-white/60">
                      Each game aggregator provides verified sports and gaming
                      outcomes for specific events or matches.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            Game 1 Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            SPORTS
                          </Badge>
                        </div>
                        <p className="mb-2 text-xs text-white/60">
                          NBA game outcomes and scores
                        </p>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x6111Eb7cff0995971236FBAe93440e290076B5F3
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            Game 2 Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            SPORTS
                          </Badge>
                        </div>
                        <p className="mb-2 text-xs text-white/60">
                          NFL game outcomes and scores
                        </p>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x35D0FbCf5942cf183414D1aD07818e3D686cEeDf
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            Game 3 Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            SPORTS
                          </Badge>
                        </div>
                        <p className="mb-2 text-xs text-white/60">
                          Soccer match results
                        </p>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x12BA3FCC0AA87181a36B3FB0F41d104C2CF34409
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            Game 4 Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            ESPORTS
                          </Badge>
                        </div>
                        <p className="mb-2 text-xs text-white/60">
                          eSports tournament results
                        </p>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x741eC326d2D88944F8328687D95b70BD386c4A69
                        </code>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-white">
                            Game 5 Aggregator
                          </h4>
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            GAMING
                          </Badge>
                        </div>
                        <p className="mb-2 text-xs text-white/60">
                          Casino and lottery results
                        </p>
                        <code className="block rounded bg-black/40 px-2 py-1 text-xs text-white/60">
                          0x9fE6a709f89d4547C9eE4A5cfF81900ea7d28aa8
                        </code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      GameOutcomeAggregator Contract
                    </h3>
                    <p className="mb-4 text-sm text-white/60">
                      The core contract that handles betting, outcomes, and
                      payouts for game predictions.
                    </p>
                    <CodeBlock
                      language="solidity"
                      filename="GameOutcomeAggregator.sol"
                      code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GameOutcomeAggregator {
    address public oracle;
    uint8 public finalOutcome;
    bool public isFinalized;

    mapping(uint8 => uint256) public outcomeTotals;
    mapping(address => mapping(uint8 => uint256)) public userBets;

    event BetPlaced(address indexed user, uint8 outcome, uint256 amount);
    event OutcomeFinalized(uint8 outcome);
    event Claimed(address indexed user, uint256 amount);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }

    constructor() {
        oracle = msg.sender;
        isFinalized = false;
    }

    function placeBet(uint8 _outcome) external payable {
        require(!isFinalized, "Betting is closed");
        require(_outcome >= 1 && _outcome <= 3, "Invalid outcome");
        require(msg.value > 0, "Must send BNB");

        userBets[msg.sender][_outcome] += msg.value;
        outcomeTotals[_outcome] += msg.value;

        emit BetPlaced(msg.sender, _outcome, msg.value);
    }

    function finalize(uint8 _outcome) external onlyOracle {
        require(!isFinalized, "Already finalized");
        require(_outcome >= 1 && _outcome <= 3, "Invalid outcome");

        finalOutcome = _outcome;
        isFinalized = true;

        emit OutcomeFinalized(_outcome);
    }

    function claim() external {
        require(isFinalized, "Not finalized yet");

        uint256 userBet = userBets[msg.sender][finalOutcome];
        require(userBet > 0, "No winning bet");

        uint256 totalWinningBets = outcomeTotals[finalOutcome];
        uint256 totalPool = address(this).balance;

        uint256 payout = (userBet * totalPool) / totalWinningBets;

        userBets[msg.sender][finalOutcome] = 0;

        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Transfer failed");

        emit Claimed(msg.sender, payout);
    }

    function setOracle(address _newOracle) external onlyOracle {
        oracle = _newOracle;
    }
}`}
                      highlightLines={[25, 36, 46]}
                    />
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Integration Example
                    </h3>
                    <CodeBlock
                      language="solidity"
                      filename="GameConsumer.sol"
                      code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGameAggregator {
    function placeBet(uint8 outcome) external payable;
    function claim() external;
    function isFinalized() external view returns (bool);
}

contract MyBettingApp {
    IGameAggregator public gameAggregator;
    
    constructor(address _aggregator) {
        gameAggregator = IGameAggregator(_aggregator);
    }
    
    function betOnTeam(uint8 team) external payable {
        // 1 = Home Win, 2 = Draw, 3 = Away Win
        gameAggregator.placeBet{value: msg.value}(team);
    }
    
    function claimWinnings() external {
        require(gameAggregator.isFinalized(), "Game not finished");
        gameAggregator.claim();
    }
}`}
                      highlightLines={[5, 19, 24]}
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* SDK Quickstart Section */}
            {activeSection === "sdk-quickstart" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  SDK Quickstart
                </h2>
                <p className="mb-8 leading-relaxed text-white/70">
                  Get started with the RION Oracle TypeScript SDK in seconds.
                  Simple integration for reading oracle data.
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Installation
                    </h3>
                    <CodeBlock
                      language="bash"
                      filename="terminal"
                      code="npm i @rion/oracle"
                      highlightLines={[1]}
                    />
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Usage Examples
                    </h3>
                    <CodeBlock
                      language="ts"
                      filename="quickstart"
                      tabs={[
                        {
                          name: "TypeScript",
                          code: `import { getPrice, verifySig, assertFresh } from "@rion/oracle";

const r = await getPrice("BNB/USD");

if (!verifySig(r)) throw Error("bad signature");

assertFresh(r, 2000);

console.log(r.value);`,
                          language: "ts",
                          highlightLines: [1, 3, 5, 7],
                        },
                        {
                          name: "Solidity",
                          code: `// SPDX-License-Identifier: MIT
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
}`,
                          language: "solidity",
                          highlightLines: [6, 11, 15],
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  {getNextSection() && (
                    <Button
                      onClick={() => navigateToSection(getNextSection()!.id)}
                      style={{ backgroundColor: "#D0FF00", color: "#000000" }}
                      className="gap-2 font-medium hover:opacity-90"
                    >
                      {getNextSection()!.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* API Reference Section */}
            {activeSection === "api-reference" && (
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-pretty">
                  API Reference
                </h2>
                <p className="mb-8 leading-relaxed text-white/70">
                  Complete REST and WebSocket API documentation for querying
                  oracle data and managing disputes.
                </p>

                <div className="space-y-8">
                  <div className="mb-8 grid gap-3 sm:grid-cols-4">
                    <div className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <Code2 className="mb-2 h-4 w-4 text-white/60" />
                      <h4 className="mb-1 text-sm font-semibold text-white">
                        REST API
                      </h4>
                      <p className="text-xs text-white/60">HTTP endpoints</p>
                    </div>
                    <div className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <Zap className="mb-2 h-4 w-4 text-white/60" />
                      <h4 className="mb-1 text-sm font-semibold text-white">
                        WebSocket
                      </h4>
                      <p className="text-xs text-white/60">Real-time feeds</p>
                    </div>
                    <div className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <Shield className="mb-2 h-4 w-4 text-white/60" />
                      <h4 className="mb-1 text-sm font-semibold text-white">
                        Auth
                      </h4>
                      <p className="text-xs text-white/60">API keys & JWT</p>
                    </div>
                    <div className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <Database className="mb-2 h-4 w-4 text-white/60" />
                      <h4 className="mb-1 text-sm font-semibold text-white">
                        Rate Limits
                      </h4>
                      <p className="text-xs text-white/60">Usage tiers</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Price Feeds
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                        <div className="mb-3 flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className="border-white/20 bg-white/10 font-mono text-xs text-white"
                          >
                            GET
                          </Badge>
                          <code className="font-mono text-sm text-white">
                            /api/v1/feeds/:pair
                          </code>
                        </div>
                        <p className="mb-3 text-sm text-white/60">
                          Get latest price for a specific pair
                        </p>
                        <CodeBlock
                          language="json"
                          filename="response.json"
                          code={`{
  "pair": "BNB/USD",
  "price": "9.79",
  "timestamp": ${Math.floor(Date.now() / 1000)},
  "roundId": 204,
  "verified": true
}`}
                          highlightLines={[3, 4, 5]}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      WebSocket Streaming
                    </h3>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <CodeBlock
                        language="ts"
                        filename="ws.ts"
                        code={`// Connect to WebSocket
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
}`}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Authentication
                    </h3>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <p className="mb-4 text-sm text-white/70">
                        Include your API key in the Authorization header:
                      </p>
                      <CodeBlock
                        language="bash"
                        filename="curl"
                        code='curl -H "Authorization: Bearer <API_KEY>" https://api.rion/v1/feeds'
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                  {getPreviousSection() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigateToSection(getPreviousSection()!.id)
                      }
                      className="gap-2 border-white/20 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {getPreviousSection()!.title}
                    </Button>
                  )}
                  <div className="flex-1" />
                  <Button
                    variant="outline"
                    onClick={() => navigateToSection("overview")}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    Back to top
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
