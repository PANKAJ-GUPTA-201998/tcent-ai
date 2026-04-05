// ============================================
// Rate Limiter Middleware
// ============================================
// Limits users to 10 AI requests per day
// Prevents API abuse and manages Groq quota

const rateLimit = require('express-rate-limit');

/**
 * Create rate limiter for AI endpoints
 * 10 requests per user per day
 */
const aiRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 requests per day
  
  // Use user ID as key (requires auth middleware first)
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  
  // Custom error message
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Daily limit reached. You can make 10 AI requests per day.',
      remainingRequests: 0,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  },
  
  // Add rate limit info to response headers
  standardHeaders: true,
  legacyHeaders: false,
  
  // Skip failed requests
  skipFailedRequests: true,
  skipSuccessfulRequests: false,
  
  // Store in memory (for production, use Redis store)
  store: undefined
});

/**
 * More lenient rate limiter for testing
 * 100 requests per hour
 */
const testRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Too many requests. Please try again later.'
});

module.exports = {
  aiRateLimiter,
  testRateLimiter
};
