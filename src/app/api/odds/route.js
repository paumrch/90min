import { NextResponse } from "next/server";
import { getData } from "@/lib/response";

export async function GET() {
  try {
    const data = getData();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
