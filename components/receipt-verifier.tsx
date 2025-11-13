"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Search } from "lucide-react"
import { useState } from "react"

export function ReceiptVerifier() {
  const [receiptHash, setReceiptHash] = useState("")
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean
    receipt?: {
      feedId: string
      roundId: number
      consumer: string
      value: string
      timestamp: string
    }
  } | null>(null)

  const handleVerify = () => {
    // Simulate verification
    if (receiptHash.length > 10) {
      setVerificationResult({
        valid: true,
        receipt: {
          feedId: "BNB/USD",
          roundId: 12345,
          consumer: "0x1234...5678",
          value: "$612.45",
          timestamp: "2 minutes ago",
        },
      })
    } else {
      setVerificationResult({
        valid: false,
      })
    }
  }

  return (
    <Card id="receipts" className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Receipt Verifier</h2>
        <p className="text-sm text-muted-foreground">Verify HTTP-402 receipts with Merkle proofs</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter receipt hash (0x...)"
            value={receiptHash}
            onChange={(e) => setReceiptHash(e.target.value)}
            className="font-mono"
          />
          <Button onClick={handleVerify}>
            <Search className="h-4 w-4 mr-2" />
            Verify
          </Button>
        </div>

        {verificationResult && (
          <div
            className={`rounded-lg border p-4 ${
              verificationResult.valid ? "border-primary/50 bg-primary/5" : "border-destructive/50 bg-destructive/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {verificationResult.valid ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-semibold text-foreground">
                {verificationResult.valid ? "Receipt Verified" : "Invalid Receipt"}
              </span>
            </div>

            {verificationResult.valid && verificationResult.receipt && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Feed ID</span>
                  <span className="font-mono text-foreground">{verificationResult.receipt.feedId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Round ID</span>
                  <span className="font-mono text-foreground">{verificationResult.receipt.roundId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consumer</span>
                  <span className="font-mono text-foreground">{verificationResult.receipt.consumer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value</span>
                  <span className="font-mono text-foreground">{verificationResult.receipt.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="text-foreground">{verificationResult.receipt.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Recent Receipts</h3>
          <div className="space-y-2">
            {[
              { hash: "0xabcd...1234", feed: "BNB/USD", time: "1m ago" },
              { hash: "0xef01...5678", feed: "BTC/USD", time: "2m ago" },
              { hash: "0x9876...dcba", feed: "ETH/USD", time: "3m ago" },
            ].map((receipt) => (
              <div key={receipt.hash} className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{receipt.hash}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {receipt.feed}
                  </Badge>
                  <span className="text-muted-foreground">{receipt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
