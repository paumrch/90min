import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { fetchScoresData } from "@/app/utils/api";

export async function GET(request) {
  try {
    const { rows: pendingMatches } = await query(
      `SELECT id, api_id, home_team, away_team, start_time, prediction
       FROM matches
       WHERE status = 'upcoming' AND start_time < NOW() - INTERVAL '2 hours'`
    );

    if (pendingMatches.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No matches to update",
      });
    }

    const scoresData = await fetchScoresData();

    let updatedCount = 0;

    for (const match of pendingMatches) {
      const scoreInfo = scoresData.find((score) => score.id === match.api_id);

      if (scoreInfo && scoreInfo.completed) {
        const homeGoals = scoreInfo.scores.home;
        const awayGoals = scoreInfo.scores.away;
        const totalGoals = homeGoals + awayGoals;
        const result = totalGoals > 2.5 ? "Over 2.5" : "Under 2.5";
        const isCorrect = result === match.prediction;

        await query(
          `UPDATE matches
           SET status = 'completed', home_goals = $1, away_goals = $2, result = $3, is_correct = $4
           WHERE id = $5`,
          [homeGoals, awayGoals, result, isCorrect, match.id]
        );

        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, matchesUpdated: updatedCount });
  } catch (error) {
    console.error("Error updating results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
