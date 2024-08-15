import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";

async function fetchData(endpoint) {
  console.log(
    `Fetching data from: ${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`
  );
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error fetching ${endpoint}:`, errorText);
    throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
  }
  return res.json();
}

export default async function Home() {
  try {
    const [results, upcomingMatches, stats] = await Promise.all([
      fetchData("/api/results"),
      fetchData("/api/upcoming"),
      fetchData("/api/stats"),
    ]);

    const filteredUpcoming = upcomingMatches.filter(
      (upcomingMatch) =>
        !results.some((result) => result.id === upcomingMatch.id)
    );

    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          <SummarySection effectiveness={stats.effectiveness} />
          <div className="grid gap-6 md:grid-cols-2">
            <Upcoming initialUpcoming={filteredUpcoming} />
            <Results initialResults={results} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in Home component:", error);
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading data</h1>
        <p className="mt-2">{error.message}</p>
      </div>
    );
  }
}
