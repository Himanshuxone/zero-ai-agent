'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const recommendations = [
  { symbol: 'AAPL', price: 178.5, target: 195.2, return: 9.4, confidence: 85, risk: 'medium', action: 'BUY' },
  { symbol: 'MSFT', price: 378.9, target: 410.5, return: 8.3, confidence: 82, risk: 'medium', action: 'BUY' },
  { symbol: 'NVDA', price: 875.3, target: 950.2, return: 8.6, confidence: 88, risk: 'high', action: 'STRONG_BUY' },
  { symbol: 'TSLA', price: 248.5, target: 275.8, return: 11.0, confidence: 75, risk: 'high', action: 'BUY' },
  { symbol: 'JPM', price: 195.2, target: 215.8, return: 10.6, confidence: 80, risk: 'low', action: 'BUY' },
  { symbol: 'GOOGL', price: 155.3, target: 175.2, return: 12.8, confidence: 83, risk: 'medium', action: 'STRONG_BUY' },
];

export function StockRecommendations() {
  const [minInvestment, setMinInvestment] = React.useState(5000);
  const [maxInvestment, setMaxInvestment] = React.useState(25000);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Investment Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Recommended Allocation</p>
                <p className="mt-1 text-lg font-bold text-chart-2">${(maxInvestment / recommendations.length).toFixed(0)}</p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Avg Expected Return</p>
                <p className="mt-1 text-lg font-bold text-chart-2">9.8%</p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">vs S&P 500 (10%)</p>
                <p className="mt-1 text-lg font-bold text-yellow-600">-0.2%</p>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Better than S&P?</p>
                <p className="mt-1 text-lg font-bold">Near Par</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Top Stock Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((stock, idx) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:border-primary/30 transition-all cursor-pointer" onClick={() => window.location.href = `/stock/${stock.symbol}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">${stock.price.toFixed(2)}</p>
                    </div>
                    <Badge variant={stock.action === 'STRONG_BUY' ? 'default' : 'secondary'}>
                      {stock.action.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="font-semibold text-sm">${stock.target.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg bg-chart-2/10 p-2">
                      <p className="text-xs text-muted-foreground">Return</p>
                      <p className="font-semibold text-sm text-chart-2">+{stock.return.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-2 flex-1 rounded-full bg-muted/30">
                          <div
                            className="h-full rounded-full bg-chart-1"
                            style={{ width: `${stock.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{stock.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">
                        {stock.risk}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Link href="/">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
