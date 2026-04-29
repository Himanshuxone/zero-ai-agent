"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorStore } from "@/lib/agents/orchestrator-store";
import type { PortfolioHolding } from "@/lib/agents/types";

// Investment Advisor Agent
// Analyzes portfolio holdings and provides P&L insights with recommendations

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function InvestmentAdvisor() {
  const {
    selectedTicker,
    marketData,
    setHoldings,
    setSelectedHolding,
    setPortfolioLoading,
    setPortfolioError,
  } = useOrchestratorStore();

  const { data, error, isLoading } = useSWR("/api/portfolio", fetcher);

  useEffect(() => {
    setPortfolioLoading(isLoading);
    if (error) {
      setPortfolioError(error.message);
    } else if (data?.holdings) {
      setHoldings(data.holdings);
      setPortfolioError(null);
    }
  }, [data, error, isLoading, setHoldings, setPortfolioLoading, setPortfolioError]);

  // Find holding for selected ticker
  const holdings: PortfolioHolding[] = data?.holdings || [];
  const selectedHolding = selectedTicker
    ? holdings.find((h) => h.ticker === selectedTicker)
    : null;

  // Get current price from market data
  const currentPrice = marketData.length > 0 
    ? marketData[marketData.length - 1].close 
    : null;

  // Calculate P&L
  const pnl = selectedHolding && currentPrice
    ? (currentPrice - selectedHolding.buyPrice) * selectedHolding.shares
    : null;

  const pnlPercent = selectedHolding && currentPrice
    ? ((currentPrice - selectedHolding.buyPrice) / selectedHolding.buyPrice) * 100
    : null;

  useEffect(() => {
    if (selectedHolding && currentPrice) {
      setSelectedHolding({
        ...selectedHolding,
        currentPrice,
        pnl: pnl ?? undefined,
        pnlPercent: pnlPercent ?? undefined,
      });
    } else {
      setSelectedHolding(null);
    }
  }, [selectedHolding, currentPrice, pnl, pnlPercent, setSelectedHolding]);

  if (!selectedTicker) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-chart-3" />
            Investment Advisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a ticker to view your holdings
          </p>
          {/* Show all holdings summary */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Your Portfolio ({holdings.length} positions)
            </p>
            <div className="grid gap-2">
              {holdings.slice(0, 5).map((holding) => (
                <div
                  key={holding.ticker}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <span className="font-mono font-medium">{holding.ticker}</span>
                  <span className="text-muted-foreground">
                    {holding.shares} shares @ ${holding.buyPrice.toFixed(2)}
                  </span>
                </div>
              ))}
              {holdings.length > 5 && (
                <p className="text-center text-xs text-muted-foreground">
                  +{holdings.length - 5} more positions
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-chart-3" />
            Investment Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  if (!selectedHolding) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-chart-3" />
            Investment Advisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No position found for <span className="font-mono font-medium">{selectedTicker}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add this ticker to your portfolio to track P&L
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isProfit = pnl !== null && pnl >= 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-chart-3" />
            Investment Advisor
          </CardTitle>
          {data?.source === "mock" && (
            <Badge variant="secondary" className="text-xs">
              Demo Data
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Position Card */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold">{selectedTicker}</span>
              <Badge variant={isProfit ? "default" : "destructive"}>
                {isProfit ? "Profit" : "Loss"}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Shares Held</p>
                <p className="text-xl font-semibold">{selectedHolding.shares}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Buy Price</p>
                <p className="text-xl font-semibold">
                  ${selectedHolding.buyPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="text-xl font-semibold">
                  {currentPrice
                    ? `$${currentPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}`
                    : "Loading..."}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Buy Date</p>
                <p className="text-xl font-semibold">
                  {new Date(selectedHolding.buyDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* P&L Summary */}
          {pnl !== null && pnlPercent !== null && (
            <div
              className={`rounded-lg p-4 ${
                isProfit
                  ? "bg-chart-2/10 border border-chart-2/20"
                  : "bg-destructive/10 border border-destructive/20"
              }`}
            >
              <p className="text-sm font-medium">Unrealized P&L</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold ${
                    isProfit ? "text-chart-2" : "text-destructive"
                  }`}
                >
                  {isProfit ? "+" : ""}${pnl.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-sm ${
                    isProfit ? "text-chart-2" : "text-destructive"
                  }`}
                >
                  ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Position Value: $
                {currentPrice
                  ? (currentPrice * selectedHolding.shares).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "..."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
