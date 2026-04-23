import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, Crown, Star, Shield, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';
import { getSubscription } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

// ── Plan data ─────────────────────────────────────────────────
const PLANS = [
  {
    id:       'starter',
    name:     'Starter',
    price:    '₹999',
    period:   '/month',
    accent:   'emerald',
    icon:     Zap,
    popular:  false,
    cta:      'Get Started',
    badge:    null,
    features: [
      'ATS Resume Checker (unlimited)',
      'AI Career Advisor (unlimited)',
      'Resume Upload & Analysis',
      'Career Path Matching',
      'Skill Gap Detection',
      'Email support',
    ],
  },
  {
    id:       'pro',
    name:     'Pro',
    price:    '₹2,999',
    period:   '/month',
    accent:   'gold',
    icon:     Crown,
    popular:  true,
    cta:      'Get Pro Access',
    badge:    'Most Popular',
    features: [
      'Everything in Starter',
      '1-on-1 Executive Coaching (2×/month)',
      'Leadership Assessment Report',
      'C-Suite & VP Roadmap',
      'Salary benchmark (your city + role)',
      'Priority support & review',
    ],
  },
  {
    id:       'premium',
    name:     'Premium',
    price:    '₹9,999',
    period:   ' one-time',
    accent:   'emerald',
    icon:     Star,
    popular:  false,
    cta:      'Book Deep Dive',
    badge:    'Best Value',
    features: [
      'Complete 360° Career Audit',
      'Custom Growth Strategy Document',
      'Full Resume & LinkedIn Overhaul',
      '3 Coaching Sessions (60 min each)',
      'Salary negotiation script (your role)',
      '90-day follow-up email access',
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────
const ACCENT = {
  emerald: {
    color:    '#059669',
    gradient: 'linear-gradient(135deg,#059669,#047857)',
    glow:     'rgba(5,150,105,0.15)',
    border:   'rgba(5,150,105,0.3)',
    badge:    { bg: 'rgba(5,150,105,0.15)', text: '#34D399', border: 'rgba(5,150,105,0.3)' },
  },
  gold: {
    color:    '#F59E0B',
    gradient: 'linear-gradient(135deg,#F59E0B,#D97706)',
    glow:     'rgba(245,158,11,0.12)',
    border:   'rgba(245,158,11,0.35)',
    badge:    { bg: 'rgba(245,158,11,0.15)', text: '#FCD34D', border: 'rgba(245,158,11,0.35)' },
  },
};

// ── Subscription status banner ────────────────────────────────
const SubscriptionBanner = ({ sub, onRefresh }) => {
  if (!sub || sub.status !== 'active') return null;

  const end = sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex items-center justify-between gap-3 rounded-xl px-5 py-3.5 text-sm"
      style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)' }}
    >
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
        <span className="text-emerald-300 font-semibold">
          {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} plan active
        </span>
        {end && <span className="text-slate-400">· Renews {end}</span>}
      </div>
      <button onClick={onRefresh} className="text-slate-500 hover:text-slate-300 transition-colors">
        <RefreshCw size={14} />
      </button>
    </motion.div>
  );
};

// ── PricingCard ───────────────────────────────────────────────
const PricingCard = ({ plan, currentPlan, isAuthenticated, onPaymentSuccess }) => {
  const a = ACCENT[plan.accent];
  const Icon = plan.icon;
  const isCurrentPlan = currentPlan === plan.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col rounded-2xl p-7"
      style={{
        background: plan.popular ? `rgba(245,158,11,0.04)` : '#1E293B',
        border: `1.5px solid ${plan.popular ? a.border : 'rgba(255,255,255,0.06)'}`,
        boxShadow: plan.popular ? `0 0 48px ${a.glow}` : 'none',
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className="px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase"
            style={{
              background: a.gradient,
              color: plan.accent === 'gold' ? '#0F172A' : '#fff',
            }}
          >
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${a.color}20` }}>
            <Icon size={16} style={{ color: a.color }} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: a.color }}>
            {plan.name}
          </h3>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
            {plan.price}
          </span>
          <span className="text-sm text-slate-500 mb-1.5">{plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
            <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: a.color }} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrentPlan ? (
        <div
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.4)', color: '#34D399' }}
        >
          <CheckCircle size={15} /> Current Plan
        </div>
      ) : isAuthenticated ? (
        <PaymentButton
          planId={plan.id}
          label={plan.cta}
          accent={plan.accent}
          className="w-full"
          onSuccess={onPaymentSuccess}
        />
      ) : (
        <a
          href="/register"
          className="block text-center px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: a.gradient,
            color: plan.accent === 'gold' ? '#0F172A' : '#fff',
            boxShadow: `0 0 20px ${a.glow}`,
          }}
        >
          {plan.cta}
        </a>
      )}
    </motion.div>
  );
};

// ── Payment History Table ─────────────────────────────────────
const PaymentHistoryTable = ({ history }) => {
  if (!history?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#1E293B' }}
    >
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-bold text-white">Payment History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Plan', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((payment, i) => (
              <tr key={payment.paymentId || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="px-6 py-3 text-slate-300 font-medium">{payment.planName}</td>
                <td className="px-6 py-3 text-slate-300">₹{payment.amount?.toLocaleString('en-IN')}</td>
                <td className="px-6 py-3 text-slate-400 capitalize">{payment.method || '—'}</td>
                <td className="px-6 py-3">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: payment.status === 'paid' ? 'rgba(5,150,105,0.15)' : payment.status === 'refunded' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      color: payment.status === 'paid' ? '#34D399' : payment.status === 'refunded' ? '#FCD34D' : '#F87171',
                    }}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-400">
                  {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────
const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription]     = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingSub, setLoadingSub]         = useState(false);

  const fetchSub = async () => {
    if (!isAuthenticated) return;
    setLoadingSub(true);
    try {
      const data = await getSubscription();
      setSubscription(data.subscription);
      setPaymentHistory(data.paymentHistory || []);
    } catch (_) {
      // silently ignore — user simply has no subscription yet
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => { fetchSub(); }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePaymentSuccess = (sub) => {
    setSubscription(sub);
    fetchSub();
  };

  return (
    <div className="min-h-screen" style={{ background: '#0F172A' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)', color: '#34D399' }}>
            <Shield size={11} /> Transparent Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Invest in your{' '}
            <span style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              career growth.
            </span>
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#475569' }}>
            The average professional loses ₹8–15 lakhs per year being in the wrong role.
            Our plans cost a fraction of one month's salary gap.
          </p>
        </motion.div>

        {/* ── Active subscription banner ── */}
        <SubscriptionBanner sub={subscription} onRefresh={fetchSub} />

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {PLANS.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentPlan={subscription?.status === 'active' ? subscription.plan : null}
              isAuthenticated={isAuthenticated}
              onPaymentSuccess={handlePaymentSuccess}
            />
          ))}
        </div>

        {/* ── Guarantee strip ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs mt-8"
          style={{ color: '#334155' }}
        >
          🛡️ 30-day money-back guarantee · No questions asked · Cancel anytime · Secured by Razorpay
        </motion.p>

        {/* ── Payment history ── */}
        <AnimatePresence>
          {paymentHistory.length > 0 && (
            <PaymentHistoryTable history={paymentHistory} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Pricing;
