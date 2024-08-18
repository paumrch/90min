import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { fetchScoresData } from "@/app/utils/api";
import { processMatchData } from "@/lib/matchUtils";

export async function POST(request) {
  try {
    const scoresData = await fetchScoresData();
    const { rows: matches } = await query(
      `SELECT id, api_id, home_team, away_team, start_time, prediction, status
       FROM matches
       WHERE status != 'completed' AND start_time < NOW() - INTERVAL '3 hours'`
    );

    let updatedCount = 0;
    let updatedMatches = [];

    for (const match of matches) {
      const scoreInfo = scoresData.find(
        (m) =>
          m.home_team === match.home_team && m.away_team === match.away_team
      );

      if (scoreInfo && scoreInfo.completed) {
        const processedData = processMatchData(match, scoreInfo);
        if (!processedData) continue;

        const { homeGoals, awayGoals, result, isCorrect } = processedData;

        const { rows } = await query(
          `UPDATE matches
           SET status = 'completed', home_goals = $1, away_goals = $2, result = $3, is_correct = $4
           WHERE id = $5
           RETURNING *`,
          [homeGoals, awayGoals, result, isCorrect, match.id]
        );

        if (rows.length > 0) {
          updatedCount++;
          updatedMatches.push(rows[0]);
        }
      }
    }

    return NextResponse.json({
      message: `${updatedCount} partidos actualizados correctamente`,
      updatedMatches: updatedMatches,
    });
  } catch (error) {
    console.error("Error al corregir los resultados de los partidos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
