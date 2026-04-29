'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DashboardPanelProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
}

export function DashboardPanel({ id, title, children, className = '', onRemove }: DashboardPanelProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-lg border border-border bg-card p-4 shadow-md transition-all ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {isHovered && onRemove && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onRemove}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            ✕
          </motion.button>
        )}
      </div>
      <div className="overflow-auto">
        {children}
      </div>
    </motion.div>
  );
}

interface MetricGaugeProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  changePercent?: number;
}

export function MetricGauge({ label, value, unit = '', trend, changePercent }: MetricGaugeProps) {
  const trendColor =
    trend === 'up' ? 'text-green-500' :
    trend === 'down' ? 'text-red-500' :
    'text-muted-foreground';

  return (
    <div className="rounded-lg bg-background/50 p-3 border border-border/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-bold text-foreground">
          {value}{unit}
        </p>
        {changePercent !== undefined && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-xs font-semibold ${trendColor}`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(changePercent).toFixed(2)}%
          </motion.span>
        )}
      </div>
    </div>
  );
}

interface TimeSeriesChartProps {
  data: Array<{ timestamp: number; value: number }>;
  title?: string;
  height?: number;
}

export function TimeSeriesChart({ data, title, height = 200 }: TimeSeriesChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  return (
    <div style={{ height }}>
      <svg width="100%" height={height} className="text-muted-foreground">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`grid-${i}`}
            x1="0"
            y1={(height / 4) * i}
            x2="100%"
            y2={(height / 4) * i}
            stroke="currentColor"
            strokeDasharray="4"
            opacity="0.1"
          />
        ))}
        
        {/* Data path */}
        {data.length > 1 && (
          <motion.polyline
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = height - ((d.value - minValue) / range) * height;
              return `${x}%,${y}`;
            }).join(' ')}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
        )}

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

interface PieChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
}

export function PieChart({ data, size = 200 }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -Math.PI / 2;

  const slices = data.map((d) => {
    const sliceAngle = (d.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = Math.cos(startAngle);
    const y1 = Math.sin(startAngle);
    const x2 = Math.cos(endAngle);
    const y2 = Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const pathData = [
      `M 0 0`,
      `L ${x1 * (size / 2)} ${y1 * (size / 2)}`,
      `A ${size / 2} ${size / 2} 0 ${largeArc} 1 ${x2 * (size / 2)} ${y2 * (size / 2)}`,
      'Z',
    ].join(' ');

    currentAngle = endAngle;
    return { pathData, color: d.color, label: d.label, percent: ((d.value / total) * 100).toFixed(1) };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`-${size / 2} -${size / 2} ${size} ${size}`}>
        {slices.map((slice, i) => (
          <motion.path
            key={i}
            d={slice.pathData}
            fill={slice.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.label}: {slices[i]?.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
