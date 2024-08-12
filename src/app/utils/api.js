export async function fetchOddsData(sport, eventId = null) {
  if (!process.env.ODDS_API_KEY) {
    throw new Error("Missing API key for odds API");
  }

  const apiHost = process.env.ODDS_API_HOST || "https://api.the-odds-api.com";
  const apiVersion = process.env.ODDS_API_VERSION || "v4";

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

  console.log("Fetching from URL:", url.toString());

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
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
    console.error("Error fetching data:", error);
    throw error;
  }
}
