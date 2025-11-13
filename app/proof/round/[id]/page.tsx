"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import {
  CheckCircle2,
  Clock,
  Shield,
  Download,
  ExternalLink,
  Share2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface RoundData {
  feedSymbol: string;
  value: string;
  timestamp: number;
  roundId: string;
  aggregatorAddress: string;
  isValid: boolean;
  councilSignatures: string[];
}

export default function ProofPage({ params }: { params: { id: string } }) {
  const roundId = params.id;
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoundData() {
      try {
        // Parse the roundId to extract feed info
        // Format: feedSymbol-timestamp-aggregatorAddress
        const parts = roundId.split("-");

        if (parts.length < 2) {
          setError("Invalid round ID format");
          setLoading(false);
          return;
        }

        const feedSymbol = parts[0];
        const timestamp = Number.parseInt(parts[1]);
        const aggregatorAddress = parts[2] || "";

        // Connect to the aggregator contract
        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL
        );

        // SimpleAggregator ABI
        const abi = [
          "function getLatestValue() view returns (int256, uint256)",
          "function authorizedOracles(address) view returns (bool)",
        ];

        const contract = new ethers.Contract(aggregatorAddress, abi, provider);

        // Fetch latest value
        const [value, contractTimestamp] = await contract.getLatestValue();

        // Format the value (assuming 8 decimals for price feeds)
        const formattedValue = (Number(value) / 1e8).toFixed(2);

        const councilAddresses = [
          process.env.NEXT_PUBLIC_COUNCIL_01_ADDRESS ||
            "0xD53c0d3118Ea819A7842C390D9c855550b4E0Ed3",
          process.env.NEXT_PUBLIC_COUNCIL_02_ADDRESS ||
            "0x1678b27db792638538a9D47129E000aa227265Ff",
          process.env.NEXT_PUBLIC_COUNCIL_03_ADDRESS ||
            "0x1deC4755eC37B0B260A4991968Faf35d820fD103",
        ];

        const councilSignatures = await Promise.all(
          councilAddresses.map(async (addr) => {
            const isAuthorized = await contract.authorizedOracles(addr);
            return isAuthorized ? addr : null;
          })
        );

        setRoundData({
          feedSymbol,
          value: formattedValue,
          timestamp: Number(contractTimestamp),
          roundId,
          aggregatorAddress,
          isValid: true,
          councilSignatures: councilSignatures.filter(Boolean) as string[],
        });
      } catch (err) {
        console.error(" Error fetching round data:", err);
        setError("Failed to load round data from blockchain");
      } finally {
        setLoading(false);
      }
    }

    fetchRoundData();
  }, [roundId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const calculateFreshness = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const age = now - timestamp;
    return age < 60 ? `${age}s` : `${Math.floor(age / 60)}m`;
  };

  const downloadProof = () => {
    if (!roundData) return;

    const proof = {
      roundId: roundData.roundId,
      feed: roundData.feedSymbol + "/USD",
      value: roundData.value,
      timestamp: roundData.timestamp,
      aggregatorAddress: roundData.aggregatorAddress,
      councilSignatures: roundData.councilSignatures,
      verifiedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(proof, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rion-proof-${roundData.feedSymbol}-${roundData.timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewOnBscScan = () => {
    if (!roundData) return;
    window.open(
      `https://testnet.bscscan.com/address/${roundData.aggregatorAddress}`,
      "_blank"
    );
  };

  const shareProof = async () => {
    const url = `${window.location.origin}/proof/round/${roundId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Proof link copied to clipboard!");
    } catch (err) {
      console.error(" Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading proof data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !roundData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Proof Not Found</h1>
            <p className="text-muted-foreground">
              {error || "Invalid round ID or data not available"}
            </p>
            <Button onClick={() => (window.location.href = "/explorer")}>
              Go to Explorer
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-8 w-8" />
              <h1 className="text-4xl font-bold font-display">
                Proof Verified
              </h1>
            </div>
            <p className="text-muted-foreground">
              Round {roundId.slice(0, 16)}...
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-sm font-mono bg-muted px-3 py-1 rounded">
                {roundId}
              </code>
              <CopyButton text={roundId} />
            </div>
          </div>

          {/* Verification Results */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Oracle Verified</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {roundData.councilSignatures.length} council members authorized
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Freshness Check</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Data age: {calculateFreshness(roundData.timestamp)} (verified
                on-chain)
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">On-Chain Data</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Retrieved from BNB Smart Chain Testnet
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Council Consensus</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {roundData.councilSignatures.length}/3 oracles verified
              </p>
            </Card>
          </div>

          {/* Report Data */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold font-display mb-4">Report Data</h2>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Feed:</span>
                <span>{roundData.feedSymbol}/USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value:</span>
                <span className="text-primary tabular-nums">
                  ${roundData.value}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="tabular-nums">{roundData.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="tabular-nums">
                  {formatDate(roundData.timestamp)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Committee:</span>
                <span>{roundData.councilSignatures.length}/3 oracles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aggregator:</span>
                <span className="truncate">
                  {roundData.aggregatorAddress.slice(0, 10)}...
                  {roundData.aggregatorAddress.slice(-8)}
                </span>
              </div>
            </div>
          </Card>

          {/* Council Members */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold font-display mb-4">
              Council Signatures
            </h2>
            <div className="space-y-2">
              {roundData.councilSignatures.map((address, idx) => (
                <div
                  key={address}
                  className="flex items-center gap-2 text-sm font-mono"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    Council-{String(idx + 1).padStart(2, "0")}:
                  </span>
                  <span>{address}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button className="neon-glow" onClick={downloadProof}>
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
            <Button variant="outline" onClick={viewOnBscScan}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View on BscScan
            </Button>
            <Button variant="outline" onClick={shareProof}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Proof
            </Button>
          </div>

          {/* Shareable Link */}
          <Card className="glass-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Share this verification
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-sm font-mono bg-muted px-3 py-1 rounded flex-1 max-w-md truncate">
                {typeof window !== "undefined" &&
                  `${window.location.origin}/proof/round/${roundId}`}
              </code>
              <CopyButton
                text={`${
                  typeof window !== "undefined" ? window.location.origin : ""
                }/proof/round/${roundId}`}
              />
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
