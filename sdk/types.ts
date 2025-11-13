/**
 * Core types for RION SDK
 */

export interface FeedConfig {
  feedId: string
  aggregator: string
  heartbeat: number
  maxDeviation: number
  active: boolean
}

export interface LatestAnswer {
  value: bigint
  timestamp: number
  roundId: number
}

export interface RoundData {
  answer: bigint
  timestamp: number
  observationCount: number
  merkleRoot: string
  finalized: boolean
}

export interface Report {
  feedId: string
  observations: bigint[]
  timestamp: number
  roundId: number
  merkleRoot: string
  aggregateSignature: string
  signerBitmap: bigint
}

export interface Dispute {
  id: number
  feedId: string
  roundId: number
  challenger: string
  claimedCorrectValue: bigint
  evidence: string
  stake: bigint
  timestamp: number
  status: DisputeStatus
  votesFor: number
  votesAgainst: number
}

export enum DisputeStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Resolved = 3,
}

export interface Receipt {
  feedId: string
  roundId: number
  consumer: string
  value: bigint
  timestamp: number
  merkleRoot: string
  merkleProof: string[]
  signature: string
  verified: boolean
}

export interface RionConfig {
  rpcUrl: string
  registryAddress: string
  chainId?: number
  privateKey?: string
}
