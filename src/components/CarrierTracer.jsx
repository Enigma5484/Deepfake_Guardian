import React, { useState } from 'react';
import { Network, Smartphone, Link as LinkIcon, Copy, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import axios from 'axios';

const CarrierTracer = ({ mobileNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState(mobileNumber || '');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const [trackingId, setTrackingId] = useState('');

  const handleGenerate = async () => {
    if (!phoneNumber) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/v1/tracker/generate', { phone: phoneNumber });
      if (res.data.success) {
        setGeneratedLink(res.data.data.trackingUrl);
        setTrackingId(res.data.data.trackingId);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate tracking link. Backend usage required.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card carrier-tracer" style={{ padding: '24px', border: '1px solid #10B981', boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '16px' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '50%' }}>
          <Network size={24} color="#10B981" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#10B981' }}>Carrier Network Tracer</h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate forensic tracking links to identify network metadata.</p>
        </div>
      </div>

      {!generatedLink ? (
        <div className="input-section">
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Target Mobile Number</label>
            <div className="glass-input" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
              <Smartphone size={18} color="var(--text-muted)" />
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter number (e.g., +91 9876543210)"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', flex: 1, outline: 'none' }}
              />
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !phoneNumber}
            className="btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: loading ? '#059669' : '#10B981' }}
          >
            {loading ? 'Generating Unique ID...' : 'Generate Forensic Link'}
            {!loading && <ArrowRight size={18} />}
          </button>
          
          {error && <p style={{ color: '#EF4444', marginTop: '12px', fontSize: '0.9rem' }}>{error}</p>}
        </div>
      ) : (
        <div className="result-section animate-fade-in">
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '12px', border: '1px dashed #10B981', textAlign: 'center' }}>
            <ShieldCheck size={48} color="#10B981" style={{ marginBottom: '16px' }} />
            <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem' }}>Tracking Link Ready</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Share this link with the target. Once clicked, network metadata will be captured.
            </p>

            <div className="glass-input" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 8px 8px 16px', background: 'rgba(0,0,0,0.2)' }}>
              <LinkIcon size={16} color="var(--text-muted)" />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem', color: '#10B981' }}>
                {generatedLink}
              </span>
              <button 
                onClick={handleCopy}
                style={{ 
                  background: copied ? '#10B981' : 'rgba(255,255,255,0.1)', 
                  border: 'none', 
                  borderRadius: '6px', 
                  padding: '8px', 
                  cursor: 'pointer',
                  color: copied ? 'white' : 'var(--text-main)',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
             <a 
                href={`/verify?id=${trackingId}`}
                target="_blank"
                rel="noreferrer"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginTop: '16px', 
                  color: '#10B981', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '20px'
                }}
              >
                <ShieldCheck size={14} />
                Monitor Live Results
              </a>
          </div>
          
          <button 
            onClick={() => { setGeneratedLink(''); setTrackingId(''); }}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              marginTop: '16px', 
              fontSize: '0.9rem', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Generate Another Link
          </button>
        </div>
      )}

      <div className="note" style={{ marginTop: '24px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p style={{ margin: 0 }}>
          <strong>Note:</strong> This tool captures IP, ISP, ASN, and Device User-Agent. 
          Use responsibly and only for authorized forensic investigations.
        </p>
      </div>
    </div>
  );
};

export default CarrierTracer;
