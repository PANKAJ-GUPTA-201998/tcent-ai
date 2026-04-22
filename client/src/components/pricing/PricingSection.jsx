import { motion } from 'framer-motion';
import PricingCard from './PricingCard';

const Grain = ({ opacity = 0.03 }) => (
  <div aria-hidden="true" style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat', backgroundSize: '180px',
  }} />
);

const PLANS = [
  {
    title: 'Career Switch Program',
    price: '₹1,999',
    period: 'month',
    accent: 'emerald',
    popular: false,
    cta: 'Start Growing',
    features: [
      'AI Career Path Analysis',
      'Resume + LinkedIn Optimization',
      'Interview Preparation Guide',
      'Salary Negotiation Playbook',
      'ATS Resume Checker (unlimited)',
      'AI Career Advisor (unlimited)',
    ],
  },
  {
    title: 'Executive Track',
    price: '₹4,999',
    period: 'month',
    accent: 'gold',
    popular: true,
    cta: 'Get Executive Access',
    features: [
      'Everything in Career Switch',
      '1-on-1 Executive Coaching (2x/month)',
      'Leadership Assessment Report',
      'C-Suite & VP Roadmap',
      'Salary benchmark report (your city)',
      'Priority support & review turnaround',
    ],
  },
  {
    title: 'Deep Dive (One-Time)',
    price: '₹9,999',
    period: null,
    accent: 'emerald',
    popular: false,
    cta: 'Book Now',
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

const PricingSection = () => (
  <section style={{ background: '#1E293B', position: 'relative', overflow: 'hidden' }}>
    <Grain opacity={0.04} />
    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.15) 40%, rgba(5,150,105,0.15) 60%, transparent)' }} />

    <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55 }}
        className="text-center mb-16">
        <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#334155' }}>
          Transparent pricing
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Investment in your{' '}
          <span style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            career growth.
          </span>
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: '#475569' }}>
          The average professional wastes ₹8–15 lakhs per year being in the wrong role.
          Our plans cost a fraction of one month's salary gap.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan, i) => <PricingCard key={plan.title} {...plan} index={i} />)}
      </div>

      {/* Guarantee strip */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 text-center">
        <p className="text-xs" style={{ color: '#334155' }}>
          🛡️ 30-day money-back guarantee · No questions asked · Cancel anytime
        </p>
      </motion.div>
    </div>

    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.04) 60%, transparent)' }} />
  </section>
);

export default PricingSection;
