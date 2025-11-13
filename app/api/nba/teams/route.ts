import { NextResponse } from "next/server";

// Simple in-memory cache (per server instance)
type TeamLite = {
  name: string;
  abbreviation: string;
  altNames: string[];
  logos: string[];
};

let CACHE: { at: number; data: TeamLite[] } | null = null;
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function GET() {
  try {
    if (CACHE && Date.now() - CACHE.at < TTL_MS) {
      return NextResponse.json(CACHE.data, {
        headers: {
          "Cache-Control": "max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    // ESPN public teams endpoint (NBA)
    const url =
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams";
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const json = await res.json();

    const teamsRaw = json?.sports?.[0]?.leagues?.[0]?.teams || [];
    const teams: TeamLite[] = teamsRaw.map((t: any) => {
      const tm = t?.team ?? {};
      const logos: string[] = (tm.logos || [])
        .map((l: any) => l?.href)
        .filter(Boolean);
      const altNamesRaw = [
        tm.displayName,
        tm.name,
        tm.shortDisplayName,
        tm.location,
        tm.nickname,
        tm.abbreviation,
      ].filter(Boolean);

      return {
        name: tm.displayName || tm.name || "",
        abbreviation: tm.abbreviation || "",
        altNames: Array.from(
          new Set(altNamesRaw.map((s: string) => s.toLowerCase()))
        ),
        logos,
      };
    });

    CACHE = { at: Date.now(), data: teams };
    return NextResponse.json(teams, {
      headers: {
        "Cache-Control": "max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    console.error("[teams] fetch failed", e);
    // Return empty array (we’ll fall back on placeholders client-side)
    return NextResponse.json([], { status: 200 });
  }
}
