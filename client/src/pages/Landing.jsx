import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PhaseJourney from '../components/PhaseJourney';

/* ─── Reusable animation ──────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Reality stats ───────────────────────────────────────── */
const STATS = [
  {
    number: '73%',
    label: 'regret their stream choice within 2 years',
    sub: 'but wait an average of 4 more years to act on it.',
  },
  {
    number: '₹22L',
    label: 'average salary lost by being in the wrong role',
    sub: 'money you should already have. Every year you wait, it compounds.',
  },
  {
    number: '4.3 yrs',
    label: 'average time before professionals course-correct',
    sub: 'that\'s 4.3 years of your 20s you can\'t get back.',
  },
];

/* ─── How it works ────────────────────────────────────────── */
const STEPS = [
  {
    number: '01',
    title: 'Identify your phase',
    description:
      'Answer a few questions or upload your resume. We pinpoint exactly which career phase you\'re in and why you\'re stuck.',
  },
  {
    number: '02',
    title: 'See your blockers clearly',
    description:
      'We show you the exact reasons people in your phase fail to move forward — and which ones apply to you specifically.',
  },
  {
    number: '03',
    title: 'Get a personalised roadmap',
    description:
      'AI-generated steps, skill gaps, career path matches, and salary targets — specific to where you are and where you want to go.',
  },
];

/* ─── Features ────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🧠',
    title: 'AI Resume Analysis',
    description: 'Upload once. Get a full breakdown of your skills, gaps, and best-fit career paths in seconds.',
  },
  {
    icon: '🎯',
    title: 'Career Path Matching',
    description: 'Matched against 15+ career paths with a percentage score — so you stop guessing and start knowing.',
  },
  {
    icon: '📊',
    title: 'Salary Intelligence',
    description: 'Real Indian salary ranges per role, per city. Walk into every negotiation knowing exactly what you\'re worth.',
  },
  {
    icon: '📚',
    title: 'Skill Gap Detection',
    description: 'Know the 2–3 skills standing between you and a 40% salary jump. Not a list of 50. The exact ones.',
  },
  {
    icon: '💬',
    title: 'AI Career Advisor',
    description: 'A career coach in your pocket — available at 2 AM when anxiety hits and you need actual answers.',
  },
  {
    icon: '🔍',
    title: 'ATS Resume Checker',
    description: 'Find out why you\'re getting ghosted. Match your resume to any JD and fix it before you apply.',
  },
];

/* ─── Grain overlay component ─────────────────────────────── */
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

/* ─── Animated counter ────────────────────────────────────── */
const Counter = ({ target, suffix = '', prefix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(target);
    const duration = 1800;
    const step = duration / 60;
    const increment = end / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(start);
    }, step);
    return () => clearInterval(timer);
  }, [target]);
  const display = Number.isInteger(parseFloat(target))
    ? Math.floor(val).toLocaleString('en-IN')
    : val.toFixed(1);
  return <>{prefix}{display}{suffix}</>;
};

/* ════════════════════════════════════════════════════════════ */
const Landing = () => {
  const [statsVisible, setStatsVisible] = useState(false);

  return (
    <div style={{ background: '#fff', overflowX: 'hidden' }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(160deg, #050508 0%, #0A0A0F 55%, #0D0D1A 100%)',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Grain opacity={0.04} />

        {/* Radial glow — top center */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '-20%', left: '50%',
            transform: 'translateX(-50%)',
            width: '900px', height: '600px',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
        {/* Radial glow — bottom right */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: '-10%', right: '-10%',
            width: '600px', height: '400px',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
        {/* Subtle dot grid */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center w-full">

          {/* Badge */}
          <motion.div {...fadeUp(0)} className="mb-8">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.25)',
                color: '#60A5FA',
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#3B82F6',
                  boxShadow: '0 0 6px #3B82F6',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }}
              />
              AI-Powered Career Guidance for India
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fadeUp(0.08)}
            style={{ lineHeight: 1.05, letterSpacing: '-0.03em' }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6"
          >
            Your career is either
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              moving forward. Or it isn't.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.16)}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            style={{ color: '#94A3B8' }}
          >
            Most Indian professionals spend years in the wrong phase —{' '}
            <span style={{ color: '#CBD5E1', fontWeight: 600 }}>not because they lack talent,
            but because nobody mapped the terrain for them.</span>
          </motion.p>
          <motion.p
            {...fadeUp(0.2)}
            className="text-base max-w-xl mx-auto mb-10"
            style={{ color: '#475569' }}
          >
            Tcent.AI identifies your exact phase, surfaces your real blockers, and gives you
            a precise roadmap to the career — and the salary — you should already have.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.26)} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              to="/register"
              className="px-9 py-4 font-bold text-white rounded-2xl text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                boxShadow: '0 0 40px rgba(59,130,246,0.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 60px rgba(59,130,246,0.45)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 40px rgba(59,130,246,0.3)'; }}
            >
              Find My Career Phase — Free
            </Link>
            <a
              href="#phases"
              className="px-9 py-4 font-semibold rounded-2xl text-base transition-all active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#94A3B8',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              See the 4 phases
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            {...fadeUp(0.32)}
            className="flex flex-wrap items-center justify-center gap-6 text-xs"
            style={{ color: '#334155' }}
          >
            {['1,000+ professionals guided', 'No credit card required', 'Results in 30 seconds'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="rgba(59,130,246,0.4)" />
                  <path d="M3.5 6L5.5 8L8.5 4" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ REALITY CHECK ═════════════════════════════════════ */}
      <section
        style={{ background: '#0A0A0F', position: 'relative', overflow: 'hidden' }}
      >
        <Grain opacity={0.04} />
        {/* Horizontal glow line at top */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3) 40%, rgba(139,92,246,0.3) 60%, transparent)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#475569' }}>
              The data nobody shows you
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
              style={{ color: '#F1F5F9', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              The cost of staying stuck
              <br />
              <span style={{ color: '#EF4444' }}>is not zero.</span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: '#475569' }}>
              Every month in the wrong phase has a price. Here's what the data actually says.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1.5rem', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            onViewportEnter={() => setStatsVisible(true)}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.number}
                style={{ background: '#0F0F17', padding: '2.5rem 2rem' }}
              >
                <div
                  className="text-4xl sm:text-5xl font-black mb-3"
                  style={{ color: i === 1 ? '#EF4444' : i === 0 ? '#F59E0B' : '#8B5CF6', letterSpacing: '-0.02em' }}
                >
                  {stat.number}
                </div>
                <p className="text-sm font-semibold mb-2" style={{ color: '#CBD5E1' }}>
                  {stat.label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
                  {stat.sub}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Fear line */}
          <motion.p
            {...fadeUp(0.1)}
            className="text-center text-sm mt-10"
            style={{ color: '#334155' }}
          >
            The worst part?{' '}
            <span style={{ color: '#64748B' }}>
              Most people know something is wrong. They just don't know what to do about it.
            </span>
            <br />
            <span style={{ color: '#3B82F6', fontWeight: 600 }}>
              That's exactly what Tcent.AI is built for.
            </span>
          </motion.p>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent)' }} />
      </section>

      {/* ══ PHASE JOURNEY ═════════════════════════════════════ */}
      <div id="phases">
        <PhaseJourney />
      </div>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section style={{ background: '#FAFAFA', position: 'relative' }}>
        <div className="max-w-4xl mx-auto px-6 py-24">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#9CA3AF' }}>
              How it works
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
              style={{ letterSpacing: '-0.02em' }}
            >
              From confused to clear
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                in three steps.
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-md mx-auto">
              No lengthy onboarding. No waiting for a coach's calendar. Just answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                {...fadeUp(i * 0.1)}
                className="flex items-start gap-6 rounded-2xl p-7"
                style={{
                  background: '#fff',
                  border: '1px solid #F1F5F9',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <span
                  className="font-black text-4xl leading-none select-none flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {step.number}
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section id="features" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#9CA3AF' }}>
              What's inside
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
              style={{ letterSpacing: '-0.02em' }}
            >
              Every tool your career actually needs
            </h2>
            <p className="text-gray-400 text-base max-w-lg mx-auto">
              Not a feature dump. Exactly what each phase demands — nothing more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.06)}
                className="group rounded-2xl p-7 transition-all duration-300 cursor-default"
                style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#DBEAFE';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{ background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)' }}
                >
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEAR CLOSER ═══════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(160deg, #050508 0%, #0A0A0F 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grain opacity={0.04} />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px', height: '400px',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center">
          <motion.p
            {...fadeUp(0)}
            className="text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ color: '#475569' }}
          >
            The uncomfortable truth
          </motion.p>

          <motion.h2
            {...fadeUp(0.06)}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6"
            style={{ lineHeight: 1.1, letterSpacing: '-0.025em' }}
          >
            Doing nothing{' '}
            <span style={{ color: '#EF4444' }}>is a choice.</span>
            <br />
            <span style={{ color: '#94A3B8' }}>It's just a very expensive one.</span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.12)}
            className="text-base leading-relaxed mb-4"
            style={{ color: '#64748B' }}
          >
            Your batchmates who are ahead of you aren't smarter.
            They aren't working harder. They just figured out their phase earlier
            — and moved with clarity while you were still guessing.
          </motion.p>

          <motion.p
            {...fadeUp(0.16)}
            className="text-base mb-12"
            style={{ color: '#475569' }}
          >
            <span style={{ color: '#94A3B8' }}>The gap isn't talent. It's information.</span>
            {' '}Tcent.AI gives you that information — in 30 seconds.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-4 font-bold text-white rounded-2xl text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                boxShadow: '0 0 50px rgba(59,130,246,0.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 70px rgba(59,130,246,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 50px rgba(59,130,246,0.3)'; }}
            >
              Stop guessing. Start knowing.
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 font-semibold rounded-2xl text-base transition-all active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748B',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Already have an account
            </Link>
          </motion.div>

          <motion.p
            {...fadeUp(0.28)}
            className="mt-8 text-xs"
            style={{ color: '#1E293B' }}
          >
            Free forever · No credit card · Takes 30 seconds
          </motion.p>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer style={{ background: '#050508', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold" style={{ color: '#1E293B' }}>Tcent.AI</span>
          <span className="text-xs" style={{ color: '#0F172A' }}>
            © {new Date().getFullYear()} Tcent.AI · AI-powered career intelligence for India
          </span>
          <div className="flex items-center gap-6 text-xs" style={{ color: '#1E293B' }}>
            <Link to="/login" style={{ color: '#1E293B' }} className="hover:text-slate-400 transition">Login</Link>
            <Link to="/register" style={{ color: '#3B82F6' }} className="hover:opacity-80 transition font-semibold">Get Started</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
