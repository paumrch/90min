"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { useToast } from "@/components/ui/use-toast";

export function Prediction({ initialMatches }) {
  const [matches, setMatches] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (
      initialMatches &&
      Array.isArray(initialMatches) &&
      initialMatches.length > 0
    ) {
      const processedMatches = initialMatches.map((match) => {
        const livescoreBet = match.bookmakers?.find(
          (b) => b.key === "livescorebet_eu"
        );
        const totalsMarket = livescoreBet?.markets?.find(
          (m) => m.key === "totals"
        );
        const overOdds = totalsMarket?.outcomes?.find(
          (o) => o.name === "Over"
        )?.price;
        const underOdds = totalsMarket?.outcomes?.find(
          (o) => o.name === "Under"
        )?.price;

        return {
          id: match.id,
          home_team: match.home_team,
          away_team: match.away_team,
          commence_time: match.commence_time,
          sport_title: match.sport_title,
          overOdds,
          underOdds,
          selectedPrediction: null,
        };
      });
      setMatches(processedMatches);
    }
  }, [initialMatches]);

  const handlePredictionSelect = useCallback((matchId, prediction, odds) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId
          ? {
              ...match,
              selectedPrediction:
                match.selectedPrediction === prediction ? null : prediction,
              selectedOdds:
                match.selectedPrediction === prediction ? null : odds,
            }
          : match
      )
    );
  }, []);

  const handleSavePredictions = async () => {
    try {
      const predictionsArray = matches
        .filter((match) => match.selectedPrediction)
        .map((match) => ({
          api_id: match.id,
          home_team: match.home_team,
          away_team: match.away_team,
          start_time: match.commence_time,
          league: match.sport_title,
          prediction: match.selectedPrediction,
          odds: match.selectedOdds,
        }));

      if (predictionsArray.length === 0) {
        toast({
          title: "Error",
          description: "No has seleccionado ninguna predicción.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictions: predictionsArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Mostrar alerta de éxito
      toast({
        title: "Éxito",
        description: "Las predicciones se han guardado correctamente.",
        variant: "default",
      });

      // Limpiar las selecciones después de guardar
      setMatches((prevMatches) =>
        prevMatches.map((match) => ({
          ...match,
          selectedPrediction: null,
          selectedOdds: null,
        }))
      );
    } catch (err) {
      console.error("Error al guardar predicciones:", err);
      toast({
        title: "Error",
        description:
          "No se pudieron guardar las predicciones. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (!isClient) {
    return <p>Cargando predicciones...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Predicciones</CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <p>No hay partidos disponibles.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Partido</TableHead>
                  <TableHead className="w-1/4">Over 2.5</TableHead>
                  <TableHead className="w-1/4">Under 2.5</TableHead>
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
                          match.selectedPrediction === "Over 2.5"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
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
                          match.selectedPrediction === "Under 2.5"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
