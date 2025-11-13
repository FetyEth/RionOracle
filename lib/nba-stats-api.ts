// NBA Stats API client for detailed game data

export interface PlayByPlayAction {
  actionNumber: number;
  clock: string;
  period: number;
  teamId: number;
  personId: number;
  playerName: string;
  actionType: string;
  subType: string;
  descriptor: string;
  qualifiers: string[];
  shotResult: string;
  scoreHome: string;
  scoreAway: string;
  description: string;
  shotDistance?: number;
  x?: number;
  y?: number;
}

export interface BoxScorePlayer {
  personId: number;
  name: string;
  position: string;
  minutes: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  plusMinus: number;
}

export interface ShotChartShot {
  x: number;
  y: number;
  made: boolean;
  shotType: string;
  shotDistance: number;
  period: number;
  minutes: number;
  seconds: number;
  playerId: number;
  playerName: string;
}

export interface GameDetail {
  gameId: string;
  homeTeam: {
    teamId: number;
    name: string;
    abbreviation: string;
    score: number;
    logo: string;
  };
  awayTeam: {
    teamId: number;
    name: string;
    abbreviation: string;
    score: number;
    logo: string;
  };
  status: string;
  period: number;
  gameClock: string;
  gameDate: string;
  arena: string;
  city: string;
}

export class NBAStatsAPI {
  private baseUrl = "https://stats.nba.com/stats";
  private headers = {
    Accept: "application/json",
    "User-Agent": "Mozilla/5.0",
    Referer: "https://stats.nba.com/",
    Origin: "https://stats.nba.com",
  };

  async fetchGameDetail(gameId: string): Promise<GameDetail | null> {
    try {
      // Use ESPN API for game summary
      const espnGameId = gameId.replace("00", ""); // Convert NBA game ID to ESPN format
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${espnGameId}`
      );

      if (!response.ok) throw new Error("Failed to fetch game detail");

      const data = await response.json();
      const header = data.header;
      const teams = data.boxscore?.teams || [];

      return {
        gameId,
        homeTeam: {
          teamId: teams[0]?.team?.id || 0,
          name:
            teams[0]?.team?.displayName ||
            header.competitions[0].competitors[0].team.displayName,
          abbreviation:
            teams[0]?.team?.abbreviation ||
            header.competitions[0].competitors[0].team.abbreviation,
          score: Number.parseInt(header.competitions[0].competitors[0].score),
          logo: header.competitions[0].competitors[0].team.logo,
        },
        awayTeam: {
          teamId: teams[1]?.team?.id || 0,
          name:
            teams[1]?.team?.displayName ||
            header.competitions[0].competitors[1].team.displayName,
          abbreviation:
            teams[1]?.team?.abbreviation ||
            header.competitions[0].competitors[1].team.abbreviation,
          score: Number.parseInt(header.competitions[0].competitors[1].score),
          logo: header.competitions[0].competitors[1].team.logo,
        },
        status: header.competitions[0].status.type.description,
        period: header.competitions[0].status.period || 0,
        gameClock: header.competitions[0].status.displayClock || "",
        gameDate: header.competitions[0].date,
        arena: header.competitions[0].venue?.fullName || "",
        city: header.competitions[0].venue?.address?.city || "",
      };
    } catch (error) {
      console.error(" Error fetching game detail:", error);
      return null;
    }
  }

  async fetchPlayByPlay(gameId: string): Promise<PlayByPlayAction[]> {
    try {
      const espnGameId = gameId.replace("00", "");
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${espnGameId}`
      );

      if (!response.ok) throw new Error("Failed to fetch play-by-play");

      const data = await response.json();
      const plays = data.plays || [];

      return plays.map((play: any, index: number) => ({
        actionNumber: index,
        clock: play.clock?.displayValue || "0:00",
        period: play.period?.number || 1,
        teamId: play.team?.id || 0,
        personId: play.participants?.[0]?.athlete?.id || 0,
        playerName: play.participants?.[0]?.athlete?.displayName || "",
        actionType: play.type?.text || "",
        subType: play.scoringPlay ? "SCORE" : "OTHER",
        descriptor: play.text || "",
        qualifiers: [],
        shotResult: play.scoringPlay ? "Made" : "",
        scoreHome: play.homeScore?.toString() || "0",
        scoreAway: play.awayScore?.toString() || "0",
        description: play.text || "",
        shotDistance: play.shotDistance || undefined,
        x: play.coordinate?.x,
        y: play.coordinate?.y,
      }));
    } catch (error) {
      console.error(" Error fetching play-by-play:", error);
      return [];
    }
  }

  async fetchBoxScore(
    gameId: string
  ): Promise<{ home: BoxScorePlayer[]; away: BoxScorePlayer[] }> {
    try {
      const espnGameId = gameId.replace("00", "");
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${espnGameId}`
      );

      if (!response.ok) throw new Error("Failed to fetch boxscore");

      const data = await response.json();
      const teams = data.boxscore?.players || [];

      const parseTeamPlayers = (team: any): BoxScorePlayer[] => {
        return (team.statistics?.[0]?.athletes || []).map((player: any) => ({
          personId: Number.parseInt(player.athlete.id),
          name: player.athlete.displayName,
          position: player.athlete.position?.abbreviation || "",
          minutes:
            player.stats.find((s: any) => s.name === "minutes")?.displayValue ||
            "0",
          points: Number.parseInt(
            player.stats.find((s: any) => s.name === "points")?.value || "0"
          ),
          rebounds: Number.parseInt(
            player.stats.find((s: any) => s.name === "rebounds")?.value || "0"
          ),
          assists: Number.parseInt(
            player.stats.find((s: any) => s.name === "assists")?.value || "0"
          ),
          steals: Number.parseInt(
            player.stats.find((s: any) => s.name === "steals")?.value || "0"
          ),
          blocks: Number.parseInt(
            player.stats.find((s: any) => s.name === "blocks")?.value || "0"
          ),
          turnovers: Number.parseInt(
            player.stats.find((s: any) => s.name === "turnovers")?.value || "0"
          ),
          fieldGoalsMade: Number.parseInt(
            player.stats.find((s: any) => s.name === "fieldGoalsMade")?.value ||
              "0"
          ),
          fieldGoalsAttempted: Number.parseInt(
            player.stats.find((s: any) => s.name === "fieldGoalsAttempted")
              ?.value || "0"
          ),
          threePointersMade: Number.parseInt(
            player.stats.find((s: any) => s.name === "threePointFieldGoalsMade")
              ?.value || "0"
          ),
          threePointersAttempted: Number.parseInt(
            player.stats.find(
              (s: any) => s.name === "threePointFieldGoalsAttempted"
            )?.value || "0"
          ),
          freeThrowsMade: Number.parseInt(
            player.stats.find((s: any) => s.name === "freeThrowsMade")?.value ||
              "0"
          ),
          freeThrowsAttempted: Number.parseInt(
            player.stats.find((s: any) => s.name === "freeThrowsAttempted")
              ?.value || "0"
          ),
          plusMinus: 0,
        }));
      };

      return {
        home: teams[0] ? parseTeamPlayers(teams[0]) : [],
        away: teams[1] ? parseTeamPlayers(teams[1]) : [],
      };
    } catch (error) {
      console.error(" Error fetching boxscore:", error);
      return { home: [], away: [] };
    }
  }

  async fetchTeamStats(gameId: string): Promise<{
    home: {
      pts: number;
      reb: number;
      ast: number;
      stl: number;
      blk: number;
      to: number;
      fgPct: number;
      fg3Pct: number;
      ftPct: number;
    };
    away: {
      pts: number;
      reb: number;
      ast: number;
      stl: number;
      blk: number;
      to: number;
      fgPct: number;
      fg3Pct: number;
      ftPct: number;
    };
  } | null> {
    try {
      const espnGameId = gameId.replace("00", "");
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${espnGameId}`
      );

      if (!response.ok) throw new Error("Failed to fetch team stats");

      const data = await response.json();
      const teams = data.boxscore?.teams || [];

      const parseTeamStats = (team: any) => {
        const stats = team.statistics || [];
        return {
          pts: Number.parseInt(
            stats.find((s: any) => s.name === "points")?.displayValue || "0"
          ),
          reb: Number.parseInt(
            stats.find((s: any) => s.name === "rebounds")?.displayValue || "0"
          ),
          ast: Number.parseInt(
            stats.find((s: any) => s.name === "assists")?.displayValue || "0"
          ),
          stl: Number.parseInt(
            stats.find((s: any) => s.name === "steals")?.displayValue || "0"
          ),
          blk: Number.parseInt(
            stats.find((s: any) => s.name === "blocks")?.displayValue || "0"
          ),
          to: Number.parseInt(
            stats.find((s: any) => s.name === "turnovers")?.displayValue || "0"
          ),
          fgPct: Number.parseFloat(
            stats.find((s: any) => s.name === "fieldGoalPct")?.displayValue ||
              "0"
          ),
          fg3Pct: Number.parseFloat(
            stats.find((s: any) => s.name === "threePointFieldGoalPct")
              ?.displayValue || "0"
          ),
          ftPct: Number.parseFloat(
            stats.find((s: any) => s.name === "freeThrowPct")?.displayValue ||
              "0"
          ),
        };
      };

      return {
        home: teams[0]
          ? parseTeamStats(teams[0])
          : {
              pts: 0,
              reb: 0,
              ast: 0,
              stl: 0,
              blk: 0,
              to: 0,
              fgPct: 0,
              fg3Pct: 0,
              ftPct: 0,
            },
        away: teams[1]
          ? parseTeamStats(teams[1])
          : {
              pts: 0,
              reb: 0,
              ast: 0,
              stl: 0,
              blk: 0,
              to: 0,
              fgPct: 0,
              fg3Pct: 0,
              ftPct: 0,
            },
      };
    } catch (error) {
      console.error(" Error fetching team stats:", error);
      return null;
    }
  }
}

export const nbaStatsApi = new NBAStatsAPI();
