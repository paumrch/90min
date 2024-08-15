"use client";

import { useState, useEffect } from "react";
import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export default function Home() {
  const [results, setResults] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [stats, setStats] = useState({
    effectiveness: { percentage: 0, hits: 0, total: 0, profit: 0 },
  });

  useEffect(() => {
    async function loadData() {
      const [fetchedResults, fetchedUpcoming, fetchedStats] = await Promise.all(
        [
          fetchData("/api/results"),
          fetchData("/api/upcoming"),
          fetchData("/api/stats"),
        ]
      );

      setResults(fetchedResults || []);
      setUpcomingMatches(fetchedUpcoming || []);
      setStats(
        fetchedStats || {
          effectiveness: { percentage: 0, hits: 0, total: 0, profit: 0 },
        }
      );
    }

    loadData();
  }, []);

  const filteredUpcoming = upcomingMatches.filter(
    (upcomingMatch) => !results.some((result) => result.id === upcomingMatch.id)
  );

  const handlePredictionRemoved = async (removedPrediction) => {
    // Actualizar upcomingMatches
    setUpcomingMatches((prevUpcoming) => [...prevUpcoming, removedPrediction]);

    // Actualizar stats (esto es una aproximación, idealmente deberías re-fetch las stats)
    setStats((prevStats) => ({
      ...prevStats,
      effectiveness: {
        ...prevStats.effectiveness,
        total: prevStats.effectiveness.total - 1,
      },
    }));

    // Re-fetch de los datos para asegurar sincronización
    const [fetchedUpcoming, fetchedStats] = await Promise.all([
      fetchData("/api/upcoming"),
      fetchData("/api/stats"),
    ]);

    setUpcomingMatches(fetchedUpcoming || []);
    setStats(
      fetchedStats || {
        effectiveness: { percentage: 0, hits: 0, total: 0, profit: 0 },
      }
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection effectiveness={stats.effectiveness} />
        <div className="grid gap-6 md:grid-cols-2">
          <Upcoming
            initialUpcoming={filteredUpcoming}
            onPredictionRemoved={handlePredictionRemoved}
          />
          <Results initialResults={results} />
        </div>
      </main>
    </div>
  );
}
