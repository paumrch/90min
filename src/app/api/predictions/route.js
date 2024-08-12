import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    let predictions;

    if (Array.isArray(body.predictions)) {
      predictions = body.predictions;
    } else if (typeof body === "object" && Object.keys(body).length > 0) {
      predictions = Object.entries(body).map(([api_id, data]) => ({
        api_id,
        ...data,
      }));
    } else {
      throw new Error(
        "Invalid input: predictions must be an array or an object"
      );
    }

    console.log(
      "Processing predictions:",
      JSON.stringify(predictions, null, 2)
    );

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
          prediction.home_team || "",
          prediction.away_team || "",
          prediction.start_time || new Date(),
          prediction.league || "",
          prediction.prediction,
          prediction.odds,
          "upcoming",
        ]
      );
    }

    return NextResponse.json({ message: "Predictions saved successfully" });
  } catch (error) {
    console.error("Error saving predictions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
