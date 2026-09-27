import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Bot, GitBranch, FileText, Building2,
  ShieldCheck, Bell, Bookmark, HelpCircle, Settings, User, X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/standards', label: 'Standards Explorer', icon: Search },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/compliance', label: 'Compliance Journey', icon: GitBranch },
  { to: '/documents', label: 'Document Intelligence', icon: FileText },
  { to: '/services', label: 'BIS Services', icon: Building2 },
  { to: '/verification', label: 'Product Verification', icon: ShieldCheck },
  { to: '/alerts', label: 'Alerts & Updates', icon: Bell },
  { to: '/saved', label: 'Saved Items', icon: Bookmark },
];

const BOTTOM_ITEMS = [
  { to: '/help', label: 'Help', icon: HelpCircle },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onClose }) => {
  const navigate = useNavigate();
  const savedItems = useAppStore((s) => s.savedItems);

  return (
    <nav
      className="flex flex-col h-full"
      style={{ backgroundColor: 'var(--color-navy)' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => { navigate('/'); onClose?.(); }}
          className="flex items-center gap-2 focus-visible:outline-white"
          aria-label="BISense home"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-saffron)' }}>
            <span className="text-white font-bold text-sm leading-none">B</span>
          </div>
          <div className="leading-none">
            <span className="block text-white font-semibold text-sm tracking-wide">BISense</span>
            <span className="block text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Standards Intelligence</span>
          </div>
        </button>
        {mobile && (
          <button
            onClick={onClose}
            className="p-1 rounded text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 w-full ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className="flex-shrink-0" style={{ color: isActive ? 'var(--color-saffron)' : undefined }} />
                <span className="flex-1 truncate">{label}</span>
                {label === 'Saved Items' && savedItems.length > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: 'rgba(242,140,40,0.3)', color: 'var(--color-saffron)' }}
                  >
                    {savedItems.length}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="px-2 pb-3 pt-2 border-t space-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 w-full ${
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
        {/* Profile stub */}
        <button
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-white/60 hover:bg-white/8 hover:text-white transition-colors w-full mt-1"
          onClick={() => navigate('/settings')}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(242,140,40,0.3)' }}>
            <User size={12} style={{ color: 'var(--color-saffron)' }} />
          </div>
          <span>My Profile</span>
        </button>
      </div>
    </nav>
  );
};
