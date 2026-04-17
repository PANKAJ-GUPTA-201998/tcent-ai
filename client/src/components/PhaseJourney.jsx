import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─── Phase data ──────────────────────────────────────────── */
const PHASES = [
  {
    number: '01',
    title: 'Finding Direction',
    subtitle: 'The Fresher Fog',
    years: '0–2 years into career',
    stuckPercent: 68,
    color: '#3B82F6',
    colorRgb: '59, 130, 246',
    feature: 'AI Career Path Matching',
    featurePath: '/register',
    pains: [
      {
        label: 'The Degree Mismatch',
        description:
          "Your college degree doesn't match a single job description. Everyone wants 'experience' but nobody hires freshers.",
      },
      {
        label: 'The Stream Paralysis',
        description:
          'MBA vs. coding bootcamp vs. domain expertise — no one gives you a straight answer on which path actually pays off.',
      },
      {
        label: 'The Buzzword Trap',
        description:
          "You've memorised the skills from job posts but can't tell which ones actually matter vs. which are just trending noise.",
      },
      {
        label: 'The Invisible Roadmap',
        description:
          "No senior at your college went into this field. There's no template. You're building the plane while falling.",
      },
    ],
  },
  {
    number: '02',
    title: 'Breaking the Plateau',
    subtitle: 'The Stagnation Years',
    years: '2–5 years in',
    stuckPercent: 54,
    color: '#8B5CF6',
    colorRgb: '139, 92, 246',
    feature: 'Skill Gap Detection',
    featurePath: '/register',
    pains: [
      {
        label: 'The Promotion Wall',
        description:
          "You're the most reliable person on the team — but the promotion keeps going to whoever speaks better in meetings.",
      },
      {
        label: 'The Skills Treadmill',
        description:
          "Every posting asks for skills you don't have, but you can't learn them without a job that teaches them.",
      },
      {
        label: 'The Switch-or-Stay Trap',
        description:
          'Switch companies, switch domains, or do an MBA? Every mentor gives different advice. You leave more confused than before.',
      },
      {
        label: 'The Solo Hustle',
        description:
          'No real mentor. Just LinkedIn posts, random YouTube playlists, and hoping the next certification changes everything.',
      },
    ],
  },
  {
    number: '03',
    title: 'The Manager Trap',
    subtitle: 'Leadership vs. Craft',
    years: '5–10 years in',
    stuckPercent: 41,
    color: '#F59E0B',
    colorRgb: '245, 158, 11',
    feature: 'AI Career Advisor',
    featurePath: '/register',
    pains: [
      {
        label: 'The IC vs. Manager Split',
        description:
          'The industry forces you to choose between craft and leadership. Both paths feel like losing something you worked years for.',
      },
      {
        label: 'The Rusting Expertise',
        description:
          "Your technical skills are quietly decaying while you sit in back-to-back meetings reviewing others' work.",
      },
      {
        label: 'The Political Ceiling',
        description:
          "The path to VP or Director isn't performance-based. It's about who you know, how you present, and invisible rules no one explains.",
      },
      {
        label: 'The Untrained Manager',
        description:
          "You were promoted because you were the best IC — but no one trained you to manage people. Now you're failing at something new.",
      },
    ],
  },
  {
    number: '04',
    title: 'The Pivot Problem',
    subtitle: 'Escape Without a Parachute',
    years: 'Any stage',
    stuckPercent: 79,
    color: '#EF4444',
    colorRgb: '239, 68, 68',
    feature: 'Resume Reframing + Analysis',
    featurePath: '/register',
    pains: [
      {
        label: 'The Sunk Cost Prison',
        description:
          "5 years in a domain you don't like. Starting over feels like betraying every sacrifice you've already made.",
      },
      {
        label: 'The Age Myth',
        description:
          "Everyone says pivoting after 28 is career suicide. You're starting to believe it — even though you know deep down it's not true.",
      },
      {
        label: 'The Transferability Gap',
        description:
          "You know your skills are valuable — but you can't translate them for a hiring manager in a completely different field.",
      },
      {
        label: 'The Financial Anchor',
        description:
          "You can't afford to take a 40% pay cut to start fresh. But you can't afford to stay either. There's no obvious middle path.",
      },
    ],
  },
];

/* ─── Animation variants ──────────────────────────────────── */
const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const phaseVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const painCardVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const badgePulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.06, 1],
    transition: { duration: 0.6, delay: 0.5, ease: 'easeInOut' },
  },
};

/* ─── Grain texture overlay ───────────────────────────────── */
const GrainOverlay = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.045,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'repeat',
      backgroundSize: '180px 180px',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
);

/* ─── Main component ──────────────────────────────────────── */
const PhaseJourney = () => {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <section
      id="phase-journey"
      style={{ background: '#0A0A0F', position: 'relative', overflow: 'hidden' }}
    >
      <GrainOverlay />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">

        {/* ── Section heading ── */}
        <motion.div
          className="text-center mb-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              background: 'rgba(59,130,246,0.12)',
              color: '#60A5FA',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
          >
            Career Psychology
          </span>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Most people are stuck.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 60%, #F472B6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              They just don't know which phase.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#64748B' }}
          >
            We've spoken with{' '}
            <span style={{ color: '#94A3B8', fontWeight: 600 }}>1,000+ Indian professionals</span>.
            Here's exactly where they get blocked — and why most generic advice doesn't help.
          </p>
        </motion.div>

        {/* ── All 4 phases — always visible ── */}
        <div className="space-y-10">
          {PHASES.map((phase, idx) => (
            <motion.div
              key={phase.number}
              custom={idx}
              variants={phaseVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#0F0F17',
                border: `1px solid rgba(${phase.colorRgb}, 0.18)`,
                boxShadow: `0 0 40px rgba(${phase.colorRgb}, 0.06)`,
              }}
            >
              {/* Phase header */}
              <div
                className="px-7 pt-7 pb-5"
                style={{
                  borderLeft: `3px solid ${phase.color}`,
                }}
              >
                <div className="flex items-start gap-5">
                  {/* Large faded number */}
                  <span
                    className="font-black leading-none select-none flex-shrink-0"
                    style={{
                      fontSize: '3.5rem',
                      color: `rgba(${phase.colorRgb}, 0.2)`,
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1,
                    }}
                  >
                    {phase.number}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3
                        className="text-xl sm:text-2xl font-bold"
                        style={{ color: '#F1F5F9' }}
                      >
                        {phase.title}
                      </h3>
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `rgba(${phase.colorRgb}, 0.12)`,
                          color: phase.color,
                          border: `1px solid rgba(${phase.colorRgb}, 0.25)`,
                        }}
                      >
                        {phase.subtitle}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs" style={{ color: '#475569' }}>
                        {phase.years}
                      </span>
                      <motion.span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `rgba(${phase.colorRgb}, 0.18)`,
                          color: phase.color,
                          border: `1px solid rgba(${phase.colorRgb}, 0.3)`,
                        }}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={badgePulse}
                      >
                        {phase.stuckPercent}% get stuck here
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thin separator */}
              <div
                style={{
                  height: '1px',
                  background: `linear-gradient(90deg, rgba(${phase.colorRgb}, 0.3), rgba(${phase.colorRgb}, 0.06) 60%, transparent)`,
                }}
              />

              {/* Pain cards */}
              <div className="px-7 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {phase.pains.map((pain, i) => (
                    <motion.div
                      key={pain.label}
                      custom={i}
                      variants={painCardVariant}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      className="rounded-xl px-4 py-4"
                      style={{
                        background: '#13131A',
                        borderLeft: `3px solid rgba(${phase.colorRgb}, 0.4)`,
                      }}
                    >
                      {i === 0 && (
                        <p
                          className="text-xs font-medium mb-1 tracking-wide uppercase"
                          style={{ color: phase.color, opacity: 0.75 }}
                        >
                          Sound familiar?
                        </p>
                      )}
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: '#CBD5E1' }}
                      >
                        {pain.label}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: '#475569' }}
                      >
                        {pain.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Feature CTA */}
                <Link
                  to={phase.featurePath}
                  className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-5 py-2.5 transition-all duration-300"
                  style={{
                    background: `rgba(${phase.colorRgb}, 0.12)`,
                    color: phase.color,
                    border: `1px solid rgba(${phase.colorRgb}, 0.25)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `rgba(${phase.colorRgb}, 0.22)`;
                    e.currentTarget.style.borderColor = `rgba(${phase.colorRgb}, 0.5)`;
                    setHoveredBtn(idx);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `rgba(${phase.colorRgb}, 0.12)`;
                    e.currentTarget.style.borderColor = `rgba(${phase.colorRgb}, 0.25)`;
                    setHoveredBtn(null);
                  }}
                >
                  See how Tcent.AI solves this
                  {hoveredBtn === idx && (
                    <span style={{ color: '#94A3B8', fontWeight: 400 }}>
                      {' '}— {phase.feature}
                    </span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="mt-20 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <p
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            You're probably in one of these phases right now.
          </p>
          <p className="text-sm mb-8" style={{ color: '#475569' }}>
            Tcent.AI identifies your phase instantly and builds a personalised roadmap out of it.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              boxShadow: '0 0 32px rgba(59,130,246,0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 48px rgba(59,130,246,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 32px rgba(59,130,246,0.25)';
            }}
          >
            Find out which one — Get Started Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default PhaseJourney;
