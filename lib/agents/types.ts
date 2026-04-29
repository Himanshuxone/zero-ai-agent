// Multi-Agent Investment Dashboard Types

export interface MarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerInfo {
  symbol: string;
  name: string;
  region: Region;
  assetClass: AssetClass;
}

export type Region = "north-america" | "europe" | "asia" | "global";
export type AssetClass = "forex" | "equity" | "crypto" | "commodity";

export interface PortfolioHolding {
  ticker: string;
  shares: number;
  buyPrice: number;
  buyDate: string;
  currentPrice?: number;
  pnl?: number;
  pnlPercent?: number;
}

export interface CompanyInfo {
  ticker: string;
  name: string;
  description: string;
  rating: string;
  sector: string;
  historicalTrend: HistoricalTrend[];
}

export interface HistoricalTrend {
  year: number;
  revenue: string;
  growth: string;
}

// Agent State Types
export interface AgentState {
  selectedRegion: Region | null;
  selectedAssetClass: AssetClass | null;
  selectedTicker: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface MarketAgentState {
  data: MarketData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface PortfolioAgentState {
  holdings: PortfolioHolding[];
  selectedHolding: PortfolioHolding | null;
  isLoading: boolean;
  error: string | null;
}

export interface FundamentalAgentState {
  companyInfo: CompanyInfo | null;
  isLoading: boolean;
  error: string | null;
}

// Event Types for Inter-Agent Communication
export interface SelectionEvent {
  type: "SELECTION_EVENT";
  payload: {
    region?: Region;
    assetClass?: AssetClass;
    ticker?: string;
  };
}

export interface DataUpdateEvent {
  type: "DATA_UPDATE";
  payload: {
    source: "market" | "portfolio" | "fundamental";
    data: unknown;
  };
}

export type AgentEvent = SelectionEvent | DataUpdateEvent;
