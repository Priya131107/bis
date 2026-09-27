import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, Building2, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TopNavProps {
  onMenuClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { mode, setMode } = useAppStore();
  const [searchValue, setSearchValue] = useState('');
  const [modeDropdown, setModeDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setModeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/standards?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  return (
    <header
      className="flex items-center gap-3 px-4 h-14 border-b flex-shrink-0"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Hamburger (mobile) */}
      <button
        className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={20} style={{ color: 'var(--color-text-secondary)' }} />
      </button>

      {/* Global search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <input
            type="search"
            placeholder="Search standards, services, topics…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-offwhite)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Global search"
          />
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        {/* Mode toggle */}
        <div className="relative" ref={dropRef}>
          <button
            id="mode-toggle"
            onClick={() => setModeDropdown((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            aria-haspopup="listbox"
            aria-expanded={modeDropdown}
            aria-label={`Current mode: ${mode === 'industry' ? 'Industry / MSME' : 'Consumer'}. Click to switch.`}
          >
            {mode === 'industry' ? (
              <Building2 size={14} style={{ color: 'var(--color-blue)' }} />
            ) : (
              <User size={14} style={{ color: 'var(--color-success)' }} />
            )}
            <span className="hidden sm:inline" style={{ color: 'var(--color-text-primary)' }}>
              {mode === 'industry' ? 'Industry / MSME' : 'Consumer'}
            </span>
            <ChevronDown size={13} style={{ color: 'var(--color-text-secondary)' }} />
          </button>

          {modeDropdown && (
            <div
              className="absolute right-0 mt-1 w-48 rounded-md border shadow-md z-50"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              role="listbox"
              aria-label="Select mode"
            >
              <button
                role="option"
                aria-selected={mode === 'industry'}
                onClick={() => { setMode('industry'); setModeDropdown(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-left transition-colors hover:bg-gray-50"
                style={{ color: mode === 'industry' ? 'var(--color-blue)' : 'var(--color-text-primary)' }}
              >
                <Building2 size={14} />
                <div>
                  <div className="font-medium">Industry / MSME</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Certification & compliance</div>
                </div>
                {mode === 'industry' && <span className="ml-auto text-xs font-medium" style={{ color: 'var(--color-blue)' }}>✓</span>}
              </button>
              <div className="border-t" style={{ borderColor: 'var(--color-border)' }} />
              <button
                role="option"
                aria-selected={mode === 'consumer'}
                onClick={() => { setMode('consumer'); setModeDropdown(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-left transition-colors hover:bg-gray-50"
                style={{ color: mode === 'consumer' ? 'var(--color-success)' : 'var(--color-text-primary)' }}
              >
                <User size={14} />
                <div>
                  <div className="font-medium">Consumer</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Safety & verification</div>
                </div>
                {mode === 'consumer' && <span className="ml-auto text-xs font-medium" style={{ color: 'var(--color-success)' }}>✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Alerts and updates (5 unread)"
        >
          <Bell size={18} style={{ color: 'var(--color-text-secondary)' }} />
          <span
            className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-error)' }}
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
};
