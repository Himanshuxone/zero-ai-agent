"use client";

import { Agent1MarketChart } from "./agent-1-market-chart";
import { Agent2Navigation } from "./agent-2-navigation";
import { Agent3Portfolio } from "./agent-3-portfolio";
import { Agent4Fundamentals } from "./agent-4-fundamentals";
import { useOrchestratorStore } from "@/lib/agents/orchestrator-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Orchestrator: The "Dashboard Master"
// Coordinates all 4 agents and provides unified layout

export function OrchestratorDashboard() {
  const {
    selectedTicker,
    marketLoading,
    portfolioLoading,
    fundamentalLoading,
  } = useOrchestratorStore();

  const agentStatuses = [
    { name: "Market", active: !!selectedTicker, loading: marketLoading },
    { name: "Navigation", active: true, loading: false },
    { name: "Portfolio", active: !!selectedTicker, loading: portfolioLoading },
    { name: "Fundamentals", active: !!selectedTicker, loading: fundamentalLoading },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Multi-Agent Investment Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Real-time market data powered by 4-agent swarm
              </p>
            </div>
          </div>

          {/* Agent Status Indicators */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Agents:</span>
            {agentStatuses.map((agent) => (
              <Badge
                key={agent.name}
                variant={agent.active ? "default" : "secondary"}
                className={`text-xs ${agent.loading ? "animate-pulse" : ""}`}
              >
                <span
                  className={`mr-1 h-1.5 w-1.5 rounded-full ${
                    agent.loading
                      ? "bg-chart-4"
                      : agent.active
                        ? "bg-chart-2"
                        : "bg-muted-foreground"
                  }`}
                />
                {agent.name}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="mx-auto max-w-screen-2xl p-4">
        {/* Orchestrator Status Card */}
        <Card className="mb-4">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                O
              </span>
              Orchestrator: Dashboard Master
              <Badge variant="outline" className="ml-2">
                {selectedTicker ? "Active" : "Awaiting Selection"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-sm text-muted-foreground">
              {selectedTicker
                ? `Coordinating agents for ${selectedTicker}. All agents are fetching and processing data in parallel.`
                : "Select a ticker using Agent 2 (Navigation) to activate all agents and view real-time data."}
            </p>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left Column: Navigation */}
          <div className="lg:col-span-3">
            <Agent2Navigation />
          </div>

          {/* Center Column: Market Chart */}
          <div className="lg:col-span-6">
            <Agent1MarketChart />
          </div>

          {/* Right Column: Portfolio */}
          <div className="lg:col-span-3">
            <Agent3Portfolio />
          </div>

          {/* Bottom Row: Fundamentals */}
          <div className="lg:col-span-12">
            <Agent4Fundamentals />
          </div>
        </div>

        {/* Architecture Info */}
        <div className="mt-6 rounded-lg border bg-muted/30 p-4">
          <h3 className="text-sm font-medium">Multi-Agent Architecture</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-md border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  O
                </span>
                <span className="text-xs font-medium">Orchestrator</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Coordinates all agents and manages global state
              </p>
            </div>
            <div className="rounded-md border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-1" />
                <span className="text-xs font-medium">Agent 1</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Live Market Specialist - Fetches real-time data
              </p>
            </div>
            <div className="rounded-md border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-2" />
                <span className="text-xs font-medium">Agent 2</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Navigation Agent - Handles UI and filtering
              </p>
            </div>
            <div className="rounded-md border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-3" />
                <span className="text-xs font-medium">Agent 3</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Portfolio Manager - Reads holdings from Excel
              </p>
            </div>
            <div className="rounded-md border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-4" />
                <span className="text-xs font-medium">Agent 4</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Fundamental Analyst - Company data from Excel
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t py-4">
        <div className="mx-auto max-w-screen-2xl px-4 text-center text-xs text-muted-foreground">
          Multi-Agent Investment Dashboard | Built with Next.js, Zustand, and SWR |
          Data sources: Yahoo Finance API (live), Excel files (portfolio/fundamentals)
        </div>
      </footer>
    </div>
  );
}
