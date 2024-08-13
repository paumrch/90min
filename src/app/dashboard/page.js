import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SummarySection } from "@/components/summary-card";
import { Prediction } from "@/components/prediction";
import { API_BASE_URL } from "@/app/utils/config";

export async function fetchData(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Fetching data from: ${url}`);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(`Data fetched successfully from ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
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
