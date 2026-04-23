// ============================================================
// Payment Service — Frontend API calls
// ============================================================

import axios from 'axios';

const PAYMENT_URL = '/api/payment';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// ── createOrder ──────────────────────────────────────────────
/**
 * Create a Razorpay order on the backend.
 * @param {string} planId  'starter' | 'pro' | 'premium'
 * @returns {{ orderId, amount, currency, plan, keyId }}
 */
export const createOrder = async (planId) => {
  const { data } = await axios.post(
    `${PAYMENT_URL}/create-order`,
    { planId },
    authHeader(),
  );
  return data;
};

// ── verifyPayment ─────────────────────────────────────────────
/**
 * Send payment proof to backend after Razorpay checkout succeeds.
 * @returns {{ success, message, subscription }}
 */
export const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, planId }) => {
  const { data } = await axios.post(
    `${PAYMENT_URL}/verify`,
    { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId },
    authHeader(),
  );
  return data;
};

// ── getSubscription ───────────────────────────────────────────
/**
 * Fetch current user's subscription info and payment history.
 * @returns {{ subscription, paymentHistory, plans }}
 */
export const getSubscription = async () => {
  const { data } = await axios.get(`${PAYMENT_URL}/subscription`, authHeader());
  return data;
};

// ── openRazorpayCheckout ──────────────────────────────────────
/**
 * Open the Razorpay checkout modal. Returns a Promise that resolves
 * on success and rejects on failure/dismissal.
 *
 * @param {{ orderId, amount, currency, plan, keyId }} orderData
 * @param {{ name, email }}                            user
 * @returns {Promise<{ razorpay_order_id, razorpay_payment_id, razorpay_signature }>}
 */
export const openRazorpayCheckout = (orderData, user) =>
  new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded. Please refresh and try again.'));
      return;
    }

    const options = {
      key:         orderData.keyId,
      amount:      orderData.amount,        // paise
      currency:    orderData.currency,
      name:        'Tcent.AI',
      description: orderData.plan.name,
      order_id:    orderData.orderId,
      prefill: {
        name:  user?.name  || '',
        email: user?.email || '',
      },
      theme: { color: '#059669' },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled by user.')),
      },
      handler: (response) => resolve(response),
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error?.description || 'Payment failed.'));
    });
    rzp.open();
  });
