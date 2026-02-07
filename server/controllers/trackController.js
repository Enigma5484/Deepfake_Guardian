const Tracker = require('../models/Tracker');
const axios = require('axios');
const crypto = require('crypto');

// Generate unique ID
const generateId = () => {
    return  crypto.randomBytes(4).toString('hex');
};

// @desc    Generate a new tracking link
// @route   POST /api/v1/tracker/generate
exports.generateTracker = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ success: false, error: 'Phone number is required' });
        }

        const id = generateId();
        
        const tracker = await Tracker.create({
            trackingId: id,
            targetPhone: phone
        });

        const trackingUrl = `${req.protocol}://${req.get('host')}/api/v1/tracker/t/${id}`;

        res.status(201).json({
            success: true,
            data: {
                trackingId: id,
                trackingUrl: trackingUrl
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Track the request (User clicked the link)
// @route   GET /api/v1/tracker/t/:id
// @desc    Track the request (User clicked the link)
// @route   GET /api/v1/tracker/t/:id
exports.trackRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const tracker = await Tracker.findOne({ trackingId: id });

        if (!tracker) {
            return res.status(404).send('Link not found or expired.');
        }

        // Capture IP
        let ip = req.ip || req.connection.remoteAddress;
        if (ip.substr(0, 7) == "::ffff:") {
            ip = ip.substr(7);
        }

        console.log(`[Track] Request from IP: ${ip}`);

        let networkData = {
            isp: 'Unknown ISP',
            asn: 'N/A',
            city: 'Unknown City',
            region: 'Unknown Region',
            country: 'Unknown Country',
            deviceType: req.get('User-Agent') || 'Unknown Device'
        };

        // Helper to fetch from ipapi.co
        const fetchIpapi = async (queryIp) => {
            try {
                const url = queryIp ? `https://ipapi.co/${queryIp}/json/` : 'https://ipapi.co/json/';
                console.log(`[Track] Trying Primary API: ${url}`);
                const response = await axios.get(url, { timeout: 5000 });
                if (!response.data.error) {
                    return {
                        isp: response.data.org || response.data.asn,
                        asn: response.data.asn,
                        city: response.data.city,
                        region: response.data.region,
                        country: response.data.country_name,
                        deviceType: req.get('User-Agent')
                    };
                }
            } catch (e) {
                console.log(`[Track] Primary API Failed: ${e.message}`);
            }
            return null;
        };

        // Helper to fetch from ip-api.com (Fallback)
        const fetchIpApiCom = async (queryIp) => {
             try {
                // ip-api.com doesn't support empty for "my ip" via simple GET in same way, 
                // but for localhost simulation we need a public IP.
                // If queryIp is empty (meaning localhost), ip-api.com will return the server's IP which is perfect.
                const url = `http://ip-api.com/json/${queryIp || ''}`; 
                console.log(`[Track] Trying Fallback API: ${url}`);
                const response = await axios.get(url, { timeout: 5000 });
                if (response.data.status === 'success') {
                    return {
                        isp: response.data.isp || response.data.org,
                        asn: response.data.as,
                        city: response.data.city,
                        region: response.data.regionName,
                        country: response.data.country,
                        deviceType: req.get('User-Agent')
                    };
                }
            } catch (e) {
                console.log(`[Track] Fallback API Failed: ${e.message}`);
            }
            return null;
        };

        // Handle Localhost
        let queryIp = ip;
        if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
            console.log('[Track] Localhost detected. Will attempt to resolve public IP of server.');
            queryIp = ''; // Empty to fetch "my ip"
        }

        // Attempt Resolution
        const primaryResult = await fetchIpapi(queryIp);
        if (primaryResult) {
            networkData = primaryResult;
        } else {
            console.log('[Track] Primary API failed. Attempting fallback...');
            const fallbackResult = await fetchIpApiCom(queryIp);
            if (fallbackResult) {
                networkData = fallbackResult;
            }
        }

        console.log('[Track] Final Data:', networkData);

        // Update Database
        tracker.status = 'CLICKED';
        tracker.clickedAt = Date.now();
        tracker.ip = (queryIp === '') ? '127.0.0.1 (Localhost)' : ip;
        tracker.network = networkData;
        await tracker.save();

        console.log('[Track] Database updated. Redirecting...');
        
        // Redirect
        res.redirect(`http://localhost:5173/verify?id=${id}`);

    } catch (err) {
        console.error(err);
        res.status(500).send('Tracking Error');
    }
};

// @desc    Get captured results for a forensic report
// @route   GET /api/v1/tracker/results/:id
exports.getResults = async (req, res) => {
    try {
        const { id } = req.params;
        const tracker = await Tracker.findOne({ trackingId: id });

        if (!tracker) {
            return res.status(404).json({ success: false, error: 'Tracker not found' });
        }

        res.status(200).json({
            success: true,
            data: tracker
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
