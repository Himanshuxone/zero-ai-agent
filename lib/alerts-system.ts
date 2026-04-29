'use client';

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AlertCircle, TrendingUp, TrendingDown, Bell } from 'lucide-react';

export interface Alert {
  id: string;
  type: 'price' | 'plChange' | 'anomaly' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  ticker?: string;
}

// Create a hook for alert management
export function useAlerts() {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  const addAlert = React.useCallback((alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: Alert = {
      ...alert,
      id,
      timestamp: new Date(),
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 10));

    // Show toast notification
    const icon = alert.type === 'anomaly' ? <AlertCircle className="w-5 h-5" /> :
                 alert.type === 'price' ? <TrendingUp className="w-5 h-5" /> :
                 alert.type === 'plChange' ? <TrendingDown className="w-5 h-5" /> :
                 <Bell className="w-5 h-5" />;

    toast.custom((t) => (
      <div className="flex gap-3 rounded-lg bg-card border border-border p-4 shadow-lg">
        <div className="text-primary">{icon}</div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">{alert.title}</p>
          <p className="text-xs text-muted-foreground">{alert.message}</p>
        </div>
      </div>
    ));

    return id;
  }, []);

  const removeAlert = React.useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setAlerts([]);
  }, []);

  return { alerts, addAlert, removeAlert, clearAll };
}

// Alert display component
export function AlertCenter({ alerts, onRemove }: { alerts: Alert[]; onRemove: (id: string) => void }) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="animate-slide-in rounded-lg bg-card border border-border p-3 shadow-lg"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                {alert.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => onRemove(alert.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AlertToaster() {
  return <Toaster position="top-right" />;
}

// Price alert checker
export function createPriceAlert(ticker: string, price: number, alertPrice: number, type: 'above' | 'below') {
  const shouldTrigger = type === 'above' ? price >= alertPrice : price <= alertPrice;
  
  if (shouldTrigger) {
    return {
      type: 'price' as const,
      title: `Price Alert: ${ticker}`,
      message: `${ticker} has ${type === 'above' ? 'risen to' : 'fallen to'} $${price.toFixed(2)}`,
      ticker,
    };
  }
  return null;
}

// P&L change alert
export function createPLAlert(ticker: string, currentPL: number, previousPL: number) {
  const change = currentPL - previousPL;
  const threshold = 100; // Alert if change > $100

  if (Math.abs(change) > threshold) {
    return {
      type: 'plChange' as const,
      title: `P&L Change: ${ticker}`,
      message: `P&L ${change > 0 ? 'increased' : 'decreased'} by $${Math.abs(change).toFixed(2)}`,
      ticker,
    };
  }
  return null;
}

// Anomaly detection (large price move)
export function detectAnomaly(ticker: string, changePercent: number) {
  const threshold = 5; // Alert if move > 5%

  if (Math.abs(changePercent) > threshold) {
    return {
      type: 'anomaly' as const,
      title: `Market Anomaly: ${ticker}`,
      message: `Unusual movement detected: ${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
      ticker,
    };
  }
  return null;
}
