import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";
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

export default async function Home() {
  const [results, upcomingMatches] = await Promise.all([
    fetchData("/api/results"),
    fetchData("/api/upcoming"),
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection />
        <div className="grid gap-6 md:grid-cols-2">
          <Upcoming initialUpcoming={upcomingMatches} />
          <Results initialResults={results} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
