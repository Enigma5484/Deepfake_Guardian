import React, { useState } from 'react';
import { Upload, User, Monitor, FileText, ArrowRight } from 'lucide-react';

const EvidenceForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    offender: '',
    platform: '',
    statement: '',
    screenshotImage: null,
    deepfakeImage: null
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.offender || !formData.platform) {
      alert("Please fill in the required fields.");
      return;
    }
    
    // Create a unique ID
    const caseId = 'CS-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    onSubmit({
      ...formData,
      id: caseId,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="glass-card form-container">
      <div className="form-header">
        <h2>Establish Record</h2>
        <p>Securely document the incident to initiate protection protocols.</p>
      </div>

      <form onSubmit={handleSubmit} className="evidence-form">
        {/* Upload Section */}
        <div className="upload-grid">
          <div className="form-group">
            <label>Offender's Message/Post</label>
            <div className={`upload-box ${formData.screenshotImage ? 'has-file' : ''}`}>
              <input 
                type="file" 
                accept="image/*" // Corrected attribute (was accept="image/*" in previous code but logic remains same)
                onChange={(e) => handleFileChange(e, 'screenshotImage')}
                className="file-input-hidden"
              />
              <div className="upload-content">
                {formData.screenshotImage ? (
                  <>
                    <img src={formData.screenshotImage} alt="Preview" className="upload-preview" />
                    <span className="upload-status success">Evidence Attached</span>
                  </>
                ) : (
                  <>
                    <Upload className="icon-upload" />
                    <span>Click to Upload Screenshot</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Deepfake Image</label>
             <div className={`upload-box ${formData.deepfakeImage ? 'has-file' : ''}`}>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'deepfakeImage')}
                className="file-input-hidden"
              />
              <div className="upload-content">
                {formData.deepfakeImage ? (
                  <>
                     <img src={formData.deepfakeImage} alt="Preview" className="upload-preview" />
                    <span className="upload-status success">Evidence Attached</span>
                  </>
                ) : (
                  <>
                    <Upload className="icon-upload" />
                    <span>Click to Upload Original/Fake</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="fields-stack">
          <div className="input-with-icon">
            <User className="input-icon" />
            <input 
              type="text" 
              placeholder="Offender's Username / Account"
              className="glass-input"
              value={formData.offender}
              onChange={e => setFormData({...formData, offender: e.target.value})}
            />
          </div>

          <div className="input-with-icon">
            <Monitor className="input-icon" />
            <input 
              type="text" 
              placeholder="Platform (e.g., Instagram, WhatsApp)"
              className="glass-input"
              value={formData.platform}
              onChange={e => setFormData({...formData, platform: e.target.value})}
            />
          </div>

          <div className="input-with-icon">
            <FileText className="input-icon" />
            <textarea 
              placeholder="Victim's Statement (Optional)"
              className="glass-input textarea-field"
              value={formData.statement}
              onChange={e => setFormData({...formData, statement: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary btn-block"
        >
          Generate Case File
          <ArrowRight className="btn-icon" />
        </button>
      </form>
    </div>
  );
};

export default EvidenceForm;
