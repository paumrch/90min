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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function Prediction({ initialMatches }) {
  const [matches, setMatches] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (initialMatches && initialMatches.length > 0) {
      setMatches(initialMatches);
    }
    setIsLoading(false);
  }, [initialMatches]);

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
          description: "You haven't selected any predictions.",
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

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Minimum wait of 1 second

      const result = await response.json();
      console.log("API Response:", result);

      toast({
        title: "Success",
        description: "Predictions have been published successfully.",
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
      console.error("Error publishing predictions:", err);
      toast({
        title: "Error",
        description: "Failed to publish predictions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <p>No matches available.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Match</TableHead>
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
                    ? "Publishing..."
                    : isPublished
                    ? "Published"
                    : "Publish"}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
