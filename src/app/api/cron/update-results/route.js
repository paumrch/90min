import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { fetchScoresData } from "@/app/utils/api";
import { processMatchData } from "@/lib/matchUtils";

export async function GET(request) {
  console.log(`Cron job ejecutado: ${new Date().toISOString()}`);

  try {
    const scoresData = await fetchScoresData();
    console.log(
      `Datos de puntuación obtenidos para ${scoresData.length} partidos`
    );

    const { rows: matches } = await query(
      `SELECT id, api_id, home_team, away_team, start_time, prediction, odds, status
       FROM matches
       WHERE start_time < NOW() - INTERVAL '3 hours' AND status != 'completed'`
    );
    console.log(`Encontrados ${matches.length} partidos para actualizar`);

    let updatedCount = 0;

    for (const match of matches) {
      const scoreInfo = scoresData.find((score) => score.id === match.api_id);

      if (scoreInfo && scoreInfo.completed) {
        const processedData = processMatchData(match, scoreInfo);
        if (!processedData) {
          console.log(`No se pudo procesar el partido con ID: ${match.id}`);
          continue;
        }

        const { homeGoals, awayGoals, result, isCorrect } = processedData;

        await query(
          `UPDATE matches
           SET status = 'completed', home_goals = $1, away_goals = $2, result = $3, is_correct = $4
           WHERE id = $5`,
          [homeGoals, awayGoals, result, isCorrect, match.id]
        );

        updatedCount++;
        console.log(`Actualizado partido con ID: ${match.id}`);
      }
    }

    console.log(
      `Actualización completada. ${updatedCount} partidos actualizados`
    );
    return NextResponse.json({ success: true, matchesUpdated: updatedCount });
  } catch (error) {
    console.error("Error en la ejecución del cron job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}