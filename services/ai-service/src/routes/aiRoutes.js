// ============================================
// AI Routes
// ============================================
// Defines all AI service endpoints

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

// Public route (no auth required)
router.get('/health', aiController.healthCheck);

// Protected routes (require authentication + rate limiting)
router.post(
  '/career-advice',
  verifyToken,
  aiRateLimiter,
  aiController.getCareerAdvice
);

router.post(
  '/resume-review',
  verifyToken,
  aiRateLimiter,
  aiController.reviewResume
);

router.post(
  '/skill-gap',
  verifyToken,
  aiRateLimiter,
  aiController.analyzeSkillGap
);

module.exports = router;
