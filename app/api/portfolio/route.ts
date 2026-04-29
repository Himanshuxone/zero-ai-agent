import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

// Agent 3: Portfolio Manager
// Reads user holdings from Portfolio.xlsx and calculates P&L

interface PortfolioRow {
  Ticker: string;
  Shares: number;
  BuyPrice: number;
  BuyDate: string;
}

interface PortfolioHolding {
  ticker: string;
  shares: number;
  buyPrice: number;
  buyDate: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  try {
    const filePath = path.join(process.cwd(), "data", "Portfolio.xlsx");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Return mock data if file doesn't exist
      return NextResponse.json({
        holdings: getMockPortfolio(),
        source: "mock",
      });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: PortfolioRow[] = XLSX.utils.sheet_to_json(sheet);

    const holdings: PortfolioHolding[] = data.map((row) => ({
      ticker: row.Ticker,
      shares: row.Shares,
      buyPrice: row.BuyPrice,
      buyDate: row.BuyDate,
    }));

    // Filter by ticker if provided
    const filteredHoldings = ticker
      ? holdings.filter((h) => h.ticker === ticker)
      : holdings;

    return NextResponse.json({
      holdings: filteredHoldings,
      source: "excel",
    });
  } catch (error) {
    console.error("Portfolio API Error:", error);
    // Return mock data as fallback
    const mockHoldings = getMockPortfolio();
    const filteredHoldings = ticker
      ? mockHoldings.filter((h) => h.ticker === ticker)
      : mockHoldings;

    return NextResponse.json({
      holdings: filteredHoldings,
      source: "mock",
      error: "Using mock data",
    });
  }
}

function getMockPortfolio(): PortfolioHolding[] {
  return [
    { ticker: "AAPL", shares: 50, buyPrice: 165.25, buyDate: "2024-01-15" },
    { ticker: "MSFT", shares: 30, buyPrice: 352.80, buyDate: "2024-02-01" },
    { ticker: "GOOGL", shares: 25, buyPrice: 138.50, buyDate: "2024-01-20" },
    { ticker: "TSLA", shares: 20, buyPrice: 232.40, buyDate: "2024-03-10" },
    { ticker: "NVDA", shares: 15, buyPrice: 725.00, buyDate: "2024-02-15" },
    { ticker: "BTC-USD", shares: 0.5, buyPrice: 62500, buyDate: "2024-03-01" },
    { ticker: "EURUSD=X", shares: 10000, buyPrice: 1.0750, buyDate: "2024-03-15" },
    { ticker: "META", shares: 20, buyPrice: 475.30, buyDate: "2024-02-20" },
    { ticker: "AMZN", shares: 25, buyPrice: 172.50, buyDate: "2024-01-25" },
    { ticker: "JPM", shares: 40, buyPrice: 188.75, buyDate: "2024-02-10" },
  ];
}
