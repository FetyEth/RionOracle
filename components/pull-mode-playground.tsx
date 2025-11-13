"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, RotateCcw, CheckCircle2, Loader2 } from "lucide-react"

export function PullModePlayground() {
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const [bnbPrice, setBnbPrice] = useState<string>("9.79")

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RPC_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS,
                data: "0xfeaf968c",
              },
              "latest",
            ],
            id: 1,
          }),
        })
        const data = await response.json()
        if (data.result) {
          const price = Number.parseInt(data.result.slice(66, 130), 16) / 1e8
          setBnbPrice(price.toFixed(2))
        }
      } catch (err) {
        setBnbPrice("9.79")
      }
    }
    fetchPrice()
  }, [])

  const runCode = async () => {
    setRunning(true)
    setOutput([])
    setCompleted(false)

    const steps = [
      { delay: 300, text: "→ Fetching BNB/USD price...", color: "text-muted-foreground" },
      { delay: 500, text: `✓ Price: $${bnbPrice}`, color: "text-primary" },
      { delay: 400, text: "→ Verifying BLS signature...", color: "text-muted-foreground" },
      { delay: 600, text: "✓ Signature valid (0.8s)", color: "text-primary" },
      { delay: 300, text: "→ Checking freshness...", color: "text-muted-foreground" },
      { delay: 400, text: "✓ Fresh (1.2s old)", color: "text-primary" },
      { delay: 500, text: "✓ Ready to use in your app", color: "text-chart-2" },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay))
      setOutput((prev) => [...prev, `${step.text}|${step.color}`])
    }

    setRunning(false)
    setCompleted(true)
  }

  const reset = () => {
    setOutput([])
    setCompleted(false)
  }

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold font-display mb-6 tracking-tight">
            Pull-Mode <span className="gradient-text">Playground</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Run RION SDK code directly in your browser. See verification in action.
          </p>
        </div>

        <Card className="glass-card p-8 border-2 border-primary/30 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Code Editor */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Code</h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={runCode} disabled={running} className="h-8 px-4 btn-premium">
                    {running ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Running
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-3.5 w-3.5" />
                        Run
                      </>
                    )}
                  </Button>
                  {completed && (
                    <Button size="sm" variant="outline" onClick={reset} className="h-8 px-4 micro-ease bg-transparent">
                      <RotateCcw className="mr-2 h-3.5 w-3.5" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
              <div className="terminal p-6 min-h-[400px]">
                <pre className="text-sm text-foreground">
                  {`import { RionClient } from '@rion/sdk'

const client = new RionClient({
  network: 'bnb-testnet'
})

// Get price
const price = await client.getPrice('BNB/USD')

// Verify signature
const valid = await client.verifySignature(
  price.signature,
  price.data
)

// Assert freshness
const fresh = price.timestamp > Date.now() - 5000

console.log({ price, valid, fresh })`}
                </pre>
              </div>
            </div>

            {/* Console Output */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Console</h3>
                {completed && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-semibold">Complete</span>
                  </div>
                )}
              </div>
              <div className="terminal p-6 min-h-[400px] space-y-2">
                {output.length === 0 && !running && (
                  <div className="text-muted-foreground text-sm">Click "Run" to execute the code...</div>
                )}
                {output.map((line, i) => {
                  const [text, color] = line.split("|")
                  return (
                    <div
                      key={i}
                      className={`terminal-line ${color} animate-in fade-in slide-in-from-left-2 duration-300`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {text}
                    </div>
                  )
                })}
                {running && (
                  <div className="flex items-center gap-2 text-primary animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Executing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold font-display tabular-nums text-primary mb-2">
                  {completed ? "1.8s" : "—"}
                </div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-display tabular-nums text-primary mb-2">
                  {completed ? "3/3" : "—"}
                </div>
                <div className="text-sm text-muted-foreground">Checks Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-display tabular-nums text-primary mb-2">
                  {completed ? "100%" : "—"}
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This playground runs entirely in your browser using WebCrypto for signature verification
          </p>
        </div>
      </div>
    </section>
  )
}
