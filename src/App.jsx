import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import EvidenceForm from './components/EvidenceForm';
import LegalOptions from './components/LegalOptions';
import ForensicResults from './components/ForensicResults';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [caseData, setCaseData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event) => {
      setStep(1);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleEvidenceSubmit = (data) => {
    setCaseData(data);
    setStep(2);
    window.history.pushState({ step: 2 }, '', '#action');
  };

  const isVerifyPage = location.pathname === '/verify';

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="app-nav glass-card">
        <div className="nav-content">
          <div className="brand-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            {/* <div className="logo-box">
              <ShieldAlert className="logo-icon" />
            </div>
            <div className="brand-text">
              <h1>Deepfake Guardian</h1>
              <span className="mono-text subtitle">DIGITAL RIGHTS PROTECTION UNIT</span>
            </div> */}
            <img 
              src="/logo.png" 
              alt="Deepfake Guardian Logo" 
              style={{ height: '50px', objectFit: 'contain' }} 
            />
            <div className="brand-text">
              <h1 style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deepfake Guardian</h1>
              <span className="mono-text subtitle">DIGITAL RIGHTS PROTECTION UNIT</span>
            </div>
          </div>
          
          {!isVerifyPage && (
            <div className="steps-container mono-text">
              <span className={`step ${step === 1 ? 'active' : ''}`}>01 // EVIDENCE</span>
              <div className="step-divider"></div>
              <span className={`step ${step === 2 ? 'active' : ''}`}>02 // ACTION</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="animate-fade-in">
          <Routes>
            <Route path="/" element={
              <>
                {step === 1 && (
                  <EvidenceForm onSubmit={handleEvidenceSubmit} initialData={caseData} />
                )}
                
                {step === 2 && caseData && (
                  <LegalOptions caseData={caseData} onBack={() => setStep(1)} />
                )}
              </>
            } />
            <Route path="/verify" element={<ForensicResults />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer glass-card mono-text">
        COPYRIGHT NOTICE
      </footer>
    </div>
  );
}

export default App;
