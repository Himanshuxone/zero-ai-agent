'use client';

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AlertCircle, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { Alert } from '@/lib/alerts-system';

// Alert display component
export function AlertCenter({ alerts, onRemove }: { alerts: Alert[]; onRemove: (id: string) => void }) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {alerts.map(alert => {
        const Icon =
          alert.type === 'anomaly'
            ? AlertCircle
            : alert.type === 'price'
              ? TrendingUp
              : alert.type === 'plChange'
                ? TrendingDown
                : Bell;

        return (
          <div
            key={alert.id}
            className="animate-slide-in rounded-lg bg-card border border-border p-3 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove(alert.id)}
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AlertToaster() {
  return <Toaster position="top-right" />;
}

// Show toast notification when alerts are triggered
export function showAlertToast(alert: Alert) {
  const Icon =
    alert.type === 'anomaly'
      ? AlertCircle
      : alert.type === 'price'
        ? TrendingUp
        : alert.type === 'plChange'
          ? TrendingDown
          : Bell;

  toast.custom((t) => (
    <div className="flex gap-3 rounded-lg bg-card border border-border p-4 shadow-lg">
      <div className="text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-foreground">{alert.title}</p>
        <p className="text-xs text-muted-foreground">{alert.message}</p>
      </div>
    </div>
  ));
}
