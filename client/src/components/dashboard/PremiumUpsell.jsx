import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';

const FEATURES = [
  'Personal coach assigned within 24 hours',
  'Weekly 1-on-1 strategy video calls',
  'Priority resume & LinkedIn reviews',
  'Direct referrals to hiring managers',
];

const PremiumUpsell = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, #1E293B 0%, #1A1F2E 100%)',
      border: '1px solid rgba(245,158,11,0.2)',
      boxShadow: '0 0 40px rgba(245,158,11,0.05)',
    }}
  >
    {/* Gold glow top-right */}
    <div aria-hidden="true" style={{ position: 'absolute', top: '-20%', right: '-10%', width: '250px', height: '200px', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">

      {/* Left content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Lock size={15} style={{ color: '#F59E0B' }} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
            Executive Track
          </span>
        </div>

        <h3 className="text-base font-black text-white mb-1">Unlock 1-on-1 Executive Coaching</h3>
        <p className="text-sm mb-4" style={{ color: '#64748B' }}>
          Work directly with industry leaders who've made the exact career jump you're targeting.
        </p>

        <ul className="space-y-2">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#94A3B8' }}>
              <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Right CTA */}
      <div className="flex flex-col items-start sm:items-center gap-3 sm:min-w-[160px] sm:text-center">
        <div>
          <p className="text-3xl font-black" style={{ color: '#F59E0B' }}>₹4,999</p>
          <p className="text-xs" style={{ color: '#475569' }}>per month · cancel anytime</p>
        </div>
        <Link to="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0F172A',
            boxShadow: '0 0 20px rgba(245,158,11,0.35)',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(245,158,11,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(245,158,11,0.35)'; }}>
          Upgrade Now <ArrowRight size={14} />
        </Link>
        <p className="text-[10px]" style={{ color: '#1E293B' }}>30-day money-back guarantee</p>
      </div>

    </div>
  </motion.div>
);

export default PremiumUpsell;
