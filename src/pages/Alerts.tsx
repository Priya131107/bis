import React from 'react';
import { Bell, AlertTriangle, Info, RefreshCw, ShieldAlert } from 'lucide-react';
import { consumerAlerts } from '../data/consumerAlerts';
import type { ConsumerAlert } from '../types';
import { DemoTag } from '../components/shared/Disclaimer';

const TYPE_ICONS: Record<ConsumerAlert['type'], React.ReactNode> = {
  recall: <AlertTriangle size={16} />,
  safety: <ShieldAlert size={16} />,
  notice: <Info size={16} />,
  update: <RefreshCw size={16} />,
};

const SEVERITY_COLORS: Record<ConsumerAlert['severity'], string> = {
  high: 'var(--color-error)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
};

const TYPE_LABELS: Record<ConsumerAlert['type'], string> = {
  recall: 'Recall',
  safety: 'Safety Notice',
  notice: 'Regulatory Notice',
  update: 'Standards Update',
};

export const Alerts: React.FC = () => (
  <div className="space-y-6 max-w-3xl">
    <div>
      <h1 className="text-2xl font-heading font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>
        Alerts &amp; Updates
      </h1>
      <p className="text-sm flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
        Recalls, safety notices, and standards updates. <DemoTag />
      </p>
    </div>

    {/* Summary bar */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Recalls', count: consumerAlerts.filter(a => a.type === 'recall').length, color: 'var(--color-error)' },
        { label: 'Safety Notices', count: consumerAlerts.filter(a => a.type === 'safety').length, color: 'var(--color-warning)' },
        { label: 'Updates', count: consumerAlerts.filter(a => a.type === 'update' || a.type === 'notice').length, color: 'var(--color-blue)' },
      ].map(({ label, count, color }) => (
        <div key={label} className="card p-3 text-center">
          <div className="text-xl font-bold" style={{ color }}>{count}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
        </div>
      ))}
    </div>

    {/* Alert cards */}
    <div className="space-y-3">
      {consumerAlerts.map((alert) => {
        const color = SEVERITY_COLORS[alert.severity];
        const Icon = TYPE_ICONS[alert.type];
        return (
          <div
            key={alert.id}
            className="card p-4 border-l-4"
            style={{ borderLeftColor: color }}
            role="article"
            aria-label={alert.title}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}18`, color }}
              >
                {Icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    {TYPE_LABELS[alert.type]}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(alert.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <Bell size={12} style={{ color: 'var(--color-text-secondary)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{alert.issuer}</span>
                </div>
                <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {alert.title}
                </h2>
                <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Product:</strong> {alert.product}
                </p>
                <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {alert.summary}
                </p>
                <div
                  className="text-xs px-3 py-2 rounded font-medium"
                  style={{ backgroundColor: `${color}10`, color }}
                >
                  <strong>Action required:</strong> {alert.actionRequired}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
