import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get('key');
  
  if (secretKey !== process.env.UPDATE_RESULTS_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testMatches = [
    {
      api_id: 'test_match_1',
      home_team: 'Test Home 1',
      away_team: 'Test Away 1',
      start_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      prediction: 'Over 2.5',
      status: 'upcoming',
      league: 'La Liga',
      odds: 1.95 // Añadido el campo odds
    },
    {
      api_id: 'test_match_2',
      home_team: 'Test Home 2',
      away_team: 'Test Away 2',
      start_time: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      prediction: 'Under 2.5',
      status: 'upcoming',
      league: 'La Liga',
      odds: 2.05 // Añadido el campo odds
    }
  ];

  try {
    for (const match of testMatches) {
      await query(
        `INSERT INTO matches (api_id, home_team, away_team, start_time, prediction, status, league, odds) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [match.api_id, match.home_team, match.away_team, match.start_time, match.prediction, match.status, match.league, match.odds]
      );
    }

    console.log(`Added ${testMatches.length} test matches`);

    return NextResponse.json({ success: true, addedMatches: testMatches });
  } catch (error) {
    console.error("Error adding test matches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}