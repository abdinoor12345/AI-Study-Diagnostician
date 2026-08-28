import React from 'react';
import { useDiagnosticFlow } from './hooks/useDiagnosticFlow';
import Layout from './components/Layout';
import StepRenderer from './components/StepRenderer';

export default function App() {
  const flow = useDiagnosticFlow();

  return (
    <Layout>
      <StepRenderer flow={flow} />
    </Layout>
  );
}