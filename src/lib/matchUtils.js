export function processMatchData(match, scoreInfo) {
    const homeScore = scoreInfo.scores.find(s => s.name === match.home_team)?.score;
    const awayScore = scoreInfo.scores.find(s => s.name === match.away_team)?.score;
  
    if (homeScore === undefined || awayScore === undefined) {
      console.log(`No se encontraron los goles para el partido ${match.home_team} vs ${match.away_team}`);
      return null;
    }
  
    const homeGoals = parseInt(homeScore);
    const awayGoals = parseInt(awayScore);
    const totalGoals = homeGoals + awayGoals;
    const result = totalGoals > 2.5 ? "Over 2.5" : "Under 2.5";
    const isCorrect = result === match.prediction;
  
    return { homeGoals, awayGoals, result, isCorrect };
  }