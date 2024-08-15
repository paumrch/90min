"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { Prediction } from "@/components/prediction";
import { SummarySection } from "@/components/summary-card";
import { SelectedPredictions } from "@/components/selected";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/app/utils/api";

function Login({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD) {
      onLogin();
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Dashboard Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    initialMatches: [],
    stats: { effectiveness: { percentage: 0, hits: 0, total: 0, profit: 0 } },
    initialSelectedPredictions: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("dashboardAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        initialMatchesResponse,
        statsResponse,
        initialSelectedPredictionsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/api/odds`),
        fetch(`${API_BASE_URL}/api/stats`),
        fetch(`${API_BASE_URL}/api/predictions`),
      ]);

      if (!initialMatchesResponse.ok)
        throw new Error(`HTTP error! status: ${initialMatchesResponse.status}`);
      if (!statsResponse.ok)
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      if (!initialSelectedPredictionsResponse.ok)
        throw new Error(
          `HTTP error! status: ${initialSelectedPredictionsResponse.status}`
        );

      const initialMatches = await initialMatchesResponse.json();
      const stats = await statsResponse.json();
      const initialSelectedPredictions =
        await initialSelectedPredictionsResponse.json();

      console.log("Fetched initial matches:", initialMatches);
      console.log("Fetched stats:", stats);
      console.log(
        "Fetched initial selected predictions:",
        initialSelectedPredictions
      );

      const uniqueMatches = initialMatches.reduce((acc, match) => {
        if (!acc.some((m) => m.id === match.id)) {
          acc.push(match);
        }
        return acc;
      }, []);

      setData({
        initialMatches: uniqueMatches,
        stats,
        initialSelectedPredictions,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Error al cargar los datos. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("dashboardAuth", "true");
  };

  const handlePredictionRemoved = (removedPrediction) => {
    setData((prevData) => {
      const originalMatch = prevData.initialMatches.find(
        (match) => match.id === removedPrediction.api_id
      );

      let updatedInitialMatches = prevData.initialMatches;

      if (originalMatch) {
        if (
          !prevData.initialMatches.some(
            (match) => match.id === originalMatch.id
          )
        ) {
          updatedInitialMatches = [...prevData.initialMatches, originalMatch];
        }
      }

      return {
        ...prevData,
        initialMatches: updatedInitialMatches,
        initialSelectedPredictions: prevData.initialSelectedPredictions.filter(
          (pred) => pred.id !== removedPrediction.id
        ),
      };
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const availableMatches = data.initialMatches.filter(
    (match) =>
      !data.initialSelectedPredictions.some((pred) => pred.api_id === match.id)
  );

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          <SummarySection effectiveness={data.stats.effectiveness} />
          <div className="grid gap-6 md:grid-cols-2">
            <Prediction initialMatches={availableMatches} />
            <SelectedPredictions
              initialSelectedPredictions={data.initialSelectedPredictions}
              onPredictionRemoved={handlePredictionRemoved}
            />
          </div>
        </main>
      </div>
    </>
  );
}
