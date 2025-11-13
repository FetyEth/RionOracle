"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"
import { OracleClient } from "@/lib/oracle-client"

interface Feed {
  id: string
  pair: string
  price: string
  change24h: number
  lastUpdate: string
  status: "active" | "stale" | "disputed"
  heartbeat: number
}

export function FeedGrid() {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const oracleClient = new OracleClient()
    const symbols = ["BNB", "ETH", "BTC", "SOL", "XRP", "DOGE", "LINK"]

    const loadFeeds = async () => {
      const feedPromises = symbols.map(async (symbol) => {
        try {
          const { price, change } = await oracleClient.getPriceBySymbol(symbol)
          return {
            id: `${symbol.toLowerCase()}-usd`,
            pair: `${symbol}/USD`,
            price: price.toFixed(2),
            change24h: change,
            lastUpdate: "2s ago",
            status: "active" as const,
            heartbeat: 60,
          }
        } catch (error) {
          return null
        }
      })

      const loadedFeeds = (await Promise.all(feedPromises)).filter(Boolean) as Feed[]
      setFeeds(loadedFeeds)
      setLoading(false)
    }

    loadFeeds()

    const interval = setInterval(() => {
      loadFeeds()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div id="feeds" className="py-8">
        <p className="text-center text-muted-foreground">Loading live feeds...</p>
      </div>
    )
  }

  return (
    <div id="feeds">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Price Feeds</h2>
          <p className="text-sm text-muted-foreground">Real-time oracle data with provable accuracy</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
          Live
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {feeds.map((feed) => (
          <Card key={feed.id} className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{feed.pair}</h3>
                <p className="text-xs text-muted-foreground">Updated {feed.lastUpdate}</p>
              </div>
              <Badge variant={feed.status === "active" ? "default" : "destructive"} className="text-xs">
                {feed.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground font-mono">${feed.price}</span>
              </div>

              <div className="flex items-center gap-2">
                {feed.change24h > 0 ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={`text-sm font-medium ${feed.change24h > 0 ? "text-primary" : "text-destructive"}`}>
                  {feed.change24h > 0 ? "+" : ""}
                  {feed.change24h.toFixed(2)}%
                </span>
                <span className="text-xs text-muted-foreground">24h</span>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Heartbeat</span>
                  <span className="text-foreground font-mono">{feed.heartbeat}s</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
