import axios from 'axios';
import { NextResponse } from 'next/server';

interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const symbol = ticker.toUpperCase();
    const url = `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?interval=1d&range=1mo`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const chart = response.data.chart.result[0];
    const timestamps = chart.timestamp;
    const quotes = chart.indicators.quote[0];

    const data: ChartData[] = timestamps.map((ts: number, i: number) => ({
      timestamp: ts * 1000,
      open: quotes.open[i] || 0,
      high: quotes.high[i] || 0,
      low: quotes.low[i] || 0,
      close: quotes.close[i] || 0,
      volume: quotes.volume[i] || 0,
    })).filter((d: ChartData) => d.close > 0);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.error('[v0] Chart API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
