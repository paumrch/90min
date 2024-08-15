import { NextResponse } from "next/server";
import { fetchOddsData } from "@/app/utils/api";
import mockData from "@/lib/data.json";

export async function GET() {
  try {
    let data;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      data = mockData;
    } else {
      data = await fetchOddsData("soccer_spain_la_liga");
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
          ...match,
          overOdds,
          underOdds,
        };
      });

    return NextResponse.json(filteredMatches);
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const revalidate = 86400;
