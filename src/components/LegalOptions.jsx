import React, { useState } from 'react';
import { Shield, AlertTriangle, Download, ChevronRight, CheckCircle, ArrowLeft, ExternalLink, X, Loader, Globe, Search, Pause, Play } from 'lucide-react';
import { generateCaseFile } from '../utils/pdfGenerator';

const LegalOptions = ({ caseData, onBack }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showScanOverlay, setShowScanOverlay] = useState(false);

  const handleDownload = () => {
    try {
      generateCaseFile(caseData);
      setDownloaded(true);
    } catch (error) {
      console.error("PDF Generation Failed:", error);
      alert("Failed to generate PDF. Please try again or check console for details.\nError: " + error.message);
    }
  };
    
  const OptionCard = ({ icon: Icon, title, description, badge, onClick, link }) => (
    <div 
      onClick={link ? () => window.open(link, '_blank') : onClick}
      className="glass-card option-card"
    >
      <div className="card-bg-icon">
        <Icon />
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <div className="icon-box">
            <Icon />
          </div>
          {badge && (
            <span className="badge badge-recommend">
              {badge}
            </span>
          )}
        </div>
        
        <h3>{title}</h3>
        <p>{description}</p>
        
        <div className="action-link">
          Proceed <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );

  const ReportingGuide = () => (
    <div className="guide-container glass-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '40px' }}>
      <div className="guide-header" style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
        <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '12px', fontWeight: 700 }}>Filing Your Cyber Crime Complaint</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Follow these steps to officially report the incident using your generated case file.
          This process ensures your evidence is submitted correctly.
        </p>
      </div>

      <div className="guide-steps" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="step-item" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="step-number" style={{ 
            background: 'var(--primary)', color: 'white', width: '40px', height: '40px', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>1</div>
          <div className="step-content">
            <h4 style={{ margin: '0 0 8px', color: 'var(--text-main)', fontSize: '1.2rem' }}>Download Your Case File</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Ensure you have downloaded the <strong>Official Case PDF</strong> from the previous screen. This contains all organized evidence.
            </p>
          </div>
        </div>

        <div className="step-item" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="step-number" style={{ 
            background: 'var(--primary)', color: 'white', width: '40px', height: '40px', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>2</div>
          <div className="step-content">
            <h4 style={{ margin: '0 0 8px', color: 'var(--text-main)', fontSize: '1.2rem' }}>Visit the Official Portal</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Go to <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>cybercrime.gov.in</a>. Click on <strong>"File a Complaint"</strong> on the homepage.
            </p>
          </div>
        </div>

        <div className="step-item" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="step-number" style={{ 
            background: 'var(--primary)', color: 'white', width: '40px', height: '40px', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>3</div>
          <div className="step-content">
            <h4 style={{ margin: '0 0 8px', color: 'var(--text-main)', fontSize: '1.2rem' }}>Select Incident Category</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Choose <strong>"Report Cyber Crime Related to Women/Children"</strong> (for deepfakes/harassment) or <strong>"Report Other Cyber Crime"</strong>.
            </p>
          </div>
        </div>

        <div className="step-item" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="step-number" style={{ 
            background: 'var(--primary)', color: 'white', width: '40px', height: '40px', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>4</div>
          <div className="step-content">
            <h4 style={{ margin: '0 0 8px', color: 'var(--text-main)', fontSize: '1.2rem' }}>Upload Evidence & Details</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Fill in the incident details using the info in your PDF. In the <strong>"Upload Evidence"</strong> section, attach the <strong>Case_Report.pdf</strong> you generated.
            </p>
          </div>
        </div>
      </div>

      <div className="guide-actions" style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <a 
          href="https://cybercrime.gov.in" 
          target="_blank" 
          rel="noreferrer"
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 28px', fontSize: '1.1rem' }}
        >
          Open Cyber Crime Portal <ExternalLink size={20} />
        </a>
        <button 
          onClick={() => setShowGuide(false)}
          className="glass-input"
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--border-color)', 
            cursor: 'pointer', 
            padding: '12px 28px', 
            fontWeight: 600, 
            color: 'var(--text-muted)',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        >
          Back to Options
        </button>
      </div>
    </div>
  );

  const handlePlatformReport = () => {
    setShowScanOverlay(true);
  };

  const ScanOverlay = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scanInitiated, setScanInitiated] = useState(false);
    const [scanResults, setScanResults] = useState({});
    const [stats, setStats] = useState({ total: 0, found: 0 });
    const [isPaused, setIsPaused] = useState(false);

    // Initial load - Start scan immediately
    React.useEffect(() => {
        initiateScan();
    }, []);

    // Helper to normalize URLs for matching
    const normalizeUrl = (url) => {
        if (!url) return '';
        return url.replace(/\/$/, '').replace(/^https?:\/\/(www\.)?/, '');
    };

    // Polling for results
    React.useEffect(() => {
        if (error || isPaused) return;
        
        const pollInterval = setInterval(() => {
            fetch('/api/v1/scan-results')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Sync website list with backend target
                        if (data.target_urls && data.target_urls.length > 0) {
                             if (JSON.stringify(websites) !== JSON.stringify(data.target_urls)) {
                                 setWebsites(data.target_urls);
                                 setLoading(false);
                             }
                        }

                        if (data.all_results) {
                            const resultsMap = {};
                            data.all_results.forEach(r => {
                                // Normalize Key from result
                                const key = normalizeUrl(r.source_url);
                                if (!resultsMap[key] || r.prediction === 'Fake') {
                                    resultsMap[key] = r;
                                }
                            });
                            setScanResults(resultsMap);
                            setStats({
                                total: data.summary?.total_scanned || 0,
                                found: data.summary?.deepfakes_found || 0
                            });
                        }
                    }
                })
                .catch(err => {
                    console.error("Polling error:", err);
                    // Don't set error state here to avoid blocking UI on transient failures
                });
        }, 1000); // Faster polling for better responsiveness

        return () => clearInterval(pollInterval);
    }, [websites, error, isPaused]);

    const initiateScan = async () => {
        // Always allow re-initiation if needed, but managing state
        setScanInitiated(true);
        setLoading(true);
        setWebsites([]); // Clear previous list
        setScanResults({});
        setStats({ total: 0, found: 0 });
        
        try {
            await fetch('/api/v1/global-scan', { method: 'POST' });
        } catch (e) {
            console.error("Scan trigger failed", e);
            setError("Failed to initiate scan");
            setLoading(false);
        }
    };

    const togglePause = async () => {
        const action = isPaused ? 'resume' : 'pause';
        try {
            const res = await fetch('/api/v1/scan-control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (data.success) {
                setIsPaused(!isPaused);
            }
        } catch (e) {
            console.error("Pause/Resume failed", e);
        }
    };

    const progressPercentage = websites.length > 0 ? (stats.total / websites.length) * 100 : 0;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{ 
                width: '90%', maxWidth: '600px', maxHeight: '80vh', 
                display: 'flex', flexDirection: 'column', position: 'relative', 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                background: 'rgba(255, 255, 255, 0.95)', // Enhanced White
                color: '#1f2937' // Darker text for white background
            }}>
                <div style={{ position: 'absolute', top: 15, right: 15, zIndex: 10, display: 'flex', gap: '8px' }}>
                     <button 
                        onClick={togglePause}
                        style={{ 
                            background: isPaused ? '#10B981' : '#F59E0B', 
                            border: 'none', color: 'white', cursor: 'pointer', 
                            padding: '8px 16px', borderRadius: '20px',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontWeight: '600', fontSize: '0.85rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isPaused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
                    </button>
                    <button 
                        onClick={() => setShowScanOverlay(false)}
                        style={{ background: 'rgba(0,0,0,0.1)', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '60px 32px 32px 32px', borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                <Globe size={32} color="#2563EB" />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px', color: '#111827' }}>Global Deepfake Scan</h2>
                                <p style={{ margin: '4px 0 0', color: '#4B5563', fontSize: '0.9rem' }}>
                                    {isPaused ? 'Scan Paused' : 'Active Real-time Monitoring'}
                                </p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                             <div style={{ fontSize: '2rem', fontWeight: 700, color: stats.found > 0 ? '#EF4444' : '#10B981' }}>
                                {stats.found}
                             </div>
                             <div style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Deepfakes Detected
                             </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ background: 'rgba(0,0,0,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ 
                            width: `${progressPercentage}%`, 
                            background: stats.found > 0 ? '#EF4444' : '#2563EB', 
                            height: '100%', 
                            transition: 'width 0.5s ease-out' 
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: '#6B7280' }}>
                        <span>Scanning: {stats.total} / {websites.length} websites</span>
                        <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#F9FAFB' }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: '#6B7280' }}>
                            <Loader className="spin" size={32} />
                            <p>Connecting to secure server...</p>
                        </div>
                    ) : error ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: '#EF4444' }}>
                            <AlertTriangle size={48} />
                            <p style={{ textAlign: 'center' }}>{error}<br/><span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Please ensure the backend server is running.</span></p>
                            <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Retry Connection</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {websites.map((site, idx) => {
                                const key = normalizeUrl(site);
                                const result = scanResults[key];
                                const isFake = result?.prediction === 'Fake';
                                const isSafe = result?.prediction === 'Real';
                                
                                return (
                                    <div key={idx} style={{ 
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '16px', 
                                        background: isFake ? '#FEF2F2' : 'white', 
                                        borderRadius: '12px', 
                                        border: isFake ? '1px solid #FECACA' : '1px solid #E5E7EB',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '8px', 
                                                background: isFake ? '#FEE2E2' : (isSafe ? '#D1FAE5' : '#F3F4F6'),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {result ? (
                                                    isFake ? <AlertTriangle size={16} color="#EF4444" /> : <CheckCircle size={16} color="#10B981" />
                                                ) : (
                                                    <div style={{ 
                                                        width: '8px', height: '8px', borderRadius: '50%', 
                                                        background: '#60A5FA', boxShadow: '0 0 8px #60A5FA'
                                                    }} className="pulse" />
                                                )}
                                            </div>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{site}</span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                                            {result ? (
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ 
                                                        fontSize: '0.85rem', 
                                                        color: isFake ? '#EF4444' : '#10B981',
                                                        fontWeight: 700, letterSpacing: '0.5px'
                                                    }}>
                                                        {isFake ? 'THREAT DETECTED' : 'SAFE'}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                        {result.confidence}% Confidence
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', background: '#F3F4F6', padding: '4px 10px', borderRadius: '20px' }}>
                                                    <Search size={12} /> Scanning...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', background: '#F3F4F6', fontSize: '0.85rem', color: '#6B7280', textAlign: 'center' }}>
                    <p style={{ margin: 0 }}>Scan running in secure background environment. This window can be minimized.</p>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="legal-options-container">
      {showScanOverlay && <ScanOverlay />}
      {showGuide ? (
        <ReportingGuide />
      ) : (
        <>
          <button onClick={onBack} className="btn-back">
            <ArrowLeft size={16} />
            Edit Information
          </button>

          <div className="success-header">
            <div className="success-badge mono-text">
              <CheckCircle size={14} />
              CASE FILE {caseData.id} GENERATED
            </div>
            <h2>Ready for Action</h2>
            <p>
              Your evidence has been secured. Choose the appropriate legal response below. 
              We recommend starting by downloading your case file.
            </p>
            
            <button 
              onClick={handleDownload}
              className={`btn-action-large ${downloaded ? 'downloaded' : ''}`}
            >
              <Download size={20} />
              {downloaded ? 'Download Again' : 'Download Official Case PDF'}
            </button>
          </div>

          <div className="options-grid">
            <OptionCard
              icon={Shield}
              title="Step-by-Step Reporting Guide"
              description="Learn how to file an official complaint on the National Cyber Crime Portal using your case file."
              badge="RECOMMENDED"
              onClick={() => setShowGuide(true)}
            />

            <OptionCard
              icon={AlertTriangle}
              title="Platform Report"
              description="Initiate a global deepfake scan across all monitored websites."
              badge="ACTION REQUIRED"
              onClick={handlePlatformReport} 
            />
          </div>
        </>
      )}
    </div>
  );
};
export default LegalOptions;

