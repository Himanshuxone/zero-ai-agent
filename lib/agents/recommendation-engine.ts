// Investment Recommendation Engine
// Generates actionable investment recommendations with ROI calculations

export interface StockRecommendation {
  symbol: string;
  currentPrice: number;
  targetPrice: number;
  expectedReturn: number; // percentage
  expectedReturnDays: number; // time horizon
  confidenceScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  pros: string[];
  cons: string[];
  alternatives: string[]; // Similar stocks with better metrics
  comparisonToSP500: {
    sp500Expected: number; // Expected S&P 500 return
    outperformance: number; // Our recommendation vs S&P 500
    better: boolean;
  };
}

export interface PortfolioRecommendation {
  minInvestment: number;
  maxInvestment: number;
  stocks: Array<{
    symbol: string;
    allocation: number; // percentage
    shares: number;
    investmentAmount: number;
  }>;
  expectedPortfolioReturn: number;
  expectedSP500Return: number;
  outperformance: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

// SP500 baseline return calculation
const SP500_ANNUAL_RETURN = 0.10; // 10% average annual return
const SP500_DAILY_RETURN = Math.pow(1 + SP500_ANNUAL_RETURN, 1 / 252) - 1;

// Generate single stock recommendation
export function generateStockRecommendation(
  symbol: string,
  currentPrice: number,
  analysis: {
    trend: 'bullish' | 'bearish' | 'neutral';
    strength: number;
    momentum: number;
    rsi: number;
    volatility: number;
    recommendation: string;
  },
  marketData: {
    pe: number;
    dividendYield: number;
    week52High: number;
    week52Low: number;
  }
): StockRecommendation {
  // Calculate target price based on analysis
  const trendMultiplier = analysis.trend === 'bullish' ? 1.08 : analysis.trend === 'bearish' ? 0.95 : 1.0;
  const strengthMultiplier = 1 + analysis.strength / 500;
  const targetPrice = currentPrice * trendMultiplier * strengthMultiplier;
  const expectedReturn = ((targetPrice - currentPrice) / currentPrice) * 100;

  // Determine time horizon (in days)
  const expectedReturnDays = Math.abs(analysis.volatility) < 1 ? 90 : Math.abs(analysis.volatility) < 3 ? 60 : 30;

  // Calculate confidence score
  let confidenceScore = 50;
  if (analysis.rsi < 30 && analysis.trend === 'bullish') confidenceScore += 25;
  if (analysis.rsi > 70 && analysis.trend === 'bearish') confidenceScore += 25;
  if (Math.abs(analysis.momentum) > 3) confidenceScore += 15;
  if (analysis.strength > 70) confidenceScore += 10;

  // Calculate S&P 500 comparison
  const sp500ExpectedReturn = SP500_DAILY_RETURN * expectedReturnDays * 100;
  const outperformance = expectedReturn - sp500ExpectedReturn;

  // Reason generation
  const reasons: string[] = [];
  if (analysis.trend === 'bullish') reasons.push('Bullish trend');
  if (analysis.rsi < 40) reasons.push('Oversold conditions');
  if (analysis.momentum > 2) reasons.push('Positive momentum');
  if (marketData.pe < 20) reasons.push('Attractive valuation');
  if (marketData.dividendYield > 2) reasons.push('Good dividend yield');

  // Pros and cons
  const pros = [
    `${analysis.trend} trend with ${analysis.strength.toFixed(1)}% strength`,
    `PE Ratio: ${marketData.pe.toFixed(1)}x (${marketData.pe < 20 ? 'Attractive' : 'Fair'})`,
    `Expected return: ${expectedReturn.toFixed(2)}% in ${expectedReturnDays} days`,
    `Outperforming S&P 500 by ${outperformance.toFixed(2)}%`,
  ];

  const cons = [
    `Volatility: ${analysis.volatility.toFixed(2)}% (${analysis.volatility > 5 ? 'High' : 'Moderate'})`,
    `52-week range: $${marketData.week52Low.toFixed(2)} - $${marketData.week52High.toFixed(2)}`,
    `Current price: ${currentPrice > marketData.week52High * 0.95 ? 'Near 52-week high' : 'Room for upside'}`,
  ];

  return {
    symbol,
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    targetPrice: parseFloat(targetPrice.toFixed(2)),
    expectedReturn: parseFloat(expectedReturn.toFixed(2)),
    expectedReturnDays,
    confidenceScore: Math.min(100, Math.max(0, confidenceScore)),
    riskLevel: analysis.volatility > 5 ? 'high' : analysis.volatility > 2 ? 'medium' : 'low',
    reason: reasons.join(', '),
    pros,
    cons,
    alternatives: generateAlternatives(symbol),
    comparisonToSP500: {
      sp500Expected: parseFloat(sp500ExpectedReturn.toFixed(2)),
      outperformance: parseFloat(outperformance.toFixed(2)),
      better: outperformance > 0,
    },
  };
}

// Generate portfolio recommendation based on min/max investment
export function generatePortfolioRecommendation(
  minInvestment: number,
  maxInvestment: number,
  recommendations: StockRecommendation[],
  riskProfile: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
): PortfolioRecommendation {
  // Sort by confidence score
  const sorted = [...recommendations].sort((a, b) => b.confidenceScore - a.confidenceScore);

  // Select stocks based on risk profile
  let selectedCount = riskProfile === 'conservative' ? 3 : riskProfile === 'moderate' ? 5 : 8;
  selectedCount = Math.min(selectedCount, sorted.length);
  const selected = sorted.slice(0, selectedCount);

  // Calculate allocations (equal-weight or weighted by confidence)
  const totalConfidence = selected.reduce((sum, s) => sum + s.confidenceScore, 0);
  const portfolioAmount = (minInvestment + maxInvestment) / 2;

  const stocks = selected.map(rec => {
    const allocation = (rec.confidenceScore / totalConfidence) * 100;
    const investmentAmount = (allocation / 100) * portfolioAmount;
    const shares = Math.floor(investmentAmount / rec.currentPrice);

    return {
      symbol: rec.symbol,
      allocation: parseFloat(allocation.toFixed(2)),
      shares,
      investmentAmount: parseFloat((shares * rec.currentPrice).toFixed(2)),
    };
  });

  // Calculate expected returns
  const expectedPortfolioReturn =
    stocks.reduce((sum, stock) => {
      const rec = recommendations.find(r => r.symbol === stock.symbol);
      return sum + (rec ? (rec.expectedReturn * stock.allocation) / 100 : 0);
    }, 0) / 100;

  const expectedSP500Return = SP500_DAILY_RETURN * 30 * 100; // 30-day horizon

  return {
    minInvestment,
    maxInvestment,
    stocks,
    expectedPortfolioReturn: parseFloat(expectedPortfolioReturn.toFixed(2)),
    expectedSP500Return: parseFloat(expectedSP500Return.toFixed(2)),
    outperformance: parseFloat((expectedPortfolioReturn - expectedSP500Return).toFixed(2)),
    riskProfile,
  };
}

// Generate alternative stocks
function generateAlternatives(symbol: string): string[] {
  const alternatives: Record<string, string[]> = {
    AAPL: ['MSFT', 'GOOGL', 'NVDA'],
    MSFT: ['AAPL', 'GOOGL', 'IBM'],
    TSLA: ['NIO', 'RIVN', 'LUCID'],
    NVDA: ['AMD', 'INTC', 'QCOM'],
    JPM: ['BAC', 'WFC', 'GS'],
    BRK: ['SPY', 'VOO', 'VTI'],
  };

  return alternatives[symbol] || ['SPY', 'QQQ', 'VOO'];
}
