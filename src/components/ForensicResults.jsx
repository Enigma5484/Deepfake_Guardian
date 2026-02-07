import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Shield, Globe, Smartphone, Activity, MapPin, ScanLine, AlertTriangle } from 'lucide-react';

const ForensicResults = () => {
    const [searchParams] = useSearchParams();
    const trackingId = searchParams.get('id');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!trackingId) {
                setError('No Tracking ID provided.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`/api/v1/tracker/results/${trackingId}`);
                if (res.data.success) {
                    setData(res.data.data);
                } else {
                    setError('Tracking data not found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch forensic data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [trackingId]);

    if (loading) return <div className="loading-screen">Decrypting Forensic Data...</div>;
    
    if (error) return (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
            <AlertTriangle size={48} style={{ marginBottom: '16px' }} />
            <h3>Access Denied</h3>
            <p>{error}</p>
        </div>
    );

    if (!data || data.status !== 'CLICKED') return (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <Activity size={48} color="#F59E0B" style={{ marginBottom: '16px' }} />
            <h3>Tracking In Progress</h3>
            <p>The target has not yet accessed the secure link. Waiting for connection...</p>
            <div className="animate-pulse" style={{ marginTop: '20px', color: '#10B981' }}>Listening...</div>
        </div>
    );

    const { network, ip, clickedAt } = data;

    return (
        <div className="forensic-results glass-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '0', overflow: 'hidden' }}>
            <div className="header" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={32} color="#10B981" />
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#10B981' }}>Forensic Report</h2>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>ID: {trackingId} • {new Date(clickedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
                {/* Metrics */}
                <ResultItem icon={Globe} label="ISP / Organization" value={network.isp} />
                <ResultItem icon={Activity} label="ASN" value={network.asn} />
                <ResultItem icon={MapPin} label="Location" value={`${network.city}, ${network.region}, ${network.country}`} />
                <ResultItem icon={ScanLine} label="IP Address" value={ip} highlight />
                <ResultItem icon={Smartphone} label="Device / User-Agent" value={network.deviceType} fullWidth />
            </div>

             <div style={{ padding: '24px', background: 'rgba(0,0,0,0.2)' }}>
                <h4 style={{ margin: '0 0 12px', color: 'var(--text-main)' }}>Network Analysis</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    The target device accessed the tracking node from <strong>{network.city}, {network.country}</strong> using <strong>{network.isp}</strong> infrastructure. 
                    IP reputation analysis suggests this is a residential connection.
                </p>
            </div>
        </div>
    );
};

const ResultItem = ({ icon: Icon, label, value, highlight, fullWidth }) => (
    <div style={{ 
        background: 'var(--bg-card)', 
        padding: '20px', 
        gridColumn: fullWidth ? '1 / -1' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Icon size={16} />
            {label}
        </div>
        <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            color: highlight ? '#10B981' : 'var(--text-main)',
            wordBreak: 'break-word'
        }}>
            {value || 'Unknown'}
        </div>
    </div>
);

export default ForensicResults;
