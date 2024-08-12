import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {

    const scoresPath = path.join(process.cwd(), '/src/lib/scores.json');
    const scoresData = JSON.parse(fs.readFileSync(scoresPath, 'utf8'));

    const { rows: upcomingMatches } = await query(
      `SELECT * FROM matches WHERE status = 'upcoming'`
    );

    // Actualizar partidos completados
    for (const score of scoresData) {
      const match = upcomingMatches.find(m => m.api_id === score.id);
      if (match) {
        const totalGoals = parseInt(score.scores[0].score) + parseInt(score.scores[1].score);
        const isCorrect = (match.prediction === 'Over 2.5' && totalGoals > 2.5) ||
                          (match.prediction === 'Under 2.5' && totalGoals < 2.5);
        
        await query(
          `UPDATE matches 
           SET status = 'completed', 
               result = $1, 
               total_goals = $2
           WHERE api_id = $3`,
          [isCorrect ? 'correct' : 'incorrect', totalGoals, score.id]
        );
      }
    }

    // Obtener partidos completados
    const { rows: completedMatches } = await query(
      `SELECT * FROM matches 
       WHERE status = 'completed' 
       ORDER BY start_time DESC 
       LIMIT 10`
    );

    return NextResponse.json(completedMatches);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}