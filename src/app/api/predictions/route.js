import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const predictions = await request.json();

    for (const prediction of predictions) {
      await query(
        "UPDATE matches SET prediction = $1, odds = $2, updated_at = CURRENT_TIMESTAMP WHERE api_id = $3",
        [prediction.prediction, prediction.odds || 1.0, prediction.api_id]
      );
    }

    return NextResponse.json({ message: "Predictions saved successfully" });
  } catch (error) {
    console.error("Error saving predictions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
