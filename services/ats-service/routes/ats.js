// ============================================
// ATS Routes
// ============================================

const express = require('express');
const router = express.Router();

const { analyzeATS, healthCheck } = require('../controllers/atsController');
const { verifyToken } = require('../middleware/auth');
const { uploadResume } = require('../middleware/fileValidation');
const { atsRateLimiter } = require('../middleware/rateLimiter');

// GET /api/ats/health — public
router.get('/health', healthCheck);

// POST /api/ats/analyze — protected + PDF upload + rate limited
router.post('/analyze', verifyToken, uploadResume, atsRateLimiter, analyzeATS);

module.exports = router;
