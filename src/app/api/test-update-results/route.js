import { NextResponse } from "next/server";
import { GET as updateResults } from '@/app/api/cron/update-results/route';

export async function GET(request) {
  console.log("Manual test: Updating results - Start");
  
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get('key');
  
  if (secretKey !== process.env.UPDATE_RESULTS_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Calling updateResults function");
    const result = await updateResults();
    console.log("Update completed, result:", result);
    return result;
  } catch (error) {
    console.error("Error in manual update:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}