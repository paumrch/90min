export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const REVALIDATE_TIME = 86400;

export async function fetchOddsData() {
  const url = `${API_BASE_URL}/api/odds`;

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data received:", JSON.stringify(data).slice(0, 200) + "...");
    return data;
  } catch (error) {
    console.error("Error fetching odds data:", error);
    throw error;
  }
}

export async function fetchScoresData() {
  const API_KEY = process.env.SCORES_API_KEY;
  const SPORT = "soccer_spain_la_liga";

  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/${SPORT}/scores/?apiKey=${API_KEY}&daysFrom=1`
  );

  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
