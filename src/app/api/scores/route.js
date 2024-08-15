import { NextResponse } from "next/server";
import { fetchScoresData } from "@/app/utils/api";

export async function GET() {
  try {
    let data;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      data = mockScores;
    } else {
      data = await fetchScoresData();
    }

    // Aquí puedes agregar cualquier procesamiento adicional que necesites para los datos de puntuaciones

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching scores data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const revalidate = 86400;