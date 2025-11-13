import { NextResponse } from "next/server";
import { getAggregatorForGame } from "@/lib/prediction-market";

const NBA_SPORT_KEY = "basketball_nba";
const ODDS_API_KEY = process.env.THE_ODDS_API_KEY;

interface OddsAPIGame {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

export async function GET() {
  if (!ODDS_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const oddsEndpoint = `https://api.the-odds-api.com/v4/sports/${NBA_SPORT_KEY}/odds/`;

    const params = new URLSearchParams({
      apiKey: ODDS_API_KEY,
      regions: "us",
      markets: "h2h,spreads,totals",
      oddsFormat: "decimal",
    });

    const response = await fetch(`${oddsEndpoint}?${params}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`The Odds API returned ${response.status}`);
    }

    const data: OddsAPIGame[] = await response.json();

    const games = data.slice(0, 5).map((game, index) => {
      const h2hMarket = game.bookmakers[0]?.markets.find(
        (m) => m.key === "h2h"
      );
      const spreadsMarket = game.bookmakers[0]?.markets.find(
        (m) => m.key === "spreads"
      );
      const totalsMarket = game.bookmakers[0]?.markets.find(
        (m) => m.key === "totals"
      );

      const homeOutcome = h2hMarket?.outcomes.find(
        (o) => o.name === game.home_team
      );
      const awayOutcome = h2hMarket?.outcomes.find(
        (o) => o.name === game.away_team
      );

      const homeSpread = spreadsMarket?.outcomes.find(
        (o) => o.name === game.home_team
      );
      const awaySpread = spreadsMarket?.outcomes.find(
        (o) => o.name === game.away_team
      );

      const overOutcome = totalsMarket?.outcomes.find((o) => o.name === "Over");
      const underOutcome = totalsMarket?.outcomes.find(
        (o) => o.name === "Under"
      );

      let aggregatorAddress: string | undefined;
      try {
        aggregatorAddress = getAggregatorForGame(index);
      } catch (err) {
        console.error(`No aggregator for game ${index}:`, err);
      }

      return {
        id: game.id,
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        homeOdds: homeOutcome?.price || 1.9,
        awayOdds: awayOutcome?.price || 1.9,
        spread:
          homeSpread && awaySpread
            ? {
                home: homeSpread.point || 0,
                away: awaySpread.point || 0,
                homeOdds: homeSpread.price || 1.9,
                awayOdds: awaySpread.price || 1.9,
              }
            : undefined,
        totals:
          overOutcome && underOutcome
            ? {
                over: overOutcome.point || 220,
                under: underOutcome.point || 220,
                overOdds: overOutcome.price || 1.9,
                underOdds: underOutcome.price || 1.9,
              }
            : undefined,
        startTime: game.commence_time,
        status: new Date(game.commence_time) > new Date() ? "upcoming" : "live",
        aggregatorAddress,
      };
    });

    return NextResponse.json(games);
  } catch (error: any) {
    console.error("Error fetching NBA games:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch games" },
      { status: 500 }
    );
  }
}
