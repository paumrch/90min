import { NextResponse } from "next/server";
import { getData } from "@/lib/response";

export async function GET() {
  try {
    const data = getData();

    const matches = Array.isArray(data) ? data : [];

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
