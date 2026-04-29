// Script to create sample Excel files for the multi-agent dashboard
// Run with: npx ts-node scripts/create-sample-data.ts

import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Portfolio.xlsx - User's holdings
const portfolioData = [
  { Ticker: "AAPL", Shares: 50, BuyPrice: 165.25, BuyDate: "2024-01-15" },
  { Ticker: "MSFT", Shares: 30, BuyPrice: 352.8, BuyDate: "2024-02-01" },
  { Ticker: "GOOGL", Shares: 25, BuyPrice: 138.5, BuyDate: "2024-01-20" },
  { Ticker: "TSLA", Shares: 20, BuyPrice: 232.4, BuyDate: "2024-03-10" },
  { Ticker: "NVDA", Shares: 15, BuyPrice: 725.0, BuyDate: "2024-02-15" },
  { Ticker: "BTC-USD", Shares: 0.5, BuyPrice: 62500, BuyDate: "2024-03-01" },
  { Ticker: "EURUSD=X", Shares: 10000, BuyPrice: 1.075, BuyDate: "2024-03-15" },
  { Ticker: "META", Shares: 20, BuyPrice: 475.3, BuyDate: "2024-02-20" },
  { Ticker: "AMZN", Shares: 25, BuyPrice: 172.5, BuyDate: "2024-01-25" },
  { Ticker: "JPM", Shares: 40, BuyPrice: 188.75, BuyDate: "2024-02-10" },
];

const portfolioSheet = XLSX.utils.json_to_sheet(portfolioData);
const portfolioWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(portfolioWorkbook, portfolioSheet, "Portfolio");
XLSX.writeFile(portfolioWorkbook, path.join(dataDir, "Portfolio.xlsx"));
console.log("Created Portfolio.xlsx");

// CompanyData.xlsx - Company fundamental data
const companyData = [
  {
    Ticker: "AAPL",
    Name: "Apple Inc.",
    Description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    Rating: "A+",
    Sector: "Technology",
    Year1: 2023,
    Revenue1: "$383.3B",
    Growth1: "-2.8%",
    Year2: 2024,
    Revenue2: "$391.0B",
    Growth2: "+2.0%",
    Year3: 2025,
    Revenue3: "$410.5B",
    Growth3: "+5.0%",
  },
  {
    Ticker: "MSFT",
    Name: "Microsoft Corporation",
    Description:
      "Microsoft Corporation develops and supports software, services, devices, and solutions worldwide.",
    Rating: "A+",
    Sector: "Technology",
    Year1: 2023,
    Revenue1: "$211.9B",
    Growth1: "+6.9%",
    Year2: 2024,
    Revenue2: "$245.1B",
    Growth2: "+15.7%",
    Year3: 2025,
    Revenue3: "$280.0B",
    Growth3: "+14.2%",
  },
  {
    Ticker: "GOOGL",
    Name: "Alphabet Inc.",
    Description:
      "Alphabet Inc. offers various products and platforms including Google Search, YouTube, Android, and Google Cloud.",
    Rating: "A",
    Sector: "Technology",
    Year1: 2023,
    Revenue1: "$307.4B",
    Growth1: "+8.7%",
    Year2: 2024,
    Revenue2: "$339.9B",
    Growth2: "+10.6%",
    Year3: 2025,
    Revenue3: "$375.0B",
    Growth3: "+10.3%",
  },
  {
    Ticker: "TSLA",
    Name: "Tesla Inc.",
    Description:
      "Tesla Inc. designs, develops, manufactures, leases, and sells electric vehicles and energy generation systems.",
    Rating: "B+",
    Sector: "Automotive",
    Year1: 2023,
    Revenue1: "$96.8B",
    Growth1: "+18.8%",
    Year2: 2024,
    Revenue2: "$97.7B",
    Growth2: "+1.0%",
    Year3: 2025,
    Revenue3: "$115.0B",
    Growth3: "+17.7%",
  },
  {
    Ticker: "NVDA",
    Name: "NVIDIA Corporation",
    Description:
      "NVIDIA Corporation provides graphics and compute networking solutions for gaming, data centers, and automotive markets.",
    Rating: "A+",
    Sector: "Technology",
    Year1: 2023,
    Revenue1: "$26.9B",
    Growth1: "+0.2%",
    Year2: 2024,
    Revenue2: "$60.9B",
    Growth2: "+126.3%",
    Year3: 2025,
    Revenue3: "$120.0B",
    Growth3: "+97.0%",
  },
];

const companySheet = XLSX.utils.json_to_sheet(companyData);
const companyWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(companyWorkbook, companySheet, "Companies");
XLSX.writeFile(companyWorkbook, path.join(dataDir, "CompanyData.xlsx"));
console.log("Created CompanyData.xlsx");

console.log("\nSample data files created successfully in /data directory!");
console.log("- Portfolio.xlsx: Contains user holdings");
console.log("- CompanyData.xlsx: Contains company fundamental data");
