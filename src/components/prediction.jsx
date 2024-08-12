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
import { useRouter } from "next/navigation";

export function Prediction({ onPredictionsSave }) {
  const [availableMatches, setAvailableMatches] = useState([]);
  const [selectedPredictions, setSelectedPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMatchesAndOdds = async () => {
      try {
        setIsLoading(true);
        // Obtener la lista de partidos
        const matchesResponse = await fetch("/api/odds");
        if (!matchesResponse.ok) {
          throw new Error("Failed to fetch matches");
        }
        const matchesData = await matchesResponse.json();

        // Obtener las cuotas para cada partido
        const matchesWithOdds = await Promise.all(
          matchesData.map(async (match) => {
            const oddsResponse = await fetch(`/api/odds/${match.id}`);
            if (!oddsResponse.ok) {
              console.error(`Failed to fetch odds for match ${match.id}`);
              return { ...match, overOdds: null, underOdds: null };
            }
            const oddsData = await oddsResponse.json();
            const overOdds = oddsData.bookmakers[0]?.markets[0]?.outcomes.find(
              (o) => o.name === "Over"
            )?.price;
            const underOdds = oddsData.bookmakers[0]?.markets[0]?.outcomes.find(
              (o) => o.name === "Under"
            )?.price;
            return { ...match, overOdds, underOdds };
          })
        );

        setAvailableMatches(matchesWithOdds);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchesAndOdds();
  }, []);

  const handlePredictionSelect = (matchId, prediction, odds) => {
    setSelectedPredictions((prev) => ({
      ...prev,
      [matchId]: { prediction, odds },
    }));
  };

  const handleSavePredictions = async () => {
    try {
      const predictionsToSave = Object.entries(selectedPredictions).map(
        ([matchId, data]) => ({
          api_id: matchId,
          prediction: data.prediction,
          odds: data.odds,
        })
      );

      await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(predictionsToSave),
      });
      onPredictionsSave(selectedPredictions);
      setSuccessMessage(
        "Predicciones guardadas con éxito. Puedes ir a la página principal para ver los próximos partidos."
      );
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (err) {
      setError("Failed to save predictions");
    }
  };

  if (isLoading)
    return (
      <Alert>
        <AlertTitle>Cargando</AlertTitle>
        <AlertDescription>Obteniendo partidos y cuotas...</AlertDescription>
      </Alert>
    );
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  if (successMessage)
    return (
      <Alert>
        <AlertTitle>Éxito</AlertTitle>
        <AlertDescription>{successMessage}</AlertDescription>
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
            {availableMatches.map((match) => (
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
