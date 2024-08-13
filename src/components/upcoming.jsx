"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}. ${hours}:${minutes}h`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Upcoming</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Próximos partidos.
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
              <TableHead className="font-semibold w-1/2">Partido</TableHead>
              <TableHead className="font-semibold w-1/4 text-right">Predicción</TableHead>
              <TableHead className="font-semibold w-1/4 text-right">Cuota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUpcoming.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <div className="font-medium">{`${match.home_team} vs ${match.away_team}`}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(match.start_time)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="secondary"
                    className="w-24 justify-center inline-flex"
                  >
                    <span className="truncate">
                      {match.prediction || "N/A"}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="outline"
                    className="w-16 justify-center inline-flex"
                  >
                    <span className="truncate">
                      {formatOdds(match.odds)}
                    </span>
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}