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

- **Real-time Market Data**: Live candlestick charts with automatic refresh
- **Multi-region Support**: North America, Europe, Asia, and Global markets
- **Asset Class Filtering**: Equity, Forex, Crypto, and Commodity support
- **Portfolio Tracking**: Real-time P&L calculations from Excel holdings
- **Fundamental Analysis**: Company descriptions, ratings, and historical trends
- **Responsive Design**: Works on desktop and mobile devices
- **State Management**: Centralized state with Zustand for agent coordination
- **Data Caching**: SWR for efficient data fetching and caching
- **Professional Themes**: Three beautiful themes (Light, Dark, Vanguard Blue)

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

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. **Click the Deploy Button** or visit [v0.dev](https://v0.dev) and import this project

2. **Connect to GitHub**:
   - In v0, click the settings button (top right)
   - Go to "Git" section
   - Connect your GitHub repository

3. **Deploy**:
   - Click "Publish" in the top right
   - Your app will be live on Vercel in seconds

### Option 2: Clone and Deploy

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/multi-agent-dashboard.git
cd multi-agent-dashboard

# Install dependencies
pnpm install

# Run locally
pnpm dev

# Deploy to Vercel
pnpm dlx vercel
```

---

## Local Development

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn
- **Git**

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/YOUR_USERNAME/multi-agent-dashboard.git

# Using SSH
git clone git@github.com:YOUR_USERNAME/multi-agent-dashboard.git

# Navigate to project
cd multi-agent-dashboard
```

#### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

#### 3. Create Sample Data Files (Optional)

The app includes mock data by default, but you can create real Excel files:

```bash
# Run the sample data creation script
pnpm dlx ts-node scripts/create-sample-data.ts
```

This creates:
- `data/Portfolio.xlsx` - Your investment holdings
- `data/CompanyData.xlsx` - Company fundamental data

#### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |

---

## Production Deployment

### Deploy to Vercel (Recommended)

#### Method 1: Via v0.dev

1. Open the project in v0.dev
2. Click "Publish" in the top right corner
3. Follow the prompts to deploy

#### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Method 3: Via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

### Environment Variables

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
multi-agent-dashboard/
├── app/
│   ├── api/
│   │   ├── market/
│   │   │   └── [ticker]/
│   │   │       └── route.ts      # Agent 1: Market data API
│   │   ├── portfolio/
│   │   │   └── route.ts          # Agent 3: Portfolio API
│   │   └── fundamentals/
│   │       └── [ticker]/
│   │           └── route.ts      # Agent 4: Fundamentals API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── agents/
│   │   ├── orchestrator-dashboard.tsx  # Main orchestrator
│   │   ├── agent-1-market-chart.tsx    # Live market charts
│   │   ├── agent-2-navigation.tsx      # Navigation filters
│   │   ├── agent-3-portfolio.tsx       # Portfolio manager
│   │   ��── agent-4-fundamentals.tsx    # Fundamental analysis
│   └── ui/                             # shadcn/ui components
├── lib/
│   └── agents/
│       ├── types.ts                    # TypeScript interfaces
│       ├── orchestrator-store.ts       # Zustand state store
│       └── ticker-data.ts              # Ticker configuration
├── data/                               # Excel data files
│   ├── Portfolio.xlsx
│   └── CompanyData.xlsx
├── scripts/
│   └── create-sample-data.ts           # Data generation script
├── package.json
└── README.md
```

---

## API Reference

### GET /api/market/[ticker]

Fetches live market data for a ticker.

**Parameters:**
- `ticker` (path): Stock/forex/crypto symbol (e.g., "AAPL", "EURUSD=X")

**Response:**
```json
{
  "ticker": "AAPL",
  "data": [
    {
      "date": "2024-03-15T14:00:00.000Z",
      "open": 178.50,
      "high": 179.20,
      "low": 178.10,
      "close": 178.90,
      "volume": 45000000
    }
  ],
  "source": "yahoo",
  "meta": {
    "currency": "USD",
    "exchangeName": "NASDAQ"
  }
}
```

### GET /api/portfolio

Fetches user portfolio holdings.

**Query Parameters:**
- `ticker` (optional): Filter by specific ticker

**Response:**
```json
{
  "holdings": [
    {
      "ticker": "AAPL",
      "shares": 50,
      "buyPrice": 165.25,
      "buyDate": "2024-01-15"
    }
  ],
  "source": "excel"
}
```

### GET /api/fundamentals/[ticker]

Fetches company fundamental data.

**Parameters:**
- `ticker` (path): Stock symbol

**Response:**
```json
{
  "company": {
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "description": "...",
    "rating": "A+",
    "sector": "Technology",
    "historicalTrend": [
      { "year": 2023, "revenue": "$383.3B", "growth": "-2.8%" }
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
