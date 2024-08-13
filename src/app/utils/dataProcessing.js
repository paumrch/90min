export function processUpcomingMatches(data) {
  return data.map((event) => {
    let odds = null;
    let prediction = "No disponible";
    let point = null;

    if (event.bookmakers && Array.isArray(event.bookmakers)) {
      const liveScoreBet = event.bookmakers.find(
        (bookmaker) => bookmaker.key === "livescorebet_eu"
      );
      if (liveScoreBet && liveScoreBet.markets) {
        const totalsMarket = liveScoreBet.markets.find(
          (market) => market.key === "totals"
        );
        if (totalsMarket && totalsMarket.outcomes) {
          const over = totalsMarket.outcomes.find(
            (outcome) => outcome.name === "Over"
          );
          if (over) {
            odds = over.price;
            point = over.point;
            prediction = `Over ${point}`;
          }
        }
      }
    } else {
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
