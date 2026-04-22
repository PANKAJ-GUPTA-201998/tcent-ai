import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Grain = ({ opacity = 0.03 }) => (
  <div aria-hidden="true" style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat', backgroundSize: '180px',
  }} />
);

const Counter = ({ target, prefix = '', suffix = '', decimals = 0, trigger }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const end = parseFloat(target);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(eased * end);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target]);

  const display = decimals > 0
    ? val.toFixed(decimals)
    : Math.floor(val).toLocaleString('en-IN');

  return <>{prefix}{display}{suffix}</>;
};

const STATS = [
  {
    prefix: '₹',
    target: 2.4,
    suffix: ' Cr+',
    decimals: 1,
    label: 'Total Salary Increments Unlocked',
    sub: 'Aggregate additional annual earnings generated across all professionals',
    color: '#F59E0B',
    colorRgb: '245,158,11',
    emoji: '💰',
  },
  {
    prefix: '',
    target: 180,
    suffix: '%',
    label: 'Average Salary Jump',
    sub: 'Median salary increase achieved by professionals who complete the full program',
    color: '#059669',
    colorRgb: '5,150,105',
    emoji: '📈',
  },
  {
    prefix: '',
    target: 450,
    suffix: '+',
    label: 'Professionals Transformed',
    sub: 'Working professionals who switched roles, got promoted, or negotiated significantly higher pay',
    color: '#8B5CF6',
    colorRgb: '139,92,246',
    emoji: '🎯',
  },
  {
    prefix: '',
    target: 4.8,
    suffix: '/5',
    decimals: 1,
    label: 'Verified Rating',
    sub: 'Average satisfaction score across all tools and coaching sessions',
    color: '#F59E0B',
    colorRgb: '245,158,11',
    emoji: '⭐',
  },
];

const StatsSection = () => {
  const [triggered, setTriggered] = useState(false);

  return (
    <section style={{ background: '#0A0E1A', position: 'relative', overflow: 'hidden' }}>
      <Grain opacity={0.04} />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(5,150,105,0.25) 40%, rgba(245,158,11,0.2) 60%, transparent)' }} />

      <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '300px', background: 'radial-gradient(ellipse, rgba(5,150,105,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}
          className="text-center text-xs font-bold tracking-widest uppercase mb-10"
          style={{ color: '#334155' }}>
          Results that speak for themselves
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1.5rem' }}
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
          onViewportEnter={() => setTriggered(true)}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: '#131B2E', padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle, rgba(${s.colorRgb},0.1) 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div className="text-2xl mb-3">{s.emoji}</div>
              <div className="text-4xl sm:text-5xl font-black mb-2 leading-none tabular-nums"
                style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}88)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>
                <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} trigger={triggered} />
              </div>
              <p className="text-sm font-bold mb-1.5" style={{ color: '#CBD5E1' }}>{s.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#334155' }}>{s.sub}</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, rgba(${s.colorRgb},0.5), transparent)` }} />
            </div>
          ))}
        </motion.div>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.04) 60%, transparent)' }} />
    </section>
  );
};

export default StatsSection;
