/* eslint-disable react-hooks/exhaustive-deps */
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
import { X } from "lucide-react";

export function SelectedPredictions({
  initialSelectedPredictions,
  onPredictionRemoved,
}) {
  const [selectedPredictions, setSelectedPredictions] = useState(
    initialSelectedPredictions
  );
  const { toast } = useToast();

  useEffect(() => {
    if (initialSelectedPredictions.length === 0) {
      fetchPredictions();
    }
  }, [initialSelectedPredictions]);

  const fetchPredictions = async () => {
    try {
      const response = await fetch("/api/predictions");
      if (!response.ok) {
        throw new Error("Failed to fetch predictions");
      }
      const data = await response.json();
      setSelectedPredictions(data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast({
        title: "Error",
        description: "Failed to load predictions.",
        variant: "destructive",
      });
    }
  };

  const handleRemovePrediction = async (prediction) => {
    try {
      const response = await fetch(`/api/predictions/${prediction.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error voiding the prediction");
      }

      toast({
        title: "Success",
        description: "The prediction has been voided successfully.",
        variant: "default",
      });

      setSelectedPredictions((prev) =>
        prev.filter((p) => p.id !== prediction.id)
      );

      if (onPredictionRemoved) {
        onPredictionRemoved(prediction);
      }
    } catch (err) {
      console.error("Error voiding the prediction:", err);
      toast({
        title: "Error",
        description:
          err.message || "Failed to void the prediction. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (selectedPredictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selected Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No predictions selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead className="text-right">Prediction</TableHead>
              <TableHead className="text-right">Odds</TableHead>
              <TableHead className="text-right">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedPredictions.map((prediction) => (
              <TableRow key={prediction.id}>
                <TableCell>{`${prediction.home_team} vs ${prediction.away_team}`}</TableCell>
                <TableCell className="text-right">
                  {prediction.prediction}
                </TableCell>
                <TableCell className="text-right">{prediction.odds}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleRemovePrediction(prediction)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
