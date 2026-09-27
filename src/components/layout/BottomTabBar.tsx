import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, GitBranch, Bookmark } from 'lucide-react';

const TABS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assistant', label: 'Assistant', icon: Bot },
  { to: '/compliance', label: 'Compliance', icon: GitBranch },
  { to: '/saved', label: 'Saved', icon: Bookmark },
];

export const BottomTabBar: React.FC = () => (
  <nav
    className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t"
    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    aria-label="Mobile tab bar"
  >
    {TABS.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors ${
            isActive ? '' : ''
          }`
        }
        style={({ isActive }) => ({
          color: isActive ? 'var(--color-blue)' : 'var(--color-text-secondary)',
        })}
        aria-label={label}
      >
        {({ isActive }) => (
          <>
            <Icon size={20} style={{ color: isActive ? 'var(--color-blue)' : 'var(--color-text-secondary)' }} />
            <span className="mt-0.5">{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);
