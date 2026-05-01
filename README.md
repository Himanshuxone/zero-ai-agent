# Multi-Agent Investment Dashboard

A real-time investment dashboard powered by a **4-agent swarm architecture**. This application demonstrates how multiple specialized AI agents can work together to provide a unified, intelligent investment monitoring experience.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (Dashboard Master)               │
│         Listens for selection events and coordinates agents      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   AGENT 1     │   │   AGENT 3     │   │   AGENT 4     │
│ Live Market   │   │  Portfolio    │   │ Fundamental   │
│  Specialist   │   │   Manager     │   │   Analyst     │
│               │   │               │   │               │
│ - Yahoo API   │   │ - Excel Read  │   │ - Excel Read  │
│ - Candlestick │   │ - P&L Calc    │   │ - Company Data│
│ - Real-time   │   │ - Holdings    │   │ - Ratings     │
└───────────────┘   └───────────────┘   └───────────────┘
        ▲
        │
┌───────────────┐
│   AGENT 2     │
│  Navigation   │
│    Agent      │
│               │
│ - Region      │
│ - Asset Class │
│ - Ticker      │
└───────────────┘
```

### Agent Descriptions

| Agent | Role | Data Source | Output |
|-------|------|-------------|--------|
| **Orchestrator** | Dashboard Master | All agents | Unified dashboard layout |
| **Agent 1** | Live Market Specialist | Yahoo Finance API | Candlestick charts, real-time prices |
| **Agent 2** | Navigation & Filter | Static config | Region > Asset Class > Ticker dropdowns |
| **Agent 3** | Portfolio Manager | Portfolio.xlsx | Holdings, P&L calculations |
| **Agent 4** | Fundamental Analyst | CompanyData.xlsx | Company info, ratings, historical trends |

---

## Features

- **Real-time Market Data**: Yahoo Finance integration for live candlestick charts and prices
- **Interactive Charts**: Tooltips, drill-down capabilities, MACD indicators, and smooth animations
- **Real-time Alerts**: Price alerts, P&L change notifications, and market anomaly detection
- **Advanced Search & Filtering**: Debounced autocomplete with multi-select filters and sorting
- **Performance Metrics Dashboard**: Sharpe ratio, volatility, maximum drawdown calculations
- **Grafana-Style Dashboard**: Resizable panels, customizable metrics, professional visualizations
- **Portfolio Tracking**: Real-time P&L calculations from Excel holdings
- **Multi-region Support**: North America, Europe, Asia, and Global markets
- **Asset Class Filtering**: Equity, Forex, Crypto, and Commodity support
- **Animated UI/UX**: Framer Motion animations for smooth transitions and micro-interactions
- **Professional Themes**: Light, Dark, and Vanguard Blue themes with seamless switching
- **State Management**: Centralized Zustand store for agent coordination
- **Data Caching**: SWR for efficient fetching and real-time updates

---

## Theme System

The dashboard includes three professionally designed themes inspired by leading financial platforms:

| Theme | Description | Best For |
|-------|-------------|----------|
| **Light** | Clean white theme with blue accents | Daytime use, presentations |
| **Dark** | Professional black theme | Low-light environments, reduced eye strain |
| **Vanguard Blue** | Premium blue gradient theme | Professional broker aesthetic |

### Switching Themes

Click the theme toggle button in the top-right corner of the header to switch between themes. Your preference is saved automatically.

---

## Quick Start & Deployment

### Via v0 Interface (Easiest - Recommended)

1. **Push to GitHub**:
   - Click **Settings** (gear icon) → **Git**
   - Click **"Push changes"** to sync to `v0/himanshusdec8-4763-150925f2` branch

2. **Automatic Vercel Deployment**:
   - Vercel automatically detects the push
   - Build starts automatically
   - Preview URL generated in ~3-5 minutes
   - Production deployment after PR approval

3. **View Live Dashboard**:
   - Click the preview URL to see the deployed app
   - Test all features: theme switching, agent coordination, alerts
   - Try Grafana dashboard at `/grafana` path

### Via GitHub & Vercel CLI (Advanced)

```bash
# Clone the repository
git clone https://github.com/Himanshuxone/zero-ai-agent.git
cd zero-ai-agent

# Install dependencies
pnpm install

# Run locally
pnpm dev

# Visit http://localhost:3000
```

### Environment Variables

The app uses **free Yahoo Finance API** (no credentials needed). For production, add optional `.env.local`:

```env
# Optional: Custom API configurations
NEXT_PUBLIC_APP_NAME=Zero AI Agent
NEXT_PUBLIC_REFRESH_INTERVAL=5000
```

---

## Local Development

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn
- **Git**

### Setup Instructions

#### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/Himanshuxone/zero-ai-agent.git

# Using SSH
git clone git@github.com:Himanshuxone/zero-ai-agent.git

# Navigate to project
cd zero-ai-agent
```

#### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

#### 3. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the dashboard

#### 4. Test Features Locally

- **Switch Themes**: Click theme toggle (top right)
- **Navigate Tickers**: Use Agent 2 dropdown (Region → Asset Class → Ticker)
- **View Grafana Dashboard**: Visit `http://localhost:3000/grafana`
- **Check Console**: View agent coordination logs

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Production Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Automatic via v0 Git Push (Easiest)

1. Click **Settings** → **Git** in v0
2. Click **"Push changes"** to sync to GitHub
3. Vercel automatically deploys on push
4. Get preview URL in ~3-5 minutes

#### Option 2: Via GitHub Integration

1. Push code to `v0/himanshusdec8-4763-150925f2` branch
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select `zero-ai-agent` repository
5. Deploy with one click

#### Option 3: Via Vercel CLI

```bash
# Login to Vercel
pnpm dlx vercel login

# Deploy preview
pnpm dlx vercel

# Deploy to production
pnpm dlx vercel --prod
```

### Environment Variables (Optional)

No environment variables are required for basic functionality. The app uses:
- Yahoo Finance API (public, no key required)
- Local Excel files for portfolio/company data

### Custom Domain Setup

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Domains"
4. Add your custom domain

---

## Project Structure

```
zero-ai-agent/
├── app/
│   ├── api/
│   │   ├── yahoo/
│   │   │   ├── quote/[ticker]/route.ts       # Yahoo Finance quotes
│   │   │   └── chart/[ticker]/route.ts       # Yahoo Finance chart data
│   │   ├── market/[ticker]/route.ts          # Agent 1: Market data
│   │   ├── portfolio/route.ts                # Agent 3: Portfolio manager
│   │   ├── fundamentals/[ticker]/route.ts    # Agent 4: Fundamentals
│   │   └── ...
│   ├── grafana/page.tsx                      # Grafana-style dashboard
│   ├── globals.css                           # Theme tokens & animations
│   ├── layout.tsx                            # Root layout with ThemeProvider
│   └── page.tsx                              # Main dashboard page
├── components/
│   ├── agents/
│   │   ├── orchestrator-dashboard.tsx        # Master orchestrator
│   │   ├── agent-1-market-chart.tsx          # Live charts with animations
│   │   ├── agent-2-navigation.tsx            # Ticker selection
│   │   ├── agent-3-portfolio.tsx             # Portfolio analysis
│   │   └── agent-4-fundamentals.tsx          # Company fundamentals
│   ├── grafana/
│   │   └── dashboard-components.tsx          # Grafana panels & metrics
│   ├── search-filter.tsx                     # Advanced search & filters
│   ├── performance-metrics.tsx               # Performance dashboard
│   ├── theme-toggle.tsx                      # Theme switcher button
│   ├── theme-provider.tsx                    # Next-themes provider
│   └── ui/                                   # shadcn/ui components
├── lib/
│   ├── agents/
│   │   ├── types.ts                          # TypeScript interfaces
│   │   ├── orchestrator-store.ts             # Zustand store
│   │   └── ticker-data.ts                    # Ticker database
│   ├── alerts-system.ts                      # Real-time alerts
│   └── ...
├── scripts/
│   └── create-sample-data.ts                 # Sample data generator
├── README.md                                 # This file
├── package.json
└── tsconfig.json
```

---

## API Reference

### Real-time Market Data Endpoints

#### GET /api/yahoo/quote/[ticker]

Fetches latest quote data from Yahoo Finance.

**Parameters:**
- `ticker` (path): Stock symbol (e.g., "AAPL", "GOOGL", "EURUSD=X")

**Response:**
```json
{
  "ticker": "AAPL",
  "price": 195.50,
  "change": 2.35,
  "changePercent": 1.22,
  "timestamp": "2024-03-15T14:30:00Z"
}
```

#### GET /api/yahoo/chart/[ticker]

Fetches historical chart data (candlesticks).

**Query Parameters:**
- `range` (optional): "1d", "5d", "1mo", "3mo", "1y", "5y" (default: "1mo")

**Response:**
```json
{
  "ticker": "AAPL",
  "data": [
    {
      "date": "2024-03-14",
      "open": 193.20,
      "high": 195.80,
      "low": 193.10,
      "close": 194.50,
      "volume": 52000000
    }
  ]
}
```

### Agent APIs

#### GET /api/market/[ticker]

Agent 1: Fetches market analysis data.

#### GET /api/portfolio

Agent 3: Fetches portfolio holdings and P&L.

#### GET /api/fundamentals/[ticker]

Agent 4: Fetches company fundamental data.

---

## Features Deep Dive

### Real-time Alerts System

The alerts system monitors portfolio changes and market conditions:

```typescript
// Price alert: Notify when ticker crosses threshold
createPriceAlert({ ticker: "AAPL", threshold: 200, type: "above" });

// P&L alert: Notify when portfolio gains/loses %
createPnLAlert({ threshold: 5, type: "loss" });

// Anomaly alert: Detect unusual market movements
createAnomalyAlert({ volatilityThreshold: 2.5 });
```

### Grafana-Style Dashboard

Access at `/grafana` for professional metrics visualization:
- Resizable panels with drag & drop
- Time-series charts with MACD indicators
- Portfolio allocation pie charts
- Performance metrics gauges
- Customizable panel sizes and layouts

### Performance Metrics

Dashboard calculates:
- **Return %**: Total portfolio return percentage
- **Volatility**: Standard deviation of returns
- **Sharpe Ratio**: Risk-adjusted returns
- **Max Drawdown**: Largest peak-to-trough decline

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start locally | Run `pnpm install` and `pnpm dev` |
| Yahoo Finance API errors | Check internet connection, API might have rate limits |
| Themes not persisting | Clear browser cache and localStorage |
| Alerts not triggering | Check browser console for errors |
| Grafana dashboard blank | Ensure ticker is selected first |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT License - feel free to use this project for personal and commercial projects.

---

## Support & Contact

- **GitHub Issues**: [Report bugs](https://github.com/Himanshuxone/zero-ai-agent/issues)
- **Discussions**: [Ask questions](https://github.com/Himanshuxone/zero-ai-agent/discussions)
- **Email**: Contact via GitHub

---

## Deployment Checklist

Before deploying to production:

- [ ] Test all 4 agents are working correctly
- [ ] Verify theme switching works in production
- [ ] Check alerts system notifications
- [ ] Test Grafana dashboard panel resizing
- [ ] Verify responsive design on mobile
- [ ] Check performance metrics calculations
- [ ] Test search and filter functionality
- [ ] Monitor API response times
- [ ] Set up Vercel analytics
- [ ] Configure custom domain (optional)

---

**Happy trading! 🚀**
    ]
  },
  "source": "excel"
}
```

---

## Customization

### Adding New Tickers

Edit `lib/agents/ticker-data.ts`:

```typescript
export const TICKERS: TickerInfo[] = [
  // Add your ticker
  { 
    symbol: "NFLX", 
    name: "Netflix Inc.", 
    region: "north-america", 
    assetClass: "equity" 
  },
  // ... existing tickers
];
```

### Modifying Portfolio Data

Option 1: Edit the Excel file at `data/Portfolio.xlsx`

Option 2: Modify mock data in `app/api/portfolio/route.ts`:

```typescript
function getMockPortfolio(): PortfolioHolding[] {
  return [
    { ticker: "NFLX", shares: 10, buyPrice: 450.00, buyDate: "2024-03-01" },
    // ... your holdings
  ];
}
```

### Adding New Agents

1. Create the agent component in `components/agents/`
2. Add state to `lib/agents/orchestrator-store.ts`
3. Create API route if needed in `app/api/`
4. Import and add to `orchestrator-dashboard.tsx`

### Customizing Themes

Edit `app/globals.css` to modify theme colors:

```css
/* Light Theme */
:root {
  --background: oklch(0.98 0.005 250);
  --primary: oklch(0.45 0.18 250);
  /* ... other variables */
}

/* Dark Theme */
.dark {
  --background: oklch(0.12 0.02 250);
  --primary: oklch(0.65 0.18 250);
  /* ... other variables */
}

/* Blue Theme */
.blue {
  --background: oklch(0.2 0.08 250);
  --primary: oklch(0.85 0.1 80);
  /* ... other variables */
}
```

---

## Troubleshooting

### Common Issues

#### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Excel files not loading

1. Ensure `data/` directory exists
2. Run the sample data script:
   ```bash
   pnpm dlx ts-node scripts/create-sample-data.ts
   ```

#### Yahoo Finance API rate limiting

The app falls back to mock data automatically. If you see "Demo Data" badges, the API may be rate-limited.

#### Build errors on Vercel

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Try clearing the Vercel build cache

### Getting Help

- Open an issue on GitHub
- Check existing issues for solutions
- Review the Vercel deployment logs

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Data Fetching**: SWR
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Excel Parsing**: xlsx (SheetJS)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## License

MIT License - feel free to use this project for learning or commercial purposes.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with Next.js and deployed on Vercel
