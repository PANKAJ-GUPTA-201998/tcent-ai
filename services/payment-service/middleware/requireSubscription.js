// ============================================================
// requireSubscription middleware
// ============================================================
// Use after verifyToken on any route that requires an active paid plan.
//
// Usage:
//   const { requireSubscription } = require('../payment-service/middleware/requireSubscription');
//   router.post('/premium-feature', verifyToken, requireSubscription(), handler);
//
// Options:
//   plans: ['pro', 'premium']  — only these plans are allowed (default: any active plan)

const mongoose = require('mongoose');

const getUser = () => {
  if (mongoose.models.User) return mongoose.models.User;
  return require('../../auth-service/src/models/User');
};

const requireSubscription = (options = {}) => {
  const allowedPlans = options.plans || ['starter', 'pro', 'premium'];

  return async (req, res, next) => {
    try {
      const User = getUser();
      const user = await User.findById(req.user.id).select('subscription role');

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found.' });
      }

      // Admins bypass subscription checks
      if (user.role === 'admin') return next();

      const sub = user.subscription;

      if (!sub || sub.status !== 'active') {
        return res.status(403).json({
          success: false,
          code:    'SUBSCRIPTION_REQUIRED',
          message: 'An active subscription is required to access this feature.',
          upgradeUrl: '/pricing',
        });
      }

      // Check end date
      if (sub.endDate && new Date() > new Date(sub.endDate)) {
        // Auto-expire in DB (fire-and-forget — don't block the response)
        User.updateOne({ _id: req.user.id }, { 'subscription.status': 'expired' }).catch(() => {});

        return res.status(403).json({
          success:    false,
          code:       'SUBSCRIPTION_EXPIRED',
          message:    'Your subscription has expired. Please renew to continue.',
          upgradeUrl: '/pricing',
        });
      }

      // Check plan tier
      if (!allowedPlans.includes(sub.plan)) {
        return res.status(403).json({
          success:    false,
          code:       'PLAN_UPGRADE_REQUIRED',
          message:    `This feature requires one of these plans: ${allowedPlans.join(', ')}.`,
          upgradeUrl: '/pricing',
        });
      }

      // Attach subscription to request for downstream use
      req.subscription = sub;
      next();
    } catch (err) {
      console.error('[requireSubscription]', err.message);
      return res.status(500).json({ success: false, message: 'Subscription check failed.' });
    }
  };
};

module.exports = { requireSubscription };
