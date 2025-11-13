import { type NextRequest, NextResponse } from "next/server";
import { storeRoundData, type RoundData } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const roundData: RoundData = await req.json();

    // Validate required fields
    if (
      !roundData.roundId ||
      !roundData.feed ||
      !roundData.councils ||
      !roundData.median
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Store the round data in Redis
    await storeRoundData(roundData);

    return NextResponse.json({
      success: true,
      message: "Round data stored successfully",
      roundId: roundData.roundId,
    });
  } catch (error: any) {
    console.error("[API] Error storing round data:", error);
    return NextResponse.json(
      {
        error: "Failed to store round data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
