import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, ChevronRight, Bookmark, CheckSquare, Bell, ExternalLink } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SkeletonAnswerBlock } from '../components/shared/Skeleton';
import { DemoTag } from '../components/shared/Disclaimer';
import { standards, getStandardById } from '../data/standards';
import type { AssistantAnswer } from '../types';
import { demoAssistantAnswers } from '../data/demoScenario';

// ── Mock answer generation ─────────────────────────────────────────────────────
function buildAnswer(query: string): AssistantAnswer {
  const q = query.toLowerCase();
  if (q.includes('water heater') || q.includes('302') || q.includes('geyser')) {
    return { ...demoAssistantAnswers.classification, query };
  }
  if (q.includes('test') || q.includes('lab')) {
    return { ...demoAssistantAnswers.testing, query };
  }
  // Generic fallback
  const matched = standards.filter((s) =>
    s.title.toLowerCase().split(' ').some((w) => q.includes(w) && w.length > 4)
  ).slice(0, 2);

  return {
    id: `ans-${Date.now()}`,
    query,
    answerText: `Based on your query about **"${query}"**, I have identified relevant Indian Standards and BIS requirements. The applicable standards cover the scope, key requirements, and testing obligations relevant to your product or topic. Please review the matched standards in the Evidence panel on the right for detailed requirements and next steps.`,
    reasoning: `The query was analysed against the BIS standards database. Keywords matched sector and product-category fields in the standards catalogue. Confidence is based on keyword alignment with standard scope and applicability clauses.`,
    matchedStandards: matched.length > 0
      ? matched.map((s, i) => ({ standardId: s.id, confidence: i === 0 ? 'high' : 'possible' }))
      : [{ standardId: 'std-001', confidence: 'possible' }],
    nextSteps: [
      { label: 'Save matched standard', actionType: 'save', payload: matched[0]?.id ?? 'std-001' },
      { label: 'Add to compliance checklist', actionType: 'checklist', payload: query },
      { label: 'Start Compliance Journey', actionType: 'service', payload: '/compliance' },
    ],
  };
}

// ── Streaming hook ─────────────────────────────────────────────────────────────
function useStreamingText(fullText: string, active: boolean) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active) { setDisplayed(fullText); return; }
    setDisplayed('');
    let i = 0;
    const words = fullText.split(' ');
    const interval = setInterval(() => {
      i++;
      setDisplayed(words.slice(0, i).join(' '));
      if (i >= words.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [fullText, active]);
  return displayed;
}

// ── Confidence label ────────────────────────────────────────────────────────────
const ConfidenceBadge: React.FC<{ level: 'high' | 'possible' }> = ({ level }) => (
  <span
    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium"
    style={
      level === 'high'
        ? { backgroundColor: 'rgba(35,134,54,0.1)', color: 'var(--color-success)' }
        : { backgroundColor: 'rgba(217,119,6,0.1)', color: 'var(--color-warning)' }
    }
  >
    {level === 'high' ? 'High-confidence match' : 'Possible match — verify'}
  </span>
);

// ── Action button ────────────────────────────────────────────────────────────
const ActionButton: React.FC<{
  label: string;
  actionType: AssistantAnswer['nextSteps'][0]['actionType'];
  payload?: string;
}> = ({ label, actionType, payload }) => {
  const { saveItem, addChecklistItem, isItemSaved } = useAppStore();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const icon = {
    save: Bookmark,
    checklist: CheckSquare,
    upload: ExternalLink,
    service: ExternalLink,
    reminder: Bell,
  }[actionType];
  const Icon = icon;

  const handleClick = () => {
    if (actionType === 'save' && payload) {
      const std = getStandardById(payload);
      if (std) {
        saveItem({ type: 'standard', referenceId: payload, label: `${std.number} — ${std.title}` });
        setDone(true);
      }
    } else if (actionType === 'checklist' && payload) {
      addChecklistItem({ label: payload });
      setDone(true);
    } else if ((actionType === 'service' || actionType === 'upload') && payload) {
      if (payload.startsWith('/')) navigate(payload);
    } else if (actionType === 'reminder') {
      setDone(true);
    }
  };

  const saved = actionType === 'save' && payload ? isItemSaved(payload) : false;

  return (
    <button
      onClick={handleClick}
      disabled={done || saved}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md border text-left transition-colors"
      style={{
        borderColor: done || saved ? 'var(--color-success)' : 'var(--color-border)',
        color: done || saved ? 'var(--color-success)' : 'var(--color-text-primary)',
        backgroundColor: done || saved ? 'rgba(35,134,54,0.06)' : 'var(--color-surface)',
      }}
    >
      <Icon size={14} className="flex-shrink-0" />
      <span className="flex-1">{done || saved ? `${label} ✓` : label}</span>
      {!done && !saved && <ChevronRight size={13} style={{ color: 'var(--color-text-secondary)' }} />}
    </button>
  );
};

// ── Evidence panel ────────────────────────────────────────────────────────────
const EvidencePanel: React.FC<{ answer: AssistantAnswer | null; loading: boolean }> = ({ answer, loading }) => {
  const navigate = useNavigate();
  if (loading) return (
    <div className="p-5 space-y-4">
      <SkeletonAnswerBlock />
    </div>
  );
  if (!answer) return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(16,42,67,0.06)' }}>
        <ChevronRight size={18} style={{ color: 'var(--color-text-secondary)' }} />
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Evidence & Actions</p>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        Ask a question to see matched standards, reasoning, and recommended next steps here.
      </p>
    </div>
  );

  return (
    <div className="overflow-y-auto h-full p-5 space-y-5">
      {/* Matched standards */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Relevant Standards
        </h3>
        <div className="space-y-2">
          {answer.matchedStandards.map(({ standardId, confidence }) => {
            const std = getStandardById(standardId);
            if (!std) return null;
            return (
              <div key={standardId} className="card p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>{std.number}</span>
                    <DemoTag className="ml-2" />
                  </div>
                  <ConfidenceBadge level={confidence} />
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{std.title}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{std.applicability}</p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className={`tag-status-${std.status}`}>
                    {std.status.charAt(0).toUpperCase() + std.status.slice(1)}
                  </span>
                  {std.mandatory && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: 'var(--color-error)' }}>
                      Mandatory
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/standards/${std.id}`)}
                    className="text-xs underline ml-auto"
                    style={{ color: 'var(--color-blue)' }}
                  >
                    View full standard
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why this applies */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Why This Applies
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
          {answer.reasoning}
        </p>
      </div>

      {/* Next steps */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          Recommended Next Steps
        </h3>
        <div className="space-y-1.5">
          {answer.nextSteps.map((step, i) => (
            <ActionButton key={i} {...step} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Rendered answer text (simple markdown bold) ────────────────────────────────
const RenderedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)' }}>
      {parts.map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </p>
  );
};

// ── Main Assistant Page ─────────────────────────────────────────────────────────
export const Assistant: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { mode, assistantPrefill, setAssistantPrefill } = useAppStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; answer?: AssistantAnswer }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<AssistantAnswer | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [latestAnswerText, setLatestAnswerText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const streamedText = useStreamingText(latestAnswerText, streamActive);

  useEffect(() => {
    const q = searchParams.get('q') || assistantPrefill;
    if (q) {
      setInput(q);
      setAssistantPrefill(null);
      setTimeout(() => submitQuery(q), 300);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  const submitQuery = (q: string) => {
    if (!q.trim()) return;
    const userMsg = { role: 'user' as const, content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setCurrentAnswer(null);
    setStreamActive(false);

    setTimeout(() => {
      const answer = buildAnswer(q);
      setLoading(false);
      setStreamActive(true);
      setLatestAnswerText(answer.answerText);
      setCurrentAnswer(answer);
      setMessages((prev) => [...prev, { role: 'assistant', content: answer.answerText, answer }]);
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(input);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-lg border overflow-hidden" style={{ height: 'calc(100vh - 180px)', minHeight: 480, borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      {/* Left: Conversation */}
      <div className="flex-1 flex flex-col min-w-0 border-r" style={{ borderColor: 'var(--color-border)' }}>
        {/* Header */}
        <div className="px-5 py-3 border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-saffron)' }}>
              {mode === 'industry' ? 'Industry / MSME' : 'Consumer'} Mode
            </p>
            <h1 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              AI Standards Assistant
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(35,134,54,0.1)', color: 'var(--color-success)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--color-success)' }} />
            Ask → Understand → Verify → Act
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {messages.length === 0 && !loading && (
            <div className="py-10 text-center">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                {mode === 'industry'
                  ? 'Ask about certification, standards, or compliance requirements.'
                  : 'Ask about product safety, BIS marks, or consumer rights.'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Try: "What standards apply to electric water heaters?"
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div
                  className="max-w-md rounded-lg px-4 py-2.5 text-sm"
                  style={{ backgroundColor: 'var(--color-navy)', color: 'white' }}
                >
                  {msg.content}
                </div>
              ) : (
                <div className="max-w-xl space-y-2">
                  <div className="text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>BISense</div>
                  {/* Show streaming only for the last assistant message */}
                  {i === messages.length - 1 && streamActive
                    ? <RenderedText text={streamedText || '...'} />
                    : <RenderedText text={msg.content} />
                  }
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="space-y-2">
              <div className="text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>BISense</div>
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: 'var(--color-blue)', animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t px-4 py-3 flex gap-2 flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'industry' ? 'Ask about standards, certification, or compliance…' : 'Ask about product safety or BIS marks…'}
            className="flex-1 text-sm px-3 py-2 rounded-md border outline-none transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            disabled={loading}
            aria-label="Type your question"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-3 py-2 disabled:opacity-50"
            aria-label="Send question"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* Right: Evidence & Actions */}
      <div className="lg:w-80 xl:w-96 border-t lg:border-t-0 flex-shrink-0" style={{ backgroundColor: 'var(--color-offwhite)' }}>
        <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
            Evidence &amp; Actions
          </p>
        </div>
        <EvidencePanel answer={currentAnswer} loading={loading} />
      </div>
    </div>
  );
};
