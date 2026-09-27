import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { BottomTabBar } from './BottomTabBar';
import { Disclaimer } from '../shared/Disclaimer';

export const AppLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-56 flex-shrink-0" style={{ backgroundColor: 'var(--color-navy)' }}>
        <Sidebar />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-64 flex flex-col" style={{ backgroundColor: 'var(--color-navy)' }}>
            <Sidebar mobile onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onMenuClick={() => setDrawerOpen(true)} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto pb-20 md:pb-0"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>

          {/* Global footer disclaimer */}
          <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <Disclaimer type="footer" />
          </footer>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <BottomTabBar />
    </div>
  );
};
