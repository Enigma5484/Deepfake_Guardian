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
const PORT = process.env.PORT || 5000;

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

// Root Route
app.get('/', (req, res) => {
  res.send('Deepfake Guardian Tracer API is Running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
