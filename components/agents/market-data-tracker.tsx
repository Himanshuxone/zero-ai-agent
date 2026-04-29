"use client";

import { useEffect } from "react";
import useSWR from "swr";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorStore } from "@/lib/agents/orchestrator-store";
import type { MarketData } from "@/lib/agents/types";

// Market Data Tracker Agent
// Streams real-time market data and displays live candlestick charts

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CandleData extends MarketData {
  candleBody: [number, number];
  candleWick: [number, number];
  isGreen: boolean;
  displayDate: string;
}

export function MarketDataTracker() {
  const { selectedTicker, setMarketData, setMarketLoading, setMarketError } =
    useOrchestratorStore();

  const { data, error, isLoading } = useSWR(
    selectedTicker ? `/api/market/${encodeURIComponent(selectedTicker)}` : null,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    setMarketLoading(isLoading);
    if (error) {
      setMarketError(error.message);
    } else if (data?.data) {
      setMarketData(data.data);
      setMarketError(null);
    }
  }, [data, error, isLoading, setMarketData, setMarketLoading, setMarketError]);

  if (!selectedTicker) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-chart-1" />
            Market Data Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-muted-foreground">
            Select a ticker to view market data
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-chart-1" />
            Market Data Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            Agent 1: Market Specialist
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-destructive">Error loading market data</p>
        </CardContent>
      </Card>
    );
  }

  const marketData: MarketData[] = data?.data || [];
  const latestPrice = marketData[marketData.length - 1]?.close;
  const previousPrice = marketData[marketData.length - 2]?.close;
  const priceChange = latestPrice && previousPrice 
    ? ((latestPrice - previousPrice) / previousPrice) * 100 
    : 0;

  // Transform data for candlestick visualization
  const chartData: CandleData[] = marketData.slice(-48).map((d) => ({
    ...d,
    candleBody: [d.open, d.close] as [number, number],
    candleWick: [d.low, d.high] as [number, number],
    isGreen: d.close >= d.open,
    displayDate: new Date(d.date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const minPrice = Math.min(...chartData.map((d) => d.low)) * 0.999;
  const maxPrice = Math.max(...chartData.map((d) => d.high)) * 1.001;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-chart-1" />
            Market Data Tracker
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {selectedTicker}
            </Badge>
            {data?.source === "mock" && (
              <Badge variant="secondary" className="text-xs">
                Demo Data
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            {latestPrice?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </span>
          <span
            className={`text-sm font-medium ${
              priceChange >= 0 ? "text-chart-2" : "text-destructive"
            }`}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(2)}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as CandleData;
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="text-sm font-medium">{d.displayDate}</p>
                    <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">Open:</span>
                      <span className="font-mono">{d.open.toFixed(4)}</span>
                      <span className="text-muted-foreground">High:</span>
                      <span className="font-mono">{d.high.toFixed(4)}</span>
                      <span className="text-muted-foreground">Low:</span>
                      <span className="font-mono">{d.low.toFixed(4)}</span>
                      <span className="text-muted-foreground">Close:</span>
                      <span className="font-mono">{d.close.toFixed(4)}</span>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={latestPrice}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            {/* Candlestick wicks */}
            <Bar
              dataKey="candleWick"
              fill="hsl(var(--muted-foreground))"
              barSize={1}
            />
            {/* Candlestick bodies */}
            {chartData.map((entry, index) => (
              <Bar
                key={index}
                dataKey="candleBody"
                fill={entry.isGreen ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
                barSize={6}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
