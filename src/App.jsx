import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import EvidenceForm from './components/EvidenceForm';
import LegalOptions from './components/LegalOptions';
// App.css is imported but we will use index.css for global styles mainly
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    const handlePopState = (event) => {
      // If user presses back, go to step 1 (or whatever state dictates)
      // Since we only have 2 steps, we default to step 1 on back
      setStep(1);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleEvidenceSubmit = (data) => {
    setCaseData(data);
    setStep(2);
    // Push a new entry so "Back" stays within the app
    window.history.pushState({ step: 2 }, '', '#action');
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="app-nav glass-card">
        <div className="nav-content">
          <div className="brand-container">
            <div className="logo-box">
              <ShieldAlert className="logo-icon" />
            </div>
            <div className="brand-text">
              <h1>Deepfake Guardian</h1>
              <span className="mono-text subtitle">DIGITAL RIGHTS PROTECTION UNIT</span>
            </div>
          </div>
          
          <div className="steps-container mono-text">
            <span className={`step ${step === 1 ? 'active' : ''}`}>01 // EVIDENCE</span>
            <div className="step-divider"></div>
            <span className={`step ${step === 2 ? 'active' : ''}`}>02 // ACTION</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="animate-fade-in">
          {step === 1 && (
            <EvidenceForm onSubmit={handleEvidenceSubmit} initialData={caseData} />
          )}
          
          {step === 2 && caseData && (
            <LegalOptions caseData={caseData} onBack={() => setStep(1)} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer glass-card mono-text">
        THIS WEBSITE IS UNDER DEVELOPMENT
      </footer>
    </div>
  );
}

export default App;
