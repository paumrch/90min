export function processUpcomingMatches(data) {
  return data.map((event) => {
    console.log("Processing event:", event.id);
    let odds = null;
    let prediction = "No disponible";
    let point = null;

    if (event.bookmakers && Array.isArray(event.bookmakers)) {
      console.log("Number of bookmakers:", event.bookmakers.length);
      const liveScoreBet = event.bookmakers.find(
        (bookmaker) => bookmaker.key === "livescorebet_eu"
      );
      console.log("LiveScore Bet found:", !!liveScoreBet);
      if (liveScoreBet && liveScoreBet.markets) {
        console.log("Number of markets:", liveScoreBet.markets.length);
        const totalsMarket = liveScoreBet.markets.find(
          (market) => market.key === "totals"
        );
        console.log("Totals market found:", !!totalsMarket);
        if (totalsMarket && totalsMarket.outcomes) {
          console.log("Number of outcomes:", totalsMarket.outcomes.length);
          const over = totalsMarket.outcomes.find(
            (outcome) => outcome.name === "Over"
          );
          console.log("Over outcome found:", !!over);
          if (over) {
            odds = over.price;
            point = over.point;
            prediction = `Over ${point}`;
            console.log("Odds, point, and prediction set:", {
              odds,
              point,
              prediction,
            });
          }
        }
      }
    } else {
      console.log("No bookmakers data found for event:", event.id);
    }

    return {
      id: event.id,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      startTime: new Date(event.commence_time),
      league: "Denmark Superliga",
      odds: odds,
      prediction: prediction,
      point: point,
    };
  });
}
