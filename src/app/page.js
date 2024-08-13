import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return "";
  } else {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  }
}

async function fetchData(endpoint) {
  const baseURL = getBaseURL();
  const res = await fetch(`${baseURL}${endpoint}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
}

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
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Upcoming initialUpcoming={upcomingMatches} />
          <Results initialResults={results} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
