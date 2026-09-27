import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, CheckSquare, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from '../components/shared/States';

export const Saved: React.FC = () => {
  const navigate = useNavigate();
  const { savedItems, checklist, removeSavedItem, toggleChecklistItem, removeChecklistItem } = useAppStore();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>
          Saved Items
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Standards and items you've saved or added to your checklist.
        </p>
      </div>

      {/* Saved Standards */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <Bookmark size={15} />
          Saved Standards
          {savedItems.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(23,105,170,0.1)', color: 'var(--color-blue)' }}>
              {savedItems.length}
            </span>
          )}
        </h2>

        {savedItems.length === 0 ? (
          <EmptyState
            title="No saved standards yet."
            description="Save a standard to quickly return to its requirements."
            ctaLabel="Browse Standards Explorer"
            ctaHref="/standards"
            icon={<Bookmark size={20} style={{ color: 'var(--color-text-secondary)' }} />}
          />
        ) : (
          <div className="space-y-2">
            {savedItems.map((item) => (
              <div key={item.id} className="card px-4 py-3 flex items-center gap-3">
                <Bookmark size={14} style={{ color: 'var(--color-blue)', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.label}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Saved {new Date(item.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/standards/${item.referenceId}`)}
                  className="btn-ghost px-2 py-1"
                  aria-label={`View ${item.label}`}
                >
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => removeSavedItem(item.id)}
                  className="btn-ghost px-2 py-1"
                  style={{ color: 'var(--color-error)' }}
                  aria-label={`Remove ${item.label}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Checklist */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <CheckSquare size={15} />
          My Compliance Checklist
          {checklist.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(35,134,54,0.1)', color: 'var(--color-success)' }}>
              {checklist.filter((c) => c.done).length}/{checklist.length} done
            </span>
          )}
        </h2>

        {checklist.length === 0 ? (
          <EmptyState
            title="Your checklist is empty."
            description="Add testing requirements or compliance steps from any standard or AI answer."
            ctaLabel="Go to Standards Explorer"
            ctaHref="/standards"
            icon={<CheckSquare size={20} style={{ color: 'var(--color-text-secondary)' }} />}
          />
        ) : (
          <div className="card overflow-hidden">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <button
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border-2 transition-colors"
                  style={{
                    borderColor: item.done ? 'var(--color-success)' : 'var(--color-border)',
                    backgroundColor: item.done ? 'rgba(35,134,54,0.1)' : 'transparent',
                  }}
                  aria-pressed={item.done}
                  aria-label={`Mark "${item.label}" as ${item.done ? 'incomplete' : 'complete'}`}
                >
                  {item.done && <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />}
                </button>
                <span
                  className="flex-1 text-sm"
                  style={{
                    color: item.done ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                    textDecoration: item.done ? 'line-through' : 'none',
                  }}
                >
                  {item.label}
                </span>
                <button
                  onClick={() => removeChecklistItem(item.id)}
                  className="btn-ghost px-1.5 py-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                  aria-label={`Remove "${item.label}"`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
