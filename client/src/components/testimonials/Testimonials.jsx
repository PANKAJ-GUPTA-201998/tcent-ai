import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const Grain = ({ opacity = 0.03 }) => (
  <div aria-hidden="true" style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'repeat', backgroundSize: '180px',
  }} />
);

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'Senior SDE',
    company: 'Amazon',
    review: "Switched from a mid-size startup to Amazon using TCENT.AI's roadmap. The skill gap analysis was surgical — I knew exactly what to fix. Worth every rupee.",
    rating: 5,
    salaryFrom: '12L',
    salaryTo: '42L',
    salaryPct: 250,
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager',
    company: 'Google',
    review: "8 years in development, always wanted PM. TCENT.AI's career path matching showed me the exact bridge. Got the Google PM offer in 7 months. Best investment in my career.",
    rating: 5,
    salaryFrom: '18L',
    salaryTo: '65L',
    salaryPct: 261,
  },
  {
    name: 'Rohit Verma',
    role: 'VP Engineering',
    company: 'Razorpay',
    review: "The executive coaching didn't just prep me for senior engineer interviews — it repositioned my entire narrative for leadership. Negotiated VP, not senior IC.",
    rating: 5,
    salaryFrom: '28L',
    salaryTo: '95L',
    salaryPct: 239,
  },
];

const Testimonials = () => (
  <section style={{ background: '#0F172A', position: 'relative', overflow: 'hidden' }}>
    <Grain opacity={0.04} />
    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.15) 40%, rgba(5,150,105,0.15) 60%, transparent)' }} />

    <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55 }}
        className="text-center mb-14">
        <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#334155' }}>
          Verified success stories
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Real professionals.{' '}
          <span style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Real salary jumps.
          </span>
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: '#475569' }}>
          These aren't cherry-picked outliers. This is what happens when ambitious professionals
          get a precise strategy instead of generic advice.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} {...t} index={i} />)}
      </div>

      {/* Bottom line */}
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-xs mt-10"
        style={{ color: '#1E293B' }}>
        Results are individual and vary based on starting point, commitment, and market conditions.
      </motion.p>
    </div>

    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.04) 60%, transparent)' }} />
  </section>
);

export default Testimonials;
