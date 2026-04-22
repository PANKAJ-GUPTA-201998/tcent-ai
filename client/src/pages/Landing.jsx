import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, TrendingUp, Target, Zap, Brain,
  ScanSearch, Upload, MessageCircle, BarChart3, BookOpen,
} from 'lucide-react';
import StatsSection from '../components/home/StatsSection';
import Testimonials from '../components/testimonials/Testimonials';
import PricingSection from '../components/pricing/PricingSection';

/* ── Animation helpers ──────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Grain overlay ──────────────────────────────────────────── */
const Grain = ({ opacity = 0.03 }) => (
  <div aria-hidden="true" style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat', backgroundSize: '180px',
  }} />
);

const Divider = () => (
  <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent)' }} />
);

/* ── Services ───────────────────────────────────────────────── */
const SERVICES = [
  { icon: ScanSearch, title: 'ATS Resume Optimizer', desc: 'Find exactly why your resume gets rejected. Fix it before you hit send.', to: '/ats-checker', color: '#059669', colorRgb: '5,150,105', tag: 'Most used' },
  { icon: MessageCircle, title: 'AI Career Advisor', desc: 'A strategic career coach at 2 AM. Switch companies, negotiate salary, plan your next move.', to: '/ai-advisor', color: '#8B5CF6', colorRgb: '139,92,246', tag: null },
  { icon: Upload, title: 'AI Resume Analysis', desc: 'Upload once. Instantly surface skills, gaps, and highest-match roles.', to: '/upload-resume', color: '#3B82F6', colorRgb: '59,130,246', tag: null },
  { icon: Brain, title: 'Career Path Matching', desc: 'Matched against 15+ senior paths with percentage fit scores.', to: '/career', color: '#F59E0B', colorRgb: '245,158,11', tag: null },
  { icon: BookOpen, title: 'Skill Gap Detection', desc: 'The 2–3 skills between you and a 40%+ salary jump. Not a list of 50.', to: '/career', color: '#06B6D4', colorRgb: '6,182,212', tag: null },
  { icon: BarChart3, title: 'Salary Intelligence', desc: 'Real Indian salary ranges per role, per city. Walk into every negotiation knowing your number.', to: '/career', color: '#EF4444', colorRgb: '239,68,68', tag: null },
];

/* ── How it works ───────────────────────────────────────────── */
const HOW = [
  { n: '01', title: 'Book Strategy Call', desc: 'A 30-minute deep dive into your current role, target, and salary gap. No generic advice.' },
  { n: '02', title: 'Get Your Personalized Roadmap', desc: 'AI + human expertise combines to build a 90-day action plan specific to you.' },
  { n: '03', title: 'Execute With Guidance', desc: 'Weekly check-ins, resume reviews, and mock negotiations — done with you, not just for you.' },
  { n: '04', title: 'Land the Higher Role', desc: 'On average, professionals who complete the program see a 180% salary increase within 12 months.' },
];

/* ════════════════════════════════════════════════════════════ */
const Landing = () => (
  <div style={{ background: '#0F172A', overflowX: 'hidden' }}>

    {/* ══ HERO ══════════════════════════════════════════════════ */}
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grain opacity={0.04} />

      {/* Radial glows */}
      {[
        { top: '-15%', left: '50%', w: '900px', h: '600px', color: 'rgba(5,150,105,0.10)' },
        { bottom: '0', right: '-10%', w: '600px', h: '500px', color: 'rgba(139,92,246,0.07)' },
      ].map((g, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute', ...g, width: g.w, height: g.h,
          background: `radial-gradient(ellipse, ${g.color} 0%, transparent 70%)`,
          transform: g.left ? 'translateX(-50%)' : undefined,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Dot grid */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center w-full">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)', color: '#34D399' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            AI-Powered Career Growth · India's #1 Platform
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1 {...fadeUp(0.07)}
          style={{ lineHeight: 1.05, letterSpacing: '-0.035em' }}
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6">
          Double Your Salary
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #34D399 0%, #059669 50%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            in 12 Months.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p {...fadeUp(0.14)}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
          style={{ color: '#94A3B8' }}>
          AI-powered career growth for ambitious professionals earning{' '}
          <span style={{ color: '#CBD5E1', fontWeight: 600 }}>₹5L–₹50L</span>{' '}
          who are ready to break through to the next level.
        </motion.p>
        <motion.p {...fadeUp(0.18)}
          className="text-sm max-w-xl mx-auto mb-10"
          style={{ color: '#475569' }}>
          Stop guessing. Stop taking bad advice from LinkedIn. Get a precise, personalized roadmap
          built by AI and reviewed by senior professionals who've made the exact jump you're targeting.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link to="/register"
            className="px-9 py-4 font-black text-white rounded-2xl text-base transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 0 40px rgba(5,150,105,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 60px rgba(5,150,105,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(5,150,105,0.4)'; }}>
            Book Strategy Call — ₹1,999 <ArrowRight size={16} className="inline ml-1" />
          </Link>
          <a href="#services"
            className="px-9 py-4 font-semibold rounded-2xl text-base transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
            See how it works
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: '#334155' }}>
          {['450+ professionals transformed', '₹2.4Cr+ salary increments unlocked', 'Average 180% salary growth'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle size={12} style={{ color: '#059669' }} />
              <span style={{ color: '#475569' }}>{t}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ══ STATS ═══════════════════════════════════════════════ */}
    <StatsSection />

    {/* ══ SERVICES ════════════════════════════════════════════ */}
    <section id="services" style={{ background: '#0F172A', position: 'relative', overflow: 'hidden' }}>
      <Grain opacity={0.03} />
      <Divider />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">

        <motion.div {...fadeUp(0)} className="mb-14">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#334155' }}>
            The full toolkit
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold" style={{ color: '#F1F5F9', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              Six tools.
              <br />
              <span style={{ background: 'linear-gradient(135deg, #34D399, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                One clear direction.
              </span>
            </h2>
            <p className="text-sm max-w-xs text-right hidden sm:block" style={{ color: '#475569' }}>
              Each tool is built for a specific career blocker experienced professionals face.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            const isLarge = i === 0;
            return (
              <motion.div key={s.title} {...fadeUp(i * 0.07)} style={{ gridColumn: isLarge ? 'span 2' : 'span 1' }}>
                <Link to={s.to}
                  className="group flex flex-col h-full rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
                  style={{ background: '#1E293B', border: `1px solid rgba(${s.colorRgb},0.15)`, minHeight: isLarge ? '220px' : '180px' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `rgba(${s.colorRgb},0.08)`;
                    e.currentTarget.style.borderColor = `rgba(${s.colorRgb},0.4)`;
                    e.currentTarget.style.boxShadow = `0 0 40px rgba(${s.colorRgb},0.12)`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#1E293B';
                    e.currentTarget.style.borderColor = `rgba(${s.colorRgb},0.15)`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '180px', background: `radial-gradient(circle, rgba(${s.colorRgb},0.07) 0%, transparent 70%)`, pointerEvents: 'none' }} />
                  <div className="flex items-start justify-between mb-auto">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${s.colorRgb},0.15)` }}>
                      <Icon size={18} style={{ color: s.color }} />
                    </div>
                    {s.tag && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `rgba(${s.colorRgb},0.15)`, color: s.color, border: `1px solid rgba(${s.colorRgb},0.3)` }}>
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-5">
                    <h3 className="font-bold mb-2 text-slate-200" style={{ fontSize: isLarge ? '1.15rem' : '0.95rem' }}>{s.title}</h3>
                    <p className="leading-relaxed text-slate-500" style={{ fontSize: isLarge ? '0.88rem' : '0.8rem' }}>{s.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all" style={{ color: s.color }}>
                    Try it <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Divider />
    </section>

    {/* ══ HOW IT WORKS ════════════════════════════════════════ */}
    <section style={{ background: '#1E293B', position: 'relative' }}>
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#334155' }}>The process</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            From stuck to promoted
            <br />
            <span style={{ background: 'linear-gradient(135deg, #34D399, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              in four steps.
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">No lengthy onboarding. No waiting for a coach's calendar.</p>
        </motion.div>

        <div className="relative">
          {/* Vertical emerald line */}
          <div className="absolute left-[28px] top-8 bottom-8 w-px hidden sm:block" style={{ background: 'linear-gradient(to bottom, transparent, #059669 20%, #059669 80%, transparent)' }} />

          <div className="space-y-6">
            {HOW.map((step, i) => (
              <motion.div key={step.n} {...fadeUp(i * 0.1)}
                className="flex items-start gap-5 rounded-2xl p-6"
                style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl"
                  style={{ background: 'rgba(5,150,105,0.12)', color: '#34D399', border: '1px solid rgba(5,150,105,0.2)' }}>
                  {step.n}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ══ TESTIMONIALS ════════════════════════════════════════ */}
    <div id="testimonials">
      <Testimonials />
    </div>

    {/* ══ PRICING ═════════════════════════════════════════════ */}
    <div id="pricing">
      <PricingSection />
    </div>

    {/* ══ FINAL CTA ═══════════════════════════════════════════ */}
    <section style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)', position: 'relative', overflow: 'hidden' }}>
      <Grain opacity={0.04} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(5,150,105,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center">
        <motion.p {...fadeUp(0)} className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: '#475569' }}>
          The uncomfortable truth
        </motion.p>
        <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6" style={{ lineHeight: 1.1, letterSpacing: '-0.025em' }}>
          Every month you wait
          <br />
          <span style={{ color: '#EF4444' }}>costs you ₹1–4 lakhs.</span>
        </motion.h2>
        <motion.p {...fadeUp(0.12)} className="text-base leading-relaxed mb-10" style={{ color: '#64748B' }}>
          The professionals ahead of you aren't smarter. They got a precise roadmap earlier.
          The gap isn't talent. It's information and strategy.
          <br /><br />
          <span style={{ color: '#94A3B8' }}>Tcent.AI gives you both — in your first session.</span>
        </motion.p>
        <motion.div {...fadeUp(0.18)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register"
            className="px-10 py-4 font-black text-white rounded-2xl text-base transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 0 50px rgba(5,150,105,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 70px rgba(5,150,105,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(5,150,105,0.4)'; }}>
            Book Your Strategy Call — ₹1,999
          </Link>
          <Link to="/login"
            className="px-10 py-4 font-semibold rounded-2xl text-base transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
            Already a member
          </Link>
        </motion.div>
        <motion.p {...fadeUp(0.24)} className="mt-6 text-xs" style={{ color: '#1E293B' }}>
          30-min strategy call · Money-back guarantee · Results or refund
        </motion.p>
      </div>
    </section>

  </div>
);

export default Landing;
