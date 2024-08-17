import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  console.log("GET /api/upcoming - Start");
  try {
    const { rows } = await query(
      `SELECT id, api_id, home_team, away_team, start_time, league, prediction, odds
       FROM matches
       WHERE status = 'upcoming' AND start_time > NOW()
       ORDER BY start_time ASC`
    );

    console.log(`Retrieved ${rows.length} upcoming matches`);
    if (rows.length > 0) {
      console.log("First match:", JSON.stringify(rows[0]));
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching upcoming matches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
