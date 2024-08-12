"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";
import { Prediction } from "@/components/prediction"; // Asegúrate de crear este componente

export default function Dashboard() {
  const [showPredictionSelector, setShowPredictionSelector] = useState(false);
  const [predictionsUpdated, setPredictionsUpdated] = useState(false);

  const handlePredictionsSave = (predictions) => {
    // Guarda las predicciones en localStorage
    localStorage.setItem("predictions", JSON.stringify(predictions));
    setShowPredictionSelector(false);
    setPredictionsUpdated(!predictionsUpdated); // Esto forzará una actualización en Upcoming
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection />

        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setShowPredictionSelector(!showPredictionSelector)}
          >
            {showPredictionSelector
              ? "Ocultar Selector"
              : "Seleccionar Predicciones"}
          </Button>
        </div>

        {showPredictionSelector && (
          <Prediction onPredictionsSave={handlePredictionsSave} />
        )}

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Upcoming key={predictionsUpdated} />{" "}
          {/* La key forzará un re-render cuando cambie */}
          <Results />
        </div>
      </main>
      <Footer />
    </div>
  );
}
