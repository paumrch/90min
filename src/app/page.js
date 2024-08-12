import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Upcoming } from "@/components/upcoming";
import { Results } from "@/components/results";
import { SummarySection } from "@/components/summary-card";

async function getResults() {
  const res = await fetch('http://localhost:3000/api/results', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch results');
  }
  return res.json();
}

async function getUpcoming() {
  const res = await fetch('http://localhost:3000/api/upcoming', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch upcoming matches');
  }
  return res.json();
}

export default async function Home() {
  const results = await getResults();
  const upcomingMatches = await getUpcoming();

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