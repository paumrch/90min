import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  console.log("GET /api/predictions - Start");
  try {
    const { rows } = await query(
      `SELECT * FROM matches WHERE prediction IS NOT NULL`
    );
    console.log("Predictions retrieved:", rows.length);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log("POST /api/predictions - Start");
  try {
    const body = await request.json();
    const { predictions } = body;

    for (const prediction of predictions) {
      await query(
        `INSERT INTO matches 
        (api_id, home_team, away_team, start_time, league, prediction, odds, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        ON CONFLICT (api_id) DO UPDATE SET 
        prediction = EXCLUDED.prediction, 
        odds = EXCLUDED.odds, 
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP`,
        [
          prediction.api_id,
          prediction.home_team,
          prediction.away_team,
          prediction.start_time,
          prediction.league,
          prediction.prediction,
          prediction.odds,
          "upcoming",
        ]
      );
    }

    return NextResponse.json({ message: "Predicciones guardadas con éxito" });
  } catch (error) {
    console.error("Error saving predictions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
