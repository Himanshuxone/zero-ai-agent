// Pattern Analysis Agent - Analyzes market patterns and technical indicators

export interface PatternAnalysis {
  symbol: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  momentum: number; // -100 to 100
  volatility: number;
  rsi: number; // 0-100 Relative Strength Index
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
  };
  patterns: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}

// Calculate RSI (Relative Strength Index)
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / (avgLoss || 1);
  return 100 - 100 / (1 + rs);
}

// Calculate MACD (Moving Average Convergence Divergence)
export function calculateMACD(prices: number[]) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;
  const signalLine = calculateEMA([macdLine, ...prices.slice(0, 8)], 9);
  const histogram = macdLine - signalLine;

  return {
    value: macdLine,
    signal: signalLine,
    histogram: histogram,
  };
}

// Calculate EMA (Exponential Moving Average)
function calculateEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }

  return ema;
}

// Calculate Simple Moving Averages
export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  return prices.slice(-period).reduce((a, b) => a + b, 0) / period;
}

// Detect price patterns
export function detectPatterns(prices: number[]): string[] {
  const patterns: string[] = [];

  if (prices.length < 3) return patterns;

  const last = prices[prices.length - 1];
  const prev1 = prices[prices.length - 2];
  const prev2 = prices[prices.length - 3];

  // Double bottom
  if (prev2 > prev1 && prev1 < last) patterns.push('Double Bottom');

  // Double top
  if (prev2 < prev1 && prev1 > last) patterns.push('Double Top');

  // Higher lows (uptrend)
  if (prev2 < prev1 && prev1 < last) patterns.push('Higher Lows');

  // Lower highs (downtrend)
  if (prev2 > prev1 && prev1 > last) patterns.push('Lower Highs');

  return patterns;
}

// Analyze market patterns comprehensively
export function analyzePatterns(
  symbol: string,
  prices: number[],
  quote: { price: number; change: number; changePercent: number }
): PatternAnalysis {
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, 200);
  const patterns = detectPatterns(prices);

  // Calculate volatility
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  const volatility =
    Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - returns.reduce((a, b) => a + b) / returns.length, 2), 0) /
        returns.length
    ) * 100;

  // Calculate momentum
  const momentum = quote.changePercent;

  // Determine trend
  const currentPrice = prices[prices.length - 1];
  const trend =
    currentPrice > sma20 && currentPrice > sma50
      ? 'bullish'
      : currentPrice < sma20 && currentPrice < sma50
        ? 'bearish'
        : 'neutral';

  // Determine strength (0-100)
  const strength = Math.abs(momentum) * 10 + (rsi > 50 ? 25 : -25);

  // Determine risk level
  const riskLevel = volatility > 5 ? 'high' : volatility > 2 ? 'medium' : 'low';

  // Generate recommendation
  let recommendation: PatternAnalysis['recommendation'] = 'hold';
  if (rsi < 30 && trend === 'bullish') recommendation = 'strong_buy';
  else if (rsi < 40 && trend === 'bullish') recommendation = 'buy';
  else if (rsi > 70 && trend === 'bearish') recommendation = 'strong_sell';
  else if (rsi > 60 && trend === 'bearish') recommendation = 'sell';
  else if (rsi > 50 && momentum > 0) recommendation = 'buy';
  else if (rsi < 50 && momentum < 0) recommendation = 'sell';

  return {
    symbol,
    trend,
    strength: Math.min(100, Math.max(0, strength)),
    momentum,
    volatility,
    rsi,
    macd,
    movingAverages: { sma20, sma50, sma200 },
    patterns,
    riskLevel,
    recommendation,
  };
}
