const express = require('express');
const router = express.Router();
const { generateTracker, trackRequest, getResults } = require('../controllers/trackController');

router.post('/generate', generateTracker);
router.get('/t/:id', trackRequest);
router.get('/results/:id', getResults);

module.exports = router;
