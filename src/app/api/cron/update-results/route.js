import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { fetchScoresData } from "@/app/utils/api";
import { processMatchData } from "@/lib/matchUtils";

export async function GET(request) {
  console.log("Iniciando actualización de resultados");
  try {
    const scoresData = await fetchScoresData();
    console.log(
      `Obtenidos datos de puntuación para ${scoresData.length} partidos`
    );

    const { rows: matches } = await query(
      `SELECT id, api_id, home_team, away_team, start_time, prediction, status
       FROM matches
       WHERE start_time < NOW() - INTERVAL '3 hours' AND status != 'completed'`
    );

    let updatedCount = 0;

    for (const match of matches) {
      const scoreInfo = scoresData.find(
        (score) =>
          score.home_team === match.home_team &&
          score.away_team === match.away_team
      );

      if (scoreInfo && scoreInfo.completed) {
        console.log(
          `Procesando partido: ${match.home_team} vs ${match.away_team}`
        );

        const processedData = processMatchData(match, scoreInfo);
        if (!processedData) continue;

        const { homeGoals, awayGoals, result, isCorrect } = processedData;

        await query(
          `UPDATE matches
           SET status = 'completed', home_goals = $1, away_goals = $2, result = $3, is_correct = $4
           WHERE id = $5`,
          [homeGoals, awayGoals, result, isCorrect, match.id]
        );

        updatedCount++;
        console.log(
          `Partido actualizado: ${match.home_team} ${homeGoals} - ${awayGoals} ${match.away_team}, Resultado: ${result}, Predicción correcta: ${isCorrect}`
        );
      } else {
        console.log(
          `El partido ${match.home_team} vs ${match.away_team} aún no ha finalizado o no se encontró información`
        );
      }
    }

    console.log(
      `Actualización completada. ${updatedCount} partidos actualizados`
    );
    return NextResponse.json({ success: true, matchesUpdated: updatedCount });
  } catch (error) {
    console.error("Error al actualizar resultados:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
