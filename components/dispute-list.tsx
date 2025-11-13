import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function DisputeList() {
  const disputes = [
    {
      id: 1,
      feedId: "BTC/USD",
      roundId: 12345,
      challenger: "0x1234...5678",
      status: "pending",
      votesFor: 5,
      votesAgainst: 2,
      timeLeft: "2d 5h",
      stake: "0.1 BNB",
    },
    {
      id: 2,
      feedId: "ETH/USD",
      roundId: 12340,
      challenger: "0x8765...4321",
      status: "resolved",
      votesFor: 8,
      votesAgainst: 1,
      timeLeft: "Resolved",
      stake: "0.1 BNB",
    },
    {
      id: 3,
      feedId: "BNB/USD",
      roundId: 12338,
      challenger: "0xabcd...ef01",
      status: "pending",
      votesFor: 3,
      votesAgainst: 3,
      timeLeft: "1d 12h",
      stake: "0.1 BNB",
    },
  ]

  return (
    <Card id="disputes" className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Active Disputes</h2>
          <p className="text-sm text-muted-foreground">Community-driven data validation</p>
        </div>
        <Button size="sm" variant="outline">
          Create Dispute
        </Button>
      </div>

      <div className="space-y-4">
        {disputes.map((dispute) => (
          <div
            key={dispute.id}
            className="rounded-lg border border-border bg-card/50 p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {dispute.status === "pending" ? (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                ) : dispute.status === "resolved" ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
                <span className="font-semibold text-foreground">
                  {dispute.feedId} #{dispute.roundId}
                </span>
              </div>
              <Badge variant={dispute.status === "pending" ? "secondary" : "default"}>{dispute.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-muted-foreground">Challenger</p>
                <p className="font-mono text-foreground">{dispute.challenger}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Stake</p>
                <p className="font-mono text-foreground">{dispute.stake}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-primary">{dispute.votesFor} For</span>
                <span className="text-destructive">{dispute.votesAgainst} Against</span>
              </div>
              <span className="text-xs text-muted-foreground">{dispute.timeLeft}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
