'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export interface PerformanceMetrics {
  totalReturn: number;
  ytdReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
}

// Calculate metrics from price data
export function calculatePerformanceMetrics(prices: number[], returns: number[] = []): PerformanceMetrics {
  const totalReturn = prices.length > 1 ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100 : 0;

  // Volatility (standard deviation of returns)
  const dailyReturns = prices.map((p, i) => i > 0 ? (p - prices[i - 1]) / prices[i - 1] : 0).slice(1);
  const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized

  // Sharpe Ratio (assuming 2% risk-free rate)
  const sharpeRatio = (totalReturn - 2) / (volatility || 1);

  // Max Drawdown
  let maxDD = 0;
  let peak = prices[0];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) peak = prices[i];
    const dd = ((prices[i] - peak) / peak) * 100;
    if (dd < maxDD) maxDD = dd;
  }

  // Win Rate (from positive returns)
  const positiveReturns = returns.filter(r => r > 0).length;
  const winRate = returns.length > 0 ? (positiveReturns / returns.length) * 100 : 0;

  // Profit Factor (sum of wins / sum of losses)
  const wins = returns.filter(r => r > 0).reduce((a, b) => a + b, 0);
  const losses = Math.abs(returns.filter(r => r < 0).reduce((a, b) => a + b, 0));
  const profitFactor = losses > 0 ? wins / losses : 0;

  // Average win/loss
  const winReturns = returns.filter(r => r > 0);
  const lossReturns = returns.filter(r => r < 0);
  const avgWin = winReturns.length > 0 ? winReturns.reduce((a, b) => a + b, 0) / winReturns.length : 0;
  const avgLoss = lossReturns.length > 0 ? lossReturns.reduce((a, b) => a + b, 0) / lossReturns.length : 0;

  return {
    totalReturn,
    ytdReturn: totalReturn, // Simplified - in real app would filter by YTD
    volatility,
    sharpeRatio,
    maxDrawdown: maxDD,
    winRate,
    profitFactor,
    avgWin,
    avgLoss,
  };
}

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  format?: 'percent' | 'decimal' | 'integer';
  trend?: 'positive' | 'negative' | 'neutral';
  tooltip?: string;
}

function MetricCard({ label, value, unit = '', format = 'decimal', trend, tooltip }: MetricCardProps) {
  let displayValue = '';
  
  if (format === 'percent') {
    displayValue = `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  } else if (format === 'integer') {
    displayValue = value.toFixed(0);
  } else {
    displayValue = value.toFixed(2);
  }

  const trendIcon = trend === 'positive' ? <TrendingUp className="w-4 h-4 text-green-500" /> :
                    trend === 'negative' ? <TrendingDown className="w-4 h-4 text-red-500" /> :
                    <div className="w-4 h-4" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-background/50 border border-border p-4 group cursor-help"
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {tooltip && <AlertCircle className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-foreground">{displayValue}</p>
        {unit && <p className="text-xs text-muted-foreground">{unit}</p>}
        <div className="ml-auto">{trendIcon}</div>
      </div>
    </motion.div>
  );
}

interface PerformanceMetricsDashboardProps {
  metrics: PerformanceMetrics;
  portfolioName?: string;
}

export function PerformanceMetricsDashboard({ metrics, portfolioName = 'Portfolio' }: PerformanceMetricsDashboardProps) {
  const getTrend = (value: number) =>
    value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
        <p className="text-xs text-muted-foreground">{portfolioName}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Return"
          value={metrics.totalReturn}
          format="percent"
          trend={getTrend(metrics.totalReturn)}
          tooltip="Cumulative return from start date to now"
        />
        <MetricCard
          label="YTD Return"
          value={metrics.ytdReturn}
          format="percent"
          trend={getTrend(metrics.ytdReturn)}
          tooltip="Year-to-date return"
        />
        <MetricCard
          label="Volatility"
          value={metrics.volatility}
          unit="%"
          format="percent"
          trend={metrics.volatility < 15 ? 'positive' : 'negative'}
          tooltip="Annualized standard deviation"
        />
        <MetricCard
          label="Sharpe Ratio"
          value={metrics.sharpeRatio}
          format="decimal"
          trend={getTrend(metrics.sharpeRatio)}
          tooltip="Risk-adjusted return (higher is better)"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Max Drawdown"
          value={metrics.maxDrawdown}
          format="percent"
          trend={getTrend(metrics.maxDrawdown)}
          tooltip="Largest peak-to-trough decline"
        />
        <MetricCard
          label="Win Rate"
          value={metrics.winRate}
          format="percent"
          trend={metrics.winRate > 50 ? 'positive' : 'negative'}
          tooltip="Percentage of winning periods"
        />
        <MetricCard
          label="Profit Factor"
          value={metrics.profitFactor}
          format="decimal"
          trend={metrics.profitFactor > 1 ? 'positive' : 'negative'}
          tooltip="Gross profit / Gross loss ratio"
        />
        <MetricCard
          label="Avg Win/Loss"
          value={metrics.avgWin / Math.abs(metrics.avgLoss || 1)}
          format="decimal"
          trend={metrics.avgWin > Math.abs(metrics.avgLoss) ? 'positive' : 'negative'}
          tooltip="Average win size vs average loss size"
        />
      </div>
    </div>
  );
}
