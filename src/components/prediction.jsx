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

export function Prediction({ onPredictionsSave }) {
  const [availableMatches, setAvailableMatches] = useState([]);
  const [selectedPredictions, setSelectedPredictions] = useState({});

  useEffect(() => {
    const fetchMatches = async () => {
      const response = await fetch("/api/odds");
      const data = await response.json();
      setAvailableMatches(data);
    };
    fetchMatches();
  }, []);

  const handlePredictionSelect = (matchId, prediction) => {
    setSelectedPredictions((prev) => ({
      ...prev,
      [matchId]: prediction,
    }));
  };

  const handleSavePredictions = () => {
    onPredictionsSave(selectedPredictions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Predicciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partido</TableHead>
              <TableHead>Over 2.5</TableHead>
              <TableHead>Under 2.5</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{`${match.home_team} vs ${match.away_team}`}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handlePredictionSelect(match.id, "Over 2.5")}
                    variant={
                      selectedPredictions[match.id] === "Over 2.5"
                        ? "default"
                        : "outline"
                    }
                  >
                    Over 2.5
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handlePredictionSelect(match.id, "Under 2.5")
                    }
                    variant={
                      selectedPredictions[match.id] === "Under 2.5"
                        ? "default"
                        : "outline"
                    }
                  >
                    Under 2.5
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleSavePredictions} className="mt-4">
          Guardar Predicciones
        </Button>
      </CardContent>
    </Card>
  );
}
