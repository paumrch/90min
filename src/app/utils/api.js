export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const REVALIDATE_TIME = 86400;

export async function fetchOddsData() {
  console.log("fetchOddsData - Start");
  console.log("API_BASE_URL:", API_BASE_URL);
  const url = `${API_BASE_URL}/api/odds`;
  console.log("Fetching from URL:", url);

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
  console.log("fetchScoresData - Start");
  const url = `${API_BASE_URL}/api/scores`;
  console.log("Fetching from URL:", url);

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(
      "Scores data received:",
      JSON.stringify(data).slice(0, 200) + "..."
    );
    return data;
  } catch (error) {
    console.error("Error fetching scores data:", error);
    throw error;
  }
}
