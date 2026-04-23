// ============================================================
// Payment Controller
// ============================================================

const {
  PLANS,
  createOrder,
  verifyPayment,
  verifyWebhookSignature,
  getPaymentDetails,
  createRefund,
  computeSubscriptionDates,
} = require('../razorpayService');

const mongoose = require('mongoose');

// Lazy-load User model to reuse whichever mongoose instance is active
const getUser = () => {
  if (mongoose.models.User) return mongoose.models.User;
  return require('../../auth-service/src/models/User');
};

// ── POST /api/payment/create-order ───────────────────────────
const createOrderHandler = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId || !PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: `Invalid plan. Choose one of: ${Object.keys(PLANS).join(', ')}`,
      });
    }

    const { order, plan } = await createOrder({
      planId,
      userId:    req.user.id,
      userEmail: req.user.email,
      userName:  req.user.name || '',
    });

    return res.json({
      success: true,
      orderId:     order.id,
      amount:      order.amount,      // paise
      currency:    order.currency,
      plan: {
        id:          plan.id,
        name:        plan.displayName,
        amountINR:   plan.amountINR,
        period:      plan.period,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('[payment] create-order error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create payment order.' });
  }
};

// ── POST /api/payment/verify ─────────────────────────────────
const verifyPaymentHandler = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
    }

    // 1. Verify signature
    const isValid = verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }

    // 2. Fetch payment details from Razorpay to confirm captured status
    const paymentDetails = await getPaymentDetails(razorpay_payment_id);
    if (paymentDetails.status !== 'captured') {
      return res.status(400).json({ success: false, message: `Payment not captured. Status: ${paymentDetails.status}` });
    }

    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ success: false, message: 'Unknown plan.' });

    // 3. Update user subscription in DB
    const User = getUser();
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const { startDate, endDate } = computeSubscriptionDates(plan, user.subscription?.endDate);

    user.subscription = {
      plan:       plan.id,
      status:     'active',
      startDate,
      endDate,
      amount:     plan.amountINR,
      autoRenew:  plan.period === 'month',
    };

    user.paymentHistory.push({
      orderId:   razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount:    plan.amountINR,
      planName:  plan.displayName,
      status:    'paid',
      paidAt:    new Date(),
      method:    paymentDetails.method || 'card',
    });

    await user.save();

    return res.json({
      success: true,
      message: `${plan.displayName} activated successfully!`,
      subscription: user.subscription,
    });
  } catch (err) {
    console.error('[payment] verify error:', err.message);
    return res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
};

// ── GET /api/payment/subscription ───────────────────────────
const getSubscriptionHandler = async (req, res) => {
  try {
    const User = getUser();
    const user = await User.findById(req.user.id).select('subscription paymentHistory');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Auto-expire subscription if past end date
    if (
      user.subscription?.status === 'active' &&
      user.subscription.endDate &&
      new Date() > new Date(user.subscription.endDate)
    ) {
      user.subscription.status = 'expired';
      await user.save();
    }

    return res.json({
      success: true,
      subscription:   user.subscription  || null,
      paymentHistory: user.paymentHistory || [],
      plans:          Object.values(PLANS).map(p => ({
        id:         p.id,
        name:       p.displayName,
        amountINR:  p.amountINR,
        period:     p.period,
        description: p.description,
      })),
    });
  } catch (err) {
    console.error('[payment] subscription fetch error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch subscription.' });
  }
};

// ── POST /api/payment/webhook ────────────────────────────────
// Razorpay sends events here. Must receive raw body for sig check.
const webhookHandler = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) return res.status(400).json({ success: false, message: 'Missing signature.' });

    // rawBody is set by the raw-body middleware in the route file
    const rawBody = req.rawBody;
    if (!rawBody) return res.status(400).json({ success: false, message: 'Missing raw body.' });

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });

    const event   = req.body;
    const payload = event?.payload?.payment?.entity;

    if (event.event === 'payment.captured' && payload) {
      const notes = payload.notes || {};
      const User  = getUser();
      const user  = await User.findById(notes.userId);

      if (user) {
        const plan = PLANS[notes.planId];
        if (plan) {
          const { startDate, endDate } = computeSubscriptionDates(plan, user.subscription?.endDate);
          user.subscription = { plan: plan.id, status: 'active', startDate, endDate, amount: plan.amountINR, autoRenew: plan.period === 'month' };

          const alreadyRecorded = user.paymentHistory.some(h => h.paymentId === payload.id);
          if (!alreadyRecorded) {
            user.paymentHistory.push({
              orderId:  payload.order_id,
              paymentId: payload.id,
              amount:   plan.amountINR,
              planName: plan.displayName,
              status:   'paid',
              paidAt:   new Date(payload.created_at * 1000),
              method:   payload.method || 'card',
            });
          }
          await user.save();
        }
      }
    }

    if (event.event === 'payment.failed' && payload) {
      const notes = payload.notes || {};
      const User  = getUser();
      const user  = await User.findById(notes.userId);
      if (user) {
        const plan = PLANS[notes.planId];
        const alreadyRecorded = user.paymentHistory.some(h => h.orderId === payload.order_id);
        if (plan && !alreadyRecorded) {
          user.paymentHistory.push({
            orderId:  payload.order_id,
            paymentId: payload.id || '',
            amount:   plan.amountINR,
            planName: plan.displayName,
            status:   'failed',
            paidAt:   new Date(),
            method:   payload.method || '',
          });
          await user.save();
        }
      }
    }

    return res.json({ success: true, received: true });
  } catch (err) {
    console.error('[payment] webhook error:', err.message);
    return res.status(500).json({ success: false, message: 'Webhook processing failed.' });
  }
};

// ── POST /api/payment/refund ─────────────────────────────────
const refundHandler = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;
    if (!paymentId) return res.status(400).json({ success: false, message: 'paymentId is required.' });

    // Only allow refunding own payments (unless admin)
    const User = getUser();
    const user = await User.findById(req.user.id).select('paymentHistory subscription role');
    const isAdmin = user?.role === 'admin';

    if (!isAdmin) {
      const owns = user?.paymentHistory?.some(h => h.paymentId === paymentId && h.status === 'paid');
      if (!owns) return res.status(403).json({ success: false, message: 'You can only refund your own payments.' });
    }

    const amountPaise = amount ? Math.round(amount * 100) : undefined;
    const refund = await createRefund(paymentId, amountPaise, reason || 'Customer refund request');

    // Mark subscription cancelled if full refund
    if (!amount && user) {
      user.subscription.status = 'cancelled';
      const entry = user.paymentHistory.find(h => h.paymentId === paymentId);
      if (entry) entry.status = 'refunded';
      await user.save();
    }

    return res.json({ success: true, refund });
  } catch (err) {
    console.error('[payment] refund error:', err.message);
    return res.status(500).json({ success: false, message: 'Refund failed. ' + err.message });
  }
};

module.exports = {
  createOrderHandler,
  verifyPaymentHandler,
  getSubscriptionHandler,
  webhookHandler,
  refundHandler,
};
