export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const REVALIDATE_TIME = 86400;

export async function fetchOddsData() {
  const url = `${API_BASE_URL}/api/odds`;

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching odds data:", error);
    throw error;
  }
}

export async function fetchScoresData() {
  const url = `${API_BASE_URL}/api/scores`;

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching scores data:", error);
    throw error;
  }
}
