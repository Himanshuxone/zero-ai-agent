"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Palette, Check } from "lucide-react";

const themes = [
  {
    value: "light" as const,
    label: "Light",
    description: "Clean white theme",
    icon: Sun,
    color: "bg-white border border-border",
  },
  {
    value: "dark" as const,
    label: "Dark",
    description: "Professional black",
    icon: Moon,
    color: "bg-zinc-900",
  },
  {
    value: "blue" as const,
    label: "Vanguard Blue",
    description: "Premium blue theme",
    icon: Palette,
    color: "bg-blue-900",
  },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = themes.find((t) => t.value === (theme || resolvedTheme)) || themes[0];
  const Icon = currentTheme.icon;

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="gap-2 border-border bg-card">
        <Sun className="h-4 w-4" />
        <span className="hidden sm:inline">Theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border bg-card hover:bg-secondary"
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentTheme.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((t) => {
          const ThemeIcon = t.icon;
          return (
            <DropdownMenuItem
              key={t.value}
              onClick={() => setTheme(t.value)}
              className="flex cursor-pointer items-center gap-3 py-3"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md ${t.color}`}
              >
                <ThemeIcon
                  className={`h-4 w-4 ${
                    t.value === "light" ? "text-zinc-700" : "text-white"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
              {theme === t.value && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
