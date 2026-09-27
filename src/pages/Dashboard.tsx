import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, TrendingUp, FileCheck, AlertTriangle, Zap, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { DemoTag } from '../components/shared/Disclaimer';

const INDUSTRY_PLACEHOLDERS = [
  'What Indian Standards apply to my electric water heater?',
  'How do I get BIS ISI certification for my MSME product?',
  'What tests are required for IS 302-2-201 certification?',
  'Which BIS lab can test my product in Rajasthan?',
  'What documents do I need for factory inspection?',
];

const CONSUMER_PLACEHOLDERS = [
  'How do I check if a product has a genuine BIS mark?',
  'Is this toy safe for my child under 3 years?',
  'What does the ISI mark on packaged water mean?',
  'How do I report a substandard product to BIS?',
  'Which helmets meet Indian safety standards?',
];

const INDUSTRY_STATS = [
  { label: 'Active Indian Standards', value: '22,000+', trend: '+340 this year', icon: FileCheck, color: 'var(--color-blue)' },
  { label: 'BIS Certified Products', value: '1.4 Lakh', trend: 'in database', icon: TrendingUp, color: 'var(--color-success)' },
  { label: 'Pending Certification Queries', value: '3', trend: 'in your account', icon: AlertTriangle, color: 'var(--color-warning)' },
  { label: 'Applicable Standards Found', value: '12', trend: 'for saved items', icon: Zap, color: 'var(--color-saffron)' },
];

const CONSUMER_STATS = [
  { label: 'Active Recalls & Notices', value: '5', trend: 'this month', icon: AlertTriangle, color: 'var(--color-error)' },
  { label: 'Verified Products', value: '2', trend: 'in your history', icon: FileCheck, color: 'var(--color-success)' },
  { label: 'Safety Alerts (30 days)', value: '3', trend: 'new alerts', icon: Zap, color: 'var(--color-warning)' },
  { label: 'Standards You Viewed', value: '4', trend: 'recently', icon: TrendingUp, color: 'var(--color-blue)' },
];

interface QuickAction {
  label: string;
  href: string;
  desc: string;
  demo?: boolean;
}

const QUICK_ACTIONS_INDUSTRY: QuickAction[] = [
  { label: 'Start Compliance Journey', href: '/compliance', desc: 'Map your product to certification stages' },
  { label: 'Find Applicable Standard', href: '/standards', desc: 'Search by product type or HS code' },
  { label: 'Run Demo: Water Heater', href: '/compliance?demo=1', desc: 'See the full certification walkthrough', demo: true },
];

const QUICK_ACTIONS_CONSUMER: QuickAction[] = [
  { label: 'Verify a BIS Mark', href: '/verification', desc: 'Check if a product is genuinely certified' },
  { label: 'View Safety Alerts', href: '/alerts', desc: 'Recalls, notices & safety updates' },
  { label: 'Ask About Product Safety', href: '/assistant', desc: 'Get guidance on any consumer product' },
];

export const Dashboard: React.FC = () => {
  const { mode, startDemoJourney } = useAppStore();
  const navigate = useNavigate();
  const [placeholder, setPlaceholder] = useState(0);
  const [query, setQuery] = useState('');

  const placeholders = mode === 'industry' ? INDUSTRY_PLACEHOLDERS : CONSUMER_PLACEHOLDERS;
  const stats = mode === 'industry' ? INDUSTRY_STATS : CONSUMER_STATS;
  const quickActions = mode === 'industry' ? QUICK_ACTIONS_INDUSTRY : QUICK_ACTIONS_CONSUMER;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((p) => (p + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleDemo = () => {
    startDemoJourney();
    navigate('/compliance?demo=1');
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section aria-labelledby="dashboard-heading">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--color-saffron)' }}>
          INTELLIGENT STANDARDS ASSISTANT
        </p>
        <h1 id="dashboard-heading" className="text-3xl sm:text-4xl font-heading font-semibold mb-2" style={{ color: 'var(--color-navy)' }}>
          {mode === 'industry'
            ? 'Turn Indian Standards into clear actions.'
            : 'Understand. Verify. Stay Safe.'}
        </h1>
        <p className="text-base mb-6 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
          {mode === 'industry'
            ? 'Navigate BIS certification, discover applicable standards, and build compliant products — with AI-guided clarity at every step.'
            : 'Verify product safety marks, understand consumer rights under Indian Standards, and stay informed about recalls and safety notices.'}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            className="btn-primary gap-2"
            onClick={() => navigate('/assistant')}
            id="cta-ask-bisense"
          >
            Ask BISense
            <ArrowRight size={15} />
          </button>
          <button
            className="btn-secondary gap-2"
            onClick={() => navigate('/standards')}
            id="cta-explore-standards"
          >
            Explore Standards
            <ChevronRight size={15} />
          </button>
          {mode === 'industry' && (
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150"
              style={{ backgroundColor: 'rgba(242,140,40,0.12)', color: '#92580A', border: '1px solid rgba(242,140,40,0.3)' }}
              onClick={handleDemo}
              id="demo-journey-btn"
              aria-label="Run Demo Journey: Water Heater Certification"
            >
              <Play size={14} />
              Demo Journey
            </button>
          )}
        </div>

        {/* AI Command Input */}
        <form onSubmit={handleQuerySubmit} className="w-full max-w-2xl">
          <div
            className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-shadow focus-within:shadow-md"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-blue)', boxShadow: '0 0 0 1px rgba(23,105,170,0.15)' }}
          >
            <div className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-navy)', color: 'white' }}>
              Ask
            </div>
            <input
              id="dashboard-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholders[placeholder]}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--color-text-primary)' }}
              aria-label="Ask BISense a question about Indian Standards"
            />
            <button
              type="submit"
              className="btn-primary py-1.5 px-3 text-xs"
              aria-label="Submit query"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Stats */}
      <section aria-label="Quick statistics">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {mode === 'industry' ? 'Your Overview' : 'Safety Dashboard'}
          </h2>
          <DemoTag />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(({ label, value, trend, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                  <Icon size={14} style={{ color }} />
                </div>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{trend}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.demo ? handleDemo : () => navigate(action.href)}
              className="card p-4 text-left hover:border-blue-300 transition-colors group"
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                    {action.label}
                    {action.demo && <span className="ml-2 tag-demo">Demo</span>}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{action.desc}</div>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--color-text-secondary)' }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Interaction model reminder */}
      <section
        className="rounded-lg px-5 py-4 border"
        style={{ backgroundColor: 'rgba(16,42,67,0.03)', borderColor: 'var(--color-border)' }}
        aria-label="Interaction model"
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          How BISense Works
        </p>
        <div className="flex items-center gap-0 flex-wrap">
          {['Ask', 'Understand', 'Verify', 'Act'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--color-navy)', color: 'white' }}
              >
                {step}
              </span>
              {i < arr.length - 1 && (
                <ChevronRight size={16} className="mx-1" style={{ color: 'var(--color-text-secondary)' }} />
              )}
            </React.Fragment>
          ))}
          <span className="ml-4 text-xs hidden sm:inline" style={{ color: 'var(--color-text-secondary)' }}>
            — Your path from question to certified compliance
          </span>
        </div>
      </section>
    </div>
  );
};
