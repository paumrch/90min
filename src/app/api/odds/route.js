import { NextResponse } from "next/server";
import { fetchOddsData } from "@/app/utils/api";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const sport = "soccer_denmark_superliga";
    const apiData = await fetchOddsData(sport);

    console.log("API Data:", JSON.stringify(apiData, null, 2));

    // Procesar los datos recibidos
    const processedData = apiData.map((match) => ({
      id: match.id,
      home_team: match.home_team,
      away_team: match.away_team,
      start_time: match.commence_time,
    }));

    // Guardar datos procesados en la base de datos
    for (const match of processedData) {
      await query(
        "INSERT INTO matches (api_id, home_team, away_team, start_time, league, prediction, odds) " +
          "VALUES ($1, $2, $3, $4, $5, $6, $7) " +
          "ON CONFLICT (api_id) DO UPDATE SET " +
          "home_team = EXCLUDED.home_team, away_team = EXCLUDED.away_team, " +
          "start_time = EXCLUDED.start_time, updated_at = CURRENT_TIMESTAMP",
        [
          match.id,
          match.home_team,
          match.away_team,
          match.start_time,
          "Denmark Superliga",
          "Pending",
          1.0,
        ]
      );
    }

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
