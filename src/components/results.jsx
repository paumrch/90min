"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
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
import Link from "next/link";

export function Results({ initialResults }) {
  const [results, setResults] = useState(initialResults);

  useEffect(() => {
    const validResults = initialResults.filter(
      (result) => result.prediction && result.prediction !== "VOID"
    );
    setResults(validResults);
  }, [initialResults]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Latest Results</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Recent match outcomes.
          </CardDescription>
        </div>
        {/* <Button asChild size="sm" className="gap-1">
          <Link href="#">
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%] font-semibold">Match</TableHead>
              <TableHead className="text-right font-semibold">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <div className="font-medium">{`${match.home_team} vs ${match.away_team}`}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {`${match.prediction} @ ${match.odds}`}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-medium">{`${match.home_goals} - ${match.away_goals}`}</span>
                    {match.result === "correct" ? (
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
