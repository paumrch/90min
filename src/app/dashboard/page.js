"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SummarySection } from "@/components/summary-card";
import { Prediction } from "@/components/prediction";

export default function Dashboard() {
  const [predictionsUpdated, setPredictionsUpdated] = useState(false);

  const handlePredictionsSave = async (predictions) => {
    // Aquí iría la lógica para guardar las predicciones en la base de datos
    await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(predictions),
    });
    setPredictionsUpdated(!predictionsUpdated);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection />
        <Prediction onPredictionsSave={handlePredictionsSave} />
      </main>
      <Footer />
    </div>
  );
}
