// ============================================
// Career Routes
// ============================================

const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const { verifyToken } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

// Public - browse career paths
router.get('/paths', careerController.getCareerPaths);

// Protected - analyze resume for career intelligence
router.post('/analyze', verifyToken, aiRateLimiter, careerController.analyzeCareer);

module.exports = router;
