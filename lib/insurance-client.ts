import { createPublicClient, http } from "viem";
import { bscTestnet } from "viem/chains";

const INSURANCE_VAULT_ABI = [
  {
    inputs: [],
    name: "getVaultBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimId", type: "uint256" }],
    name: "getClaim",
    outputs: [
      {
        components: [
          { internalType: "address", name: "claimant", type: "address" },
          { internalType: "bytes32", name: "feedId", type: "bytes32" },
          { internalType: "uint256", name: "roundId", type: "uint256" },
          { internalType: "uint256", name: "disputeId", type: "uint256" },
          { internalType: "uint256", name: "lossAmount", type: "uint256" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "processed", type: "bool" },
          { internalType: "bool", name: "approved", type: "bool" },
          { internalType: "uint256", name: "payoutAmount", type: "uint256" },
        ],
        internalType: "struct IInsuranceVault.Claim",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface InsuranceClaim {
  claimId: number;
  claimant: string;
  feedId: string;
  roundId: number;
  disputeId: number;
  lossAmount: bigint;
  description: string;
  timestamp: number;
  processed: boolean;
  approved: boolean;
  payoutAmount: bigint;
}

export interface InsuranceStats {
  vaultBalance: bigint;
  totalClaims: number;
  totalPayouts: bigint;
  recentClaims: InsuranceClaim[];
}

export async function getInsuranceStats(
  vaultAddress: string
): Promise<InsuranceStats> {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL),
  });

  try {
    const bytecode = await client.getBytecode({
      address: vaultAddress as `0x${string}`,
    });

    if (!bytecode || bytecode === "0x") {
      throw new Error("Contract not deployed at address");
    }

    // Get vault balance
    const balance = await client.readContract({
      address: vaultAddress as `0x${string}`,
      abi: INSURANCE_VAULT_ABI,
      functionName: "getVaultBalance",
    });

    // Get claim count
    const claimCount = await client.readContract({
      address: vaultAddress as `0x${string}`,
      abi: INSURANCE_VAULT_ABI,
      functionName: "claimCount",
    });

    const totalClaims = Number(claimCount);
    let totalPayouts = 0n;
    const recentClaims: InsuranceClaim[] = [];

    // Fetch last 5 claims
    const startId = Math.max(1, totalClaims - 4);
    for (let i = totalClaims; i >= startId && i >= 1; i--) {
      try {
        const claim = await client.readContract({
          address: vaultAddress as `0x${string}`,
          abi: INSURANCE_VAULT_ABI,
          functionName: "getClaim",
          args: [BigInt(i)],
        });

        const claimData = claim as {
          claimant: string;
          feedId: string;
          roundId: bigint;
          disputeId: bigint;
          lossAmount: bigint;
          description: string;
          timestamp: bigint;
          processed: boolean;
          approved: boolean;
          payoutAmount: bigint;
        };

        if (claimData.approved && claimData.payoutAmount > 0n) {
          totalPayouts += claimData.payoutAmount;
        }

        recentClaims.push({
          claimId: i,
          claimant: claimData.claimant,
          feedId: claimData.feedId,
          roundId: Number(claimData.roundId),
          disputeId: Number(claimData.disputeId),
          lossAmount: claimData.lossAmount,
          description: claimData.description,
          timestamp: Number(claimData.timestamp),
          processed: claimData.processed,
          approved: claimData.approved,
          payoutAmount: claimData.payoutAmount,
        });
      } catch (err) {
        // Claim might not exist, continue
        continue;
      }
    }

    return {
      vaultBalance: balance,
      totalClaims,
      totalPayouts,
      recentClaims,
    };
  } catch (error) {
    console.error(" Failed to fetch insurance stats:", error);
    throw error;
  }
}
