/**
 * Testimonials — 3-card grid
 * Dark background — fits between the Features bento and Fear closer sections.
 */

import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

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

const TESTIMONIALS = [
  {
    name:   'Rohan Mishra',
    role:   'Software Developer',
    review: "TCENT.AI's personality assessment cleared my confusion. Finally happy with my career choice.",
    rating: 5,
  },
  {
    name:   'Anjali Singh',
    role:   'Data Analyst',
    review: "The AI advisor's guidance was helpful. My resume improved significantly.",
    rating: 4,
  },
  {
    name:   'Vikash Kumar',
    role:   'DevOps Engineer',
    review: 'Career path suggestions were spot on. Highly recommended!',
    rating: 5,
  },
];

const Testimonials = () => (
  <section
    style={{
      background: '#080810',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Grain opacity={0.04} />

    {/* Top divider */}
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent)',
    }} />

    <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="text-center mb-12"
      >
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ color: '#334155' }}
        >
          What professionals say
        </p>
        <h2
          className="text-3xl sm:text-4xl font-extrabold"
          style={{
            color: '#F1F5F9',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          Real people.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Real clarity.
          </span>
        </h2>
      </motion.div>

      {/* 3-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} {...t} index={i} />
        ))}
      </div>

    </div>

    {/* Bottom divider */}
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, transparent)',
    }} />
  </section>
);

export default Testimonials;
