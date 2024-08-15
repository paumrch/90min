import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";
import { API_BASE_URL } from "@/app/utils/config";

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [results, upcomingMatches, stats] = await Promise.all([
    fetchData("/api/results"),
    fetchData("/api/upcoming"),
    fetchData("/api/stats"),
  ]);

  const effectiveness = stats?.effectiveness || {
    percentage: 0,
    hits: 0,
    total: 0,
    profit: 0,
  };

  const filteredUpcoming =
    upcomingMatches?.filter(
      (upcomingMatch) =>
        !results?.some((result) => result.id === upcomingMatch.id)
    ) || [];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SummarySection effectiveness={effectiveness} />
        <div className="grid gap-6 md:grid-cols-2">
          <Upcoming initialUpcoming={filteredUpcoming} />
          <Results initialResults={results || []} />
        </div>
      </main>
    </div>
  );
}
