"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Link from "next/link";

export function Results() {
  const [completedMatches, setCompletedMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/results");
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setCompletedMatches(data);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (isLoading) {
    return (
      <Alert>
        <AlertTitle>Cargando</AlertTitle>
        <AlertDescription>Obteniendo resultados de partidos...</AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Últimos resultados</CardTitle>
          <CardDescription>
            Partidos de fútbol recientes y sus resultados.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="gap-1">
          <Link href="#">
            Ver todos
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Partido</TableHead>
              <TableHead className="text-right">Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <div className="font-medium">{`${match.home_team} vs ${match.away_team}`}</div>
                  <div className="text-sm text-muted-foreground">
                    {`${match.prediction} @ ${match.odds}`}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-medium">{`${match.total_goals} goles`}</span>
                    {match.result === 'correct' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}