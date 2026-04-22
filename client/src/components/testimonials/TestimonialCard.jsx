/**
 * TestimonialCard — single testimonial
 * Used inside Testimonials.jsx grid.
 */

import { motion } from 'framer-motion';

/* ── Star rating ─────────────────────────────────────────────────────────── */
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <svg
        key={n}
        width="14" height="14"
        viewBox="0 0 24 24"
        fill={n <= rating ? '#F59E0B' : 'none'}
        stroke={n <= rating ? '#F59E0B' : '#CBD5E1'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

/* ── Avatar (initials in colored circle) ─────────────────────────────────── */
const AVATAR_COLORS = [
  { bg: 'rgba(59,130,246,0.15)',   text: '#60A5FA',  border: 'rgba(59,130,246,0.3)' },
  { bg: 'rgba(139,92,246,0.15)',   text: '#A78BFA',  border: 'rgba(139,92,246,0.3)' },
  { bg: 'rgba(6,182,212,0.15)',    text: '#22D3EE',  border: 'rgba(6,182,212,0.3)'  },
];

const Avatar = ({ name, colorIdx }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const c = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold select-none flex-shrink-0"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {initials}
    </div>
  );
};

/* ── Card ─────────────────────────────────────────────────────────────────── */
const TestimonialCard = ({ name, role, review, rating, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col rounded-2xl p-6 relative overflow-hidden"
    style={{
      background: '#0D0D18',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    {/* Subtle top-right glow per card */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', top: 0, right: 0,
        width: '120px', height: '120px',
        background: `radial-gradient(circle, ${
          index === 0 ? 'rgba(59,130,246,0.08)' :
          index === 1 ? 'rgba(139,92,246,0.08)' :
                        'rgba(6,182,212,0.08)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}
    />

    {/* Stars */}
    <div className="mb-4">
      <Stars rating={rating} />
    </div>

    {/* Quote */}
    <p
      className="text-sm leading-relaxed flex-1 mb-5"
      style={{ color: '#94A3B8' }}
    >
      "{review}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 mt-auto">
      <Avatar name={name} colorIdx={index} />
      <div>
        <p className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>{name}</p>
        <p className="text-xs" style={{ color: '#475569' }}>{role}</p>
      </div>
    </div>
  </motion.div>
);

export default TestimonialCard;
