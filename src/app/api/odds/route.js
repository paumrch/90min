import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  console.log("Solicitud de cuotas recibida");

  try {
    const { rows } = await query(
      `SELECT data FROM odds_cache 
       ORDER BY created_at DESC 
       LIMIT 1`
    );

    if (rows.length === 0) {
      console.log("No hay datos de cuotas disponibles");
      return NextResponse.json([], { status: 200 });
    }

    let oddsData = rows[0].data;

    if (!Array.isArray(oddsData)) {
      console.error("oddsData es inválido:", oddsData);
      return NextResponse.json([], { status: 200 });
    }

    console.log(`Datos de cuotas recuperados para ${oddsData.length} partidos`);

    const now = new Date();
    oddsData = oddsData.filter((match) => new Date(match.commence_time) > now);

    console.log(
      `${oddsData.length} partidos con cuotas después de filtrar por fecha`
    );

    return NextResponse.json(oddsData);
  } catch (error) {
    console.error("Error en /api/odds:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
