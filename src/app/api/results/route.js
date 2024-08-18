import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(
      `SELECT id, home_team, away_team, commence_time, prediction, odds, 
              home_goals, away_goals, result, is_correct, status
       FROM matches 
       WHERE status = 'completed' 
         AND prediction IS NOT NULL 
         AND prediction != 'VOID'
       ORDER BY commence_time DESC 
       LIMIT 10`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
