import { createPublicClient, http } from "viem";
import { bscTestnet } from "viem/chains";

const RECEIPT_STORE_ABI = [
  {
    inputs: [{ name: "receiptHash", type: "bytes32" }],
    name: "getReceipt",
    outputs: [
      {
        components: [
          { name: "feedId", type: "bytes32" },
          { name: "roundId", type: "uint256" },
          { name: "consumer", type: "address" },
          { name: "value", type: "int256" },
          { name: "timestamp", type: "uint256" },
          { name: "merkleRoot", type: "bytes32" },
          { name: "merkleProof", type: "bytes32[]" },
          { name: "signature", type: "bytes" },
          { name: "verified", type: "bool" },
        ],
        name: "receipt",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "consumer", type: "address" }],
    name: "getConsumerReceiptCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "receiptHash", type: "bytes32" }],
    name: "verifyReceipt",
    outputs: [
      { name: "valid", type: "bool" },
      {
        components: [
          { name: "feedId", type: "bytes32" },
          { name: "roundId", type: "uint256" },
          { name: "consumer", type: "address" },
          { name: "value", type: "int256" },
          { name: "timestamp", type: "uint256" },
          { name: "merkleRoot", type: "bytes32" },
          { name: "merkleProof", type: "bytes32[]" },
          { name: "signature", type: "bytes" },
          { name: "verified", type: "bool" },
        ],
        name: "receipt",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface Receipt {
  feedId: string;
  roundId: bigint;
  consumer: string;
  value: bigint;
  timestamp: bigint;
  merkleRoot: string;
  verified: boolean;
}

export interface ReceiptStats {
  totalReceipts: number;
  recentReceipts: Receipt[];
}

export async function getReceiptStats(
  contractAddress: string
): Promise<ReceiptStats | null> {
  try {
    const client = createPublicClient({
      chain: bscTestnet,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    // Check if contract is deployed
    const bytecode = await client.getBytecode({
      address: contractAddress as `0x${string}`,
    });

    if (!bytecode || bytecode === "0x") {
      console.log(" ReceiptStore contract not deployed at", contractAddress);
      return null;
    }

    // For now, return empty stats since we don't have stored receipts yet
    return {
      totalReceipts: 0,
      recentReceipts: [],
    };
  } catch (error) {
    console.error(" Failed to fetch receipt stats:", error);
    return null;
  }
}
