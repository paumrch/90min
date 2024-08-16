import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";

async function fetchData(endpoint) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export default async function Home() {
  const [results, upcomingMatches, stats] = await Promise.all([
    fetchData("/api/results"),
    fetchData("/api/upcoming"),
    fetchData("/api/stats"),
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection effectiveness={stats.effectiveness} />
        <div className="grid gap-6 md:grid-cols-2">
          <Upcoming initialUpcoming={upcomingMatches} />
          <Results initialResults={results} />
        </div>
      </main>
    </div>
  );
}
