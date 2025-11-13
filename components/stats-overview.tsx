import { Card } from "@/components/ui/card"
import { TrendingUp, Shield, FileCheck, Activity } from "lucide-react"

export function StatsOverview() {
  const stats = [
    {
      label: "Active Feeds",
      value: "12",
      change: "+3 this week",
      icon: Activity,
      trend: "up",
    },
    {
      label: "Total Updates",
      value: "1.2M",
      change: "99.97% uptime",
      icon: TrendingUp,
      trend: "up",
    },
    {
      label: "Disputes Resolved",
      value: "47",
      change: "2 pending",
      icon: Shield,
      trend: "neutral",
    },
    {
      label: "Receipts Verified",
      value: "8.4K",
      change: "+1.2K today",
      icon: FileCheck,
      trend: "up",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-primary"
                    : stat.trend === "down"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
