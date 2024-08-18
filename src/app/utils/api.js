export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const REVALIDATE_TIME = 86400;

export async function fetchOddsData() {
  const url = `${API_BASE_URL}/api/odds`;

  console.log(`Iniciando fetchOddsData. URL: ${url}`);
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    console.log("Respuesta recibida. Estado:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos recibidos:", JSON.stringify(data).slice(0, 200) + "...");
    return data;
  } catch (error) {
    console.error("Error al obtener datos de cuotas:", error);
    throw error;
  }
}

export async function fetchScoresData() {
  const API_KEY = process.env.SCORES_API_KEY;
  if (!API_KEY) {
    console.error("SCORES_API_KEY no está definida");
    throw new Error("API key no configurada");
  }

  const SPORT = "soccer_spain_la_liga";
  const url = `https://api.the-odds-api.com/v4/sports/${SPORT}/scores/?apiKey=${API_KEY}&daysFrom=3`;

  console.log(
    `Iniciando fetchScoresData. URL: ${url.replace(API_KEY, "HIDDEN_KEY")}`
  );
  try {
    const response = await fetch(url);
    console.log("Respuesta recibida. Estado:", response.status);

    if (!response.ok) {
      throw new Error(`API respondió con estado: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Datos de puntuación recibidos para ${data.length} partidos`);
    return data;
  } catch (error) {
    console.error("Error al obtener datos de puntuación:", error);
    throw error;
  }
}
