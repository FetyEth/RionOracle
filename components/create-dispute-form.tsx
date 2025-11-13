"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface CreateDisputeFormProps {
  walletAddress?: string | null;
  onSuccess?: () => void;
}

const BRAND = "#D0FF00";

export function CreateDisputeForm({
  walletAddress,
  onSuccess,
}: CreateDisputeFormProps) {
  const [feedId, setFeedId] = useState("");
  const [roundId, setRoundId] = useState("");
  const [claimedValue, setClaimedValue] = useState("");
  const [evidence, setEvidence] = useState("");
  const [stake, setStake] = useState("0.1");
  const [showSimulation, setShowSimulation] = useState(false);

  const feeds = [
    { id: "BNB/USD", address: "demo-bnb" },
    { id: "ETH/USD", address: "demo-eth" },
    { id: "BTC/USD", address: "demo-btc" },
    { id: "SOL/USD", address: "demo-sol" },
    { id: "XRP/USD", address: "demo-xrp" },
    { id: "DOGE/USD", address: "demo-doge" },
    { id: "LINK/USD", address: "demo-link" },
  ];

  const isValidStake = Number.parseFloat(stake || "0") >= 0.1;
  const isFormComplete = !!feedId && !!roundId && !!claimedValue && !!evidence;

  const handleDemoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormComplete || !isValidStake) {
      setShowSimulation(false);
      return;
    }

    setShowSimulation(true);

    // In production you'd call DisputeManager here, then onSuccess?.()
    // onSuccess?.();

    setTimeout(() => {
      document
        .getElementById("simulation-message")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  return (
    <section className="relative bg-[#050505] rounded-3xl border border-white/10 overflow-hidden">
      {/* subtle glow */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: BRAND }}
      />

      {/* top header row */}
      <div className="relative border-b border-white/[0.08] bg-gradient-to-r from-[#0a0a0a] via-black to-[#050505] px-6 md:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Launch a Challenge
              </h3>
              <div className="px-2 py-0.5 text-[10px] font-bold bg-[#D0FF00] font-mono text-black rounded-full flex items-center gap-1 uppercase tracking-[0.18em]">
                Demo
              </div>
            </div>
            <p className="text-xs md:text-sm text-white/60 max-w-md">
              Simulate a dispute against a price round. In production, this flow
              will call the <span className="font-mono">DisputeManager</span>{" "}
              contract on BNB Testnet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px]">
            {walletAddress ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#D0FF00]" />
                Challenger: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-white/60">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Connect a wallet to file real disputes soon
              </span>
            )}
            <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-white/50">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              BNB Testnet • Governance Demo
            </span>
          </div>
        </div>
      </div>

      {/* main grid */}
      <form
        onSubmit={handleDemoSubmit}
        className="relative p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8"
      >
        {/* left: form fields */}
        <div className="lg:col-span-3 space-y-6">
          {/* step indicators */}
          <ol className="grid grid-cols-3 gap-2 text-[11px] text-white/55 mb-1">
            <StepBadge index={1} label="Select feed & round" active />
            <StepBadge
              index={2}
              label="Claim correct value"
              active={!!roundId}
            />
            <StepBadge
              index={3}
              label="Provide evidence & stake"
              active={!!evidence}
            />
          </ol>

          {/* row 1 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="feed" className="text-white/80 text-xs">
                Oracle Feed
              </Label>
              <Select value={feedId} onValueChange={setFeedId}>
                <SelectTrigger id="feed" className="bg-black border-white/15">
                  <SelectValue placeholder="Select feed" />
                </SelectTrigger>
                <SelectContent>
                  {feeds.map((feed) => (
                    <SelectItem key={feed.id} value={feed.id}>
                      {feed.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-white/40">
                Choose the price feed you believe is wrong.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roundId" className="text-white/80 text-xs">
                Round ID
              </Label>
              <Input
                id="roundId"
                type="number"
                placeholder="e.g., 204"
                value={roundId}
                onChange={(e) => setRoundId(e.target.value)}
                className="bg-black border-white/15"
              />
              <p className="text-[11px] text-white/40">
                The round you’re challenging from the aggregator.
              </p>
            </div>
          </div>

          {/* row 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="claimedValue" className="text-white/80 text-xs">
                Claimed Correct Value (USD)
              </Label>
              <Input
                id="claimedValue"
                type="number"
                step="0.01"
                placeholder="e.g., 980.00"
                value={claimedValue}
                onChange={(e) => setClaimedValue(e.target.value)}
                className="bg-black border-white/15"
              />
              <p className="text-[11px] text-white/40">
                What the price should have been at that round.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stake" className="text-white/80 text-xs">
                Stake Amount (BNB)
              </Label>
              <Input
                id="stake"
                type="number"
                step="0.01"
                min="0.1"
                placeholder="0.1"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="bg-black border-white/15"
              />
              <p className="text-[11px] text-white/40">
                Minimum 0.1 BNB stake required to discourage spam.
              </p>
              {!isValidStake && (
                <p className="text-[11px] text-red-400 mt-1">
                  Stake must be at least 0.1 BNB to open a dispute.
                </p>
              )}
            </div>
          </div>

          {/* evidence */}
          <div className="space-y-2">
            <Label htmlFor="evidence" className="text-white/80 text-xs">
              Evidence
            </Label>
            <Textarea
              id="evidence"
              placeholder="Explain why the oracle data is incorrect. Include sources, market data, timestamps, and any reference exchanges you used."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={4}
              className="resize-none bg-black border-white/15"
            />
            <p className="text-[11px] text-white/40">
              This will be shown to voters and stored with the dispute.
            </p>
          </div>

          {/* submit */}
          <div className="space-y-3">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90"
            >
              {isFormComplete && isValidStake
                ? `Simulate Dispute (${stake} BNB Stake)`
                : "Fill required fields to simulate"}
            </Button>
            <p className="text-[11px] text-center text-white/40">
              Demo only: No real transactions are sent. On BNB Testnet, this
              will trigger a real dispute against the live oracle.
            </p>
          </div>

          {/* original “Coming soon” text, restored */}
          <div className="text-center pt-1">
            <p className="text-sm text-white/40">
              Coming soon: Connect wallet to file real disputes
            </p>
          </div>
        </div>

        {/* right: live preview & explainer */}
        <div className="lg:col-span-2 space-y-4">
          {/* dispute preview card */}
          <div className="rounded-2xl border border-white/15 bg-black/70 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-1">
                  Dispute Preview
                </p>
                <p className="text-sm text-white/70">
                  This is how your challenge would appear to the network.
                </p>
              </div>
              <div className="px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-[10px] text-white/60 uppercase tracking-[0.14em]">
                Status: Draft
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <PreviewField
                label="Feed"
                value={feedId || "—"}
                highlight={!!feedId}
              />
              <PreviewField
                label="Round ID"
                value={roundId || "—"}
                highlight={!!roundId}
              />
              <PreviewField
                label="Claimed Value"
                value={claimedValue ? `$${claimedValue}` : "—"}
                highlight={!!claimedValue}
              />
              <PreviewField
                label="Stake"
                value={`${stake || "0.00"} BNB`}
                highlight={isValidStake}
              />
            </div>

            <div className="text-xs text-white/60 border-t border-white/10 pt-3 mt-3">
              <span className="font-semibold text-white/80">Evidence:</span>{" "}
              {evidence
                ? evidence.slice(0, 160) + (evidence.length > 160 ? "…" : "")
                : "Your written evidence will be displayed here for voters."}
            </div>
          </div>

          {/* flow explainer */}
          <div className="rounded-2xl border border-white/10 bg-black/70 p-5 md:p-6 space-y-3">
            <h4 className="text-sm font-semibold text-white">
              What happens on-chain?
            </h4>
            <ol className="text-xs text-white/60 space-y-1.5 ml-4 list-decimal">
              <li>
                Your transaction calls the DisputeManager with your inputs.
              </li>
              <li>The dispute enters an evidence window for review.</li>
              <li>Validators and stakeholders vote to slash or reject.</li>
              <li>
                If approved, the faulty oracle signers are slashed and you
                receive a payout.
              </li>
              <li>If rejected, your stake is routed to the insurance vault.</li>
            </ol>
          </div>

          {/* simulation message with new style */}
          {showSimulation && (
            <div
              id="simulation-message"
              className="mt-3 rounded-2xl border border-white/12 bg-[#050505] p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Demo
                  </h4>
                  <ul className="space-y-1.5 text-xs text-white/75">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D0FF00] flex-shrink-0 mt-0.5" />
                      <span>
                        Open a dispute for{" "}
                        <strong>{feedId || "BNB/USD"}</strong> Round #
                        {roundId || "232"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D0FF00] flex-shrink-0 mt-0.5" />
                      <span>
                        Lock <strong>{stake || "0.1"} BNB</strong> as your
                        challenge stake
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D0FF00] flex-shrink-0 mt-0.5" />
                      <span>Publish your evidence to the dispute record</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D0FF00] flex-shrink-0 mt-0.5" />
                      <span>Start the on-chain voting period</span>
                    </li>
                  </ul>
                  <p className="text-[11px] text-white/55 mt-3">
                    Once RION Disputes are live, this same flow will trigger a
                    real on-chain challenge on BNB Testnet.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

/* ───────────────────── tiny helpers ───────────────────── */

function StepBadge({
  index,
  label,
  active,
}: {
  index: number;
  label: string;
  active?: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
          active
            ? "bg-[#D0FF00] text-black"
            : "border border-white/20 text-white/60"
        }`}
      >
        {index}
      </span>
      <span className="text-[11px] text-white/50 leading-snug">{label}</span>
    </li>
  );
}

function PreviewField({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/70 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 mb-1">
        {label}
      </div>
      <div
        className={`text-xs font-mono ${
          highlight ? "text-white" : "text-white/40"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
