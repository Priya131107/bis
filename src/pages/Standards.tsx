import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { standards, sectors } from '../data/standards';
import type { Standard } from '../types';
import { SkeletonCard } from '../components/shared/Skeleton';
import { DemoTag } from '../components/shared/Disclaimer';
import { EmptyState } from '../components/shared/States';

const STATUS_LABELS: Record<Standard['status'], string> = {
  active: 'Active',
  draft: 'Draft',
  withdrawn: 'Withdrawn',
  amended: 'Amended',
};

const StatusBadge: React.FC<{ status: Standard['status'] }> = ({ status }) => (
  <span className={`tag-status-${status === 'amended' ? 'draft' : status}`}>
    {STATUS_LABELS[status]}
  </span>
);

export const Standards: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState(searchParams.get('q') ?? '');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMandatory, setSelectedMandatory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return standards.filter((s) => {
      const q = searchQ.toLowerCase();
      const matchQ = !q || s.title.toLowerCase().includes(q) || s.number.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      const matchSector = !selectedSector || s.sector === selectedSector;
      const matchStatus = !selectedStatus || s.status === selectedStatus;
      const matchMandatory =
        !selectedMandatory ||
        (selectedMandatory === 'mandatory' ? s.mandatory : !s.mandatory);
      return matchQ && matchSector && matchStatus && matchMandatory;
    });
  }, [searchQ, selectedSector, selectedStatus, selectedMandatory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQ ? { q: searchQ } : {});
  };

  const clearFilters = () => {
    setSearchQ('');
    setSelectedSector('');
    setSelectedStatus('');
    setSelectedMandatory('');
    setSearchParams({});
  };

  const hasFilters = searchQ || selectedSector || selectedStatus || selectedMandatory;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-heading font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>
          Standards Explorer
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Search and filter across Indian Standards. <DemoTag className="ml-1" />
        </p>
      </div>

      {/* Search + filter controls */}
      <div className="space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1 max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-secondary)' }} />
            <input
              type="search"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search by standard number, title, or sector…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              aria-label="Search standards"
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="btn-secondary gap-2"
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
            {hasFilters && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-saffron)' }} />}
          </button>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn-ghost gap-1" aria-label="Clear all filters">
              <X size={14} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </form>

        {showFilters && (
          <div className="card p-4 grid sm:grid-cols-3 gap-3">
            {/* Sector */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Sector</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full text-sm rounded-md border px-2 py-1.5"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                aria-label="Filter by sector"
              >
                <option value="">All sectors</option>
                {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* Status */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-sm rounded-md border px-2 py-1.5"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="amended">Amended</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            {/* Mandatory */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Certification Type</label>
              <select
                value={selectedMandatory}
                onChange={(e) => setSelectedMandatory(e.target.value)}
                className="w-full text-sm rounded-md border px-2 py-1.5"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                aria-label="Filter by mandatory status"
              >
                <option value="">All</option>
                <option value="mandatory">Mandatory (ISI)</option>
                <option value="voluntary">Voluntary</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {filtered.length} standard{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Desktop table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No standards match your filters"
          description="Try broadening your search or clearing the active filters."
          ctaLabel="Clear filters"
          ctaHref="/standards"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-offwhite)' }}>
                  {['Number', 'Title', 'Sector', 'Status', 'Type', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((std, i) => (
                  <tr
                    key={std.id}
                    className="border-b transition-colors hover:bg-gray-50 cursor-pointer"
                    style={{ borderColor: i < filtered.length - 1 ? 'var(--color-border)' : 'transparent' }}
                    onClick={() => navigate(`/standards/${std.id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--color-blue)' }}>{std.number}</td>
                    <td className="px-4 py-3 font-medium max-w-xs">
                      <span style={{ color: 'var(--color-text-primary)' }}>{std.title}</span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>{std.sector}</td>
                    <td className="px-4 py-3"><StatusBadge status={std.status} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{std.mandatory ? 'Mandatory' : 'Voluntary'}</td>
                    <td className="px-4 py-3">
                      <ChevronRight size={15} style={{ color: 'var(--color-text-secondary)' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((std) => (
              <button
                key={std.id}
                onClick={() => navigate(`/standards/${std.id}`)}
                className="card w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold" style={{ color: 'var(--color-blue)' }}>{std.number}</span>
                  <StatusBadge status={std.status} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{std.title}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{std.sector} · {std.mandatory ? 'Mandatory' : 'Voluntary'}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
