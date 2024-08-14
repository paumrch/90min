"use client";

import React, { useState } from "react";
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
  const [matches, setMatches] = useState(initialMatches);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();

  const handlePredictionSelect = (matchId, prediction, odds) => {
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
  };

  const handlePublishPredictions = async () => {
    setIsPublishing(true);
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
        setIsPublishing(false);
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

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera mínima de 1 segundo

      const result = await response.json();
      console.log("API Response:", result);

      toast({
        title: "Éxito",
        description: "Las predicciones se han publicado correctamente.",
        variant: "default",
      });

      setIsPublished(true);
      setTimeout(() => {
        setIsPublished(false);
        setMatches((prevMatches) =>
          prevMatches.filter((match) => !match.selectedPrediction)
        );
      }, 1000);
    } catch (err) {
      console.error("Error al publicar predicciones:", err);
      toast({
        title: "Error",
        description:
          "No se pudieron publicar las predicciones. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Partidos</CardTitle>
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
                  <TableHead className="w-1/4 text-center">Over 2.5</TableHead>
                  <TableHead className="w-1/4 text-center">Under 2.5</TableHead>
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
                        {match.overOdds.toFixed(2)}
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
                        {match.underOdds.toFixed(2)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <div className="w-1/4">
                <Button
                  onClick={handlePublishPredictions}
                  disabled={isPublishing || isPublished}
                  className="w-full"
                >
                  {isPublishing
                    ? "Publicando..."
                    : isPublished
                    ? "Publicado"
                    : "Publicar"}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
