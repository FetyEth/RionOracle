export type ReportType = "price" | "outcome" | "por" | "agent" | "attestation" | "rwa"

export interface ReportCore {
  id: string
  type: ReportType
  feedId: string
  timestamp: number
  value: string
  signers: string[]
  merkleRoot: string
  status: "instant" | "final" | "disputed"
}

export interface PriceReport extends ReportCore {
  type: "price"
  deviation: number
  staleness: number
}

export interface OutcomeReport extends ReportCore {
  type: "outcome"
  evidence: string[]
  sources: string[]
}

export interface PoRReport extends ReportCore {
  type: "por"
  wallets: string[]
  venues: string[]
  snapshotRoot: string
}

export interface AgentReport extends ReportCore {
  type: "agent"
  receiptHash: string
  paymentProof: string
}

export interface AttestationReport extends ReportCore {
  type: "attestation"
  batchId: string
  zkSummary: string
}

export interface RWAReport extends ReportCore {
  type: "rwa"
  basket: string
  nav: string
  sources: string[]
}

export type Report = PriceReport | OutcomeReport | PoRReport | AgentReport | AttestationReport | RWAReport
