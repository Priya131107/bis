import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
      style={{ backgroundColor: 'rgba(242,140,40,0.12)' }}
    >
      <Construction size={22} style={{ color: 'var(--color-saffron)' }} />
    </div>
    <h1 className="text-xl font-heading font-semibold mb-2" style={{ color: 'var(--color-navy)' }}>
      {title}
    </h1>
    <p className="text-sm max-w-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
      {description}
    </p>
    <span
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
      style={{ backgroundColor: 'rgba(242,140,40,0.12)', color: '#92580A', border: '1px solid rgba(242,140,40,0.3)' }}
    >
      Coming in next release
    </span>
  </div>
);

export const StandardsGraph: React.FC = () => (
  <ComingSoon
    title="Standards Graph"
    description="An interactive node graph visualising the relationships between products, standards, testing requirements, certification paths, documents, and BIS services."
  />
);

export const Settings: React.FC = () => (
  <div className="max-w-xl space-y-6">
    <h1 className="text-2xl font-heading font-semibold" style={{ color: 'var(--color-navy)' }}>Settings</h1>
    <div className="card p-5 space-y-4">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Display Mode</p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Switch between Industry/MSME and Consumer mode using the toggle in the top navigation bar.</p>
      </div>
      <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Data &amp; Privacy</p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>BISense is a prototype. No personal data is transmitted. All state is stored locally in your browser.</p>
      </div>
      <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Version</p>
        <p className="text-sm font-mono" style={{ color: 'var(--color-text-secondary)' }}>BISense v1.0.0 — SIH 2026 Prototype</p>
      </div>
    </div>
  </div>
);

export const Help: React.FC = () => (
  <div className="max-w-2xl space-y-6">
    <h1 className="text-2xl font-heading font-semibold" style={{ color: 'var(--color-navy)' }}>Help &amp; Documentation</h1>
    <div className="space-y-3">
      {[
        { q: 'What is BISense?', a: 'BISense is an AI-assisted interface prototype for navigating Indian Standards (BIS) requirements. It is designed for both industry users seeking certification guidance and consumers seeking safety information.' },
        { q: 'Is this connected to the real BIS database?', a: 'No. This is a prototype with illustrative demo data. All standards, services, and verifications shown are for demonstration purposes only. Always verify against official BIS channels.' },
        { q: 'What is the Demo Journey?', a: 'The Demo Journey is a pre-built walkthrough of the BIS certification process for a domestic electric water heater manufactured in Rajasthan. It illustrates all stages from product identification to post-certification compliance.' },
        { q: 'How do I switch between Industry and Consumer modes?', a: 'Use the mode toggle in the top navigation bar. Industry mode is for manufacturers and importers seeking BIS certification. Consumer mode is for end-users verifying product safety.' },
        { q: 'Where can I find official BIS information?', a: 'Visit www.bis.gov.in for official standards, certification status, and regulatory information. The Manak Online portal (manakonline.in) is used for certification applications.' },
      ].map(({ q, a }) => (
        <div key={q} className="card p-4">
          <p className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>{q}</p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{a}</p>
        </div>
      ))}
    </div>
  </div>
);
