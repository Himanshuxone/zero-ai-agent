"use client";

import { Agent1MarketChart } from "./agent-1-market-chart";
import { Agent2Navigation } from "./agent-2-navigation";
import { Agent3Portfolio } from "./agent-3-portfolio";
import { Agent4Fundamentals } from "./agent-4-fundamentals";
import { useOrchestratorStore } from "@/lib/agents/orchestrator-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp, BarChart3, Briefcase, LineChart, Zap } from "lucide-react";
import { motion } from "framer-motion";

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
    { name: "Market", active: !!selectedTicker, loading: marketLoading, icon: TrendingUp },
    { name: "Navigation", active: true, loading: false, icon: BarChart3 },
    { name: "Portfolio", active: !!selectedTicker, loading: portfolioLoading, icon: Briefcase },
    { name: "Fundamentals", active: !!selectedTicker, loading: fundamentalLoading, icon: LineChart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg"
            >
              <Zap className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Zero AI Agent</h1>
              <p className="text-xs text-muted-foreground">
                Multi-Agent Investment Dashboard
              </p>
            </div>
          </motion.div>

          {/* Agent Status Indicators */}
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-xs font-medium text-muted-foreground">Agents:</span>
            {agentStatuses.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Badge
                    variant={agent.active ? "default" : "secondary"}
                    className={`gap-1.5 px-3 py-1 text-xs font-medium ${agent.loading ? "animate-pulse" : ""}`}
                  >
                    <Icon className="h-3 w-3" />
                    <motion.span
                      className={`h-1.5 w-1.5 rounded-full ${
                        agent.loading
                          ? "bg-warning"
                          : agent.active
                            ? "bg-success"
                            : "bg-muted-foreground"
                      }`}
                      animate={agent.active ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    {agent.name}
                  </Badge>
                </motion.div>
              );
            })}
          </div>

          {/* Theme Toggle & Grafana Link */}
          <div className="flex items-center gap-3">
            <a
              href="/grafana"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg bg-primary/10 hover:bg-primary/20 px-3 py-2"
            >
              Grafana Dashboard
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="mx-auto max-w-screen-2xl p-4 lg:p-6">
        {/* Orchestrator Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5 py-4">
              <CardTitle className="flex items-center gap-3 text-base">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground shadow-md"
                >
                  O
                </motion.span>
                <span className="font-semibold">Orchestrator: Dashboard Master</span>
                <Badge variant="outline" className="ml-auto border-primary/30 bg-primary/5">
                  {selectedTicker ? "Active" : "Awaiting Selection"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedTicker
                  ? `Coordinating agents for ${selectedTicker}. All agents are fetching and processing data in parallel.`
                  : "Select a ticker using Agent 2 (Navigation) to activate all agents and view real-time data."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
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
        <div className="mt-8 rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground">Multi-Agent Architecture</h3>
          <p className="mt-1 text-xs text-muted-foreground">Powered by a coordinated swarm of specialized AI agents</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { id: "O", name: "Orchestrator", desc: "Coordinates all agents and manages global state", color: "from-primary to-accent" },
              { id: "1", name: "Agent 1", desc: "Live Market Specialist - Fetches real-time data", color: "from-chart-1 to-chart-1/70" },
              { id: "2", name: "Agent 2", desc: "Navigation Agent - Handles UI and filtering", color: "from-chart-2 to-chart-2/70" },
              { id: "3", name: "Agent 3", desc: "Portfolio Manager - Reads holdings from Excel", color: "from-chart-3 to-chart-3/70" },
              { id: "4", name: "Agent 4", desc: "Fundamental Analyst - Company data analysis", color: "from-chart-4 to-chart-4/70" },
            ].map((agent) => (
              <div key={agent.id} className="rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${agent.color} text-xs font-bold text-white shadow-sm`}>
                    {agent.id}
                  </span>
                  <span className="text-xs font-semibold">{agent.name}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-border/50 bg-card/30 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-screen-2xl px-4 text-center">
          <p className="text-xs font-medium text-foreground">Zero AI Agent - Multi-Agent Investment Dashboard</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Built with Next.js, Zustand, and SWR | Data: Yahoo Finance API, Excel
          </p>
        </div>
      </footer>
    </div>
  );
}
