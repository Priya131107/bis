import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Bot, Play, RotateCcw } from 'lucide-react';
import { complianceStages } from '../data/complianceStages';
import { demoScenario } from '../data/demoScenario';
import type { ComplianceStage } from '../types';
import { useAppStore } from '../store/useAppStore';
import { DemoTag, Disclaimer } from '../components/shared/Disclaimer';
import { getServiceById } from '../data/services';
import { SkeletonCard } from '../components/shared/Skeleton';

const COMPLEXITY_COLOR: Record<ComplianceStage['complexity'], string> = {
  low: 'var(--color-success)',
  medium: 'var(--color-warning)',
  high: 'var(--color-error)',
};

const STATUS_ICON: Record<ComplianceStage['status'], React.ReactNode> = {
  'complete': <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />,
  'in-progress': <Clock size={16} style={{ color: 'var(--color-warning)' }} />,
  'not-started': <AlertCircle size={16} style={{ color: 'var(--color-border)' }} />,
};

export const Compliance: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { demoJourney, startDemoJourney, advanceDemoStep, resetDemoJourney, setAssistantPrefill } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemo = searchParams.get('demo') === '1' || demoJourney.active;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isDemo && !demoJourney.active) {
      startDemoJourney();
    }
  }, [isDemo]);

  const stages = isDemo
    ? complianceStages.map((s, i) => ({
        ...s,
        status:
          demoJourney.completedSteps.includes(i)
            ? 'complete'
            : i === demoJourney.currentStep
            ? 'in-progress'
            : 'not-started',
      } as ComplianceStage))
    : complianceStages;

  const completedCount = stages.filter((s) => s.status === 'complete').length;
  const progressPct = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-semibold" style={{ color: 'var(--color-navy)' }}>
            Compliance Journey
          </h1>
          {isDemo ? (
            <div className="flex items-center gap-2 mt-1">
              <DemoTag />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {demoScenario.productName} · {demoScenario.businessType} · {demoScenario.location}
              </span>
            </div>
          ) : (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Track your product through each certification stage.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {isDemo ? (
            <button
              onClick={() => { resetDemoJourney(); navigate('/compliance'); }}
              className="btn-ghost gap-2"
            >
              <RotateCcw size={14} />
              Reset Demo
            </button>
          ) : (
            <button
              onClick={() => { startDemoJourney(); navigate('/compliance?demo=1'); }}
              className="btn-secondary gap-2"
              id="start-demo-journey"
            >
              <Play size={14} />
              Run Demo Journey
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Overall Progress</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-blue)' }}>{completedCount}/{stages.length} stages</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: 'var(--color-blue)' }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPct}% complete`}
          />
        </div>
      </div>

      {/* Demo action area */}
      {isDemo && demoJourney.active && demoJourney.currentStep < stages.length && (
        <div className="card p-4 border-l-4" style={{ borderLeftColor: 'var(--color-saffron)' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-saffron)' }}>Demo Mode — Current Stage</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {stages[demoJourney.currentStep]?.name}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {demoScenario.actionPlan[demoJourney.currentStep] ?? 'Demo complete.'}
              </p>
            </div>
            {demoJourney.currentStep < stages.length - 1 && (
              <button onClick={advanceDemoStep} className="btn-primary whitespace-nowrap">
                Advance Stage →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : (
        <>
          {/* Desktop horizontal timeline header */}
          <div className="hidden lg:flex items-center gap-0 overflow-x-auto pb-2">
            {stages.map((stage, i) => (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setExpandedId(expandedId === stage.id ? null : stage.id)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-md transition-colors"
                  style={{ minWidth: 100 }}
                  aria-expanded={expandedId === stage.id}
                  aria-label={`Stage ${i + 1}: ${stage.name}, status: ${stage.status}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors"
                    style={{
                      borderColor: stage.status === 'complete' ? 'var(--color-success)' : stage.status === 'in-progress' ? 'var(--color-warning)' : 'var(--color-border)',
                      backgroundColor: stage.status === 'complete' ? 'rgba(35,134,54,0.12)' : stage.status === 'in-progress' ? 'rgba(217,119,6,0.12)' : 'var(--color-offwhite)',
                    }}
                  >
                    {STATUS_ICON[stage.status]}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight" style={{ color: expandedId === stage.id ? 'var(--color-blue)' : 'var(--color-text-secondary)' }}>
                    {stage.name}
                  </span>
                </button>
                {i < stages.length - 1 && (
                  <div className="flex-1 h-0.5 min-w-4" style={{ backgroundColor: stages[i + 1].status !== 'not-started' ? 'var(--color-blue)' : 'var(--color-border)' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Stage details (both desktop & mobile) */}
          <div className="space-y-2">
            {stages.map((stage, i) => {
              const service = getServiceById(stage.relatedServiceId);
              const isExpanded = expandedId === stage.id;

              return (
                <div key={stage.id} className="card overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : stage.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    aria-expanded={isExpanded}
                    id={`stage-btn-${stage.id}`}
                  >
                    <div className="flex-shrink-0">{STATUS_ICON[stage.status]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-secondary mr-1">Stage {i + 1}</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{stage.name}</span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: `${COMPLEXITY_COLOR[stage.complexity]}18`, color: COMPLEXITY_COLOR[stage.complexity] }}
                        >
                          {stage.complexity} complexity
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-secondary)' }}>
                        ~{stage.estimatedDays} days · {stage.responsibleParty}
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--color-text-secondary)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-secondary)' }} />}
                  </button>

                  {isExpanded && (
                    <div className="border-t px-4 pb-4 pt-3 space-y-4" style={{ borderColor: 'var(--color-border)' }}>
                      <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{stage.description}</p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Required Documents</p>
                          <ul className="space-y-1">
                            {stage.requiredDocuments.map((doc, j) => (
                              <li key={j} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-blue)' }} />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Responsible Party</p>
                            <p className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{stage.responsibleParty}</p>
                          </div>
                          {service && (
                            <div>
                              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Related BIS Service</p>
                              <button
                                onClick={() => navigate('/services')}
                                className="text-xs underline"
                                style={{ color: 'var(--color-blue)' }}
                              >
                                {service.name}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setAssistantPrefill(`Explain stage: ${stage.name} for BIS product certification`);
                          navigate('/assistant');
                        }}
                        className="btn-ghost gap-1.5 text-xs"
                      >
                        <Bot size={13} />
                        Ask AI about this stage
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Demo Journey full detail */}
      {isDemo && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-navy)' }}>
            Demo Scenario: Gap Analysis &amp; Action Plan
          </h2>
          <DemoTag />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-error)' }}>Identified Gaps</h3>
              <ul className="space-y-1.5">
                {demoScenario.gaps.map((gap, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Recommended Action Plan</h3>
              <ol className="space-y-1.5">
                {demoScenario.actionPlan.map((step, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: 'var(--color-navy)', color: 'white' }}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Disclaimer type="copilot" />
        </div>
      )}
    </div>
  );
};
