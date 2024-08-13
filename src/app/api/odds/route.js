import { NextResponse } from "next/server";
import { getData } from "@/lib/response";

export async function GET() {
  try {
    const data = getData();
    console.log("Odds data fetched:", JSON.stringify(data, null, 2));

    const matches = Array.isArray(data) ? data : [];

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
