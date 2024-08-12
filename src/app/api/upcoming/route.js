import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(
      `SELECT id, api_id, home_team, away_team, start_time, league, prediction, odds
       FROM matches
       WHERE status = 'upcoming'
       ORDER BY start_time ASC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching upcoming matches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}