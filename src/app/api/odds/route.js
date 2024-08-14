// route.js
import { NextResponse } from "next/server";
import { getData } from "@/lib/response";

export async function GET() {
  try {
    const data = getData();

    const filteredMatches = Array.isArray(data)
      ? data
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
              ...match,
              overOdds,
              underOdds,
            };
          })
      : [];

    return NextResponse.json(filteredMatches);
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
