const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter — applied globally in index.js.
 * 100 requests per IP per 15-minute window.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Stricter limiter for assessment submission endpoints.
 * Prevents bulk submission abuse: 10 submissions per IP per hour.
 */
const assessmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many assessment submissions. Please try again after an hour.',
  },
});

/**
 * Daily assessment limiter — applied to /submit and /retake.
 * IP-level guard only; per-user enforcement is handled via DB count in the routes.
 * 3 attempts per IP per 24-hour window mirrors the per-user cap.
 */
const dailyAssessmentLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Assessment limit reached for today. Please try again tomorrow.',
  },
});

module.exports = { apiLimiter, assessmentLimiter, dailyAssessmentLimiter };
