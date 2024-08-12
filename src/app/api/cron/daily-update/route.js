import { NextResponse } from "next/server";
import { fetchOddsData } from "@/lib/api";
import { query } from "@/lib/db";

export async function POST() {
  try {
    // Fetch new matches
    const newMatches = await fetchOddsData("soccer_denmark_superliga");

    // Update existing matches and add new ones
    for (const match of newMatches) {
      await query(
        "INSERT INTO matches (api_id, home_team, away_team, start_time, league, prediction, odds) " +
          "VALUES ($1, $2, $3, $4, $5, $6, $7) " +
          "ON CONFLICT (api_id) DO UPDATE SET " +
          "home_team = EXCLUDED.home_team, away_team = EXCLUDED.away_team, " +
          "start_time = EXCLUDED.start_time, league = EXCLUDED.league, " +
          "odds = EXCLUDED.odds, updated_at = CURRENT_TIMESTAMP",
        [
          match.id,
          match.home_team,
          match.away_team,
          match.commence_time,
          "Denmark Superliga",
          null,
          null,
        ]
      );
    }

    // Update results for completed matches
    // This part would require another API call to get results, which isn't provided in the current setup
    // You'd need to implement this part based on how you're getting match results

    // Update stats
    await updateStats();

    return NextResponse.json({
      message: "Daily update completed successfully",
    });
  } catch (error) {
    console.error("Error in daily update:", error);
    return NextResponse.json(
      { error: "Error performing daily update" },
      { status: 500 }
    );
  }
}

async function updateStats() {
  const { rows } = await query(
    "SELECT COUNT(*) as total, " +
      "SUM(CASE WHEN result = prediction THEN 1 ELSE 0 END) as correct, " +
      "SUM(CASE WHEN result = prediction THEN odds - 1 ELSE -1 END) as profit " +
      "FROM matches WHERE status = 'completed'"
  );

  const { total, correct, profit } = rows[0];

  await query(
    "UPDATE stats SET total_predictions = $1, correct_predictions = $2, total_profit = $3, updated_at = CURRENT_TIMESTAMP",
    [total, correct, profit]
  );
}
