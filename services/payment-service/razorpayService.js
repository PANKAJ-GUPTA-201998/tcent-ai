// ============================================================
// Razorpay Service — core SDK wrapper
// ============================================================
// All Razorpay API calls live here. Controllers call these
// methods; they never touch the SDK directly.

const Razorpay = require('razorpay');
const crypto   = require('crypto');

// Lazy-init so the module can be required without env vars set
// (e.g. during test imports). Actual calls will fail fast if
// keys are missing, which is the right behaviour.
let _instance = null;
const getRazorpay = () => {
  if (_instance) return _instance;

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables');
  }

  _instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return _instance;
};

// ── Plan catalogue ────────────────────────────────────────────
// Single source of truth — imported by controller + frontend service
const PLANS = {
  starter: {
    id:          'starter',
    name:        'Starter',
    displayName: 'Starter Plan',
    amountPaise: 99900,          // ₹999 in paise
    amountINR:   999,
    currency:    'INR',
    period:      'month',
    durationDays: 30,
    description: 'AI career tools for working professionals',
  },
  pro: {
    id:          'pro',
    name:        'Pro',
    displayName: 'Pro Plan',
    amountPaise: 299900,         // ₹2,999 in paise
    amountINR:   2999,
    currency:    'INR',
    period:      'month',
    durationDays: 30,
    description: 'Everything in Starter + executive coaching',
  },
  premium: {
    id:          'premium',
    name:        'Premium',
    displayName: 'Premium Plan',
    amountPaise: 999900,         // ₹9,999 in paise
    amountINR:   9999,
    currency:    'INR',
    period:      'one-time',
    durationDays: 365,
    description: '360° career audit — one-time deep dive',
  },
};

// ── createOrder ───────────────────────────────────────────────
/**
 * Create a Razorpay order for the given planId.
 * Returns the order object that the frontend hands to the checkout widget.
 */
const createOrder = async ({ planId, userId, userEmail, userName }) => {
  const plan = PLANS[planId];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);

  const rzp = getRazorpay();

  const order = await rzp.orders.create({
    amount:   plan.amountPaise,
    currency: plan.currency,
    receipt:  `rcpt_${userId}_${Date.now()}`,
    notes: {
      planId,
      planName: plan.displayName,
      userId,
      userEmail,
      userName,
    },
  });

  return { order, plan };
};

// ── verifyPayment ─────────────────────────────────────────────
/**
 * Verify Razorpay payment signature (HMAC-SHA256).
 * Must be called before crediting any subscription.
 *
 * @returns {boolean} true if signature is valid
 */
const verifyPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET not set');

  const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected  = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(razorpay_signature, 'hex'),
  );
};

// ── verifyWebhookSignature ────────────────────────────────────
/**
 * Verify that a webhook request genuinely came from Razorpay.
 * Pass the raw request body (Buffer/string) and the
 * X-Razorpay-Signature header value.
 */
const verifyWebhookSignature = (rawBody, signature) => {
  const secret   = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET not set');

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature, 'hex'),
  );
};

// ── getPaymentDetails ─────────────────────────────────────────
/**
 * Fetch a single payment's details from Razorpay.
 */
const getPaymentDetails = async (paymentId) => {
  const rzp = getRazorpay();
  return rzp.payments.fetch(paymentId);
};

// ── createRefund ──────────────────────────────────────────────
/**
 * Issue a full or partial refund for a payment.
 * @param {string} paymentId   - Razorpay payment ID
 * @param {number} amountPaise - Amount to refund in paise (omit for full refund)
 * @param {string} notes       - Optional refund reason
 */
const createRefund = async (paymentId, amountPaise, notes = '') => {
  const rzp = getRazorpay();

  const options = { speed: 'normal', notes: { reason: notes } };
  if (amountPaise) options.amount = amountPaise;

  return rzp.payments.refund(paymentId, options);
};

// ── computeSubscriptionDates ──────────────────────────────────
/**
 * Given a plan and optional existing end date, compute new
 * subscription start and end dates.
 * Re-subscribing before expiry extends from the current end date.
 */
const computeSubscriptionDates = (plan, currentEndDate) => {
  const now   = new Date();
  const start = (!currentEndDate || currentEndDate < now) ? now : new Date(currentEndDate);
  const end   = new Date(start);
  end.setDate(end.getDate() + plan.durationDays);
  return { startDate: start, endDate: end };
};

module.exports = {
  PLANS,
  createOrder,
  verifyPayment,
  verifyWebhookSignature,
  getPaymentDetails,
  createRefund,
  computeSubscriptionDates,
};
