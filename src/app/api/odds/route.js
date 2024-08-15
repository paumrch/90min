import { NextResponse } from "next/server";
import { fetchOddsData } from "@/app/utils/api";
import mockData from "@/lib/data.json";

export async function GET() {
  try {
    let data;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock data for odds");
      data = mockData;
    } else {
      data = await fetchOddsData("soccer_spain_la_liga");
    }

    if (!data || !Array.isArray(data)) {
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
          ...match,
          overOdds,
          underOdds,
        };
      });

    console.log("Environment:", process.env.NODE_ENV);
    console.log("Using mock data:", process.env.NEXT_PUBLIC_USE_MOCK_DATA);
    console.log("API base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log("Filtered matches:", filteredMatches);
    return NextResponse.json(filteredMatches);
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const revalidate = 86400;
