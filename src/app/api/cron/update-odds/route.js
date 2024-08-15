import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const API_KEY = process.env.ODDS_API_KEY;
const SPORT = "soccer_spain_la_liga";
const REGION = "eu";
const MARKET = "totals";

export async function GET() {
  console.log("Cron job: Updating odds");
  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?apiKey=${API_KEY}&regions=${REGION}&markets=${MARKET}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      console.error("Invalid data structure received:", data);
      throw new Error("Invalid data received from API");
    }

    const filteredMatches = data
      .filter((match) => {
        const livescoreBet = match.bookmakers?.find(
          (b) => b.key === "livescorebet_eu"
        );
        const totalsMarket = livescoreBet?.markets?.find(
          (m) => m.key === "totals"
        );
        const overOdds = totalsMarket?.outcomes?.find(
          (o) => o.name === "Over"
        )?.price;
        const underOdds = totalsMarket?.outcomes?.find(
          (o) => o.name === "Under"
        )?.price;

        return overOdds && underOdds;
      })
      .map((match) => {
        const livescoreBet = match.bookmakers.find(
          (b) => b.key === "livescorebet_eu"
        );
        const totalsMarket = livescoreBet.markets.find(
          (m) => m.key === "totals"
        );
        const overOdds = totalsMarket.outcomes.find(
          (o) => o.name === "Over"
        ).price;
        const underOdds = totalsMarket.outcomes.find(
          (o) => o.name === "Under"
        ).price;

        return {
          id: match.id,
          sport_key: match.sport_key,
          sport_title: match.sport_title,
          commence_time: match.commence_time,
          home_team: match.home_team,
          away_team: match.away_team,
          overOdds,
          underOdds,
        };
      });

    await query(
      `INSERT INTO odds_cache (data, created_at) VALUES ($1, NOW())
       ON CONFLICT (id) DO UPDATE SET data = $1, created_at = NOW()`,
      [JSON.stringify(filteredMatches)]
    );

    return NextResponse.json({
      success: true,
      matchesUpdated: filteredMatches.length,
    });
  } catch (error) {
    console.error("Error updating odds:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
