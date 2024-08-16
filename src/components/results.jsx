import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
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

export function Results({ initialResults }) {
  const results = initialResults.filter(
    (result) =>
      result.prediction &&
      result.prediction !== "VOID" &&
      result.status === "completed"
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Latest Results</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Recent match outcomes.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p>No results available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%] font-semibold">Match</TableHead>
                <TableHead className="text-right font-semibold">
                  Result
                </TableHead>
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
                      {match.is_correct ? (
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
        )}
      </CardContent>
    </Card>
  );
}
