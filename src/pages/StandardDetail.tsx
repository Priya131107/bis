import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, CheckSquare, BookOpen, ExternalLink, Calendar, CheckCircle, X } from 'lucide-react';
import { getStandardById } from '../data/standards';
import { useAppStore } from '../store/useAppStore';
import { DemoTag } from '../components/shared/Disclaimer';
import { SkeletonCard } from '../components/shared/Skeleton';
import { ErrorState } from '../components/shared/States';

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--color-success)',
  draft: 'var(--color-warning)',
  withdrawn: 'var(--color-error)',
  amended: 'var(--color-warning)',
};

export const StandardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { saveItem, isItemSaved, addChecklistItem } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [showSimplified, setShowSimplified] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [id]);

  const std = id ? getStandardById(id) : undefined;
  const saved = std ? isItemSaved(std.id) : false;

  if (loading) return (
    <div className="space-y-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );

  if (!std) return (
    <ErrorState
      title="Standard not found"
      message="We couldn't find this standard in the demo database."
      onGoBack={() => navigate('/standards')}
    />
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button onClick={() => navigate('/standards')} className="btn-ghost gap-1 -ml-2">
        <ArrowLeft size={15} />
        Back to Standards Explorer
      </button>

      {/* Header */}
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-blue)' }}>{std.number}</span>
              <DemoTag />
              <span
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{ backgroundColor: `${STATUS_COLORS[std.status]}18`, color: STATUS_COLORS[std.status] }}
              >
                {std.status.charAt(0).toUpperCase() + std.status.slice(1)}
              </span>
              {std.mandatory && (
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: 'var(--color-error)' }}>
                  Mandatory
                </span>
              )}
            </div>
            <h1 className="text-xl font-heading font-semibold" style={{ color: 'var(--color-navy)' }}>{std.title}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => saveItem({ type: 'standard', referenceId: std.id, label: `${std.number} — ${std.title}` })}
              className={`btn-secondary gap-2 text-sm ${saved ? 'border-green-300' : ''}`}
              disabled={saved}
              style={saved ? { color: 'var(--color-success)', borderColor: 'var(--color-success)' } : {}}
              aria-label={saved ? 'Already saved' : 'Save this standard'}
            >
              <Bookmark size={14} />
              {saved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-sm border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Sector</p>
            <p style={{ color: 'var(--color-text-primary)' }}>{std.sector}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Category</p>
            <p style={{ color: 'var(--color-text-primary)' }}>{std.category}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Last Updated</p>
            <p className="flex items-center gap-1.5" style={{ color: 'var(--color-text-primary)' }}>
              <Calendar size={13} />
              {new Date(std.lastUpdated).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scope */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Scope &amp; Applicability</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{std.scope}</p>
            <div className="text-xs px-3 py-2 rounded" style={{ backgroundColor: 'rgba(23,105,170,0.06)', color: 'var(--color-blue)' }}>
              <strong>Applies to:</strong> {std.applicability}
            </div>
          </div>

          {/* Key requirements */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Key Requirements</h2>
            <ul className="space-y-2">
              {std.keyRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testing requirements */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Testing Requirements</h2>
            <ul className="space-y-1.5">
              {std.testingRequirements.map((test, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: 'rgba(23,105,170,0.1)', color: 'var(--color-blue)' }}>{i + 1}</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{test}</span>
                  <button
                    onClick={() => addChecklistItem({ label: test, standardId: std.id })}
                    className="ml-auto btn-ghost py-0.5 px-1.5 text-xs"
                    aria-label={`Add "${test}" to checklist`}
                    title="Add to checklist"
                  >
                    <CheckSquare size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Documentation */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Required Documentation</h2>
            <ul className="space-y-1.5">
              {std.documentation.map((doc, i) => (
                <li key={i} className="text-sm flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-saffron)' }} />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Amendments */}
          {std.amendments.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Amendments</h2>
              <div className="space-y-3">
                {std.amendments.map((am, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="text-xs font-mono mt-0.5 whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>
                      {new Date(am.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{am.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="space-y-3">
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Actions</h3>
            <button
              onClick={() => setShowSimplified(true)}
              className="btn-secondary w-full gap-2 justify-start text-sm"
            >
              <BookOpen size={14} />
              Explain this standard simply
            </button>
            <button
              onClick={() => navigate(`/compliance?standard=${std.id}`)}
              className="btn-primary w-full gap-2 justify-start text-sm"
            >
              <ExternalLink size={14} />
              Check applicability to my product
            </button>
            <button
              onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Tell me about ${std.number}`)}`)}
              className="btn-ghost w-full gap-2 justify-start text-sm"
            >
              Ask AI about this standard →
            </button>
          </div>

          {std.relatedStandardIds.length > 0 && (
            <div className="card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>Related Standards</h3>
              <div className="space-y-1">
                {std.relatedStandardIds.map((rid) => {
                  const rel = getStandardById(rid);
                  return rel ? (
                    <button
                      key={rid}
                      onClick={() => navigate(`/standards/${rid}`)}
                      className="w-full text-left text-xs py-1.5 px-2 rounded hover:bg-gray-50 transition-colors"
                      style={{ color: 'var(--color-blue)' }}
                    >
                      {rel.number} — {rel.title.slice(0, 50)}…
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simplified explanation modal */}
      {showSimplified && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-label="Simplified explanation"
        >
          <div className="card max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: 'var(--color-navy)' }}>
                {std.number} — In Plain Terms
              </h2>
              <button onClick={() => setShowSimplified(false)} aria-label="Close" className="btn-ghost p-1">
                <X size={16} />
              </button>
            </div>
            <DemoTag />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
              <strong>{std.number}</strong> is the Indian Standard for {std.title.toLowerCase()}. 
              It applies to {std.applicability.toLowerCase()}.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
              In simple terms, this standard sets out the safety rules and minimum quality requirements that a product must meet.
              {std.mandatory
                ? ' This certification is <strong>mandatory</strong> — you cannot legally sell this product in India without the BIS ISI mark.'
                : ' This certification is voluntary, but obtaining it can increase market trust.'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
              Key things you need to do: {std.keyRequirements.slice(0, 3).join('; ').toLowerCase()}, and get the product tested at a BIS-recognised lab.
            </p>
            <button onClick={() => setShowSimplified(false)} className="btn-primary w-full">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};
