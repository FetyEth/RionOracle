"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Loader2, Download, Copy, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProofConsole() {
  const [activeTab, setActiveTab] = useState("verify")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [roundId, setRoundId] = useState("0x7f3e9a2b...")
  const [price, setPrice] = useState("612.45")

  // Auto-load latest BNB/USD round on mount
  useEffect(() => {
    const loadLatestRound = async () => {
      // Simulate loading latest round
      await new Promise((resolve) => setTimeout(resolve, 500))
      setRoundId("0x7f3e9a2b...")
      setPrice("612.45")
    }
    loadLatestRound()
  }, [])

  // Simulate live round updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = (612 + Math.random() * 2).toFixed(2)
      setPrice(newPrice)
      setVerified(false)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleVerify = async () => {
    setVerifying(true)
    // Simulate WebCrypto verification
    await new Promise((resolve) => setTimeout(resolve, 800))
    setVerifying(false)
    setVerified(true)
  }

  return (
    <div className="glass rounded-xl p-1 shadow-2xl">
      <div className="rounded-lg bg-black/60 border border-primary/20">
        {/* Terminal header */}
        <div className="flex items-center justify-between border-b border-primary/20 px-4 py-2.5 bg-black/40">
          <div className="flex items-center gap-2">
            <div className="status-dot online" />
            <span className="text-xs font-mono text-muted-foreground">Round {roundId}</span>
            <span className="pulse-soft text-xs font-medium text-primary">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-primary/20 bg-transparent p-0">
            <TabsTrigger
              value="verify"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Verify
            </TabsTrigger>
            <TabsTrigger
              value="receipts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Receipts
            </TabsTrigger>
            <TabsTrigger
              value="recompute"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Recompute
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="verify" className="mt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-muted-foreground font-mono">BNB/USD</span>
                  <span className="text-3xl font-bold tabular-nums font-display text-primary">${price}</span>
                </div>
                <div className="text-xs text-muted-foreground">Committee: 7/10 signers • Freshness: 1.2s</div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="terminal-line flex items-center justify-between">
                  <span className="text-muted-foreground">Signature (BLS)</span>
                  {verified ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-muted-foreground">pending</span>
                  )}
                </div>
                <div className="terminal-line flex items-center justify-between">
                  <span className="text-muted-foreground">Freshness check</span>
                  {verified ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-muted-foreground">pending</span>
                  )}
                </div>
                <div className="terminal-line flex items-center justify-between">
                  <span className="text-muted-foreground">Merkle root</span>
                  {verified ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-muted-foreground">pending</span>
                  )}
                </div>
              </div>

              <Button
                onClick={handleVerify}
                disabled={verifying || verified}
                className={cn("w-full verify-btn micro-ease", verifying && "verifying", verified && "neon-border")}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : verified ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Verified
                  </>
                ) : (
                  "Verify in Browser"
                )}
              </Button>

              {verified && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 micro-ease bg-transparent">
                    <Copy className="mr-2 h-3.5 w-3.5" />
                    Copy Proof
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 micro-ease bg-transparent">
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    Share
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="receipts" className="mt-0 space-y-3">
              <div className="space-y-2 font-mono text-xs">
                <div className="terminal-line">
                  <div className="text-muted-foreground mb-1">Provider</div>
                  <div className="text-primary">Binance • 0x4a2f...</div>
                </div>
                <div className="terminal-line">
                  <div className="text-muted-foreground mb-1">Merkle Path</div>
                  <div className="space-y-1">
                    <div className="merkle-node text-primary cursor-pointer">0x7f3e9a2b... ✓</div>
                    <div className="merkle-node text-muted-foreground hover:text-primary cursor-pointer ml-4">
                      → 0x2b4c8d1a...
                    </div>
                    <div className="merkle-node text-muted-foreground hover:text-primary cursor-pointer ml-8">
                      → 0x9e1f3c7b...
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full micro-ease bg-transparent">
                View Full Proof
              </Button>
            </TabsContent>

            <TabsContent value="recompute" className="mt-0 space-y-3">
              <div className="space-y-2 font-mono text-xs">
                <div className="terminal-line">
                  <div className="text-muted-foreground mb-1">Sources (5)</div>
                  <div className="space-y-1">
                    <div>Binance: $612.43</div>
                    <div>OKX: $612.47</div>
                    <div>PancakeSwap: $612.45</div>
                    <div>Bybit: $612.44</div>
                    <div>Gate.io: $612.46</div>
                  </div>
                </div>
                <div className="terminal-line">
                  <div className="text-muted-foreground mb-1">Median</div>
                  <div className="text-primary">$612.45</div>
                </div>
                <div className="terminal-line">
                  <div className="text-muted-foreground mb-1">Diff</div>
                  <div className="text-primary">0.00%</div>
                </div>
              </div>
              <Button variant="outline" className="w-full micro-ease bg-transparent">
                Download Artifacts
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
