import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DisclaimerProps {
  type: 'copilot' | 'document' | 'verification' | 'footer';
  className?: string;
}

const DISCLAIMER_TEXT: Record<DisclaimerProps['type'], string> = {
  copilot:
    'AI-assisted guidance — verify requirements against current official BIS information before submission.',
  document:
    'Demo analysis — no OCR/AI processing has occurred on this file.',
  verification:
    'Demo verification — connected BIS API required for live verification.',
  footer:
    'This prototype demonstrates an AI-assisted interface concept. Official BIS requirements and decisions should be verified through authoritative BIS channels.',
};

export const Disclaimer: React.FC<DisclaimerProps> = ({ type, className = '' }) => {
  const Icon = type === 'footer' ? Info : AlertTriangle;
  return (
    <div className={`disclaimer ${className}`} role="note">
      <Icon className="flex-shrink-0 mt-0.5" size={14} />
      <span>{DISCLAIMER_TEXT[type]}</span>
    </div>
  );
};

export const DemoTag: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`tag-demo ${className}`} title="This is illustrative demo data">
    Demo data
  </span>
);
