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

// POST /api/ats/analyze — protected + rate limited + PDF upload
router.post('/analyze', verifyToken, atsRateLimiter, uploadResume, analyzeATS);

module.exports = router;
