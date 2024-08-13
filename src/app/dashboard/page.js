import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SummarySection } from "@/components/summary-card";
import { Prediction } from "@/components/prediction";

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

async function getInitialMatches() {
  return fetchData("/api/odds");
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
