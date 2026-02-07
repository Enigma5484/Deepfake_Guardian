import React, { useState, useEffect } from 'react';
import { Leaf, Info } from 'lucide-react';

const CarbonTracker = ({ mobileNumber }) => {
  const [networkType, setNetworkType] = useState('4G');
  const [dataUsage, setDataUsage] = useState(1.5); // Default estimated daily usage in GB
  const [emission, setEmission] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Carbon Intensity Factors (India 2026 Projections) - gCO2e per GB
  const CARBON_FACTORS = {
    '5G': 30,
    '4G': 120,
    'WiFi': 3,
    '2G': 3000
  };

  const SERVER_OVERHEAD = 15; // gCO2e per GB for cloud processing

  const calculateEmission = () => {
    setIsAnimating(true);
    // Formula: E = D * (N_intensity + S_overhead)
    const factor = CARBON_FACTORS[networkType] || 120;
    const total = dataUsage * (factor + SERVER_OVERHEAD);
    
    setTimeout(() => {
      setEmission(Math.round(total));
      setIsAnimating(false);
    }, 800);
  };

  useEffect(() => {
    calculateEmission();
  }, [networkType, dataUsage]);

  const getImpactLevel = (val) => {
    if (val < 50) return { label: 'LOW', color: '#10B981', width: '25%' };
    if (val < 200) return { label: 'MODERATE', color: '#F59E0B', width: '50%' };
    if (val < 500) return { label: 'HIGH', color: '#EF4444', width: '75%' };
    return { label: 'EXTREME', color: '#7F1D1D', width: '100%' };
  };

  const impact = getImpactLevel(emission);

  return (
    <div className="glass-card carbon-tracker" style={{ padding: '24px', textAlign: 'center', border: '1px solid #10B981' }}>
      {console.log('Rendering CarbonTracker')}
      <div className="tracker-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '12px' }}>
          <Leaf size={32} color="#10B981" />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Digital Carbon Footprint</h3>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Est. impact for +91 {mobileNumber || 'XXXXXXXXXX'}</p>
      </div>

      <div className="controls-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="control-group" style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Network Type</label>
          <div className="glass-input" style={{ padding: '0', overflow: 'hidden', display: 'flex' }}>
            <select 
              value={networkType}
              onChange={(e) => setNetworkType(e.target.value)}
              style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none' }}
            >
              <option value="4G">4G LTE (Standard)</option>
              <option value="5G">5G (Efficient)</option>
              <option value="WiFi">Wi-Fi (Low Impact)</option>
              <option value="2G">2G/3G (High Impact)</option>
            </select>
          </div>
        </div>

        <div className="control-group" style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Daily Data (GB)</label>
          <input 
            type="number" 
            min="0.1" 
            step="0.1"
            value={dataUsage}
            onChange={(e) => setDataUsage(parseFloat(e.target.value) || 0)}
            className="glass-input"
          />
        </div>
      </div>

      {/* Gauge Visualization */}
      <div className="gauge-container" style={{ position: 'relative', height: '160px', overflow: 'hidden', marginBottom: '16px' }}>
        <div className="gauge-bg" style={{ 
          width: '200px', height: '100px', borderTopLeftRadius: '100px', borderTopRightRadius: '100px', 
          background: 'rgba(255,255,255,0.1)', border: '20px solid rgba(255,255,255,0.1)', borderBottom: 'none',
          margin: '0 auto', position: 'relative', top: '20px'
        }}>
          <div className="gauge-fill" style={{ 
            width: '100%', height: '100%', background: 'transparent',
            border: `20px solid ${impact.color}`, borderBottom: 'none',
            borderTopLeftRadius: '100px', borderTopRightRadius: '100px',
            position: 'absolute', top: '-20px', left: '-20px',
            transformOrigin: 'bottom center',
            transform: `rotate(${ (emission / 600 * 180) - 180 }deg)`, // Simplified rotation logic
            transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
        <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {Math.round(emission)}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '4px' }}>gCO2e</span>
          </div>
          <div style={{ color: impact.color, fontWeight: 600, letterSpacing: '1px' }}>{impact.label} IMPACT</div>
        </div>
      </div>

      <div className="methodology-note" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
        <Info size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
        Calculation based on <strong>India 2026 Digital Provenance</strong> model. 
        <br/>Includes network transmission & server overhead.
      </div>
    </div>
  );
};

export default CarbonTracker;
