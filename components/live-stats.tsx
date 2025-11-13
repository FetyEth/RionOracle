"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Activity, Shield, Users } from "lucide-react"
import { useEffect, useState } from "react"

export function LiveStats() {
  const [stats, setStats] = useState({
    totalFeeds: 42,
    updates24h: 1247,
    uptime: 99.97,
    tvlSecured: 127.5,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        updates24h: prev.updates24h + Math.floor(Math.random() * 3),
        tvlSecured: prev.tvlSecured + (Math.random() - 0.5) * 0.1,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Feeds</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalFeeds}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Across 8 categories</p>
          </Card>

          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Updates (24h)</p>
                <p className="mt-2 text-3xl font-bold">{stats.updates24h.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-chart-2/10 p-3">
                <TrendingUp className="h-6 w-6 text-chart-2" />
              </div>
            </div>
            <p className="mt-4 text-xs text-primary">+12% from yesterday</p>
          </Card>

          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network Uptime</p>
                <p className="mt-2 text-3xl font-bold">{stats.uptime}%</p>
              </div>
              <div className="rounded-lg bg-chart-3/10 p-3">
                <Shield className="h-6 w-6 text-chart-3" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Last 30 days</p>
          </Card>

          <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TVL Secured</p>
                <p className="mt-2 text-3xl font-bold">${stats.tvlSecured.toFixed(1)}M</p>
              </div>
              <div className="rounded-lg bg-chart-4/10 p-3">
                <Users className="h-6 w-6 text-chart-4" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Across 23 protocols</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
