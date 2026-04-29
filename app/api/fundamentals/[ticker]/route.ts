import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

// Agent 4: Fundamental Analyst
// Reads company data from CompanyData.xlsx

interface CompanyRow {
  Ticker: string;
  Name: string;
  Description: string;
  Rating: string;
  Sector: string;
  Year1: number;
  Revenue1: string;
  Growth1: string;
  Year2: number;
  Revenue2: string;
  Growth2: string;
  Year3: number;
  Revenue3: string;
  Growth3: string;
}

interface CompanyInfo {
  ticker: string;
  name: string;
  description: string;
  rating: string;
  sector: string;
  historicalTrend: Array<{
    year: number;
    revenue: string;
    growth: string;
  }>;
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
    const filePath = path.join(process.cwd(), "data", "CompanyData.xlsx");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Return mock data if file doesn't exist
      const mockData = getMockCompanyData(ticker);
      if (!mockData) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        company: mockData,
        source: "mock",
      });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: CompanyRow[] = XLSX.utils.sheet_to_json(sheet);

    const companyRow = data.find((row) => row.Ticker === ticker);

    if (!companyRow) {
      // Try mock data as fallback
      const mockData = getMockCompanyData(ticker);
      if (!mockData) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        company: mockData,
        source: "mock",
      });
    }

    const company: CompanyInfo = {
      ticker: companyRow.Ticker,
      name: companyRow.Name,
      description: companyRow.Description,
      rating: companyRow.Rating,
      sector: companyRow.Sector,
      historicalTrend: [
        { year: companyRow.Year1, revenue: companyRow.Revenue1, growth: companyRow.Growth1 },
        { year: companyRow.Year2, revenue: companyRow.Revenue2, growth: companyRow.Growth2 },
        { year: companyRow.Year3, revenue: companyRow.Revenue3, growth: companyRow.Growth3 },
      ],
    };

    return NextResponse.json({
      company,
      source: "excel",
    });
  } catch (error) {
    console.error("Fundamentals API Error:", error);
    const mockData = getMockCompanyData(ticker);
    if (!mockData) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      company: mockData,
      source: "mock",
      error: "Using mock data",
    });
  }
}

function getMockCompanyData(ticker: string): CompanyInfo | null {
  const companies: Record<string, CompanyInfo> = {
    AAPL: {
      ticker: "AAPL",
      name: "Apple Inc.",
      description:
        "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, Apple Watch, AirPods, Apple TV, and HomePod.",
      rating: "A+",
      sector: "Technology",
      historicalTrend: [
        { year: 2023, revenue: "$383.3B", growth: "-2.8%" },
        { year: 2024, revenue: "$391.0B", growth: "+2.0%" },
        { year: 2025, revenue: "$410.5B", growth: "+5.0%" },
      ],
    },
    MSFT: {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      description:
        "Microsoft Corporation develops and supports software, services, devices, and solutions. The company operates through Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments.",
      rating: "A+",
      sector: "Technology",
      historicalTrend: [
        { year: 2023, revenue: "$211.9B", growth: "+6.9%" },
        { year: 2024, revenue: "$245.1B", growth: "+15.7%" },
        { year: 2025, revenue: "$280.0B", growth: "+14.2%" },
      ],
    },
    GOOGL: {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      description:
        "Alphabet Inc. offers various products and platforms. Google Services includes Google Search, Google ads, YouTube, Android, Chrome, Google Maps, Google Play, Gmail, and Google Cloud.",
      rating: "A",
      sector: "Technology",
      historicalTrend: [
        { year: 2023, revenue: "$307.4B", growth: "+8.7%" },
        { year: 2024, revenue: "$339.9B", growth: "+10.6%" },
        { year: 2025, revenue: "$375.0B", growth: "+10.3%" },
      ],
    },
    TSLA: {
      ticker: "TSLA",
      name: "Tesla Inc.",
      description:
        "Tesla Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems. The company operates through Automotive and Energy Generation and Storage segments.",
      rating: "B+",
      sector: "Automotive",
      historicalTrend: [
        { year: 2023, revenue: "$96.8B", growth: "+18.8%" },
        { year: 2024, revenue: "$97.7B", growth: "+1.0%" },
        { year: 2025, revenue: "$115.0B", growth: "+17.7%" },
      ],
    },
    NVDA: {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      description:
        "NVIDIA Corporation provides graphics and compute networking solutions. The company designs GPUs for gaming, professional visualization, datacenter, and automotive markets.",
      rating: "A+",
      sector: "Technology",
      historicalTrend: [
        { year: 2023, revenue: "$26.9B", growth: "+0.2%" },
        { year: 2024, revenue: "$60.9B", growth: "+126.3%" },
        { year: 2025, revenue: "$120.0B", growth: "+97.0%" },
      ],
    },
    META: {
      ticker: "META",
      name: "Meta Platforms Inc.",
      description:
        "Meta Platforms Inc. develops products that enable people to connect and share through mobile devices, PCs, VR headsets, and wearables. It operates through Family of Apps and Reality Labs segments.",
      rating: "A",
      sector: "Technology",
      historicalTrend: [
        { year: 2023, revenue: "$134.9B", growth: "+15.7%" },
        { year: 2024, revenue: "$156.2B", growth: "+15.8%" },
        { year: 2025, revenue: "$178.0B", growth: "+14.0%" },
      ],
    },
    AMZN: {
      ticker: "AMZN",
      name: "Amazon.com Inc.",
      description:
        "Amazon.com Inc. engages in retail sale of consumer products and subscriptions through online and physical stores. It also provides Amazon Web Services (AWS), advertising services, and other seller services.",
      rating: "A",
      sector: "Consumer Cyclical",
      historicalTrend: [
        { year: 2023, revenue: "$574.8B", growth: "+11.8%" },
        { year: 2024, revenue: "$637.9B", growth: "+11.0%" },
        { year: 2025, revenue: "$700.0B", growth: "+9.7%" },
      ],
    },
    JPM: {
      ticker: "JPM",
      name: "JPMorgan Chase & Co.",
      description:
        "JPMorgan Chase & Co. operates as a financial services company. The company provides investment banking, financial services for consumers and small businesses, commercial banking, and asset management.",
      rating: "A",
      sector: "Financial Services",
      historicalTrend: [
        { year: 2023, revenue: "$162.4B", growth: "+22.9%" },
        { year: 2024, revenue: "$175.0B", growth: "+7.8%" },
        { year: 2025, revenue: "$185.0B", growth: "+5.7%" },
      ],
    },
    "BTC-USD": {
      ticker: "BTC-USD",
      name: "Bitcoin USD",
      description:
        "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network. It was invented in 2008 by an unknown person using the name Satoshi Nakamoto.",
      rating: "B",
      sector: "Cryptocurrency",
      historicalTrend: [
        { year: 2023, revenue: "N/A", growth: "+156%" },
        { year: 2024, revenue: "N/A", growth: "+125%" },
        { year: 2025, revenue: "N/A", growth: "+45%" },
      ],
    },
    "EURUSD=X": {
      ticker: "EURUSD=X",
      name: "EUR/USD",
      description:
        "The EUR/USD currency pair represents the exchange rate between the Euro and the US Dollar. It is the most traded currency pair in the forex market.",
      rating: "A",
      sector: "Forex",
      historicalTrend: [
        { year: 2023, revenue: "N/A", growth: "+3.1%" },
        { year: 2024, revenue: "N/A", growth: "-3.5%" },
        { year: 2025, revenue: "N/A", growth: "+1.2%" },
      ],
    },
  };

  return companies[ticker] || null;
}
