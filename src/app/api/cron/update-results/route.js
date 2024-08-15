import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  console.log("Cron job: Updating results");
  try {
    // Actualiza el estado de los partidos a 'completed' si han pasado más de 2 horas desde su inicio
    const { rows: updatedMatches } = await query(
      `UPDATE matches
       SET status = 'completed'
       WHERE status = 'upcoming' AND commence_time < NOW() - INTERVAL '2 hours'
       RETURNING *`
    );

    // Aquí podrías agregar lógica adicional para obtener los resultados reales
    // de los partidos completados, por ejemplo, haciendo una llamada a una API de resultados

    // Por ahora, simplemente simularemos resultados aleatorios para los partidos completados
    for (const match of updatedMatches) {
      const homeGoals = Math.floor(Math.random() * 5);
      const awayGoals = Math.floor(Math.random() * 5);
      const totalGoals = homeGoals + awayGoals;
      const result = totalGoals > 2.5 ? "Over 2.5" : "Under 2.5";
      const isCorrect = result === match.prediction;

      await query(
        `UPDATE matches
         SET home_goals = $1, away_goals = $2, result = $3, is_correct = $4
         WHERE id = $5`,
        [homeGoals, awayGoals, result, isCorrect, match.id]
      );
    }

    return NextResponse.json({
      success: true,
      matchesUpdated: updatedMatches.length,
    });
  } catch (error) {
    console.error("Error updating results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
