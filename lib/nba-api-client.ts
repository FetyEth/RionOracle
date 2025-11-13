import { getTeamLogoDynamic } from "@/lib/team-logo-resolver";

export interface NBAGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  homeOdds: number;
  awayOdds: number;
  spread?: { home: number; away: number; homeOdds: number; awayOdds: number };
  totals?: { over: number; under: number; overOdds: number; underOdds: number };
  startTime: Date;
  status: "upcoming" | "live" | "final";
  homeScore?: number;
  awayScore?: number;
}

export class NBAApiClient {
  async fetchGames(): Promise<NBAGame[]> {
    try {
      const response = await fetch("/api/nba/games");

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "API key not configured") {
          return [];
        }
        throw new Error("Failed to fetch games");
      }
      const games = await response.json();

      const enriched: NBAGame[] = await Promise.all(
        games.map(async (game: any) => {
          const [homeLogo, awayLogo] = await Promise.all([
            getTeamLogoDynamic(game.homeTeam),
            getTeamLogoDynamic(game.awayTeam),
          ]);

          return {
            ...game,
            startTime: new Date(game.startTime),
            homeTeamLogo: homeLogo,
            awayTeamLogo: awayLogo,
          } as NBAGame;
        })
      );

      return enriched;
    } catch (error) {
      console.error("Error fetching NBA games:", error);
      return [];
    }
  }

  async fetchLiveScores(): Promise<
    Record<string, { homeScore: number; awayScore: number; completed: boolean }>
  > {
    try {
      const response = await fetch("/api/nba/scores");

      if (!response.ok) throw new Error("Failed to fetch scores");
      return await response.json();
    } catch (error) {
      console.error("Error fetching live scores:", error);
      return {};
    }
  }

  private getGameStatus(startTime: Date): "upcoming" | "live" | "final" {
    const now = new Date();
    const diffMs = startTime.getTime() - now.getTime();
    const diffHours = diffMs / 36e5;

    if (diffHours > 0) return "upcoming";
    if (diffHours > -3) return "live";
    return "final";
  }
}

// Export singleton instance
export const nbaApi = new NBAApiClient();
