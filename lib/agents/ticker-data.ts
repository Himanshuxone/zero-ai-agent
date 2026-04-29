import type { TickerInfo, Region, AssetClass } from "./types";

export const TICKERS: TickerInfo[] = [
  // North America - Equity
  { symbol: "AAPL", name: "Apple Inc.", region: "north-america", assetClass: "equity" },
  { symbol: "MSFT", name: "Microsoft Corporation", region: "north-america", assetClass: "equity" },
  { symbol: "GOOGL", name: "Alphabet Inc.", region: "north-america", assetClass: "equity" },
  { symbol: "AMZN", name: "Amazon.com Inc.", region: "north-america", assetClass: "equity" },
  { symbol: "TSLA", name: "Tesla Inc.", region: "north-america", assetClass: "equity" },
  { symbol: "NVDA", name: "NVIDIA Corporation", region: "north-america", assetClass: "equity" },
  { symbol: "META", name: "Meta Platforms Inc.", region: "north-america", assetClass: "equity" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", region: "north-america", assetClass: "equity" },

  // Europe - Equity
  { symbol: "NESN.SW", name: "Nestle SA", region: "europe", assetClass: "equity" },
  { symbol: "ASML", name: "ASML Holding", region: "europe", assetClass: "equity" },
  { symbol: "SAP", name: "SAP SE", region: "europe", assetClass: "equity" },
  { symbol: "MC.PA", name: "LVMH", region: "europe", assetClass: "equity" },
  { symbol: "SHEL", name: "Shell PLC", region: "europe", assetClass: "equity" },

  // Asia - Equity
  { symbol: "TSM", name: "Taiwan Semiconductor", region: "asia", assetClass: "equity" },
  { symbol: "BABA", name: "Alibaba Group", region: "asia", assetClass: "equity" },
  { symbol: "TM", name: "Toyota Motor Corp", region: "asia", assetClass: "equity" },
  { symbol: "SONY", name: "Sony Group Corp", region: "asia", assetClass: "equity" },
  { symbol: "9988.HK", name: "Alibaba HK", region: "asia", assetClass: "equity" },

  // Global - Forex
  { symbol: "EURUSD=X", name: "EUR/USD", region: "global", assetClass: "forex" },
  { symbol: "GBPUSD=X", name: "GBP/USD", region: "global", assetClass: "forex" },
  { symbol: "USDJPY=X", name: "USD/JPY", region: "global", assetClass: "forex" },
  { symbol: "AUDUSD=X", name: "AUD/USD", region: "global", assetClass: "forex" },
  { symbol: "USDCAD=X", name: "USD/CAD", region: "global", assetClass: "forex" },
  { symbol: "USDCHF=X", name: "USD/CHF", region: "global", assetClass: "forex" },

  // Global - Crypto
  { symbol: "BTC-USD", name: "Bitcoin USD", region: "global", assetClass: "crypto" },
  { symbol: "ETH-USD", name: "Ethereum USD", region: "global", assetClass: "crypto" },
  { symbol: "SOL-USD", name: "Solana USD", region: "global", assetClass: "crypto" },
  { symbol: "XRP-USD", name: "XRP USD", region: "global", assetClass: "crypto" },

  // Global - Commodity
  { symbol: "GC=F", name: "Gold Futures", region: "global", assetClass: "commodity" },
  { symbol: "CL=F", name: "Crude Oil Futures", region: "global", assetClass: "commodity" },
  { symbol: "SI=F", name: "Silver Futures", region: "global", assetClass: "commodity" },
  { symbol: "NG=F", name: "Natural Gas Futures", region: "global", assetClass: "commodity" },
];

export const REGIONS: { value: Region; label: string }[] = [
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "global", label: "Global" },
];

export const ASSET_CLASSES: { value: AssetClass; label: string }[] = [
  { value: "equity", label: "Equity" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "commodity", label: "Commodity" },
];

export function getTickersByFilter(region?: Region | null, assetClass?: AssetClass | null): TickerInfo[] {
  return TICKERS.filter((ticker) => {
    if (region && ticker.region !== region) return false;
    if (assetClass && ticker.assetClass !== assetClass) return false;
    return true;
  });
}

export function getAvailableAssetClasses(region: Region | null): AssetClass[] {
  if (!region) return [];
  const tickers = TICKERS.filter((t) => t.region === region);
  return [...new Set(tickers.map((t) => t.assetClass))];
}
