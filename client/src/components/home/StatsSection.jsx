/**
 * StatsSection — social proof counter strip
 * Dark background to match Landing.jsx's alternating dark/light rhythm.
 * Counters animate when section scrolls into view.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ── Grain overlay (same as Landing.jsx) ────────────────────────────────── */
const Grain = ({ opacity = 0.035 }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      opacity,
      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'repeat', backgroundSize: '180px',
    }}
  />
);

/* ── Animated counter ────────────────────────────────────────────────────── */
const Counter = ({ target, decimals = 0, prefix = '', suffix = '', trigger }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const end = parseFloat(target);
    const duration = 1600;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target]);

  const display = decimals > 0
    ? val.toFixed(decimals)
    : Math.floor(val).toLocaleString('en-IN');

  return <>{prefix}{display}{suffix}</>;
};

/* ── Stat data ───────────────────────────────────────────────────────────── */
const STATS = [
  {
    target: 1200,
    suffix: '+',
    label: 'Students Guided',
    sub: 'Professionals who found clarity with Tcent.AI',
    color: '#3B82F6',
    colorRgb: '59,130,246',
  },
  {
    target: 450,
    suffix: '+',
    label: 'Career Transitions',
    sub: 'Successful role or domain switches facilitated',
    color: '#8B5CF6',
    colorRgb: '139,92,246',
  },
  {
    target: 4.8,
    decimals: 1,
    suffix: '/5',
    label: 'Average Rating',
    sub: 'Across all tools and assessments',
    color: '#F59E0B',
    colorRgb: '245,158,11',
  },
];

/* ── Main component ──────────────────────────────────────────────────────── */
const StatsSection = () => {
  const [triggered, setTriggered] = useState(false);

  return (
    <section
      style={{
        background: '#0A0A0F',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Grain opacity={0.04} />

      {/* Top divider line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2) 40%, rgba(139,92,246,0.2) 60%, transparent)',
      }} />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold tracking-widest uppercase mb-10"
          style={{ color: '#334155' }}
        >
          Trusted by professionals across India
        </motion.p>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '1.5rem',
          }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          onViewportEnter={() => setTriggered(true)}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                background: '#0F0F17',
                padding: '2.5rem 2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Card inner glow */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '140px', height: '140px',
                  background: `radial-gradient(circle, rgba(${stat.colorRgb},0.1) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Number */}
              <div
                className="text-5xl sm:text-6xl font-black mb-2 leading-none tabular-nums"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}99)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                }}
              >
                <Counter
                  target={stat.target}
                  decimals={stat.decimals ?? 0}
                  suffix={stat.suffix ?? ''}
                  trigger={triggered}
                />
              </div>

              {/* Label */}
              <p className="text-sm font-bold mb-1.5" style={{ color: '#CBD5E1' }}>
                {stat.label}
              </p>

              {/* Sub */}
              <p className="text-xs leading-relaxed" style={{ color: '#334155' }}>
                {stat.sub}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(${stat.colorRgb},0.5), transparent)`,
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom divider line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.04) 60%, transparent)',
      }} />
    </section>
  );
};

export default StatsSection;
