"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Copy, ExternalLink, FileText, Loader2 } from "lucide-react"
import Link from "next/link"

export function ReceiptProver() {
  const [receiptHash, setReceiptHash] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerify = async () => {
    setVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setVerifying(false)
    setVerified(true)
  }

  const exampleReceipt = {
    hash: "0x7f3e9a2b4c8d1a5f3e7b9c2d4a6f8e1b3c5d7a9f",
    provider: "Binance",
    providerAddress: "0x4a2f...8d1b",
    data: { pair: "BNB/USD", price: 612.45, timestamp: 1704067200 },
    signature: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
    merklePath: ["0x7f3e9a2b...", "0x2b4c8d1a...", "0x9e1f3c7b...", "receiptsRoot"],
  }

  return (
    <section className="container mx-auto px-4 py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-6 glass px-6 py-3 rounded-full border border-primary/30">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">HTTP-402 Receipts</span>
        </div>
        <h2 className="text-6xl md:text-7xl font-bold font-display mb-6 tracking-tighter">
          Verify a <span className="gradient-text">Receipt</span>
        </h2>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
          Cryptographic proof of data delivery. Receipts or it didn't happen.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="glass-card p-12 border-2 border-primary/30 shadow-2xl">
          <div className="mb-8">
            <label className="text-sm font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">
              Receipt Hash
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="0x7f3e9a2b4c8d1a5f..."
                value={receiptHash}
                onChange={(e) => setReceiptHash(e.target.value)}
                className="flex-1 h-14 px-6 text-base font-mono bg-background/60 border-2 border-border/50 focus:border-primary/50"
              />
              <Button
                onClick={handleVerify}
                disabled={verifying || !receiptHash}
                className="h-14 px-8 text-base font-semibold btn-premium"
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="text-sm text-muted-foreground">or</span>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 text-base micro-ease bg-transparent border-2"
            onClick={() => {
              setReceiptHash(exampleReceipt.hash)
              handleVerify()
            }}
          >
            Try Example Receipt
          </Button>

          {verified && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass rounded-2xl p-8 border-2 border-primary/30">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">Signature Valid</div>
                    <div className="text-sm text-muted-foreground">Receipt verified on-chain</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Provider</div>
                    <div className="font-semibold text-lg">
                      {exampleReceipt.provider} • {exampleReceipt.providerAddress}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Data Delivered</div>
                    <div className="terminal p-4 font-mono text-sm">{JSON.stringify(exampleReceipt.data, null, 2)}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Signature</div>
                    <div className="font-mono text-xs text-muted-foreground break-all bg-secondary/50 p-3 rounded-lg">
                      {exampleReceipt.signature}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                      Merkle Path to Round
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                      {exampleReceipt.merklePath.map((node, i) => (
                        <div
                          key={i}
                          className={`merkle-node transition-all duration-300 ${
                            i === 0 || i === exampleReceipt.merklePath.length - 1
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          }`}
                          style={{ marginLeft: `${i * 16}px` }}
                        >
                          {i > 0 && "→ "}
                          {node} {(i === 0 || i === exampleReceipt.merklePath.length - 1) && "✓"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 micro-ease bg-transparent border-2">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Proof
                </Button>
                <Button variant="outline" className="flex-1 h-12 micro-ease bg-transparent border-2" asChild>
                  <Link href="/receipts">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Explorer
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Learn more about HTTP-402 receipts and how AI agents use them
          </p>
          <Button variant="outline" size="lg" className="micro-ease bg-transparent" asChild>
            <Link href="/receipts">Read Documentation</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
