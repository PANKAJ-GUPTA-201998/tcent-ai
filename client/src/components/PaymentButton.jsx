import { useState } from 'react';
import { Loader2, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { createOrder, openRazorpayCheckout, verifyPayment } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

/**
 * PaymentButton
 *
 * Props:
 *   planId       — 'starter' | 'pro' | 'premium'
 *   label        — Button label (default: 'Subscribe Now')
 *   className    — Extra Tailwind classes
 *   accent       — 'emerald' | 'gold' (controls gradient)
 *   onSuccess    — callback(subscription) after successful payment + verification
 *   onError      — callback(errorMessage) on failure
 */
const PaymentButton = ({
  planId,
  label    = 'Subscribe Now',
  className = '',
  accent   = 'emerald',
  onSuccess,
  onError,
}) => {
  const { user } = useAuth();
  const [status, setStatus]   = useState('idle');  // idle | loading | success | error
  const [message, setMessage] = useState('');

  const isGold = accent === 'gold';
  const gradient = isGold
    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
    : 'linear-gradient(135deg, #059669, #047857)';
  const glow = isGold
    ? 'rgba(245,158,11,0.45)'
    : 'rgba(5,150,105,0.45)';
  const textColor = isGold ? '#0F172A' : '#fff';

  const handleClick = async () => {
    if (status === 'loading' || status === 'success') return;

    setStatus('loading');
    setMessage('');

    try {
      // 1. Create order on backend
      const orderData = await createOrder(planId);

      // 2. Open Razorpay checkout modal
      const paymentResponse = await openRazorpayCheckout(orderData, user);

      // 3. Verify payment on backend
      const result = await verifyPayment({
        razorpay_order_id:  paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature:  paymentResponse.razorpay_signature,
        planId,
      });

      setStatus('success');
      setMessage(result.message || 'Payment successful!');
      onSuccess?.(result.subscription);

    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Payment failed. Please try again.';
      setStatus('error');
      setMessage(msg);
      onError?.(msg);

      // Auto-reset after 5s so user can retry
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold ${className}`}
        style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.4)', color: '#34D399' }}>
        <CheckCircle size={16} />
        {message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        style={{
          background: gradient,
          color: textColor,
          boxShadow: `0 0 20px ${glow}`,
        }}
        onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.boxShadow = `0 0 32px ${glow}`; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${glow}`; }}
      >
        {status === 'loading' ? (
          <><Loader2 size={15} className="animate-spin" /> Processing…</>
        ) : (
          <><Zap size={15} /> {label}</>
        )}
      </button>

      {status === 'error' && message && (
        <div className="flex items-start gap-1.5 text-xs text-red-400 px-1">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          {message}
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
