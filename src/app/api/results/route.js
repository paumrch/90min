import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { fetchScoresData } from "@/app/utils/api";
import mockScores from "@/lib/scores.json";

export async function GET() {
  console.log("GET /api/results - Start");
  try {
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Using mock data:", process.env.NEXT_PUBLIC_USE_MOCK_DATA);

    let scoresData;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock data for scores");
      scoresData = mockScores;
    } else {
      console.log("Fetching real scores data");
      scoresData = await fetchScoresData();
    }

    console.log(
      "Scores data received:",
      JSON.stringify(scoresData).slice(0, 200) + "..."
    );

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "true") {
      console.log("Updating matches in database");
      const { rows: upcomingMatches } = await query(
        `SELECT * FROM matches WHERE status = 'upcoming'`
      );
      console.log("Upcoming matches:", upcomingMatches.length);

      for (const score of scoresData) {
        const match = upcomingMatches.find((m) => m.api_id === score.id);
        if (match) {
          // ... (rest of the update logic)
          console.log(`Updated match: ${match.api_id}`);
        }
      }
    }

    let completedMatches;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      completedMatches = scoresData
        .filter((match) => match.completed === true)
        .slice(0, 10);
    } else {
      const { rows } = await query(
        `SELECT * FROM matches 
         WHERE status = 'completed' 
         ORDER BY start_time DESC 
         LIMIT 10`
      );
      completedMatches = rows;
    }

    console.log("Completed matches count:", completedMatches.length);
    console.log("First completed match:", JSON.stringify(completedMatches[0]));

    return NextResponse.json(completedMatches);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

export const revalidate = 86400;
