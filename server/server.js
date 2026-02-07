require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const trackRoutes = require('./routes/trackRoutes');

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

// Root Route
app.get('/', (req, res) => {
  res.send('Deepfake Guardian Tracer API is Running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
