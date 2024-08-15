import fs from "fs";
import path from "path";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

const REVALIDATE_TIME = 86400;

function readMockData(filename) {
  const possiblePaths = [
    path.join(process.cwd(), "lib", filename),
    path.join(process.cwd(), "src", "lib", filename),
    path.join(process.cwd(), "app", "lib", filename),
    path.join(process.cwd(), "src", "app", "lib", filename),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContents);
    }
  }

  throw new Error(
    `Mock data file ${filename} not found in any expected locations`
  );
}

export async function fetchOddsData(sport, eventId = null) {
  if (process.env.USE_MOCK_DATA === "true") {
    try {
      return readMockData("data.json");
    } catch (error) {
      console.error("Error reading mock data:", error);
      return [];
    }
  }

  if (!process.env.ODDS_API_KEY) {
    throw new Error("Missing API key for odds API");
  }

  const apiHost = "https://api.the-odds-api.com";
  const apiVersion = "v4";

  let url;
  if (eventId) {
    url = new URL(
      `${apiHost}/${apiVersion}/sports/${sport}/events/${eventId}/odds`
    );
    url.searchParams.append("markets", "totals");
    url.searchParams.append("oddsFormat", "decimal");
    url.searchParams.append("regions", "eu");
  } else {
    url = new URL(`${apiHost}/${apiVersion}/sports/${sport}/events`);
  }

  url.searchParams.append("apiKey", process.env.ODDS_API_KEY);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching odds data:", error);
    throw error;
  }
}

export async function fetchScoresData() {
  if (process.env.USE_MOCK_DATA === "true") {
    return readMockData("scores.json");
  }

  if (!process.env.ODDS_API_KEY) {
    throw new Error("Missing API key for odds API");
  }

  const apiHost = "https://api.the-odds-api.com";
  const apiVersion = "v4";
  const sport = "soccer_spain_la_liga";

  const url = new URL(`${apiHost}/${apiVersion}/sports/${sport}/scores/`);
  url.searchParams.append("apiKey", process.env.ODDS_API_KEY);
  url.searchParams.append("daysFrom", "3");
  url.searchParams.append("dateFormat", "iso");

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching scores data:", error);
    throw error;
  }
}
