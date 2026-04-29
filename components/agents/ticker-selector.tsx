"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrchestratorStore } from "@/lib/agents/orchestrator-store";
import {
  REGIONS,
  ASSET_CLASSES,
  getTickersByFilter,
  getAvailableAssetClasses,
} from "@/lib/agents/ticker-data";
import type { Region, AssetClass } from "@/lib/agents/types";

// Ticker Selector & Pattern Analyzer
// Renders UI dropdowns for Region > Asset Class > Ticker hierarchy

export function TickerSelector() {
  const {
    selectedRegion,
    selectedAssetClass,
    selectedTicker,
    setRegion,
    setAssetClass,
    setTicker,
    reset,
  } = useOrchestratorStore();

  const availableAssetClasses = selectedRegion
    ? getAvailableAssetClasses(selectedRegion)
    : [];

  const availableTickers = getTickersByFilter(selectedRegion, selectedAssetClass);

  const handleRegionChange = (value: string) => {
    setRegion(value as Region);
  };

  const handleAssetClassChange = (value: string) => {
    setAssetClass(value as AssetClass);
  };

  const handleTickerChange = (value: string) => {
    setTicker(value);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-chart-2" />
            Ticker Selector
          </CardTitle>
          {selectedTicker && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            1. Select Region
          </label>
          <Select value={selectedRegion || ""} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a region..." />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Asset Class Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            2. Select Asset Class
          </label>
          <Select
            value={selectedAssetClass || ""}
            onValueChange={handleAssetClassChange}
            disabled={!selectedRegion}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  selectedRegion ? "Choose asset class..." : "Select region first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {ASSET_CLASSES.filter((ac) =>
                availableAssetClasses.includes(ac.value)
              ).map((assetClass) => (
                <SelectItem key={assetClass.value} value={assetClass.value}>
                  {assetClass.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ticker Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            3. Select Ticker
          </label>
          <Select
            value={selectedTicker || ""}
            onValueChange={handleTickerChange}
            disabled={!selectedAssetClass}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  selectedAssetClass ? "Choose ticker..." : "Select asset class first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableTickers.map((ticker) => (
                <SelectItem key={ticker.symbol} value={ticker.symbol}>
                  <span className="flex items-center gap-2">
                    <span className="font-mono font-medium">{ticker.symbol}</span>
                    <span className="text-muted-foreground">{ticker.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selection Summary */}
        {selectedTicker && (
          <div className="mt-4 rounded-lg border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Active Selection</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">
                {REGIONS.find((r) => r.value === selectedRegion)?.label}
              </Badge>
              <Badge variant="outline">
                {ASSET_CLASSES.find((a) => a.value === selectedAssetClass)?.label}
              </Badge>
              <Badge className="font-mono">{selectedTicker}</Badge>
            </div>
          </div>
        )}

        {/* Quick Select Popular Tickers */}
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {["AAPL", "MSFT", "BTC-USD", "EURUSD=X"].map((symbol) => (
              <Button
                key={symbol}
                variant={selectedTicker === symbol ? "default" : "outline"}
                size="sm"
                className="h-7 font-mono text-xs"
                onClick={() => {
                  // Find ticker and set all selections
                  const ticker = getTickersByFilter().find(
                    (t) => t.symbol === symbol
                  );
                  if (ticker) {
                    setRegion(ticker.region);
                    setTimeout(() => setAssetClass(ticker.assetClass), 0);
                    setTimeout(() => setTicker(ticker.symbol), 0);
                  }
                }}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
