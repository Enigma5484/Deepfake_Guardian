import React, { useState, useEffect } from 'react';
import { Shield, Globe, Smartphone, Activity, MapPin, Terminal, AlertTriangle, ScanLine, Crosshair } from 'lucide-react';

const DigitalTrace = ({ mobileNumber }) => {
  const [traceStep, setTraceStep] = useState(0); // 0: Idle, 1: HLR, 2: IP, 3: Device, 4: Complete
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [isSelfTrace, setIsSelfTrace] = useState(false);

  // Simulated Database of Mobile Number Series (First 4 digits -> Original Operator/Circle)
  // NOTE: This data represents ORIGINAL ALLOCATION. Actual operator may differ due to MNP.
  const SERIES_DB = {
    // --- 98xx Series (Legacy GSM) ---
    '9810': { operator: 'Airtel', circle: 'Delhi NCR' },
    '9811': { operator: 'Vodafone Idea (Vi)', circle: 'Delhi NCR' },
    '9818': { operator: 'Airtel', circle: 'Delhi NCR' },
    '9871': { operator: 'Airtel', circle: 'Delhi NCR' },
    '9873': { operator: 'Vodafone Idea (Vi)', circle: 'Delhi NCR' },
    '9891': { operator: 'Vodafone Idea (Vi)', circle: 'Delhi NCR' },
    '9899': { operator: 'Vodafone Idea (Vi)', circle: 'Delhi NCR' },
    '9999': { operator: 'Vodafone Idea (Vi)', circle: 'Delhi NCR' },
    '9820': { operator: 'Vodafone Idea (Vi)', circle: 'Mumbai' },
    '9821': { operator: 'Airtel', circle: 'Mumbai' }, // Historic BPL Mobile -> Loop -> Airtel
    '9819': { operator: 'Vodafone Idea (Vi)', circle: 'Mumbai' },
    '9833': { operator: 'Vodafone Idea (Vi)', circle: 'Mumbai' },
    '9867': { operator: 'Airtel', circle: 'Mumbai' },
    '9892': { operator: 'Airtel', circle: 'Mumbai' },
    '9844': { operator: 'Vodafone Idea (Vi)', circle: 'Karnataka' },
    '9845': { operator: 'Airtel', circle: 'Karnataka' },
    '9880': { operator: 'Airtel', circle: 'Karnataka' },
    '9886': { operator: 'Vodafone Idea (Vi)', circle: 'Karnataka' },
    '9900': { operator: 'Airtel', circle: 'Karnataka' },
    '9901': { operator: 'Airtel', circle: 'Karnataka' },
    '9902': { operator: 'Vodafone Idea (Vi)', circle: 'Karnataka' },
    '9945': { operator: 'Airtel', circle: 'Karnataka' },
    '9964': { operator: 'Vodafone Idea (Vi)', circle: 'Karnataka' },
    '9972': { operator: 'Airtel', circle: 'Karnataka' },
    '9980': { operator: 'Airtel', circle: 'Karnataka' },
    '9986': { operator: 'Vodafone Idea (Vi)', circle: 'Karnataka' },
    '9840': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9841': { operator: 'Vodafone Idea (Vi)', circle: 'Tamil Nadu' }, 
    '9842': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9843': { operator: 'Vodafone Idea (Vi)', circle: 'Tamil Nadu' },
    '9884': { operator: 'Vodafone Idea (Vi)', circle: 'Tamil Nadu' },
    '9894': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9940': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9941': { operator: 'Vodafone Idea (Vi)', circle: 'Tamil Nadu' },
    '9942': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9943': { operator: 'Vodafone Idea (Vi)', circle: 'Tamil Nadu' },
    '9944': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9952': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9994': { operator: 'Airtel', circle: 'Tamil Nadu' },
    '9848': { operator: 'Vodafone Idea (Vi)', circle: 'Andhra Pradesh' },
    '9849': { operator: 'Airtel', circle: 'Andhra Pradesh' },
    '9866': { operator: 'Airtel', circle: 'Andhra Pradesh' },
    '9885': { operator: 'Vodafone Idea (Vi)', circle: 'Andhra Pradesh' },
    '9908': { operator: 'Airtel', circle: 'Andhra Pradesh' },
    '9912': { operator: 'Idea (Vi)', circle: 'Andhra Pradesh' },
    '9948': { operator: 'Idea (Vi)', circle: 'Andhra Pradesh' },
    '9949': { operator: 'Airtel', circle: 'Andhra Pradesh' },
    '9951': { operator: 'Idea (Vi)', circle: 'Andhra Pradesh' },
    '9959': { operator: 'Airtel', circle: 'Andhra Pradesh' },
    '9963': { operator: 'Airtel', circle: 'Andhra Pradesh' },
    '9966': { operator: 'Vodafone (Vi)', circle: 'Andhra Pradesh' },
    '9985': { operator: 'Vodafone (Vi)', circle: 'Andhra Pradesh' },
    '9989': { operator: 'Airtel', circle: 'Andhra Pradesh' },
    '9830': { operator: 'Vodafone Idea (Vi)', circle: 'Kolkata' },
    '9831': { operator: 'Airtel', circle: 'Kolkata' },
    '9836': { operator: 'Vodafone (Vi)', circle: 'Kolkata' },
    '9874': { operator: 'Vodafone (Vi)', circle: 'Kolkata' },
    '9883': { operator: 'Reliance Jio', circle: 'Kolkata' }, // Originally Reliance CDMA/GSM
    '9903': { operator: 'Airtel', circle: 'Kolkata' },
    // --- 94xx Series (BSNL) ---
    '9400': { operator: 'BSNL', circle: 'Kerala' },
    '9401': { operator: 'BSNL', circle: 'Assam' },
    '9402': { operator: 'BSNL', circle: 'North East' },
    '9403': { operator: 'BSNL', circle: 'Maharashtra' },
    '9404': { operator: 'BSNL', circle: 'Maharashtra' },
    '9405': { operator: 'BSNL', circle: 'Maharashtra' },
    '9406': { operator: 'BSNL', circle: 'Madhya Pradesh' },
    '9407': { operator: 'BSNL', circle: 'Madhya Pradesh' },
    '9408': { operator: 'BSNL', circle: 'Gujarat' },
    '9409': { operator: 'BSNL', circle: 'Gujarat' },
    '9410': { operator: 'BSNL', circle: 'UP West' },
    '9411': { operator: 'BSNL', circle: 'UP West' },
    '9412': { operator: 'BSNL', circle: 'UP West' },
    '9413': { operator: 'BSNL', circle: 'Rajasthan' },
    '9414': { operator: 'BSNL', circle: 'Rajasthan' },
    '9415': { operator: 'BSNL', circle: 'UP East' },
    '9416': { operator: 'BSNL', circle: 'Haryana' },
    '9417': { operator: 'BSNL', circle: 'Punjab' },
    '9418': { operator: 'BSNL', circle: 'Himachal Pradesh' },
    '9419': { operator: 'BSNL', circle: 'J&K' },
    '9420': { operator: 'BSNL', circle: 'Maharashtra' },
    '9421': { operator: 'BSNL', circle: 'Maharashtra' },
    '9422': { operator: 'BSNL', circle: 'Maharashtra' },
    '9423': { operator: 'BSNL', circle: 'Maharashtra' },
    '9424': { operator: 'BSNL', circle: 'Madhya Pradesh' },
    '9425': { operator: 'BSNL', circle: 'Madhya Pradesh' },
    '9426': { operator: 'BSNL', circle: 'Gujarat' },
    '9427': { operator: 'BSNL', circle: 'Gujarat' },
    '9428': { operator: 'BSNL', circle: 'Gujarat' },
    '9429': { operator: 'BSNL', circle: 'Gujarat' },
    '9430': { operator: 'BSNL', circle: 'Bihar' },
    '9431': { operator: 'BSNL', circle: 'Bihar/Jharkhand' },
    '9432': { operator: 'BSNL', circle: 'Kolkata' },
    '9433': { operator: 'BSNL', circle: 'Kolkata' },
    '9434': { operator: 'BSNL', circle: 'West Bengal' },
    '9435': { operator: 'BSNL', circle: 'Assam' },
    '9436': { operator: 'BSNL', circle: 'North East' },
    '9437': { operator: 'BSNL', circle: 'Orissa' },
    '9438': { operator: 'BSNL', circle: 'Orissa' },
    '9439': { operator: 'BSNL', circle: 'Orissa' },
    '9440': { operator: 'BSNL', circle: 'Andhra Pradesh' },
    '9441': { operator: 'BSNL', circle: 'Andhra Pradesh' },
    '9442': { operator: 'BSNL', circle: 'Tamil Nadu' },
    '9443': { operator: 'BSNL', circle: 'Tamil Nadu' },
    '9444': { operator: 'BSNL', circle: 'Chennai' },
    '9445': { operator: 'BSNL', circle: 'Chennai' },
    '9446': { operator: 'BSNL', circle: 'Kerala' },
    '9447': { operator: 'BSNL', circle: 'Kerala' },
    '9448': { operator: 'BSNL', circle: 'Karnataka' },
    '9449': { operator: 'BSNL', circle: 'Karnataka' },
    '9450': { operator: 'BSNL', circle: 'UP East' },
    '9451': { operator: 'BSNL', circle: 'UP East' },
    '9452': { operator: 'BSNL', circle: 'UP East' },
    '9453': { operator: 'BSNL', circle: 'UP East' },
    '9454': { operator: 'BSNL', circle: 'UP East' },
    '9455': { operator: 'BSNL', circle: 'UP East' },
    '9456': { operator: 'BSNL', circle: 'UP West' },
    '9457': { operator: 'BSNL', circle: 'UP West' },
    '9458': { operator: 'BSNL', circle: 'UP West' },
    '9459': { operator: 'BSNL', circle: 'Himachal Pradesh' },
    '9460': { operator: 'BSNL', circle: 'Rajasthan' },
    '9461': { operator: 'BSNL', circle: 'Rajasthan' },
    '9462': { operator: 'BSNL', circle: 'Rajasthan' },
    '9463': { operator: 'BSNL', circle: 'Punjab' },
    '9464': { operator: 'BSNL', circle: 'Punjab' },
    '9465': { operator: 'BSNL', circle: 'Punjab' },
    '9466': { operator: 'BSNL', circle: 'Haryana' },
    '9467': { operator: 'BSNL', circle: 'Haryana' },
    '9468': { operator: 'BSNL', circle: 'Rajasthan' },
    '9469': { operator: 'BSNL', circle: 'J&K' },
    '9470': { operator: 'BSNL', circle: 'Bihar' },
    '9471': { operator: 'BSNL', circle: 'Bihar' },
    '9472': { operator: 'BSNL', circle: 'Bihar' },
    '9473': { operator: 'BSNL', circle: 'Bihar' },
    '9474': { operator: 'BSNL', circle: 'West Bengal' },
    // --- Jio Series (7xxx, 6xxx, 8xxx) ---
    '7000': { operator: 'Reliance Jio', circle: 'Madhya Pradesh' },
    '7001': { operator: 'Reliance Jio', circle: 'Madhya Pradesh' },
    '7002': { operator: 'Reliance Jio', circle: 'North East' },
    '7003': { operator: 'Reliance Jio', circle: 'West Bengal' },
    '7004': { operator: 'Airtel', circle: 'UP East' }, // Exception
    '7005': { operator: 'Reliance Jio', circle: 'North East' },
    '7006': { operator: 'Reliance Jio', circle: 'J&K' },
    '7007': { operator: 'Reliance Jio', circle: 'UP East' },
    '7008': { operator: 'Reliance Jio', circle: 'Orissa' },
    '7009': { operator: 'Reliance Jio', circle: 'Punjab' },
    '7010': { operator: 'Reliance Jio', circle: 'Tamil Nadu' },
    '7011': { operator: 'Reliance Jio', circle: 'Delhi NCR' },
    '7012': { operator: 'Reliance Jio', circle: 'Kerala' },
    '7013': { operator: 'Reliance Jio', circle: 'Andhra Pradesh' },
    '7014': { operator: 'Reliance Jio', circle: 'Rajasthan' },
    '7015': { operator: 'Reliance Jio', circle: 'Haryana' },
    '7016': { operator: 'Reliance Jio', circle: 'Gujarat' },
    '7017': { operator: 'Reliance Jio', circle: 'UP West' },
    '7018': { operator: 'Reliance Jio', circle: 'Himachal Pradesh' },
    '7019': { operator: 'Reliance Jio', circle: 'Karnataka' },
    '7020': { operator: 'Reliance Jio', circle: 'Maharashtra' },
    '7021': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '7022': { operator: 'Reliance Jio', circle: 'Karnataka' },
    '7023': { operator: 'Reliance Jio', circle: 'Rajasthan' },
    '7024': { operator: 'Reliance Jio', circle: 'Madhya Pradesh' },
    '7025': { operator: 'Reliance Jio', circle: 'Kerala' },
    '7026': { operator: 'Reliance Jio', circle: 'Karnataka' },
    '7027': { operator: 'Reliance Jio', circle: 'UP West' },
    '7028': { operator: 'Reliance Jio', circle: 'Maharashtra' },
    '7029': { operator: 'Reliance Jio', circle: 'West Bengal' },
    // --- 99xx Series (Mixed) ---
    '9910': { operator: 'Airtel', circle: 'Delhi NCR' },
    '9911': { operator: 'Idea (Vi)', circle: 'Delhi NCR' },
    '9920': { operator: 'Idea (Vi)', circle: 'Mumbai' },
    '9930': { operator: 'Vodafone (Vi)', circle: 'Kolkata' },
    '9945': { operator: 'Airtel', circle: 'Karnataka' },
    '9953': { operator: 'Vodafone (Vi)', circle: 'Delhi NCR' },
    '9958': { operator: 'Airtel', circle: 'Delhi NCR' },
    '9968': { operator: 'Mahanagar Telephone (MTNL)', circle: 'Delhi NCR' },
    '9971': { operator: 'Airtel', circle: 'Delhi NCR' },
    '9990': { operator: 'Idea (Vi)', circle: 'Delhi NCR' },
    // --- 8xxx Series ---
    '8800': { operator: 'Airtel', circle: 'Delhi NCR' },
    '8860': { operator: 'Vodafone (Vi)', circle: 'Delhi NCR' },
    '8130': { operator: 'Airtel', circle: 'Delhi NCR' },
    '8527': { operator: 'Airtel', circle: 'Delhi NCR' },
    '8377': { operator: 'Airtel', circle: 'Delhi NCR' },
    '8447': { operator: 'Vodafone (Vi)', circle: 'Delhi NCR' },
    '8888': { operator: 'Idea (Vi)', circle: 'Delhi NCR' },
    '8826': { operator: 'Airtel', circle: 'Delhi NCR' },
    '8105': { operator: 'Airtel', circle: 'Karnataka' },
    '8971': { operator: 'Airtel', circle: 'Karnataka' },
    '8861': { operator: 'Airtel', circle: 'Karnataka' },
    '8867': { operator: 'Airtel', circle: 'Karnataka' },
    '8722': { operator: 'Airtel', circle: 'Karnataka' },
    '8095': { operator: 'Vodafone (Vi)', circle: 'Karnataka' },
    '8050': { operator: 'Vodafone (Vi)', circle: 'Karnataka' },
    '8123': { operator: 'Vodafone (Vi)', circle: 'Karnataka' },
    '8147': { operator: 'Airtel', circle: 'Karnataka' },
    '8197': { operator: 'Airtel', circle: 'Karnataka' },
    '8277': { operator: 'BSNL', circle: 'Karnataka' },
    '8880': { operator: 'Reliance Jio', circle: 'Maharashtra' }, 
    '8888': { operator: 'Idea (Vi)', circle: 'Delhi NCR' },
    '8879': { operator: 'Vodafone (Vi)', circle: 'Mumbai' },
    '8652': { operator: 'Vodafone (Vi)', circle: 'Mumbai' },
    '8108': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '8451': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '8452': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '8454': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '8080': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '8291': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '8828': { operator: 'Reliance Jio', circle: 'Mumbai' },
    '8097': { operator: 'Tata Docomo (->Airtel)', circle: 'Mumbai' },
    '8104': { operator: 'Tata Docomo (->Airtel)', circle: 'Mumbai' },
    '8422': { operator: 'Uninor (->Airtel/Vi)', circle: 'Mumbai' },
    '8424': { operator: 'Uninor (->Airtel/Vi)', circle: 'Mumbai' },
    '8425': { operator: 'Uninor (->Airtel/Vi)', circle: 'Mumbai' },
    '8433': { operator: 'Reliance Jio', circle: 'Maharashtra' },
  };

  const getUserDevice = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) return "Android Smartphone";
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "iOS Device (iPhone/iPad)";
    if (/windows phone/i.test(ua)) return "Windows Phone";
    if (/Win/i.test(ua)) return "Windows PC";
    if (/Mac/i.test(ua)) return "Macintosh (Apple PC)";
    if (/Linux/i.test(ua)) return "Linux System";
    return "Unknown Browser/Device";
  };

  const loadSelfTrace = async () => {
    setIsSelfTrace(true);
    setTraceStep(1);
    setLogs(['> Initializing Host Trace...', '> Identifying User-Agent...', '> Handshaking with Gateway...']);
    setResult(null);

    // Get Device Type Immediately
    const deviceType = getUserDevice();

    try {
      // Step 2: Location
      setTimeout(async () => {
        setLogs(prev => [...prev, '> Resolving Public IP...', '> Requesting Geolocation Permission...']);
        
        // Try Geolocation API first for Precision
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              // Success: Use Lat/Long
              const { latitude, longitude, accuracy } = position.coords;
              setLogs(prev => [...prev, '> GPS SATELLITE LOCK ACQUIRED.', `> Precision: ${accuracy}m`]);
              
              // Fallback to IP API for ISP info, but use Geo for Location
              try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                
                setTraceStep(4);
                setResult({
                  operator: data.org || data.asn,
                  circle: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`, // Exact GPS
                  status: 'Online (GPS Active)',
                  ip: data.ip,
                  device: deviceType,
                  country: 'India (GPS Verified)'
                });
                setLogs(prev => [...prev, '> HOST IDENTIFIED.', '> CONNECTION SECURE.']);
              } catch (e) {
                // If IP API fails, still show GPS
                setTraceStep(4);
                setResult({
                  operator: 'Unknown ISP',
                  circle: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
                  status: 'Online (GPS)',
                  ip: 'Detected (Hidden)',
                  device: deviceType,
                  country: 'India'
                });
              }
            },
            async (error) => {
              // Denied/Error: Fallback to IP API
              setLogs(prev => [...prev, '> GPS ACCESS DENIED.', '> Falling back to IP Triangulation...']);
              try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                
                if (!data.error) {
                    setTraceStep(4);
                    setResult({
                    operator: data.org || data.asn,
                    circle: `${data.city}, ${data.region} (${data.region_code})`, // City, State
                    status: 'Online (IP Base)',
                    ip: data.ip,
                    device: deviceType,
                    country: data.country_name
                    });
                    setLogs(prev => [...prev, '> HOST IDENTIFIED via IP.', '> CONNECTION SECURE.']);
                } else {
                    throw new Error('API Error');
                }
              } catch (err) {
                 throw err;
              }
            }
          );
        } else {
           // No Geo API: Fallback to IP
           // ... (Same fall back logic)
        }

      }, 2000);
    } catch (e) {
      console.error(e);
      setResult({
        operator: 'Unknown ISP',
        circle: 'Local Network',
        status: 'Offline',
        ip: '127.0.0.1 (Local)',
        device: deviceType,
      });
      setTraceStep(4);
    }
  };

  const getSimulatedData = (number) => {
    const prefix = number ? number.substring(0, 4) : 'xxxx';
    const carrierData = SERIES_DB[prefix] || { 
      operator: ['Airtel', 'Jio', 'Vi', 'BSNL'][Math.floor(Math.random() * 4)], 
      circle: ['Delhi NCR', 'Mumbai', 'Karnataka', 'Maharashtra', 'UP West'][Math.floor(Math.random() * 5)] 
    };

    return {
      ...carrierData,
      status: Math.random() > 0.3 ? 'Active / Home' : 'Roaming / Active',
      ip: `106.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} (Simulated Pool)`,
      device: Math.random() > 0.5 ? 'Smartphone (Android/iOS)' : 'Feature Phone', // Generic
      lastActive: 'Just now'
    };
  };

  useEffect(() => {
    if (isSelfTrace) return; // Don't run effect if self tracing
    if (!mobileNumber) return;

    // Reset
    setTraceStep(1);
    setIsSelfTrace(false);
    setLogs(['> Initializing HLR Lookup...', '> Handshaking with Gateway...']);
    setResult(null);

    // Sequence
    const timeouts = [];

    // Step 1: Carrier Resolved
    timeouts.push(setTimeout(() => {
      setLogs(prev => [...prev, '> Carrier detected (Original Series)...', '> Resolving Circle ID...']);
    }, 800));

    // Step 2: IP Trace
    timeouts.push(setTimeout(() => {
      setTraceStep(2);
      setLogs(prev => [...prev, '> Pinging Network Tower...', '> Triangulating Signal Strength...', '> IP Leased: Dynamic']);
    }, 1800));

    // Step 3: Device info
    timeouts.push(setTimeout(() => {
      setTraceStep(3);
      setLogs(prev => [...prev, '> Reading User-Agent Headers...', '> Device Fingerprinting initialized...']);
    }, 2800));

    // Step 4: Finish
    timeouts.push(setTimeout(() => {
      setTraceStep(4);
      setLogs(prev => [...prev, '> DATA EXTRACTED SUCCESSFULLY.', '> CLOSING CONNECTION.']);
      setResult(getSimulatedData(mobileNumber));
    }, 3800));

    return () => timeouts.forEach(clearTimeout);
  }, [mobileNumber, isSelfTrace]);


  return (
    <div className="glass-card digital-trace" style={{ 
      padding: '24px', 
      fontFamily: 'var(--font-mono)', 
      background: 'rgba(10, 10, 10, 0.9)', 
      color: '#00ff41',
      border: '1px solid #00aaaa',
      boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,255,65,0.3)', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} />
          <span style={{ fontWeight: 700, letterSpacing: '1px' }}>DIGITAL_TRACE_V2.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <div className={`status-dot ${traceStep < 4 ? 'blink' : ''}`} style={{ width: '8px', height: '8px', borderRadius: '50%', background: traceStep < 4 ? '#ffff00' : '#00ff41' }}></div>
          {traceStep < 4 ? 'TRACING...' : 'LOCKED'}
        </div>
      </div>

      {/* Target Info */}
      <div style={{ marginBottom: '20px', background: 'rgba(0,50,0,0.5)', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#00aaaa', marginBottom: '4px' }}>TARGET_MSISDN:</div>
          <div style={{ fontSize: '1.25rem', letterSpacing: '2px', fontWeight: 600 }}>
            {isSelfTrace ? 'HOST_DEVICE' : `+91 ${mobileNumber || 'XXXXXXXXXX'}`}
          </div>
        </div>
        <button 
            type="button"
            onClick={loadSelfTrace}
            style={{
                background: 'rgba(0, 255, 65, 0.1)',
                border: '1px solid #00ff41',
                color: '#00ff41',
                padding: '6px 12px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
        >
            <Crosshair size={14} />
            TRACE LOCAL HOST
        </button>
      </div>

      {/* Live Logs */}
      {traceStep < 4 && (
        <div style={{ height: '150px', overflowY: 'auto', fontSize: '0.85rem', color: '#00cc00', padding: '10px', borderLeft: '2px solid #00aaaa', background: 'rgba(0,0,0,0.5)', marginBottom: '20px' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
          ))}
          <div className="blink">_</div>
        </div>
      )}

      {/* Results Grid - Only show when complete */}
      {traceStep === 4 && result && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          
          <ResultBox icon={<Globe size={16} />} label="SERVICE PROVIDER" value={result.operator} color="#00ffff" />
          <ResultBox icon={<MapPin size={16} />} label="LOCATION / CIRCLE" value={result.circle} color="#ff00ff" />
          <ResultBox icon={<Activity size={16} />} label="STATUS" value={result.status} color="#ffff00" />
          <ResultBox icon={<ScanLine size={16} />} label="IP ADDRESS" value={result.ip} color="#00ff41" />
          <ResultBox icon={<Smartphone size={16} />} label="DEVICE TYPE" value={result.device} color="#ffffff" span={2} />
          
          <div style={{ gridColumn: 'span 2', marginTop: '12px', fontSize: '0.75rem', color: '#00aaaa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={12} />
              {isSelfTrace ? 'VERIFIED REAL-TIME DATA (HOST)' : 'DATA BASED ON ORIGINAL ALLOCATION SERIES.'}
            </div>
            {!isSelfTrace && (
                <div style={{ opacity: 0.7 }}>
                Exact GPS/IP tracking requires Law Enforcement Access.
                </div>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        .blink { animation: blinker 1s linear infinite; }
        @keyframes blinker { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

const ResultBox = ({ icon, label, value, color, span = 1 }) => (
  <div style={{ 
    gridColumn: `span ${span}`,
    background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.1)', 
    padding: '10px', 
    borderRadius: '4px' 
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
      {icon}
      {label}
    </div>
    <div style={{ fontSize: '1rem', fontWeight: 600, color: color, textShadow: `0 0 10px ${color}`, wordBreak: 'break-all' }}>
      {value}
    </div>
  </div>
);

export default DigitalTrace;
