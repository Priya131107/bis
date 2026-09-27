import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, TestTube, FileCheck, Award, Microscope, User, MessageSquare, BookOpen } from 'lucide-react';
import { bisServices } from '../data/services';
import type { BISService } from '../types';
import { DemoTag } from '../components/shared/Disclaimer';

const CATEGORY_ICONS: Record<BISService['category'], React.ReactNode> = {
  certification: <Award size={18} />,
  registration: <FileCheck size={18} />,
  testing: <TestTube size={18} />,
  licensing: <Building2 size={18} />,
  laboratory: <Microscope size={18} />,
  consumer: <User size={18} />,
  complaints: <MessageSquare size={18} />,
  standards: <BookOpen size={18} />,
};

const CATEGORY_COLORS: Record<BISService['category'], string> = {
  certification: 'var(--color-blue)',
  registration: 'var(--color-success)',
  testing: 'var(--color-warning)',
  licensing: 'var(--color-navy)',
  laboratory: '#7C3AED',
  consumer: 'var(--color-saffron)',
  complaints: 'var(--color-error)',
  standards: 'var(--color-blue)',
};

const CATEGORY_LABELS: Record<BISService['category'], string> = {
  certification: 'Certification',
  registration: 'Registration',
  testing: 'Testing',
  licensing: 'Licensing',
  laboratory: 'Laboratory',
  consumer: 'Consumer Services',
  complaints: 'Complaints',
  standards: 'Standards Info',
};

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<BISService['category'] | ''>('');

  const categories = [...new Set(bisServices.map((s) => s.category))] as BISService['category'][];
  const filtered = selectedCategory ? bisServices.filter((s) => s.category === selectedCategory) : bisServices;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>
          BIS Services Hub
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Find and start BIS services for certification, testing, complaints, and more. <DemoTag className="ml-1" />
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors font-medium ${!selectedCategory ? 'text-white border-transparent' : ''}`}
          style={!selectedCategory ? { backgroundColor: 'var(--color-navy)', borderColor: 'var(--color-navy)' } : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          aria-pressed={!selectedCategory}
        >
          All Services
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors font-medium ${selectedCategory === cat ? 'text-white border-transparent' : ''}`}
            style={selectedCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
            aria-pressed={selectedCategory === cat}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Service grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {filtered.map((svc) => {
          const color = CATEGORY_COLORS[svc.category];
          const Icon = CATEGORY_ICONS[svc.category];
          return (
            <div key={svc.id} className="card p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {Icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{svc.name}</h2>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {CATEGORY_LABELS[svc.category]}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    For: {svc.targetAudience}
                  </p>
                </div>
              </div>

              <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                {svc.description}
              </p>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Process</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{svc.processOverview}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,42,67,0.06)', color: 'var(--color-text-secondary)' }}>
                    {svc.stepCount} steps
                  </span>
                </div>
              </div>

              <div className="border-t pt-3 flex gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  onClick={() => navigate('/compliance')}
                  className="btn-primary flex-1 gap-2 justify-center text-sm"
                  id={`svc-start-${svc.id}`}
                >
                  Start
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Tell me about the ${svc.name} BIS service`)}`)}
                  className="btn-ghost text-sm px-3"
                >
                  Ask AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
