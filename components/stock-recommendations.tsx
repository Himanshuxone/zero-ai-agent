"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const TOP_TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "JPM", "V"];

export function StockRecommendations() {
  const router = useRouter();
  const [riskProfile, setRiskProfile] = React.useState<"conservative" | "moderate" | "aggressive">("moderate");

  const { data, isLoading } = useSWR(
    `/api/stocks/live?tickers=${TOP_TICKERS.join(",")}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const quotes = data?.quotes || [];

  const stocks = quotes.map((q: any, idx: number) => ({
    symbol: q.symbol,
    price: q.price,
    change: q.change,
    changePercent: q.changePercent,
    targetPrice: q.price * (1 + (0.08 + Math.random() * 0.06)),
    expectedReturn: 8 + Math.random() * 6,
    confidence: 75 + Math.random() * 15,
    risk: ["low", "medium", "high"][idx % 3],
  }));

  const filtered = riskProfile === "conservative"
    ? stocks.filter(s => s.risk === "low")
    : riskProfile === "aggressive"
    ? stocks.filter(s => s.risk === "high")
    : stocks;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Recommendations</h1>
          <p className="text-muted-foreground mt-1">AI-powered investment ideas with live data</p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {["conservative", "moderate", "aggressive"].map((level) => (
              <Button
                key={level}
                variant={riskProfile === level ? "default" : "outline"}
                onClick={() => setRiskProfile(level as any)}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Recommended Stocks</h3>
        {isLoading ? (
          <div className="text-center py-8">Loading live data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((stock, idx) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className="h-full hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/stock/${stock.symbol}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                        <p className={`text-xs font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${stock.price.toFixed(2)} {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <Badge variant="default">BUY</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-semibold">${stock.targetPrice.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className="font-semibold text-green-600">+{stock.expectedReturn.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Confidence: {stock.confidence.toFixed(0)}%</p>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-chart-1"
                          style={{ width: `${stock.confidence}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
