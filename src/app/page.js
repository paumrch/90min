import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";
import Hero from "@/components/homepage/hero";

async function fetchData(endpoint) {
  console.log(
    `Fetching data from: ${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`
  );
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
      {
        cache: "no-store",
      }
    );
    console.log(`Response status: ${res.status}`);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(
        `HTTP error! status: ${res.status}, message: ${errorText}`
      );
    }
    const data = await res.json();
    console.log(`Data fetched from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

export default async function Home() {
  console.log("Home page - Fetching data");
  const [results, upcomingMatches, stats] = await Promise.all([
    fetchData("/api/results", { cache: "no-store" }),
    fetchData("/api/upcoming", { cache: "no-store" }),
    fetchData("/api/stats", { cache: "no-store" }),
  ]);

  console.log("Home page - Results:", results);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <Hero />
        <SummarySection effectiveness={stats.effectiveness} />
        <div className="grid gap-6 md:grid-cols-2">
          <Upcoming initialUpcoming={upcomingMatches} />
          <Results initialResults={results} />
        </div>
      </main>
    </div>
  );
}
