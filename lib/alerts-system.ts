import React from 'react';

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

// Helper to get alert icon type
export function getAlertIconType(alertType: Alert['type']): 'anomaly' | 'price' | 'plChange' | 'info' {
  return alertType;
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
