import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingCard = ({
  title, price, period, features, cta, ctaTo = '/register',
  popular = false, accent = 'emerald', index,
}) => {
  const isGold    = accent === 'gold';
  const isEmerald = accent === 'emerald';

  const accentColor    = isGold ? '#F59E0B' : '#059669';
  const accentRgb      = isGold ? '245,158,11' : '5,150,105';
  const accentGradient = isGold
    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
    : 'linear-gradient(135deg, #059669, #047857)';
  const glowColor = isGold
    ? 'rgba(245,158,11,0.4)'
    : 'rgba(5,150,105,0.4)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col relative rounded-2xl p-7"
      style={{
        background: popular ? 'rgba(245,158,11,0.04)' : '#1E293B',
        border: popular
          ? '1.5px solid rgba(245,158,11,0.3)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: popular ? `0 0 40px rgba(245,158,11,0.08)` : 'none',
      }}>

      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full text-xs font-black text-black tracking-widest uppercase"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            Most Popular
          </span>
        </div>
      )}

      {/* Title */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>{title}</h3>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>{price}</span>
          {period && <span className="text-sm text-slate-500 mb-1.5">/{period}</span>}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: '#94A3B8' }}>
            <CheckCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link to={ctaTo}
        className="block text-center px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
        style={{
          background: accentGradient,
          color: isGold ? '#0F172A' : '#fff',
          boxShadow: `0 0 20px ${glowColor}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 32px ${glowColor}`; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}`; }}>
        {cta}
      </Link>
    </motion.div>
  );
};

export default PricingCard;
