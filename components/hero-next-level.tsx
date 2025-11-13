import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import { ProofConsole } from "@/components/proof-console"
import Link from "next/link"

export function HeroNextLevel() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Grid background with depth */}
      <div className="absolute inset-0 grid-depth" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-chart-2/10 blur-[120px]" />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary neon-glow">
              <Zap className="h-4 w-4" />
              Live on BNB Testnet
            </div>

            {/* H1 */}
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight font-display md:text-6xl lg:text-7xl">
              BNB's default oracle.
              <br />
              <span className="gradient-text">Instant, then final</span>
              <br />— with insurance.
            </h1>

            {/* Sub */}
            <p className="text-lg text-muted-foreground max-w-xl text-balance md:text-xl">
              Verify a real round, in your browser. See a slash & payout. Install the SDK and fetch a price now.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="neon-glow micro-ease group">
                <Link href="/lab">
                  Open The Lab
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="micro-ease bg-transparent">
                <Link href="/disputes">See a Slash + Payout</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="micro-ease bg-transparent">
                <Link href="/sdk">Install SDK</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="status-dot online" />
                <span>7/10 Committee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-dot online" />
                <span>1.2s Freshness</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-dot online" />
                <span>$2.4M Insured</span>
              </div>
            </div>
          </div>

          {/* Right: Proof Console */}
          <div className="lg:pl-8">
            <ProofConsole />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm font-mono tabular-nums border-t border-border/50 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">BNB/USD</span>
            <span className="text-primary font-semibold">$612.34</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">p95</span>
            <span className="text-foreground">1.6s</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Quorum</span>
            <span className="text-foreground">5/6</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Window</span>
            <span className="text-chart-1">Final</span>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Don't trust it—prove it</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="sm" className="micro-ease bg-transparent">
              Download Report
            </Button>
            <Button variant="outline" size="sm" className="micro-ease bg-transparent">
              Verify Locally
            </Button>
            <Button variant="outline" size="sm" className="micro-ease bg-transparent">
              View Artifacts
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
