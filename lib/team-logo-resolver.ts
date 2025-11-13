// lib/team-logo-resolver.ts
type TeamLite = {
  name: string;
  abbreviation: string;
  altNames: string[];
  logos: string[];
};

let _teamsPromise: Promise<TeamLite[]> | null = null;

async function loadTeams(): Promise<TeamLite[]> {
  if (!_teamsPromise) {
    _teamsPromise = fetch("/api/nba/teams", { cache: "force-cache" })
      .then((r) => r.json())
      .catch(() => [] as TeamLite[]);
  }
  return _teamsPromise;
}

// very small fuzzy match: exact (case-insensitive) -> includes() -> abbreviation match
function matchTeam(teams: TeamLite[], name: string): TeamLite | undefined {
  const q = name.trim().toLowerCase();
  // exact against any alt
  let hit = teams.find((t) => t.altNames.includes(q));
  if (hit) return hit;
  // contains
  hit = teams.find((t) => t.altNames.some((a) => a.includes(q)));
  if (hit) return hit;
  return undefined;
}

/** Returns a usable logo URL for a team name, with good fallbacks. */
export async function getTeamLogoDynamic(teamName: string): Promise<string> {
  const teams = await loadTeams();
  const t = matchTeam(teams, teamName);

  // 1) ESPN’s primary vector/PNG (first href is usually the square mark)
  const espn = t?.logos?.[0];
  if (espn) return espn;

  // 2) Local file by abbreviation (if you’ve added some under /public/nba-logos)
  const abbr = t?.abbreviation?.toUpperCase();
  if (abbr) {
    // you can choose .svg or .png; keep both and let the browser pick
    return `/nba-logos/${abbr}.svg`;
  }

  // 3) Neutral placeholder (won’t 404)
  return `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(
    teamName + " NBA logo"
  )}`;
}
