import { NextRequest, NextResponse } from 'next/server';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

export async function GET(request: NextRequest) {
  const tickers = request.nextUrl.searchParams.get('tickers')?.split(',') || [];

  if (!tickers.length) {
    return NextResponse.json(
      { error: 'Tickers parameter required' },
      { status: 400 }
    );
  }

  try {
    const quotes = await Promise.all(
      tickers.map(ticker => fetchQuote(ticker.trim().toUpperCase()))
    );

    return NextResponse.json({
      quotes: quotes.filter(q => q !== null),
      timestamp: new Date().toISOString(),
      source: 'yahoo-finance',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Live stocks API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live quotes', quotes: [] },
      { status: 200 }
    );
  }
}

async function fetchQuote(symbol: string) {
  try {
    const now = Date.now();
    const cached = cache.get(symbol);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryDetail`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      }
    );

    if (!response.ok) throw new Error('Quote fetch failed');
    const data = await response.json();
    const result = data?.quoteSummary?.result?.[0];

    if (!result) return generateMockQuote(symbol);

    const quote = {
      symbol,
      price: result.price?.regularMarketPrice?.raw || 0,
      change: result.price?.regularMarketChange?.raw || 0,
      changePercent: result.price?.regularMarketChangePercent?.raw || 0,
      bid: result.price?.bid?.raw || 0,
      ask: result.price?.ask?.raw || 0,
      volume: result.price?.regularMarketVolume?.raw || 0,
      marketCap: result.summaryDetail?.marketCap?.raw || 0,
      pe: result.summaryDetail?.trailingPE?.raw || 0,
      yearHigh: result.summaryDetail?.fiftyTwoWeekHigh?.raw || 0,
      yearLow: result.summaryDetail?.fiftyTwoWeekLow?.raw || 0,
      timestamp: new Date().toISOString(),
      isLive: true,
    };

    cache.set(symbol, { data: quote, timestamp: now });
    return quote;
  } catch (error) {
    console.error(`Failed to fetch ${symbol}:`, error);
    return generateMockQuote(symbol);
  }
}

function generateMockQuote(symbol: string) {
  const basePrice = getBasePrice(symbol);
  const change = (Math.random() - 0.5) * 3;
  const changePercent = (change / basePrice) * 100;

  return {
    symbol,
    price: basePrice + change,
    change,
    changePercent,
    bid: basePrice + change - 0.02,
    ask: basePrice + change + 0.02,
    volume: Math.floor(Math.random() * 100000000),
    marketCap: (basePrice + change) * Math.random() * 1000000000,
    pe: 15 + Math.random() * 20,
    yearHigh: basePrice * 1.2,
    yearLow: basePrice * 0.8,
    timestamp: new Date().toISOString(),
    isLive: false,
  };
}

function getBasePrice(ticker: string): number {
  const prices: Record<string, number> = {
    'AAPL': 178.5, 'MSFT': 378.9, 'GOOGL': 141.2, 'AMZN': 178.3, 'TSLA': 248.5,
    'NVDA': 875.3, 'META': 485.6, 'JPM': 195.2, 'BAC': 35.8, 'WFC': 55.2,
    'BRK.B': 625.3, 'JNJ': 165.4, 'PG': 168.2, 'KO': 63.5, 'MCD': 296.8,
    'SPY': 475.2, 'QQQ': 385.6, 'DIA': 385.1, 'IVV': 475.1,
  };
  return prices[ticker] || 100 + Math.random() * 200;
}
