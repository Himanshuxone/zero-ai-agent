'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardPanel, MetricGauge, TimeSeriesChart, PieChart } from '@/components/grafana/dashboard-components';
import { PerformanceMetricsDashboard, calculatePerformanceMetrics } from '@/components/performance-metrics';
import { AdvancedSearchFilter } from '@/components/search-filter';
import { useAlerts, AlertCenter, AlertToaster, createPriceAlert, detectAnomaly } from '@/lib/alerts-system';
import useSWR from 'swr';

interface DashboardData {
  portfolio: { symbol: string; shares: number; avgCost: number }[];
  marketData: Record<string, any>;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function GrafanaDashboard() {
  const { alerts, addAlert, removeAlert } = useAlerts();
  const [dashboardData, setDashboardData] = React.useState<DashboardData>({
    portfolio: [
      { symbol: 'AAPL', shares: 100, avgCost: 150 },
      { symbol: 'MSFT', shares: 50, avgCost: 320 },
      { symbol: 'GOOGL', shares: 30, avgCost: 2800 },
    ],
    marketData: {},
  });

  // Fetch real-time data
  const { data: portfolioMetrics } = useSWR('/api/portfolio', fetcher, { refreshInterval: 30000 });

  // Simulate real-time price updates and alerts
  React.useEffect(() => {
    const interval = setInterval(() => {
      dashboardData.portfolio.forEach(holding => {
        const priceAlert = createPriceAlert(holding.symbol, Math.random() * 500, 300, 'above');
        if (priceAlert) {
          addAlert(priceAlert);
        }
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [addAlert, dashboardData.portfolio]);

  const portfolioValue = dashboardData.portfolio.reduce((sum, h) => sum + (h.shares * h.avgCost), 0);
  const currentValue = portfolioValue * 1.05; // Simulated 5% gain
  const portfolioMetricsData = calculatePerformanceMetrics([portfolioValue, currentValue]);

  const sampleTimeSeries = Array.from({ length: 30 }, (_, i) => ({
    timestamp: Date.now() - (30 - i) * 86400000,
    value: 100000 + Math.random() * 10000 - 5000,
  }));

  const assetAllocation = [
    { label: 'Technology', value: 60, color: '#3b82f6' },
    { label: 'Healthcare', value: 25, color: '#10b981' },
    { label: 'Finance', value: 15, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      <AlertToaster />
      <AlertCenter alerts={alerts} onRemove={removeAlert} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground">Investment Dashboard</h1>
        <p className="text-muted-foreground">Real-time portfolio analytics & market insights</p>
      </motion.div>

      {/* Search & Filter */}
      <AdvancedSearchFilter
        tickers={[
          { symbol: 'AAPL', name: 'Apple Inc.' },
          { symbol: 'MSFT', name: 'Microsoft Corporation' },
          { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        ]}
        onFilter={(filters) => console.log('Filters:', filters)}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardPanel title="Portfolio Value" id="portfolio-value">
          <MetricGauge
            label="Current Value"
            value={`$${currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            trend="up"
            changePercent={5}
          />
        </DashboardPanel>
        <DashboardPanel title="Cash Available" id="cash">
          <MetricGauge
            label="Buying Power"
            value="$50,000"
            trend="neutral"
          />
        </DashboardPanel>
        <DashboardPanel title="Daily Change" id="daily-change">
          <MetricGauge
            label="Today"
            value="+$2,500"
            trend="up"
            changePercent={2.5}
          />
        </DashboardPanel>
        <DashboardPanel title="Top Performer" id="top-performer">
          <MetricGauge
            label="AAPL"
            value="+12.5%"
            trend="up"
            changePercent={12.5}
          />
        </DashboardPanel>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DashboardPanel
          title="Portfolio Value Trend"
          id="value-trend"
          className="lg:col-span-2"
        >
          <TimeSeriesChart data={sampleTimeSeries} height={300} />
        </DashboardPanel>
        <DashboardPanel
          title="Asset Allocation"
          id="asset-allocation"
        >
          <PieChart data={assetAllocation} />
        </DashboardPanel>
      </div>

      {/* Performance Metrics */}
      <DashboardPanel title="Performance Analysis" id="performance-metrics">
        <PerformanceMetricsDashboard metrics={portfolioMetricsData} portfolioName="Main Portfolio" />
      </DashboardPanel>

      {/* Holdings Table */}
      <DashboardPanel title="Portfolio Holdings" id="holdings">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Symbol</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-semibold">Shares</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-semibold">Avg Cost</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-semibold">Current</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-semibold">Gain/Loss</th>
                <th className="text-right py-2 px-2 text-muted-foreground font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.portfolio.map((holding, i) => {
                const current = holding.avgCost * (1 + Math.sin(i) * 0.15);
                const gainLoss = (current - holding.avgCost) * holding.shares;
                const percent = ((current - holding.avgCost) / holding.avgCost) * 100;

                return (
                  <motion.tr
                    key={holding.symbol}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                  >
                    <td className="py-3 px-2 font-semibold text-foreground">{holding.symbol}</td>
                    <td className="text-right py-3 px-2 text-foreground">{holding.shares}</td>
                    <td className="text-right py-3 px-2 text-muted-foreground">${holding.avgCost.toFixed(2)}</td>
                    <td className="text-right py-3 px-2 text-foreground">${current.toFixed(2)}</td>
                    <td className={`text-right py-3 px-2 font-semibold ${gainLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${gainLoss.toFixed(0)}
                    </td>
                    <td className={`text-right py-3 px-2 font-semibold ${percent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {percent > 0 ? '+' : ''}{percent.toFixed(2)}%
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DashboardPanel>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <DashboardPanel title="Recent Alerts" id="recent-alerts">
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between rounded-lg bg-background/50 border border-border/50 p-2"
              >
                <div className="flex-1">
                  <p className="font-semibold text-xs text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                </div>
                <p className="text-xs text-muted-foreground/50">{alert.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      )}
    </div>
  );
}
