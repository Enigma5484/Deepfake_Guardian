require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const trackRoutes = require('./routes/trackRoutes');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.set('trust proxy', true); // Important for req.ip behind proxies

// Rate Limiting
const resultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/deepfake-guardian', {
  autoIndex: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/v1/tracker', resultLimiter, trackRoutes);

// Configure Multer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Analyze Endpoint
app.post('/api/v1/analyze', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image file uploaded' });
    }

    const scriptPath = path.join(__dirname, '../ml_service/predict.py');
    const imagePath = req.file.path;

    // Run Python Script
    const pythonProcess = spawn('python', [scriptPath, imagePath]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        // Optional: Delete file after processing
        // fs.unlinkSync(imagePath);

        if (code !== 0) {
            console.error('Python Script Error:', errorString);
            return res.status(500).json({ success: false, error: 'Analysis execution failed' });
        }

        // Parse Output
        // Expected: [Result] Class: ... \n [Confidence] ...%
        const classMatch = dataString.match(/\[Result\] Class: (.+)/);
        const confMatch = dataString.match(/\[Confidence\] (.+)%/);

        if (classMatch && confMatch) {
            res.json({
                success: true,
                result: {
                    label: classMatch[1].trim(),
                    confidence: parseFloat(confMatch[1]),
                    isFake: classMatch[1].includes('Fake')
                }
            });
        } else {
            console.error('Parse Error, Output:', dataString);
            res.status(500).json({ success: false, error: 'Failed to parse analysis results' });
        }
    });
});


// Keep track of the scanning process
let scanProcess = null;

// Global Scan Endpoint
app.post('/api/v1/global-scan', (req, res) => {
    const scriptPath = path.join(__dirname, '../ml_service/deepfake_scanner.py');
    const pauseFlagPath = path.join(__dirname, '../ml_service/scan_paused.flag');
    
    // Kill existing process if running
    if (scanProcess) {
        try {
            console.log('[Global Scan] Stopping previous scan process...');
            scanProcess.kill();
            scanProcess = null;
        } catch (e) {
            console.error("Failed to kill previous process:", e);
        }
    }

    // Clear pause flag if exists
    if (fs.existsSync(pauseFlagPath)) {
        try {
            fs.unlinkSync(pauseFlagPath);
        } catch (e) {
            console.error("Failed to clear pause flag:", e);
        }
    }

    // Clear previous results to reset count
    const resultsPath = path.join(__dirname, '../ml_service/scan_results.json');
    if (fs.existsSync(resultsPath)) {
        try {
            fs.unlinkSync(resultsPath);
        } catch (e) {
            console.error("Failed to clear previous results:", e);
        }
    }

    console.log(`[Global Scan] Initiating scan using ${scriptPath}`);

    // Run Python Script in detached mode
    // We keep a reference to it now, so we can kill it later.
    // Note: 'detached: true' might make it harder to kill if we lose the reference, 
    // but here we maintain the reference `scanProcess`.
    // However, if we restart the server, we lose the reference (OS manages that).
    // For now, this solves the "click proceed twice" issue within one server session.
    const pythonProcess = spawn('python', [scriptPath]);
    
    scanProcess = pythonProcess;

    pythonProcess.stdout.on('data', (data) => {
        // console.log(`[Scanner]: ${data}`); // Optional logging
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`[Scanner Error]: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`[Scanner] Process exited with code ${code}`);
        if (scanProcess === pythonProcess) {
            scanProcess = null;
        }
    });

    res.json({ 
        success: true, 
        message: 'Global deepfake scan initiated.' 
    });
});

// Scan Control Endpoint (Pause/Resume)
app.post('/api/v1/scan-control', (req, res) => {
    const { action } = req.body;
    const pauseFlagPath = path.join(__dirname, '../ml_service/scan_paused.flag');

    try {
        if (action === 'pause') {
            fs.closeSync(fs.openSync(pauseFlagPath, 'w'));
            res.json({ success: true, message: 'Scan paused' });
        } else if (action === 'resume') {
            if (fs.existsSync(pauseFlagPath)) {
                fs.unlinkSync(pauseFlagPath);
            }
            res.json({ success: true, message: 'Scan resumed' });
        } else {
            res.status(400).json({ success: false, error: 'Invalid action' });
        }
    } catch (error) {
        console.error("Control error:", error);
        res.status(500).json({ success: false, error: 'Failed to execute control action' });
    }
});

// Get Websites List Endpoint
app.get('/api/v1/websites', (req, res) => {
    const websitesPath = path.join(__dirname, '../websites.txt');
    fs.readFile(websitesPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading websites.txt:", err);
            return res.status(500).json({ success: false, error: 'Failed to load website list' });
        }
        const websites = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        res.json({ success: true, websites });
    });
});

// Get Scan Results Endpoint
app.get('/api/v1/scan-results', (req, res) => {
    const resultsPath = path.join(__dirname, '../ml_service/scan_results.json');
    if (!fs.existsSync(resultsPath)) {
        return res.json({ success: true, results: [], summary: { total_scanned: 0 } });
    }
    
    fs.readFile(resultsPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading results:", err);
            return res.status(500).json({ success: false, error: 'Failed to load results' });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json({ success: true, ...jsonData });
        } catch (e) {
            res.json({ success: true, results: [], summary: { total_scanned: 0 } });
        }
    });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Deepfake Guardian Tracer API is Running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
