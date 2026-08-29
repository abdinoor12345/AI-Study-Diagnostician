 import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDiagnosticFlow } from './hooks/useDiagnosticFlow';
import Layout from './components/Layout';
import StepRenderer from './components/StepRenderer';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const flow = useDiagnosticFlow();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<StepRenderer flow={flow} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Layout>
  );
}