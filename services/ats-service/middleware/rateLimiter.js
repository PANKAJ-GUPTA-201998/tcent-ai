// ============================================
// Rate Limiter - ATS Service
// ============================================
// 10 ATS analyses per user per day

const rateLimit = require('express-rate-limit');

const atsRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Daily limit reached. You can run 10 ATS analyses per day.',
      remainingRequests: 0,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

module.exports = { atsRateLimiter };
