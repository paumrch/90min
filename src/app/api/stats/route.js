import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  console.log("GET /api/stats - Start");
  try {
    const result = await query("SELECT * FROM calculate_stats()");
    console.log("Stats retrieved:", result.rows[0]);

    const stats = result.rows[0];
    const effectiveness = {
      percentage: parseFloat(stats.effectiveness) || 0,
      hits: parseInt(stats.correct_predictions),
      total: parseInt(stats.total_predictions),
      profit: parseFloat(stats.total_profit),
    };

    console.log("Processed stats:", effectiveness);

    return NextResponse.json({ effectiveness });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
        effectiveness: {
          percentage: 0,
          hits: 0,
          total: 0,
          profit: 0,
        },
      },
      { status: 500 }
    );
  }
}
