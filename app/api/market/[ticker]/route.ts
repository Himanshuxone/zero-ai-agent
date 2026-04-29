import { NextRequest, NextResponse } from "next/server";

// Agent 1: Live Market Specialist
// Fetches real-time market data using Yahoo Finance API

interface YahooQuote {
  timestamp: number[];
  indicators: {
    quote: Array<{
      open: number[];
      high: number[];
      low: number[];
      close: number[];
      volume: number[];
    }>;
  };
}

interface MarketDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  if (!ticker) {
    return NextResponse.json(
      { error: "Ticker symbol is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch last 5 days of data with 1-hour intervals
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - 5 * 24 * 60 * 60; // 5 days ago

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      ticker
    )}?period1=${startDate}&period2=${endDate}&interval=1h`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const chart = data?.chart?.result?.[0];

    if (!chart) {
      // Return mock data if API fails
      return NextResponse.json({
        ticker,
        data: generateMockData(ticker),
        source: "mock",
      });
    }

    const timestamps: number[] = chart.timestamp || [];
    const quote = chart.indicators?.quote?.[0] as YahooQuote["indicators"]["quote"][0];

    if (!quote || !timestamps.length) {
      return NextResponse.json({
        ticker,
        data: generateMockData(ticker),
        source: "mock",
      });
    }

    const marketData: MarketDataPoint[] = timestamps
      .map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString(),
        open: quote.open?.[index] ?? 0,
        high: quote.high?.[index] ?? 0,
        low: quote.low?.[index] ?? 0,
        close: quote.close?.[index] ?? 0,
        volume: quote.volume?.[index] ?? 0,
      }))
      .filter(
        (d: MarketDataPoint) => d.open && d.high && d.low && d.close
      );

    return NextResponse.json({
      ticker,
      data: marketData,
      source: "yahoo",
      meta: {
        currency: chart.meta?.currency || "USD",
        exchangeName: chart.meta?.exchangeName || "Unknown",
        regularMarketPrice: chart.meta?.regularMarketPrice,
      },
    });
  } catch (error) {
    console.error("Market API Error:", error);
    // Return mock data as fallback
    return NextResponse.json({
      ticker,
      data: generateMockData(ticker),
      source: "mock",
      error: "Using mock data due to API limitations",
    });
  }
}

function generateMockData(ticker: string): MarketDataPoint[] {
  const data: MarketDataPoint[] = [];
  const now = Date.now();
  const basePrice = getBasePrice(ticker);

  for (let i = 120; i >= 0; i--) {
    const timestamp = now - i * 60 * 60 * 1000; // hourly data
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = basePrice * (1 + change);
    const closeChange = (Math.random() - 0.5) * volatility;
    const close = open * (1 + closeChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    data.push({
      date: new Date(timestamp).toISOString(),
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }

  return data;
}

function getBasePrice(ticker: string): number {
  const prices: Record<string, number> = {
    AAPL: 178.5,
    MSFT: 378.9,
    GOOGL: 141.2,
    AMZN: 178.3,
    TSLA: 248.5,
    NVDA: 875.3,
    META: 485.6,
    JPM: 195.2,
    "BTC-USD": 67500,
    "ETH-USD": 3450,
    "EURUSD=X": 1.085,
    "GBPUSD=X": 1.265,
    "USDJPY=X": 154.5,
    "GC=F": 2350,
    "CL=F": 78.5,
  };
  return prices[ticker] || 100;
}
