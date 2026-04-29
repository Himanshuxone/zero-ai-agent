import { create } from "zustand";
import type {
  Region,
  AssetClass,
  MarketData,
  PortfolioHolding,
  CompanyInfo,
} from "./types";

interface OrchestratorState {
  // Selection State (Agent 2)
  selectedRegion: Region | null;
  selectedAssetClass: AssetClass | null;
  selectedTicker: string | null;

  // Market Data (Agent 1)
  marketData: MarketData[];
  marketLoading: boolean;
  marketError: string | null;

  // Portfolio Data (Agent 3)
  holdings: PortfolioHolding[];
  selectedHolding: PortfolioHolding | null;
  portfolioLoading: boolean;
  portfolioError: string | null;

  // Fundamental Data (Agent 4)
  companyInfo: CompanyInfo | null;
  fundamentalLoading: boolean;
  fundamentalError: string | null;

  // Actions
  setRegion: (region: Region | null) => void;
  setAssetClass: (assetClass: AssetClass | null) => void;
  setTicker: (ticker: string | null) => void;
  setMarketData: (data: MarketData[]) => void;
  setMarketLoading: (loading: boolean) => void;
  setMarketError: (error: string | null) => void;
  setHoldings: (holdings: PortfolioHolding[]) => void;
  setSelectedHolding: (holding: PortfolioHolding | null) => void;
  setPortfolioLoading: (loading: boolean) => void;
  setPortfolioError: (error: string | null) => void;
  setCompanyInfo: (info: CompanyInfo | null) => void;
  setFundamentalLoading: (loading: boolean) => void;
  setFundamentalError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  selectedRegion: null,
  selectedAssetClass: null,
  selectedTicker: null,
  marketData: [],
  marketLoading: false,
  marketError: null,
  holdings: [],
  selectedHolding: null,
  portfolioLoading: false,
  portfolioError: null,
  companyInfo: null,
  fundamentalLoading: false,
  fundamentalError: null,
};

export const useOrchestratorStore = create<OrchestratorState>((set) => ({
  ...initialState,

  setRegion: (region) =>
    set({
      selectedRegion: region,
      selectedAssetClass: null,
      selectedTicker: null,
    }),

  setAssetClass: (assetClass) =>
    set({ selectedAssetClass: assetClass, selectedTicker: null }),

  setTicker: (ticker) => set({ selectedTicker: ticker }),

  setMarketData: (data) => set({ marketData: data }),
  setMarketLoading: (loading) => set({ marketLoading: loading }),
  setMarketError: (error) => set({ marketError: error }),

  setHoldings: (holdings) => set({ holdings }),
  setSelectedHolding: (holding) => set({ selectedHolding: holding }),
  setPortfolioLoading: (loading) => set({ portfolioLoading: loading }),
  setPortfolioError: (error) => set({ portfolioError: error }),

  setCompanyInfo: (info) => set({ companyInfo: info }),
  setFundamentalLoading: (loading) => set({ fundamentalLoading: loading }),
  setFundamentalError: (error) => set({ fundamentalError: error }),

  reset: () => set(initialState),
}));
