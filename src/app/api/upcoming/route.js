import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(
      "SELECT * FROM matches WHERE prediction IS NOT NULL AND status = $1 ORDER BY start_time ASC",
      ["upcoming"]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching upcoming matches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
