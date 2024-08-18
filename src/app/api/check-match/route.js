// En un nuevo archivo, por ejemplo: api/check-match/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const homeTeam = searchParams.get('home');
  const awayTeam = searchParams.get('away');

  if (!homeTeam || !awayTeam) {
    return NextResponse.json({ error: "Se requieren los parámetros 'home' y 'away'" }, { status: 400 });
  }

  try {
    const { rows } = await query(
      `SELECT * FROM matches WHERE home_team = $1 AND away_team = $2`,
      [homeTeam, awayTeam]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ match: rows[0] });
  } catch (error) {
    console.error("Error al buscar el partido:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}