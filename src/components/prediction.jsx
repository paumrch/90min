"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export function Prediction({ onPredictionsSave }) {
  const [matches, setMatches] = useState([]);
  const [selectedPredictions, setSelectedPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/odds");
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        const processedData = data.map((match) => {
          const livescoreBet = match.bookmakers.find(
            (b) => b.key === "livescorebet_eu"
          );
          const totalsMarket = livescoreBet?.markets.find(
            (m) => m.key === "totals"
          );
          const overOdds = totalsMarket?.outcomes.find(
            (o) => o.name === "Over"
          )?.price;
          const underOdds = totalsMarket?.outcomes.find(
            (o) => o.name === "Under"
          )?.price;
          return {
            ...match,
            overOdds,
            underOdds,
          };
        });
        setMatches(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handlePredictionSelect = (matchId, prediction, odds) => {
    setSelectedPredictions((prev) => ({
      ...prev,
      [matchId]: { prediction, odds },
    }));
  };

  const handleSavePredictions = async () => {
    try {
      const predictionsArray = Object.entries(selectedPredictions).map(
        ([matchId, data]) => {
          const match = matches.find((m) => m.id === matchId);
          return {
            api_id: matchId,
            home_team: match.home_team,
            away_team: match.away_team,
            start_time: match.commence_time,
            league: match.sport_title,
            prediction: data.prediction,
            odds: data.odds,
          };
        }
      );

      console.log("Sending predictions:", { predictions: predictionsArray });

      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictions: predictionsArray }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("API Response:", result);
      onPredictionsSave(selectedPredictions);
      toast({
        title: "Éxito",
        description: "Las predicciones se han guardado correctamente.",
      });
    } catch (err) {
      console.error("Error al guardar predicciones:", err);
      setError("Failed to save predictions: " + err.message);
      toast({
        title: "Error",
        description:
          "No se pudieron guardar las predicciones. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading)
    return (
      <Alert>
        <AlertTitle>Cargando</AlertTitle>
        <AlertDescription>Obteniendo partidos disponibles...</AlertDescription>
      </Alert>
    );
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Predicciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partido</TableHead>
              <TableHead>Over 2.5</TableHead>
              <TableHead>Under 2.5</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{`${match.home_team} vs ${match.away_team}`}</TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handlePredictionSelect(
                        match.id,
                        "Over 2.5",
                        match.overOdds
                      )
                    }
                    variant={
                      selectedPredictions[match.id]?.prediction === "Over 2.5"
                        ? "default"
                        : "outline"
                    }
                  >
                    {match.overOdds ? match.overOdds.toFixed(2) : "N/A"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handlePredictionSelect(
                        match.id,
                        "Under 2.5",
                        match.underOdds
                      )
                    }
                    variant={
                      selectedPredictions[match.id]?.prediction === "Under 2.5"
                        ? "default"
                        : "outline"
                    }
                  >
                    {match.underOdds ? match.underOdds.toFixed(2) : "N/A"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleSavePredictions} className="mt-4">
          Guardar Predicciones
        </Button>
      </CardContent>
    </Card>
  );
}
