import React, { useState } from 'react';
import { Shield, AlertTriangle, Download, ChevronRight, CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { generateCaseFile } from '../utils/pdfGenerator';

const LegalOptions = ({ caseData, onBack }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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

  return (
    <div className="legal-options-container">
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
              description="Access direct reporting channels for major social platforms (Instagram, Meta, X/Twitter)."
              link="https://help.instagram.com/contact/383679321740945" 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LegalOptions;
