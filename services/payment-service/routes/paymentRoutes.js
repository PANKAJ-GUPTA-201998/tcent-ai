// ============================================================
// Payment Routes
// ============================================================

const express = require('express');
const router  = express.Router();

const {
  createOrderHandler,
  verifyPaymentHandler,
  getSubscriptionHandler,
  webhookHandler,
  refundHandler,
} = require('../controllers/paymentController');

// Auth middleware — reuse the one from auth-service
const { verifyToken } = require('../../upload-service/src/middleware/auth');

// ── Webhook — MUST be before express.json() so we can capture rawBody
// The unified api/[...path].js mounts this router AFTER express.json(),
// so we stash the raw body ourselves on the webhook route via a special
// middleware defined right here.
const captureRawBody = (req, res, next) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks).toString('utf8');
    try { req.body = JSON.parse(req.rawBody); } catch (_) { req.body = {}; }
    next();
  });
  req.on('error', next);
};

// Public — Razorpay webhook (no auth, signature-verified)
router.post('/webhook', captureRawBody, webhookHandler);

// Protected routes
router.post('/create-order',  verifyToken, createOrderHandler);
router.post('/verify',        verifyToken, verifyPaymentHandler);
router.get('/subscription',   verifyToken, getSubscriptionHandler);
router.post('/refund',        verifyToken, refundHandler);

module.exports = router;
