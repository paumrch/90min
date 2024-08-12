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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Upcoming() {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/upcoming");
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming matches");
        }
        const data = await response.json();
        setUpcomingMatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <Alert>
        <AlertTitle>Cargando</AlertTitle>
        <AlertDescription>Obteniendo próximos partidos...</AlertDescription>
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
            {upcomingMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{`${match.home_team} vs ${match.away_team}`}</TableCell>
                <TableCell>
                  {new Date(match.start_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge>{match.prediction}</Badge>
                </TableCell>
                <TableCell>{match.odds}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
