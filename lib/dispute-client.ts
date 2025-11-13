import { createPublicClient, http, formatEther } from "viem";
import { bscTestnet } from "viem/chains";

const DISPUTE_MANAGER_ABI = [
  {
    inputs: [
      { name: "feedId", type: "bytes32" },
      { name: "roundId", type: "uint256" },
      { name: "claimedValue", type: "int256" },
      { name: "proof", type: "bytes" },
    ],
    name: "createDispute",
    outputs: [{ name: "disputeId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "disputeId", type: "uint256" },
      { name: "support", type: "bool" },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "disputeId", type: "uint256" }],
    name: "resolveDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "disputeId", type: "uint256" }],
    name: "getDispute",
    outputs: [
      {
        components: [
          { name: "disputeId", type: "uint256" },
          { name: "feedId", type: "bytes32" },
          { name: "roundId", type: "uint256" },
          { name: "challenger", type: "address" },
          { name: "claimedValue", type: "int256" },
          { name: "actualValue", type: "int256" },
          { name: "stake", type: "uint256" },
          { name: "status", type: "uint8" }, // enum DisputeStatus
          { name: "votesFor", type: "uint256" },
          { name: "votesAgainst", type: "uint256" },
          { name: "createdAt", type: "uint256" },
          { name: "resolvedAt", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "disputeCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

enum DisputeStatus {
  Proposed = 0,
  Evidence = 1,
  Voting = 2,
  Resolved = 3,
  Rejected = 4,
}

export class DisputeClient {
  private publicClient;
  private disputeManagerAddress: string;

  constructor(disputeManagerAddress: string) {
    this.disputeManagerAddress = disputeManagerAddress as `0x${string}`;

    this.publicClient = createPublicClient({
      chain: bscTestnet,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });
  }

  async getDispute(disputeId: number) {
    const dispute = await this.publicClient.readContract({
      address: this.disputeManagerAddress as `0x${string}`,
      abi: DISPUTE_MANAGER_ABI,
      functionName: "getDispute",
      args: [BigInt(disputeId)],
    });

    const status = Number(dispute.status);
    const resolved =
      status === DisputeStatus.Resolved || status === DisputeStatus.Rejected;
    const slashed = status === DisputeStatus.Resolved;

    // Calculate voting end time (evidence period + voting period = 3 hours total)
    const votingEndsAt = Number(dispute.createdAt) + 3 * 3600;

    return {
      id: Number(dispute.disputeId),
      challenger: dispute.challenger,
      aggregator: dispute.feedId, // Using feedId as aggregator identifier
      roundId: Number(dispute.roundId),
      claimedCorrectValue: Number(dispute.claimedValue),
      stake: formatEther(dispute.stake),
      createdAt: Number(dispute.createdAt),
      votingEndsAt,
      votesFor: Number(dispute.votesFor),
      votesAgainst: Number(dispute.votesAgainst),
      resolved,
      slashed,
      evidence: `Status: ${DisputeStatus[status]}`, // Simplified evidence display
      status,
    };
  }

  async getDisputeCount() {
    const count = await this.publicClient.readContract({
      address: this.disputeManagerAddress as `0x${string}`,
      abi: DISPUTE_MANAGER_ABI,
      functionName: "disputeCount",
    });

    return Number(count);
  }

  async getAllDisputes() {
    const count = await this.getDisputeCount();
    const disputes = [];

    for (let i = 1; i <= count; i++) {
      try {
        const dispute = await this.getDispute(i);
        disputes.push(dispute);
      } catch (error) {
        console.error(` Failed to fetch dispute ${i}:`, error);
      }
    }

    return disputes;
  }
}
