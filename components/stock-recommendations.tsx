"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateStockRecommendation, generatePortfolioRecommendation } from "@/lib/agents/recommendation-engine";
import { generateBuySellSignal, generatePortfolioSignals } from "@/lib/agents/buy-sell-signals";
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface RecommendedStock {
  symbol: string;
  currentPrice: number;
  targetPrice: number;
  expectedReturn: number;
  confidenceScore: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

const TOP_STOCKS: RecommendedStock[] = [
  { symbol: "AAPL", currentPrice: 178.5, targetPrice: 195.2, expectedReturn: 9.4, confidenceScore: 85, riskLevel: "medium", recommendation: "BUY" },
  { symbol: "MSFT", currentPrice: 378.9, targetPrice: 410.5, expectedReturn: 8.3, confidenceScore: 82, riskLevel: "medium", recommendation: "BUY" },
  { symbol: "NVDA", currentPrice: 875.3, targetPrice: 950.2, expectedReturn: 8.6, confidenceScore: 88, riskLevel: "high", recommendation: "STRONG_BUY" },
  { symbol: "TSLA", currentPrice: 248.5, targetPrice: 275.8, expectedReturn: 11.0, confidenceScore: 75, riskLevel: "high", recommendation: "BUY" },
  { symbol: "JPM", currentPrice: 195.2, targetPrice: 215.8, expectedReturn: 10.6, confidenceScore: 80, riskLevel: "low", recommendation: "BUY" },
];

export function StockRecommendations() {
  const [minInvestment, setMinInvestment] = React.useState(5000);
  const [maxInvestment, setMaxInvestment] = React.useState(25000);
  const [riskProfile, setRiskProfile] = React.useState<"conservative" | "moderate" | "aggressive">("moderate");

  const recommendations = TOP_STOCKS.map(stock => 
    generateStockRecommendation(
      stock.symbol,
      stock.currentPrice,
      { trend: "bullish", strength: stock.confidenceScore, momentum: stock.expectedReturn, rsi: 40, volatility: 2, recommendation: stock.recommendation },
      { pe: 22, dividendYield: 1.5, week52High: stock.currentPrice * 1.3, week52Low: stock.currentPrice * 0.7 }
    )
  );

  const portfolioRec = generatePortfolioRecommendation(minInvestment, maxInvestment, recommendations, riskProfile);
  const signals = recommendations.map((rec, idx) => 
    generateBuySellSignal(
      rec.symbol,
      rec.currentPrice,
      minInvestment,
      maxInvestment,
      { trend: "bullish", strength: rec.confidenceScore, rsi: 40, momentum: rec.expectedReturn, volatility: 2, recommendation: rec.recommendation }
    )
  );
  const portfolioSignals = generatePortfolioSignals(signals, minInvestment, maxInvestment);

  return (
    <div className="space-y-6">
      {/* Portfolio Analyzer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Portfolio Investment Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Min Investment ($)</label>
                <input
                  type="number"
                  value={minInvestment}
                  onChange={(e) => setMinInvestment(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Investment ($)</label>
                <input
                  type="number"
                  value={maxInvestment}
                  onChange={(e) => setMaxInvestment(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Risk Profile</label>
                <select
                  value={riskProfile}
                  onChange={(e) => setRiskProfile(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Expected Portfolio Return</p>
                <p className="mt-1 text-xl font-bold text-chart-2">
                  {portfolioRec.expectedPortfolioReturn.toFixed(2)}%
                </p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">S&P 500 Expected Return</p>
                <p className="mt-1 text-xl font-bold text-muted-foreground">
                  {portfolioRec.expectedSP500Return.toFixed(2)}%
                </p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Outperformance</p>
                <p className={`mt-1 text-xl font-bold ${portfolioRec.outperformance > 0 ? "text-chart-2" : "text-destructive"}`}>
                  {portfolioRec.outperformance > 0 ? "+" : ""}{portfolioRec.outperformance.toFixed(2)}%
                </p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Better than S&P 500?</p>
                <p className="mt-1 text-lg font-bold">
                  {portfolioRec.outperformance > 0 ? "✓ YES" : "✗ NO"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Stocks */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Top Stock Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={rec.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{rec.symbol}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">${rec.currentPrice.toFixed(2)}</p>
                    </div>
                    <Badge variant={rec.recommendation === "strong_buy" ? "default" : "secondary"}>
                      {rec.recommendation.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Return Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-xs text-muted-foreground">Target Price</p>
                      <p className="font-semibold text-sm">${rec.targetPrice.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg bg-chart-2/10 p-2">
                      <p className="text-xs text-muted-foreground">Expected Return</p>
                      <p className="font-semibold text-sm text-chart-2">
                        {rec.expectedReturn > 0 ? "+" : ""}{rec.expectedReturn.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* S&P 500 Comparison */}
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-2">
                    <p className="text-xs font-medium text-primary">vs S&P 500</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rec.comparisonToSP500.better ? "✓ Better by" : "✗ Worse by"}{" "}
                      <span className={rec.comparisonToSP500.better ? "text-chart-2" : "text-destructive"}>
                        {Math.abs(rec.comparisonToSP500.outperformance).toFixed(2)}%
                      </span>
                    </p>
                  </div>

                  {/* Confidence & Risk */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-2 flex-1 rounded-full bg-muted/30">
                          <div
                            className="h-full rounded-full bg-chart-1"
                            style={{ width: `${rec.confidenceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{rec.confidenceScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {rec.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Buy/Sell Signal */}
                  {signals[idx] && (
                    <div className="rounded-lg border border-primary/20 bg-background p-2">
                      <p className="text-xs font-medium">Trade Setup</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Entry</p>
                          <p className="font-semibold text-xs">${signals[idx].entryPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Stop Loss</p>
                          <p className="font-semibold text-xs text-destructive">${signals[idx].stopLossPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Take Profit</p>
                          <p className="font-semibold text-xs text-chart-2">${signals[idx].takeProfitPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Risk/Reward</p>
                          <p className="font-semibold text-xs">{signals[idx].riskRewardRatio.toFixed(2)}:1</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-chart-2" />
            Recommended Portfolio Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioRec.stocks.map(stock => (
              <div key={stock.symbol} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-semibold">{stock.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {stock.shares} shares @ {stock.allocation.toFixed(1)}% allocation
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${stock.investmentAmount.toFixed(2)}</p>
                  <div className="mt-1 h-2 w-24 rounded-full bg-muted/30">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${stock.allocation}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <p className="text-sm text-muted-foreground">Total Investment Required</p>
              <p className="text-2xl font-bold text-primary">
                ${portfolioRec.stocks.reduce((sum, s) => sum + s.investmentAmount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
