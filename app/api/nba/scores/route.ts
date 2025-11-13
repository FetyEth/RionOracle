import { NextResponse } from "next/server";

const NBA_SPORT_KEY = "basketball_nba";
const ODDS_API_KEY = process.env.THE_ODDS_API_KEY;

interface ScoreData {
  id: string;
  scores: Array<{
    name: string;
    score: string;
  }>;
  completed: boolean;
}

export async function GET() {
  if (!ODDS_API_KEY) {
    return NextResponse.json({});
  }

  try {
    const scoresEndpoint = `https://api.the-odds-api.com/v4/sports/${NBA_SPORT_KEY}/scores/`;

    const params = new URLSearchParams({
      apiKey: ODDS_API_KEY,
      daysFrom: "3",
    });

    const response = await fetch(`${scoresEndpoint}?${params}`, {
      next: { revalidate: 15 },
    });

    if (!response.ok) {
      return NextResponse.json({});
    }

    const data: ScoreData[] = await response.json();

    const scores: Record<
      string,
      { homeScore: number; awayScore: number; completed: boolean }
    > = {};

    data.forEach((game) => {
      if (game.scores && game.scores.length >= 2) {
        const homeScore = Number.parseInt(game.scores[0]?.score || "0");
        const awayScore = Number.parseInt(game.scores[1]?.score || "0");

        scores[game.id] = {
          homeScore,
          awayScore,
          completed: game.completed,
        };
      }
    });

    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json({});
  }
}
