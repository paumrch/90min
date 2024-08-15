import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { fetchScoresData } from "@/app/utils/api";
import mockScores from "@/lib/scores.json";

export async function GET() {
  try {
    let scoresData;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock data for scores");
      scoresData = mockScores;
    } else {
      scoresData = await fetchScoresData();
    }

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "true") {
      const { rows: upcomingMatches } = await query(
        `SELECT * FROM matches WHERE status = 'upcoming'`
      );

      for (const score of scoresData) {
        const match = upcomingMatches.find((m) => m.api_id === score.id);
        if (match) {
          const homeScore = parseInt(
            score.scores.find((s) => s.name === score.home_team).score
          );
          const awayScore = parseInt(
            score.scores.find((s) => s.name === score.away_team).score
          );
          const totalGoals = homeScore + awayScore;
          const isCorrect =
            (match.prediction === "Over 2.5" && totalGoals > 2.5) ||
            (match.prediction === "Under 2.5" && totalGoals < 2.5);

          await query(
            `UPDATE matches 
             SET status = 'completed', 
                 result = $1, 
                 home_goals = $2,
                 away_goals = $3
             WHERE api_id = $4`,
            [
              isCorrect ? "correct" : "incorrect",
              homeScore,
              awayScore,
              score.id,
            ]
          );
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

    console.log("Completed matches:", completedMatches);
    return NextResponse.json(completedMatches);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const revalidate = 86400;
