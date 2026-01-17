import React, { useState } from 'react';
import { Shield, Gavel, AlertTriangle, Download, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { generateCaseFile, generateLegalNoticePDF } from '../utils/pdfGenerator';

const LegalOptions = ({ caseData, onBack }) => {
  const [downloaded, setDownloaded] = useState(false);

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

  const handleLegalNotice = () => {
    try {
      generateLegalNoticePDF(caseData);
    } catch (error) {
       console.error("Notice PDF Failed:", error);
       alert("Failed to generate Notice PDF: " + error.message);
    }
  };

  return (
    <div className="legal-options-container">
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
          title="File Cyber Complaint"
          description="Direct path to the National Cyber Crime Reporting Portal. Use your Case ID and generated PDF."
          badge="RECOMMENDED"
          link="https://cybercrime.gov.in"
        />

        <OptionCard
          icon={Gavel}
          title="Send Legal Notice"
          description="Generate a formal Cease & Desist letter to send immediately to the offender via DM or Email."
          onClick={handleLegalNotice}
        />

        <OptionCard
          icon={AlertTriangle}
          title="Platform Report"
          description="Access direct reporting channels for major social platforms (Instagram, Meta, X/Twitter)."
          link="https://help.instagram.com/contact/383679321740945" 
        />
      </div>
    </div>
  );
};

export default LegalOptions;
