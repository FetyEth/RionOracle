/**
 * API endpoint for receipt generation and verification
 * Simulates HTTP-402 payment flow
 */

import { type NextRequest, NextResponse } from "next/server"
import { generateReceipt } from "@/lib/merkle-tree"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedId, roundId, consumer, action } = body

    if (action === "generate") {
      // Simulate fetching observations from aggregator
      const observations = [
        { consumer: consumer, value: "42000000000" },
        { consumer: "0xOther1", value: "42010000000" },
        { consumer: "0xOther2", value: "41990000000" },
      ]

      const receipt = generateReceipt(feedId, roundId, observations, consumer)

      return NextResponse.json({
        success: true,
        receipt,
        message: "Receipt generated successfully",
      })
    }

    if (action === "verify") {
      const { merkleRoot, merkleProof, value } = body

      // In production, verify against on-chain data
      const isValid = merkleProof && merkleProof.length > 0

      return NextResponse.json({
        success: true,
        valid: isValid,
        message: isValid ? "Receipt verified" : "Invalid receipt",
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const receiptHash = searchParams.get("hash")

  if (!receiptHash) {
    return NextResponse.json({ success: false, message: "Receipt hash required" }, { status: 400 })
  }

  // In production, fetch from blockchain
  return NextResponse.json({
    success: true,
    receipt: {
      feedId: "BNB/USD",
      roundId: 1,
      consumer: "0xConsumer1",
      value: "42000000000",
      timestamp: Date.now(),
      verified: true,
    },
  })
}
