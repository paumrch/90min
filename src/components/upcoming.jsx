"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function Upcoming() {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    // Fetch matches and predictions
    const fetchData = async () => {
      const matchesResponse = await fetch("/api/odds");
      const matchesData = await matchesResponse.json();

      // Aquí deberías obtener las predicciones guardadas
      // Por ejemplo, desde localStorage o una API
      const savedPredictions = JSON.parse(
        localStorage.getItem("predictions") || "{}"
      );

      setPredictions(savedPredictions);
      setUpcomingMatches(matchesData);
    };
    fetchData();
  }, []);

  const matchesWithPredictions = upcomingMatches.filter(
    (match) => predictions[match.id]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Partidos con Predicciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partido</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Predicción</TableHead>
              <TableHead>Cuota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchesWithPredictions.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{`${match.home_team} vs ${match.away_team}`}</TableCell>
                <TableCell>
                  {new Date(match.commence_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge>{predictions[match.id]}</Badge>
                </TableCell>
                <TableCell>
                  {match.bookmakers[0]?.markets[0]?.outcomes
                    .find((o) => o.name === predictions[match.id].split(" ")[0])
                    ?.price.toFixed(2) || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
