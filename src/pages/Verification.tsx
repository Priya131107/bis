import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Disclaimer, DemoTag } from '../components/shared/Disclaimer';

type VerifyState = 'idle' | 'loading' | 'verified' | 'failed';

const VERIFIED_RESULT = {
  identifier: '',
  productName: 'Aqua-Warm 15L Electric Water Heater',
  manufacturer: 'HeatTech Industries Pvt Ltd, Jaipur',
  standard: 'IS 302-2-201',
  licenceNumber: 'CM/L-7654321',
  validUpto: '2027-03-31',
  status: 'Valid',
};

const FAILED_RESULT = {
  identifier: '',
  reason: "We couldn't verify this identifier in the demo database. The mark may be counterfeit, the licence may have expired, or the identifier may have been entered incorrectly.",
};

export const Verification: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setVerifyState('loading');

    // Simulate animated sequence
    setTimeout(() => {
      // IDs starting with 'BIS' → verified, anything else → failed
      const success = identifier.trim().toUpperCase().startsWith('BIS') || identifier.trim() === 'CM/L-7654321';
      setVerifyState(success ? 'verified' : 'failed');
    }, 2800);
  };

  const STEPS = [
    'Checking identifier format…',
    'Matching BIS licence records…',
    'Verifying certification status…',
    'Preparing result…',
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>
          Product Verification
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Verify if a product holds a genuine BIS certification or ISI mark.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleVerify} className="card p-5 space-y-4">
        <div>
          <label htmlFor="bis-identifier" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
            BIS Licence / CM/L Number or ISI Mark ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-secondary)' }} />
              <input
                id="bis-identifier"
                type="text"
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setVerifyState('idle'); }}
                placeholder="e.g. BIS-CM-7654321 or CM/L-7654321"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                aria-label="Enter BIS licence number"
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={verifyState === 'loading' || !identifier.trim()}
            >
              Verify
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            <strong>Demo tip:</strong> IDs starting with "BIS" or "CM/L-7654321" return a verified result. Any other value returns "Unable to verify."
          </p>
        </div>
      </form>

      {/* Animated checking steps */}
      {verifyState === 'loading' && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Loader size={15} className="animate-spin" style={{ color: 'var(--color-blue)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Checking identifier…</span>
          </div>
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse"
                style={{ backgroundColor: 'rgba(23,105,170,0.12)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-blue)' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)', animationDelay: `${i * 200}ms` }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* VERIFIED result */}
      {verifyState === 'verified' && (
        <div className="space-y-4">
          <div
            className="card p-5 border-l-4"
            style={{ borderLeftColor: 'var(--color-success)' }}
            role="status"
            aria-label="Verification result: Verified"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(35,134,54,0.12)' }}>
                <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>VERIFIED</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Identifier: {identifier}</p>
                  <DemoTag />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
              {[
                { label: 'Product', value: VERIFIED_RESULT.productName },
                { label: 'Manufacturer', value: VERIFIED_RESULT.manufacturer },
                { label: 'Applicable Standard', value: VERIFIED_RESULT.standard },
                { label: 'Licence Number', value: VERIFIED_RESULT.licenceNumber },
                { label: 'Valid Upto', value: new Date(VERIFIED_RESULT.validUpto).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Status', value: VERIFIED_RESULT.status },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
                  <p style={{ color: 'var(--color-text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
          <Disclaimer type="verification" />
        </div>
      )}

      {/* FAILED result */}
      {verifyState === 'failed' && (
        <div className="space-y-4">
          <div
            className="card p-5 border-l-4"
            style={{ borderLeftColor: 'var(--color-error)' }}
            role="status"
            aria-label="Verification result: Unable to verify"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(192,57,43,0.1)' }}>
                <XCircle size={20} style={{ color: 'var(--color-error)' }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: 'var(--color-error)' }}>Unable to Verify</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Identifier: {identifier}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-primary)' }}>
              {FAILED_RESULT.reason}
            </p>
            <div className="flex gap-2">
              <button onClick={() => { setIdentifier(''); setVerifyState('idle'); }} className="btn-primary text-sm">
                Try another identifier
              </button>
              <button onClick={() => window.open('https://www.bis.gov.in', '_blank', 'noopener')} className="btn-secondary text-sm">
                Check BIS website
              </button>
            </div>
          </div>
          <Disclaimer type="verification" />
        </div>
      )}
    </div>
  );
};
