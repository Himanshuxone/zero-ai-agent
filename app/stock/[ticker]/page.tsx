'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Lightbulb } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function StockDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const ticker = params.ticker as string;

  const { data: stockDetails, isLoading, error } = useSWR(
    ticker ? `/api/stocks/details/${ticker}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6">
        <div className="mx-auto max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !stockDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6">
        <div className="mx-auto max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Card className="border-2 border-dashed border-muted">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Failed to load stock details</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const changeColor = stockDetails.change >= 0 ? 'text-chart-2' : 'text-destructive';
  const priceChange = stockDetails.changePercent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl font-bold">{stockDetails.name}</h1>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {stockDetails.ticker}
              </Badge>
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="hidden md:block"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
          </motion.div>
        </motion.div>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle>Current Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold">
                  ${stockDetails.price?.toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-semibold ${changeColor}`}>
                    {stockDetails.change >= 0 ? '+' : ''}{stockDetails.change?.toFixed(2)}
                  </span>
                  <span className={`text-xl font-semibold ${changeColor}`}>
                    ({stockDetails.changePercent >= 0 ? '+' : ''}{stockDetails.changePercent?.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(stockDetails.timestamp).toLocaleString()}
              </p>
              {stockDetails.source === 'mock' && (
                <Badge variant="secondary" className="w-fit">Demo Data</Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Company Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sector</p>
                <p className="text-lg font-semibold">{stockDetails.sector}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Industry</p>
                <p className="text-lg font-semibold">{stockDetails.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Founded</p>
                <p className="text-lg font-semibold">{stockDetails.founded}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CEO</p>
                <p className="text-lg font-semibold">{stockDetails.ceo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employees</p>
                <p className="text-lg font-semibold">
                  {(stockDetails.employees / 1000).toFixed(1)}K+
                </p>
              </div>
              {stockDetails.website && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  asChild
                >
                  <a href={stockDetails.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Market Cap</p>
                <p className="text-sm font-semibold">
                  ${(stockDetails.marketCap / 1000000000).toFixed(2)}B
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">P/E Ratio</p>
                <p className="text-sm font-semibold">{stockDetails.pe?.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">EPS</p>
                <p className="text-sm font-semibold">${stockDetails.eps?.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Dividend Yield</p>
                <p className="text-sm font-semibold">{stockDetails.dividendYield?.toFixed(2)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">52W High/Low</p>
                <p className="text-sm font-semibold">
                  ${stockDetails.fiftyTwoWeekHigh?.toFixed(2)} / ${stockDetails.fiftyTwoWeekLow?.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Description */}
        {stockDetails.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {stockDetails.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Financial Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${(stockDetails.revenue / 1000000000).toFixed(1)}B
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Net Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${(stockDetails.netIncome / 1000000000).toFixed(1)}B
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(stockDetails.profitMargin * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">ROE</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(stockDetails.returnOnEquity * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Debt to Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {stockDetails.debtToEquity?.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {(stockDetails.averageVolume / 1000000).toFixed(1)}M
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggestion & Recommendation Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <Button
            onClick={() => router.push('/recommendations')}
            className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
            size="lg"
          >
            <Lightbulb className="h-5 w-5" />
            Get More Stock Ideas
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            size="lg"
            className="flex-1 gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
