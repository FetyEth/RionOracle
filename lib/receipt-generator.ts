import { createHash } from "crypto";
import { ethers } from "ethers";

export interface ReceiptInput {
  roundId: string;
  feed: string;
  oracle: string;
  oracleAddress: string;
  price: number;
  timestamp: number;
  txHash: string;
}

export function generateReceipt(input: ReceiptInput) {
  // Create receipt data object
  const receiptData = {
    roundId: input.roundId,
    feed: input.feed,
    oracle: input.oracle,
    oracleAddress: input.oracleAddress,
    price: input.price,
    timestamp: input.timestamp,
    txHash: input.txHash,
  };

  // Generate receipt hash from the data
  const dataString = JSON.stringify(receiptData);
  const receiptHash =
    "0x" + createHash("sha256").update(dataString).digest("hex");

  // Generate mock signature (in production, this would be signed by the oracle)
  const message = ethers.solidityPackedKeccak256(
    ["string", "uint256", "uint256", "address"],
    [input.feed, input.price, input.timestamp, input.oracleAddress]
  );

  // Mock signature for demo purposes
  const signature = ethers.keccak256(
    ethers.toUtf8Bytes(message + input.oracle)
  );

  // Generate merkle proof path (simplified for demo)
  const merkleProof = [
    ethers.keccak256(ethers.toUtf8Bytes(input.oracle + "1")),
    ethers.keccak256(ethers.toUtf8Bytes(input.feed + "2")),
    ethers.keccak256(ethers.toUtf8Bytes(input.roundId + "3")),
  ];

  return {
    hash: receiptHash,
    signature,
    merkleProof,
    ...receiptData,
    verified: true,
  };
}
