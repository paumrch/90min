import { NextResponse } from "next/server";
import { fetchScoresData } from "@/app/utils/api";

export async function GET() {
  try {
    let data;
    {
      data = await fetchScoresData();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching scores data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const revalidate = 86400;
