import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Assistant } from './pages/Assistant';
import { Standards } from './pages/Standards';
import { StandardDetail } from './pages/StandardDetail';
import { Compliance } from './pages/Compliance';
import { Services } from './pages/Services';
import { Documents } from './pages/Documents';
import { Verification } from './pages/Verification';
import { Alerts } from './pages/Alerts';
import { Saved } from './pages/Saved';
import { StandardsGraph, Settings, Help } from './pages/Stubs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="standards" element={<Standards />} />
          <Route path="standards/:id" element={<StandardDetail />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="services" element={<Services />} />
          <Route path="documents" element={<Documents />} />
          <Route path="verification" element={<Verification />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="saved" element={<Saved />} />
          <Route path="graph" element={<StandardsGraph />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
