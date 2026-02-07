import React, { useState } from 'react';
import { Upload, User, Monitor, FileText, ArrowRight, Shield, RefreshCw, X, PlayCircle, Instagram, Facebook, Twitter, MessageCircle, Youtube, Globe, Ghost, Cat, ChevronDown, Phone, Scan } from 'lucide-react';
import DigitalTrace from './DigitalTrace';

const PlatformIcon = ({ name }) => {
  switch(name) {
    case 'Instagram': return <Instagram size={18} />;
    case 'Facebook': return <Facebook size={18} />;
    case 'Twitter': return <Twitter size={18} />;
    case 'WhatsApp': return <MessageCircle size={18} color="#25D366" />;
    case 'Telegram': return <MessageCircle size={18} color="#0088cc" />;
    case 'TikTok': return <span style={{ fontSize: '18px' }}>🎵</span>;
    case 'Snapchat': return <Ghost size={18} />;
    case 'Discord': return <span style={{ fontSize: '18px' }}>🎮</span>;
    case 'YouTube': return <Youtube size={18} color="#FF0000" />;
    case 'Other': return <Globe size={18} />;
    default: return <Monitor size={18} />;
  }
};

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div 
        className="glass-input"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer',
          paddingRight: '16px' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Select Platform</span>
          )}
        </div>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </div>

      {isOpen && (
        <div className="glass-card" style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          zIndex: 50, 
          marginTop: '4px',
          maxHeight: '250px',
          overflowY: 'auto',
          background: 'var(--bg-surface)',
          padding: '8px 0'
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EvidenceForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    offender: '',
    platform: '',
    countryCode: '+91',
    offenderPhone: '',
    statement: '',
    screenshotImage: [], // Array of files/URLs
    deepfakeImage: [],   // Array of files/URLs
    incidentType: 'extortion' // 'extortion', 'fakes', or 'trace'
  });

  const countryCodes = [
    { code: '+91', country: 'IN' }, { code: '+1', country: 'US/CA' }, { code: '+44', country: 'UK' },
    { code: '+61', country: 'AU' }, { code: '+81', country: 'JP' }, { code: '+49', country: 'DE' },
    { code: '+33', country: 'FR' }, { code: '+86', country: 'CN' }, { code: '+7', country: 'RU' },
    { code: '+55', country: 'BR' }, { code: '+39', country: 'IT' }, { code: '+34', country: 'ES' },
    { code: '+82', country: 'KR' }, { code: '+65', country: 'SG' }, { code: '+971', country: 'UAE' },
    { code: '+966', country: 'SA' }, { code: '+27', country: 'ZA' }, { code: '+92', country: 'PK' },
    { code: '+880', country: 'BD' }, { code: '+62', country: 'ID' }, { code: '+60', country: 'MY' },
    { code: '+63', country: 'PH' }, { code: '+84', country: 'VN' }, { code: '+66', country: 'TH' },
    { code: '+20', country: 'EG' }, { code: '+98', country: 'IR' }, { code: '+90', country: 'TR' },
    { code: '+31', country: 'NL' }, { code: '+41', country: 'CH' }, { code: '+46', country: 'SE' },
    { code: '+32', country: 'BE' }, { code: '+43', country: 'AT' }, { code: '+48', country: 'PL' },
    { code: '+52', country: 'MX' }, { code: '+54', country: 'AR' }, { code: '+56', country: 'CL' },
    { code: '+57', country: 'CO' }, { code: '+51', country: 'PE' }, { code: '+58', country: 'VE' },
    { code: '+351', country: 'PT' }, { code: '+30', country: 'GR' }, { code: '+36', country: 'HU' },
    { code: '+420', country: 'CZ' }, { code: '+45', country: 'DK' }, { code: '+358', country: 'FI' },
    { code: '+47', country: 'NO' }, { code: '+353', country: 'IE' }, { code: '+64', country: 'NZ' }
  ].sort((a, b) => a.country.localeCompare(b.country));

  const isFakesMode = formData.incidentType === 'fakes';
  const isTraceMode = formData.incidentType === 'trace';

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = [];
      let processedCount = 0;
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newFiles.push({
            url: reader.result,
            type: file.type,
            name: file.name
          });
          processedCount++;
          
          if (processedCount === files.length) {
            setFormData(prev => ({ 
              ...prev, 
              [field]: [...(prev[field] || []), ...newFiles] 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate based on mode
    if (isTraceMode) return; // Trace mode doesn't submit
    if (!isFakesMode && (!formData.offender || !formData.platform)) {
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
        
        {/* Mode Switch */}
        <div className="mode-switch-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => setFormData({...formData, incidentType: 'extortion'})}
            className={`mode-btn ${!isFakesMode ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: !isFakesMode ? 'var(--primary)' : 'transparent',
              color: !isFakesMode ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s'
            }}
          >
            Extortion Case
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, incidentType: 'fakes'})}
            className={`mode-btn ${isFakesMode ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: isFakesMode ? 'var(--primary)' : 'transparent',
              color: isFakesMode ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s'
            }}
          >
            Only Fakes
          </button>
          
          <button 
            type="button"
            onClick={() => setFormData({...formData, incidentType: 'trace'})}
            className={`mode-btn ${isTraceMode ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: isTraceMode ? '#000' : 'transparent',
              color: isTraceMode ? '#00ff41' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <Scan size={14} />
            Digital Trace
          </button>
        </div>
      </div>



      {isTraceMode ? (
        <div className="trace-mode-container" style={{ padding: '0 20px 20px' }}>
          <DigitalTrace mobileNumber={formData.offenderPhone} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="evidence-form">
        {/* Upload Section */}
        <div className="upload-grid">
          <div className="form-group">
            <label>Offender's Message/Post</label>
            <div className={`upload-box ${formData.screenshotImage?.length > 0 ? 'has-file' : ''}`}>
              <div className="upload-content" style={formData.screenshotImage?.length > 0 ? { pointerEvents: 'auto', zIndex: 20 } : {}}>
                {formData.screenshotImage?.length > 0 ? (
                  <div className="preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', width: '100%', padding: '10px', maxHeight: '100%', overflowY: 'auto' }}>
                    {formData.screenshotImage.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {file.type.startsWith('video') ? (
                          <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PlayCircle size={24} color="white" />
                          </div>
                        ) : (
                          <img src={file.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile('screenshotImage', idx); }}
                          style={{ position: 'absolute', top: 4, right: 4, padding: 4, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex' }}
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', aspectRatio: '1', cursor: 'pointer', border: '1px dashed var(--border-color)', transition: 'all 0.2s' }}>
                       <input 
                        type="file" 
                        multiple
                        accept={isFakesMode ? "image/*,video/*" : "image/*"}
                        onChange={(e) => handleFileChange(e, 'screenshotImage')}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '24px', color: 'var(--text-muted)' }}>+</span>
                    </label>
                  </div>
                ) : (
                  <>
                     <input 
                      type="file" 
                      multiple
                      accept={isFakesMode ? "image/*,video/*" : "image/*"}
                      onChange={(e) => handleFileChange(e, 'screenshotImage')}
                      className="file-input-hidden"
                      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    />
                    <Upload className="icon-upload" />
                    <span>{isFakesMode ? "Upload Evidence (Photo/Video)" : "Click to Upload Screenshot(s)"}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Deepfake Image</label>
             <div className={`upload-box ${formData.deepfakeImage?.length > 0 ? 'has-file' : ''}`}>
              <div className="upload-content" style={formData.deepfakeImage?.length > 0 ? { pointerEvents: 'auto', zIndex: 20 } : {}}>
                {formData.deepfakeImage?.length > 0 ? (
                  <div className="preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', width: '100%', padding: '10px', maxHeight: '100%', overflowY: 'auto' }}>
                    {formData.deepfakeImage.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {file.type.startsWith('video') ? (
                          <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PlayCircle size={24} color="white" />
                          </div>
                        ) : (
                          <img src={file.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile('deepfakeImage', idx); }}
                          style={{ position: 'absolute', top: 4, right: 4, padding: 4, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex' }}
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', aspectRatio: '1', cursor: 'pointer', border: '1px dashed var(--border-color)', transition: 'all 0.2s' }}>
                       <input 
                        type="file" 
                        multiple
                        accept={isFakesMode ? "image/*,video/*" : "image/*"}
                        onChange={(e) => handleFileChange(e, 'deepfakeImage')}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '24px', color: 'var(--text-muted)' }}>+</span>
                    </label>
                  </div>
                ) : (
                  <>
                     <input 
                      type="file" 
                      multiple
                      accept={isFakesMode ? "image/*,video/*" : "image/*"}
                      onChange={(e) => handleFileChange(e, 'deepfakeImage')}
                      className="file-input-hidden"
                      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    />
                    <Upload className="icon-upload" />
                    <span>{isFakesMode ? "Upload Fake Content (Photo/Video)" : "Click to Upload Original/Fake"}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields - Only show offender info if not in 'Only Fakes' mode */}
        <div className="fields-stack">
          {!isFakesMode && (
            <>
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="glass-input" style={{ width: '120px', padding: 0, overflow: 'hidden', position: 'relative' }}>
                  <select 
                    value={formData.countryCode} 
                    onChange={e => setFormData({...formData, countryCode: e.target.value})}
                    style={{ 
                      width: '100%', height: '100%', background: 'transparent', border: 'none', 
                      padding: '0 10px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer',
                      appearance: 'none', zIndex: 1
                    }}
                  >
                    {countryCodes.map((c, i) => (
                      <option key={i} value={c.code} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                        {c.country} ({c.code})
                      </option>
                    ))}
                  </select>
                  <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="input-with-icon" style={{ flex: 1 }}>
                  <Phone className="input-icon" />
                  <input 
                    type="tel" 
                    placeholder="Offender's Number (Optional)"
                    className="glass-input"
                    value={formData.offenderPhone}
                    onChange={e => setFormData({...formData, offenderPhone: e.target.value})}
                  />
                </div>
              </div>

                <div className="input-with-icon" style={{ position: 'relative', zIndex: 10 }}>
                {/* Remove input-icon wrapper logic for CustomSelect, as it has its own padding */}
                <CustomSelect 
                  value={formData.platform}
                  onChange={(val) => setFormData({...formData, platform: val})}
                  options={[
                    { value: 'Instagram', label: 'Instagram', icon: <PlatformIcon name="Instagram" /> },
                    { value: 'WhatsApp', label: 'WhatsApp', icon: <PlatformIcon name="WhatsApp" /> },
                    { value: 'Facebook', label: 'Facebook', icon: <PlatformIcon name="Facebook" /> },
                    { value: 'Telegram', label: 'Telegram', icon: <PlatformIcon name="Telegram" /> },
                    { value: 'Twitter', label: 'X (Twitter)', icon: <PlatformIcon name="Twitter" /> },
                    { value: 'Snapchat', label: 'Snapchat', icon: <PlatformIcon name="Snapchat" /> },
                    { value: 'TikTok', label: 'TikTok', icon: <PlatformIcon name="TikTok" /> },
                    { value: 'Discord', label: 'Discord', icon: <PlatformIcon name="Discord" /> },
                    { value: 'YouTube', label: 'YouTube', icon: <PlatformIcon name="YouTube" /> },
                    { value: 'Other', label: 'Other', icon: <PlatformIcon name="Other" /> },
                  ]}
                />
              </div>
            </>
          )}

          <div className="input-with-icon">
            <FileText className="input-icon" />
            <textarea 
              placeholder="Victim's Statement"
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
    )}
    </div>
  );
};

export default EvidenceForm;
