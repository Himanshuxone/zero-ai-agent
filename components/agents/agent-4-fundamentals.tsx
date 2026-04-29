"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrchestratorStore } from "@/lib/agents/orchestrator-store";

// Agent 4: Fundamental Analyst
// Displays company information and historical trends

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Company not found");
    return res.json();
  });

export function Agent4Fundamentals() {
  const {
    selectedTicker,
    setCompanyInfo,
    setFundamentalLoading,
    setFundamentalError,
  } = useOrchestratorStore();

  const { data, error, isLoading } = useSWR(
    selectedTicker
      ? `/api/fundamentals/${encodeURIComponent(selectedTicker)}`
      : null,
    fetcher
  );

  useEffect(() => {
    setFundamentalLoading(isLoading);
    if (error) {
      setFundamentalError(error.message);
      setCompanyInfo(null);
    } else if (data?.company) {
      setCompanyInfo(data.company);
      setFundamentalError(null);
    }
  }, [data, error, isLoading, setCompanyInfo, setFundamentalLoading, setFundamentalError]);

  if (!selectedTicker) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-chart-4" />
            Agent 4: Fundamental Analyst
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a ticker to view fundamental analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-chart-4" />
            Agent 4: Fundamental Analyst
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.company) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-chart-4" />
            Agent 4: Fundamental Analyst
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No fundamental data available for{" "}
              <span className="font-mono font-medium">{selectedTicker}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const company = data.company;

  const getRatingColor = (rating: string) => {
    if (rating.startsWith("A")) return "bg-chart-2 text-chart-2-foreground";
    if (rating.startsWith("B")) return "bg-chart-4 text-chart-4-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-chart-4" />
            Agent 4: Fundamental Analyst
          </CardTitle>
          {data?.source === "mock" && (
            <Badge variant="secondary" className="text-xs">
              Demo Data
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline">{company.sector}</Badge>
              <Badge className={getRatingColor(company.rating)}>
                Rating: {company.rating}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {company.description}
          </p>
        </div>

        {/* Historical Trend */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Historical Performance</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.historicalTrend.map(
                (trend: { year: number; revenue: string; growth: string }) => (
                  <TableRow key={trend.year}>
                    <TableCell className="font-medium">{trend.year}</TableCell>
                    <TableCell>{trend.revenue}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          trend.growth.startsWith("+") ||
                          (!trend.growth.startsWith("-") &&
                            trend.growth !== "N/A")
                            ? "text-chart-2"
                            : trend.growth.startsWith("-")
                              ? "text-destructive"
                              : ""
                        }
                      >
                        {trend.growth}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Analysis Summary */}
        <div className="rounded-lg border p-3">
          <h4 className="text-sm font-medium">Analysis Summary</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {company.rating.startsWith("A")
              ? "Strong fundamentals with consistent growth trajectory. Recommended for long-term investors."
              : company.rating.startsWith("B")
                ? "Solid fundamentals with moderate growth potential. Suitable for balanced portfolios."
                : "Mixed fundamentals. Exercise caution and conduct further research."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
