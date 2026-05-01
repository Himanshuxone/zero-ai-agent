'use client';

import { StockRecommendations } from '@/components/stock-recommendations';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Lightbulb className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Investment Recommendations</h1>
          </div>
          <p className="text-muted-foreground">
            AI-powered stock recommendations with ROI projections, buy/sell signals, and S&P 500 comparisons
          </p>
        </motion.div>

        {/* Main Content */}
        <StockRecommendations />
      </div>
    </div>
  );
}
