import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    forWho: 'Fresh graduates · First-jobbers · People who picked a stream and now regret it',
    stake: 'The first 2 years set the trajectory for the next 20. Most people lose them to guesswork.',
    pains: [
      {
        label: 'ATS Rejects You Before a Human Reads Your Resume',
        description:
          "You applied to 80+ jobs. Got 2 callbacks. Your resume isn't bad — it's invisible. Automated filters kill it before any recruiter sees it.",
      },
      {
        label: 'Your Degree Means Nothing in the Job Market',
        description:
          "4 years. Lakhs in fees. And not a single JD asks for what you studied. Everyone wants 'experience' but nobody explains how to get the first one.",
      },
      {
        label: 'Every Senior Gives You Different Advice',
        description:
          'MBA vs. coding bootcamp vs. domain certification — your relatives, LinkedIn, and college seniors all say something different. The noise is deafening.',
      },
      {
        label: "You Don't Know Which Skills Are Real vs. Buzzwords",
        description:
          "You've memorised the keywords from job posts. But you can't tell if 'GenAI' or 'product thinking' will actually land you a job or just waste 6 months.",
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
    forWho: 'Mid-level employees · People 2–5 years in · Professionals who feel invisible at work',
    stake: 'The plateau is silent. You stop growing but you look busy. Years pass before you notice.',
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
    forWho: 'Senior professionals · New managers · People who got promoted and now feel lost',
    stake: 'You traded craft for meetings. Now neither feels like yours. This is the most identity-destroying phase.',
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
    forWho: 'Anyone who hates their field · Career changers · People whose "safe" choice turned out wrong',
    stake: "The longer you stay, the harder it feels to leave. But every year you wait, the exit gets more expensive.",
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

/* ─── Slide animation ─────────────────────────────────────── */
const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '60%' : '-60%',
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? '-60%' : '60%',
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
  }),
};

const painVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.07 },
  }),
};

/* ─── Arrow button ────────────────────────────────────────── */
const ArrowBtn = ({ onClick, disabled, direction, color, colorRgb }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'prev' ? 'Previous phase' : 'Next phase'}
    style={{
      width: '2.75rem',
      height: '2.75rem',
      borderRadius: '50%',
      border: `1px solid rgba(${colorRgb}, ${disabled ? '0.1' : '0.35'})`,
      background: disabled ? 'rgba(255,255,255,0.03)' : `rgba(${colorRgb}, 0.12)`,
      color: disabled ? '#334155' : color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = `rgba(${colorRgb}, 0.22)`;
        e.currentTarget.style.borderColor = `rgba(${colorRgb}, 0.6)`;
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = `rgba(${colorRgb}, 0.12)`;
        e.currentTarget.style.borderColor = `rgba(${colorRgb}, 0.35)`;
      }
    }}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d={direction === 'prev' ? 'M10 3L5 8L10 13' : 'M6 3L11 8L6 13'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

/* ─── Grain overlay ───────────────────────────────────────── */
const GrainOverlay = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.04,
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
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const phase = PHASES[current];

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => { if (current > 0) go(current - 1); };
  const next = () => { if (current < PHASES.length - 1) go(current + 1); };

  /* drag-to-swipe */
  const handleDragEnd = (_, info) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  return (
    <section
      id="phase-journey"
      style={{ background: '#0A0A0F', position: 'relative', overflow: 'hidden' }}
    >
      <GrainOverlay />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">

        {/* ── Heading ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{
              background: 'rgba(59,130,246,0.12)',
              color: '#60A5FA',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
          >
            Career Psychology
          </span>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4"
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

          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            We've spoken with{' '}
            <span style={{ color: '#94A3B8', fontWeight: 600 }}>1,000+ Indian professionals</span>.
            Here's exactly where they get blocked.
          </p>
        </motion.div>

        {/* ── Phase step indicators ── */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {PHASES.map((p, i) => (
            <button
              key={p.number}
              onClick={() => go(i)}
              aria-label={`Go to phase ${i + 1}`}
              style={{
                height: '4px',
                width: current === i ? '2.5rem' : '1rem',
                borderRadius: '9999px',
                background: current === i ? p.color : 'rgba(255,255,255,0.12)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* ── Slider card ── */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '1.25rem' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              style={{
                background: '#0F0F17',
                border: `1px solid rgba(${phase.colorRgb}, 0.2)`,
                boxShadow: `0 0 60px rgba(${phase.colorRgb}, 0.08)`,
                borderRadius: '1.25rem',
                overflow: 'hidden',
                cursor: 'grab',
                userSelect: 'none',
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: '2rem 2rem 1.5rem',
                  borderLeft: `4px solid ${phase.color}`,
                  background: `linear-gradient(135deg, rgba(${phase.colorRgb}, 0.07) 0%, transparent 60%)`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-5">
                    {/* Watermark number */}
                    <span
                      className="font-black select-none flex-shrink-0"
                      style={{
                        fontSize: '4rem',
                        lineHeight: 1,
                        color: `rgba(${phase.colorRgb}, 0.18)`,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {phase.number}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3
                          className="text-2xl sm:text-3xl font-bold"
                          style={{ color: '#F1F5F9' }}
                        >
                          {phase.title}
                        </h3>
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            background: `rgba(${phase.colorRgb}, 0.15)`,
                            color: phase.color,
                            border: `1px solid rgba(${phase.colorRgb}, 0.3)`,
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
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: `rgba(${phase.colorRgb}, 0.18)`,
                            color: phase.color,
                            border: `1px solid rgba(${phase.colorRgb}, 0.35)`,
                          }}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: [0.9, 1.06, 1], opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          {phase.stuckPercent}% get stuck here
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Nav arrows — top right */}
                  <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                    <ArrowBtn
                      onClick={prev}
                      disabled={current === 0}
                      direction="prev"
                      color={phase.color}
                      colorRgb={phase.colorRgb}
                    />
                    <ArrowBtn
                      onClick={next}
                      disabled={current === PHASES.length - 1}
                      direction="next"
                      color={phase.color}
                      colorRgb={phase.colorRgb}
                    />
                  </div>
                </div>
              </div>

              {/* Who it's for + stake */}
              <div
                style={{
                  padding: '0.85rem 2rem',
                  background: `rgba(${phase.colorRgb}, 0.05)`,
                  borderLeft: `4px solid ${phase.color}`,
                }}
              >
                <p className="text-xs font-semibold mb-0.5" style={{ color: phase.color, opacity: 0.9 }}>
                  Who this phase is for
                </p>
                <p className="text-xs mb-2" style={{ color: '#64748B' }}>
                  {phase.forWho}
                </p>
                <p className="text-xs font-medium italic" style={{ color: '#475569' }}>
                  "{phase.stake}"
                </p>
              </div>

              {/* Separator */}
              <div
                style={{
                  height: '1px',
                  background: `linear-gradient(90deg, rgba(${phase.colorRgb}, 0.4), rgba(${phase.colorRgb}, 0.05) 70%, transparent)`,
                }}
              />

              {/* Pain grid */}
              <div style={{ padding: '1.75rem 2rem' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                  {phase.pains.map((pain, i) => (
                    <motion.div
                      key={pain.label}
                      custom={i}
                      variants={painVariant}
                      initial="hidden"
                      animate="visible"
                      className="rounded-xl px-4 py-4"
                      style={{
                        background: '#13131A',
                        borderLeft: `3px solid rgba(${phase.colorRgb}, 0.45)`,
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
                      <p className="text-sm font-semibold mb-1" style={{ color: '#CBD5E1' }}>
                        {pain.label}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                        {pain.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Feature CTA + counter */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Link
                    to={phase.featurePath}
                    className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-5 py-2.5 transition-all duration-250"
                    style={{
                      background: `rgba(${phase.colorRgb}, 0.12)`,
                      color: phase.color,
                      border: `1px solid rgba(${phase.colorRgb}, 0.25)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `rgba(${phase.colorRgb}, 0.22)`;
                      e.currentTarget.style.borderColor = `rgba(${phase.colorRgb}, 0.55)`;
                      setHoveredBtn(true);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `rgba(${phase.colorRgb}, 0.12)`;
                      e.currentTarget.style.borderColor = `rgba(${phase.colorRgb}, 0.25)`;
                      setHoveredBtn(false);
                    }}
                  >
                    See how Tcent.AI solves this
                    {hoveredBtn && (
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

                  {/* Phase counter */}
                  <span className="text-xs tabular-nums" style={{ color: '#334155' }}>
                    Phase{' '}
                    <span style={{ color: phase.color, fontWeight: 700 }}>{current + 1}</span>
                    {' '}of {PHASES.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p
            className="text-xl sm:text-2xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            You're probably in one of these phases right now.
          </p>
          <p className="text-sm mb-7" style={{ color: '#475569' }}>
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
              e.currentTarget.style.boxShadow = '0 0 52px rgba(59,130,246,0.45)';
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
