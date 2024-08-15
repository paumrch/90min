"use client";

import { useState, useEffect } from 'react';
import { Prediction } from "@/components/prediction";
import { SummarySection } from "@/components/summary-card";
import { SelectedPredictions } from "@/components/selected";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function Login({ onLogin }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD) {
      onLogin();
    } else {
      alert('Incorrect password');
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
  const [data, setData] = useState({
    initialMatches: [],
    stats: { effectiveness: { percentage: 0, hits: 0, total: 0, profit: 0 } },
    initialSelectedPredictions: []
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('dashboardAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [initialMatches, stats, initialSelectedPredictions] = await Promise.all([
        fetch('/api/odds').then(res => res.json()),
        fetch('/api/stats').then(res => res.json()),
        fetch('/api/predictions').then(res => res.json())
      ]);

      setData({ initialMatches, stats, initialSelectedPredictions });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('dashboardAuth', 'true');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection effectiveness={data.stats.effectiveness} />
        <div className="grid gap-6 md:grid-cols-2">
          <Prediction initialMatches={data.initialMatches} />
          <SelectedPredictions initialSelectedPredictions={data.initialSelectedPredictions} />
        </div>
      </main>
    </div>
  );
}