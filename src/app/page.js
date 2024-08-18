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
  const data = await res.json();
  console.log(`Data fetched from ${endpoint}:`, data);
  return data;
}

export default async function Home() {
  console.log("Home page - Fetching data");
  const [results, upcomingMatches, stats] = await Promise.all([
    fetchData("/api/results", { cache: 'no-store' }),
    fetchData("/api/upcoming", { cache: 'no-store' }),
    fetchData("/api/stats", { cache: 'no-store' }),
  ]);

  console.log("Home page - Results:", results);

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
