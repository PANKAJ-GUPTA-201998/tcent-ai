import { motion } from 'framer-motion';

/* ── Stars ──────────────────────────────────────────────────── */
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(n => (
      <svg key={n} width="14" height="14" viewBox="0 0 24 24"
        fill={n <= rating ? '#F59E0B' : 'none'}
        stroke={n <= rating ? '#F59E0B' : '#334155'}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

/* ── Avatar ─────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', border: 'rgba(245,158,11,0.35)' },  // gold
  { bg: 'rgba(5,150,105,0.15)', text: '#34D399',  border: 'rgba(5,150,105,0.35)'  },  // emerald
  { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA', border: 'rgba(139,92,246,0.35)' },  // purple
];

const Avatar = ({ name, colorIdx }) => {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const c = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
  return (
    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black select-none flex-shrink-0"
      style={{ background: c.bg, color: c.text, border: `1.5px solid ${c.border}` }}>
      {initials}
    </div>
  );
};

/* ── Salary badge ───────────────────────────────────────────── */
const SalaryBadge = ({ from, to, pct }) => (
  <div className="flex items-center gap-2 mt-4 flex-wrap">
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black"
      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
      <span style={{ color: '#78716C' }}>₹{from}</span>
      <span style={{ color: '#475569' }}>→</span>
      <span style={{ color: '#F59E0B' }}>₹{to}</span>
    </div>
    <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-black"
      style={{ background: 'rgba(5,150,105,0.12)', color: '#34D399', border: '1px solid rgba(5,150,105,0.2)' }}>
      ↑ {pct}% salary jump
    </div>
  </div>
);

/* ── Card ───────────────────────────────────────────────────── */
const TestimonialCard = ({ name, role, company, review, rating, salaryFrom, salaryTo, salaryPct, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col rounded-2xl p-6 relative overflow-hidden"
    style={{ background: '#1E293B', border: '1px solid rgba(245,158,11,0.1)' }}>

    {/* Corner glow */}
    <div aria-hidden="true" style={{
      position: 'absolute', top: 0, right: 0, width: '130px', height: '130px',
      background: `radial-gradient(circle, ${
        index === 0 ? 'rgba(245,158,11,0.08)' : index === 1 ? 'rgba(5,150,105,0.08)' : 'rgba(139,92,246,0.08)'
      } 0%, transparent 70%)`, pointerEvents: 'none',
    }} />

    {/* Stars */}
    <div className="mb-4"><Stars rating={rating} /></div>

    {/* Quote */}
    <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: '#94A3B8' }}>
      "{review}"
    </p>

    {/* Salary badge */}
    <SalaryBadge from={salaryFrom} to={salaryTo} pct={salaryPct} />

    {/* Author */}
    <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Avatar name={name} colorIdx={index} />
      <div>
        <p className="text-sm font-bold text-white">{name}</p>
        <p className="text-xs" style={{ color: '#475569' }}>{role}</p>
        {company && <p className="text-xs font-semibold mt-0.5" style={{ color: '#059669' }}>@ {company}</p>}
      </div>
    </div>
  </motion.div>
);

export default TestimonialCard;
