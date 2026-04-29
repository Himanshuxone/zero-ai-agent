import axios from 'axios';
import { NextResponse } from 'next/server';

interface YahooQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  bid: number;
  ask: number;
  volume: number;
  marketCap: number;
  pe: number;
  eps: number;
}

// Yahoo Finance API endpoint (no auth required for basic quotes)
const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v10/finance';

export async function GET(request: Request, { params }: { params: Promise<{ ticker: string }> }) {
  try {
    const { ticker } = await params;
    const symbol = ticker.toUpperCase();

    // Fetch quote data
    const url = `${YAHOO_BASE_URL}/quoteSummary/${symbol}?modules=price,summaryDetail,financialData`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const result = response.data.quoteSummary.result[0];
    const price = result.price;
    const summary = result.summaryDetail;
    const financial = result.financialData;

    const quote: YahooQuote = {
      symbol: symbol,
      regularMarketPrice: price.regularMarketPrice.raw,
      regularMarketChange: price.regularMarketChange?.raw || 0,
      regularMarketChangePercent: price.regularMarketChangePercent?.raw || 0,
      bid: price.bid?.raw || price.regularMarketPrice.raw,
      ask: price.ask?.raw || price.regularMarketPrice.raw,
      volume: price.regularMarketVolume?.raw || 0,
      marketCap: summary.marketCap?.raw || 0,
      pe: summary.trailingPE?.raw || 0,
      eps: financial.trailingEps?.raw || 0,
    };

    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.error('[v0] Yahoo Finance API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote data' },
      { status: 500 }
    );
  }
}
