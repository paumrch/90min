import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const API_KEY = process.env.ODDS_API_KEY;
const SPORT = "soccer_spain_la_liga";
const REGION = "eu";
const MARKET = "totals";

export async function GET() {
  console.log(
    `Cron job de actualización de cuotas ejecutado: ${new Date().toISOString()}`
  );

  try {
    if (!API_KEY) {
      console.error("ODDS_API_KEY no está definida");
      throw new Error("API key no configurada");
    }

    const url = `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?apiKey=${API_KEY}&regions=${REGION}&markets=${MARKET}`;
    console.log(
      `Iniciando fetchOddsData. URL: ${url.replace(API_KEY, "HIDDEN_KEY")}`
    );

    const response = await fetch(url);
    console.log("Respuesta recibida. Estado:", response.status);

    if (!response.ok) {
      throw new Error(`API respondió con estado: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      console.error("Estructura de datos inválida recibida:", data);
      throw new Error("Datos inválidos recibidos de la API");
    }

    console.log(`Datos de cuotas recibidos para ${data.length} partidos`);

    const filteredMatches = data
      .filter((match) => {
        const livescoreBet = match.bookmakers?.find(
          (b) => b.key === "livescorebet_eu"
        );
        const totalsMarket = livescoreBet?.markets?.find(
          (m) => m.key === "totals"
        );
        const overOdds = totalsMarket?.outcomes?.find(
          (o) => o.name === "Over"
        )?.price;
        const underOdds = totalsMarket?.outcomes?.find(
          (o) => o.name === "Under"
        )?.price;

        return overOdds && underOdds;
      })
      .map((match) => {
        const livescoreBet = match.bookmakers.find(
          (b) => b.key === "livescorebet_eu"
        );
        const totalsMarket = livescoreBet.markets.find(
          (m) => m.key === "totals"
        );
        const overOdds = totalsMarket.outcomes.find(
          (o) => o.name === "Over"
        ).price;
        const underOdds = totalsMarket.outcomes.find(
          (o) => o.name === "Under"
        ).price;

        return {
          id: match.id,
          sport_key: match.sport_key,
          sport_title: match.sport_title,
          commence_time: match.commence_time,
          home_team: match.home_team,
          away_team: match.away_team,
          overOdds,
          underOdds,
        };
      });

    console.log(`Cuotas filtradas para ${filteredMatches.length} partidos`);

    await query(
      `INSERT INTO odds_cache (data, created_at) VALUES ($1, NOW())
       ON CONFLICT (id) DO UPDATE SET data = $1, created_at = NOW()`,
      [JSON.stringify(filteredMatches)]
    );

    console.log("Cuotas actualizadas en la base de datos");

    return NextResponse.json({
      success: true,
      matchesUpdated: filteredMatches.length,
    });
  } catch (error) {
    console.error("Error al actualizar cuotas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
