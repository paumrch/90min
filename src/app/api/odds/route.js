import { NextResponse } from "next/server";
import { fetchOddsData } from "@/app/utils/api";

export async function GET() {
  try {
    const sport = "soccer_denmark_superliga";
    console.log("Fetching events data...");
    const eventsData = await fetchOddsData(sport);

    if (!eventsData || eventsData.length === 0) {
      console.warn("No event data received from the API for Denmark Superliga");
      return NextResponse.json(
        { error: "No event data available" },
        { status: 404 }
      );
    }

    console.log(
      `Received ${eventsData.length} events. Fetching odds for each event...`
    );

    const eventsWithOdds = await Promise.all(
      eventsData.map(async (event) => {
        try {
          console.log(`Fetching odds for event ${event.id}...`);
          const oddsData = await fetchOddsData(sport, event.id);
          console.log(`Odds data received for event ${event.id}:`, oddsData);
          return { ...event, bookmakers: oddsData.bookmakers };
        } catch (error) {
          console.error(`Error fetching odds for event ${event.id}:`, error);
          return { ...event, bookmakers: [] };
        }
      })
    );

    console.log("All events processed. Sending response...");
    return NextResponse.json(eventsWithOdds);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
