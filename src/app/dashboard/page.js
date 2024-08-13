import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SummarySection } from "@/components/summary-card";
import { Prediction } from "@/components/prediction";
import { API_BASE_URL } from "@/app/utils/config";

async function fetchData(endpoint) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
}

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const initialMatches = await fetchData("/api/odds");

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
