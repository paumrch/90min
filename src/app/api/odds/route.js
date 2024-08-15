import { NextResponse } from "next/server";
import { fetchOddsData } from "@/app/utils/api";
import mockData from "@/lib/data.json";

export async function GET() {
  console.log("GET /api/odds - Start");
  try {
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Using mock data:", process.env.NEXT_PUBLIC_USE_MOCK_DATA);
    console.log("API base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

    let data;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock data for odds");
      data = mockData;
    } else {
      console.log("Fetching real data from API");
      data = await fetchOddsData("soccer_spain_la_liga");
    }

    console.log(
      "Raw data received:",
      JSON.stringify(data).slice(0, 200) + "..."
    );

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

    console.log("Filtered matches count:", filteredMatches.length);
    console.log("First filtered match:", JSON.stringify(filteredMatches[0]));

    return NextResponse.json(filteredMatches);
  } catch (error) {
    console.error("Error in /api/odds:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const revalidate = 86400;
