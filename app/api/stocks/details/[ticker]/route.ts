import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker.toUpperCase();

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=profile,price,summaryDetail,financialData,recommendationTrend`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      }
    );

    if (!response.ok) throw new Error('Not found');
    const data = await response.json();
    const result = data?.quoteSummary?.result?.[0];

    if (!result) return NextResponse.json(generateMockDetails(ticker));

    return NextResponse.json({
      ticker,
      price: result.price?.regularMarketPrice?.raw || 0,
      change: result.price?.regularMarketChange?.raw || 0,
      changePercent: result.price?.regularMarketChangePercent?.raw || 0,
      name: result.profile?.companyName || ticker,
      sector: result.profile?.sector || 'N/A',
      industry: result.profile?.industry || 'N/A',
      website: result.profile?.website || '',
      description: result.profile?.longBusinessSummary || '',
      ceo: result.profile?.companyOfficers?.[0]?.name || 'N/A',
      founded: result.profile?.founded || 'N/A',
      employees: result.profile?.fullTimeEmployees || 0,
      marketCap: result.summaryDetail?.marketCap?.raw || 0,
      pe: result.summaryDetail?.trailingPE?.raw || 0,
      eps: result.financialData?.trailingEps?.raw || 0,
      dividendYield: result.summaryDetail?.dividendYield?.raw || 0,
      fiftyTwoWeekHigh: result.summaryDetail?.fiftyTwoWeekHigh?.raw || 0,
      fiftyTwoWeekLow: result.summaryDetail?.fiftyTwoWeekLow?.raw || 0,
      averageVolume: result.summaryDetail?.averageVolume?.raw || 0,
      targetPrice: result.financialData?.targetMeanPrice?.raw || 0,
      revenue: result.financialData?.totalRevenue?.raw || 0,
      netIncome: result.financialData?.netIncomeToCommon?.raw || 0,
      debtToEquity: result.financialData?.debtToEquity?.raw || 0,
      returnOnEquity: result.financialData?.returnOnEquity?.raw || 0,
      profitMargin: result.financialData?.profitMargins?.raw || 0,
      recommendations: result.recommendationTrend?.trend?.[0] || {},
      timestamp: new Date().toISOString(),
      source: 'yahoo',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300',
      },
    });
  } catch (error) {
    console.error(`Stock details error for ${ticker}:`, error);
    return NextResponse.json(generateMockDetails(ticker));
  }
}

function generateMockDetails(ticker: string) {
  const basePrice = getBasePrice(ticker);
  const change = (Math.random() - 0.5) * 5;

  const companies: Record<string, any> = {
    'AAPL': {
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      description: 'Apple is a technology company that designs, manufactures, and sells electronics.',
      ceo: 'Tim Cook',
      founded: '1976',
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software',
      description: 'Microsoft develops software, services, and devices.',
      ceo: 'Satya Nadella',
      founded: '1975',
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      sector: 'Technology',
      industry: 'Internet Services',
      description: 'Google operates as a search engine and digital advertising company.',
      ceo: 'Sundar Pichai',
      founded: '1998',
    },
    'TSLA': {
      name: 'Tesla, Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Automotive',
      description: 'Tesla manufactures electric vehicles and energy storage systems.',
      ceo: 'Elon Musk',
      founded: '2003',
    },
  };

  const info = companies[ticker] || {
    name: ticker,
    sector: 'Technology',
    industry: 'Diversified',
    description: `${ticker} is a publicly traded company.`,
    ceo: 'N/A',
    founded: '2000',
  };

  return {
    ticker,
    price: basePrice + change,
    change,
    changePercent: (change / basePrice) * 100,
    ...info,
    website: `https://www.${ticker.toLowerCase()}.com`,
    employees: Math.floor(Math.random() * 100000) + 10000,
    marketCap: (basePrice + change) * 1000000000,
    pe: 15 + Math.random() * 20,
    eps: (basePrice + change) / 25,
    dividendYield: Math.random() * 3,
    fiftyTwoWeekHigh: basePrice * 1.3,
    fiftyTwoWeekLow: basePrice * 0.7,
    averageVolume: Math.floor(Math.random() * 50000000),
    targetPrice: basePrice * 1.1,
    revenue: Math.floor(Math.random() * 1000000000000),
    netIncome: Math.floor(Math.random() * 100000000000),
    debtToEquity: Math.random() * 1,
    returnOnEquity: Math.random() * 30,
    profitMargin: Math.random() * 30,
    recommendations: {
      strongBuy: Math.floor(Math.random() * 10),
      buy: Math.floor(Math.random() * 15),
      hold: Math.floor(Math.random() * 10),
      sell: Math.floor(Math.random() * 5),
      strongSell: Math.floor(Math.random() * 3),
    },
    timestamp: new Date().toISOString(),
    source: 'mock',
  };
}

function getBasePrice(ticker: string): number {
  const prices: Record<string, number> = {
    'AAPL': 178.5, 'MSFT': 378.9, 'GOOGL': 141.2, 'AMZN': 178.3, 'TSLA': 248.5,
    'NVDA': 875.3, 'META': 485.6, 'JPM': 195.2, 'BAC': 35.8, 'WFC': 55.2,
    'BRK.B': 625.3, 'JNJ': 165.4, 'PG': 168.2, 'KO': 63.5, 'MCD': 296.8,
  };
  return prices[ticker] || 100 + Math.random() * 200;
}
