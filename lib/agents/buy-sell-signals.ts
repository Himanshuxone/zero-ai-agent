// Buy/Sell Signal Generator Agent
// Generates precise entry and exit points based on investment constraints

export interface BuySellSignal {
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  entryPrice: number;
  exitPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  riskRewardRatio: number;
  positionSize: number; // for given min/max investment
  expectedProfit: number; // percentage
  expectedLoss: number; // percentage
  confidence: number; // 0-100
  timing: {
    optimalBuyTime: string;
    expectedHoldDays: number;
    optimalExitTime: string;
  };
}

export interface PortfolioSignals {
  signals: BuySellSignal[];
  totalInvestmentRequired: number;
  expectedPortfolioReturn: number;
  maxDrawdown: number; // Maximum loss possible
  riskRewardRatio: number;
  recommendation: 'aggressive_buy' | 'buy' | 'hold' | 'wait';
}

// Generate buy/sell signals for a single stock
export function generateBuySellSignal(
  symbol: string,
  currentPrice: number,
  minInvestment: number,
  maxInvestment: number,
  analysis: {
    trend: 'bullish' | 'bearish' | 'neutral';
    strength: number;
    rsi: number;
    momentum: number;
    volatility: number;
    recommendation: string;
  }
): BuySellSignal {
  // Calculate entry point
  const entryPrice = currentPrice * (analysis.trend === 'bullish' ? 0.98 : 1.02); // Buy low
  const exitPrice = currentPrice * (1 + analysis.strength / 100);

  // Calculate stop loss (2-3% below entry)
  const stopLossPercent = 2 + Math.min(analysis.volatility / 2, 3);
  const stopLossPrice = entryPrice * (1 - stopLossPercent / 100);

  // Calculate take profit (based on risk/reward, min 1:2)
  const riskAmount = entryPrice - stopLossPrice;
  const takeProfitPrice = entryPrice + riskAmount * 2;

  // Risk/reward ratio
  const riskRewardRatio = (takeProfitPrice - entryPrice) / (entryPrice - stopLossPrice);

  // Position size calculation
  const accountSize = (minInvestment + maxInvestment) / 2;
  const positionSize = (accountSize * (analysis.strength / 100)) / entryPrice;

  // Expected P&L
  const expectedProfit = ((takeProfitPrice - entryPrice) / entryPrice) * 100;
  const expectedLoss = ((entryPrice - stopLossPrice) / entryPrice) * 100;

  // Signal generation
  let signal: BuySellSignal['signal'] = 'hold';
  if (analysis.rsi < 35 && analysis.trend === 'bullish') signal = 'buy';
  else if (analysis.rsi > 65 && analysis.trend === 'bearish') signal = 'sell';
  else if (analysis.recommendation === 'strong_buy') signal = 'buy';
  else if (analysis.recommendation === 'strong_sell') signal = 'sell';

  // Confidence score
  let confidence = 50;
  if (signal === 'buy' && analysis.rsi < 30) confidence += 30;
  if (signal === 'sell' && analysis.rsi > 70) confidence += 30;
  if (riskRewardRatio > 2) confidence += 20;
  if (analysis.strength > 70) confidence += 10;

  // Timing information
  const holdDays = analysis.volatility > 5 ? 10 : analysis.volatility > 2 ? 15 : 20;

  return {
    symbol,
    signal,
    entryPrice: parseFloat(entryPrice.toFixed(2)),
    exitPrice: parseFloat(exitPrice.toFixed(2)),
    stopLossPrice: parseFloat(stopLossPrice.toFixed(2)),
    takeProfitPrice: parseFloat(takeProfitPrice.toFixed(2)),
    riskRewardRatio: parseFloat(riskRewardRatio.toFixed(2)),
    positionSize: parseFloat(positionSize.toFixed(4)),
    expectedProfit: parseFloat(expectedProfit.toFixed(2)),
    expectedLoss: parseFloat(expectedLoss.toFixed(2)),
    confidence: Math.min(100, Math.max(0, confidence)),
    timing: {
      optimalBuyTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      expectedHoldDays: holdDays,
      optimalExitTime: new Date(Date.now() + holdDays * 24 * 3600000).toISOString(),
    },
  };
}

// Generate portfolio-level signals
export function generatePortfolioSignals(
  signals: BuySellSignal[],
  minInvestment: number,
  maxInvestment: number
): PortfolioSignals {
  // Filter buy signals
  const buySignals = signals.filter(s => s.signal === 'buy');
  const sellSignals = signals.filter(s => s.signal === 'sell');

  // Calculate total investment required
  const totalInvestmentRequired = buySignals.reduce((sum, s) => sum + (s.positionSize * s.entryPrice), 0);

  // Calculate expected returns
  const expectedPortfolioReturn =
    buySignals.reduce((sum, s) => sum + (s.expectedProfit * s.positionSize * s.entryPrice) / 100, 0) /
    totalInvestmentRequired;

  // Calculate max drawdown
  const maxDrawdown =
    buySignals.reduce((sum, s) => sum + (s.expectedLoss * s.positionSize * s.entryPrice) / 100, 0) /
    totalInvestmentRequired;

  // Average risk/reward
  const avgRiskReward =
    buySignals.reduce((sum, s) => sum + s.riskRewardRatio, 0) / (buySignals.length || 1);

  // Recommendation
  let recommendation: PortfolioSignals['recommendation'] = 'hold';
  if (expectedPortfolioReturn > 5 && avgRiskReward > 2) recommendation = 'aggressive_buy';
  else if (expectedPortfolioReturn > 2 && avgRiskReward > 1.5) recommendation = 'buy';
  else if (totalInvestmentRequired < minInvestment) recommendation = 'wait';

  return {
    signals: buySignals,
    totalInvestmentRequired: parseFloat(totalInvestmentRequired.toFixed(2)),
    expectedPortfolioReturn: parseFloat(expectedPortfolioReturn.toFixed(2)),
    maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
    riskRewardRatio: parseFloat(avgRiskReward.toFixed(2)),
    recommendation,
  };
}

// Calculate position sizing for multiple stocks
export function calculatePositionSizing(
  investments: Array<{ symbol: string; price: number; score: number }>,
  accountSize: number
): Array<{
  symbol: string;
  allocation: number;
  shares: number;
  investmentAmount: number;
}> {
  const totalScore = investments.reduce((sum, inv) => sum + inv.score, 0);

  return investments.map(inv => {
    const allocation = (inv.score / totalScore) * 100;
    const investmentAmount = (allocation / 100) * accountSize;
    const shares = Math.floor(investmentAmount / inv.price);

    return {
      symbol: inv.symbol,
      allocation: parseFloat(allocation.toFixed(2)),
      shares,
      investmentAmount: parseFloat((shares * inv.price).toFixed(2)),
    };
  });
}
