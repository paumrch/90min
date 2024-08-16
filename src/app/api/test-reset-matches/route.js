import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get("key");

  if (secretKey !== process.env.UPDATE_RESULTS_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rows } = await query(
      `UPDATE matches 
       SET status = 'upcoming', home_goals = NULL, away_goals = NULL, result = NULL, is_correct = NULL 
       WHERE status = 'completed' 
       RETURNING id, home_team, away_team`
    );

    console.log(`Reset ${rows.length} matches to upcoming status`);

    return NextResponse.json({ success: true, resetMatches: rows });
  } catch (error) {
    console.error("Error resetting matches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
