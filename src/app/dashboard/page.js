import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SummarySection } from "@/components/summary-card";
import { Prediction } from "@/components/prediction";

import { API_URL } from "@/app/utils/api";

async function getInitialMatches() {
  const res = await fetch(`${API_URL}/api/odds`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch initial matches");
  }
  return res.json();
}

export default async function Dashboard() {
  const initialMatches = await getInitialMatches();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection />
        <Prediction initialMatches={initialMatches} />
      </main>
      <Footer />
    </div>
  );
}
