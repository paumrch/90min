import { NextResponse } from 'next/server';
import { fetchOddsData } from '@/app/utils/api';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const sport = 'soccer_denmark_superliga';
    const oddsData = await fetchOddsData(sport, id);
    
    if (!oddsData) {
      return NextResponse.json({ error: 'No odds data available for this match' }, { status: 404 });
    }

    return NextResponse.json(oddsData);
  } catch (error) {
    console.error('Error fetching odds data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}