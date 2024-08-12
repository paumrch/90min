"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection />
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Upcoming />
          <Results />
        </div>
      </main>
      <Footer />
    </div>
  );
}
