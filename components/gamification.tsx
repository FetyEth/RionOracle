"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Shield, Crown } from "lucide-react"
import { useState } from "react"

const badges = [
  {
    icon: Trophy,
    title: "First Verify",
    description: "Verify your first round proof and start your journey",
    xp: 10,
    color: "from-yellow-500 to-orange-500",
    rarity: "Common",
  },
  {
    icon: Flame,
    title: "7-Day Streak",
    description: "Verify proofs 7 days in a row without missing",
    xp: 50,
    color: "from-orange-500 to-red-500",
    rarity: "Rare",
  },
  {
    icon: Shield,
    title: "Guardian",
    description: "Catch 5 bad data reports and protect the network",
    xp: 300,
    color: "from-blue-500 to-purple-500",
    rarity: "Epic",
  },
  {
    icon: Crown,
    title: "Oracle Master",
    description: "Reach 10,000 total XP and join the elite",
    xp: 1000,
    color: "from-amber-500 to-yellow-500",
    rarity: "Mythic",
  },
]

const rarityColors = {
  Common: "text-gray-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Mythic: "text-amber-400",
}

export function Gamification() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--primary-rgb),0.15),transparent_70%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Gamification</span>
          </div>
          <h2 className="mb-6 text-6xl font-bold font-display tracking-tight">
            Earn <span className="gradient-text">Verification Badges</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            Verify proofs, catch bad data, and climb the leaderboard. Collect rare badges and showcase your expertise.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            const isHovered = hoveredIndex === index

            return (
              <Card
                key={index}
                className={`group relative overflow-hidden glass p-8 text-center transition-all duration-300 ${isHovered ? "border-primary/50 shadow-2xl shadow-primary/20 scale-105" : "hover:border-primary/30"}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Animated gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Rarity indicator */}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="outline"
                    className={`text-xs ${rarityColors[badge.rarity as keyof typeof rarityColors]} border-current`}
                  >
                    {badge.rarity}
                  </Badge>
                </div>

                <div className="relative">
                  {/* Outer glow ring */}
                  <div className="relative inline-flex mb-8">
                    {/* Outer glow ring */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${badge.color} opacity-20 blur-2xl scale-150 transition-all duration-500 ${isHovered ? "opacity-40 scale-[1.8]" : ""}`}
                    />

                    {/* Badge circle */}
                    <div
                      className={`relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} shadow-2xl transition-all duration-300 ${isHovered ? "scale-110 rotate-12" : ""}`}
                    >
                      {/* Inner icon with white color */}
                      <Icon className="h-16 w-16 text-white drop-shadow-lg" strokeWidth={2} />
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-3 font-display">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{badge.description}</p>

                  {/* XP badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold text-sm shadow-lg transition-all duration-300 ${isHovered ? "scale-110 shadow-xl" : ""}`}
                  >
                    <span>+{badge.xp} XP</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Leaderboard CTA */}
        <div className="mt-16 text-center">
          <Card className="inline-block glass p-8 max-w-2xl">
            <div className="flex items-center justify-between gap-8">
              <div className="text-left">
                <h3 className="text-2xl font-bold font-display mb-2">Ready to compete?</h3>
                <p className="text-muted-foreground">Join the leaderboard and start earning badges today</p>
              </div>
              <a
                href="/lab"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-chart-2 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                Start Verifying
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
