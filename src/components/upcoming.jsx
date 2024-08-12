"use client";

import React from "react";
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

export function Upcoming({ initialUpcoming }) {
  const formatOdds = (odds) => {
    if (typeof odds === "number") {
      return odds.toFixed(2);
    }
    if (typeof odds === "string") {
      const num = parseFloat(odds);
      return isNaN(num) ? "N/A" : num.toFixed(2);
    }
    return "N/A";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Partidos</CardTitle>
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
            {initialUpcoming.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{`${match.home_team} vs ${match.away_team}`}</TableCell>
                <TableCell>
                  {new Date(match.start_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge>{match.prediction || "N/A"}</Badge>
                </TableCell>
                <TableCell>{formatOdds(match.odds)} €</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}