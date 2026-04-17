import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PhaseJourney from '../components/PhaseJourney';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI Resume Analysis',
    description:
      'Upload your resume and our AI instantly extracts your skills, experience, and strengths with high accuracy.',
  },
  {
    icon: '🎯',
    title: 'Career Path Matching',
    description:
      'Get matched against 10+ career paths with a percentage score showing exactly where you fit best.',
  },
  {
    icon: '📊',
    title: 'Salary Intelligence',
    description:
      'See real salary ranges for each career match so you can negotiate with confidence.',
  },
  {
    icon: '📚',
    title: 'Skill Gap Detection',
    description:
      'Know precisely which skills to learn next to unlock higher-match career opportunities.',
  },
  {
    icon: '💬',
    title: 'AI Career Advisor',
    description:
      'Chat with an AI advisor trained on career strategy, resume writing, and interview preparation.',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    description:
      'Get a complete career intelligence report in seconds — no waiting, no manual review.',
  },
];

const Landing = () => (
  <div className="min-h-screen bg-white">

    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6 tracking-wide uppercase">
            Powered by Claude AI
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          AI-Powered{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Career Guidance
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Upload your resume and get instant, data-driven insights into the career paths
          where you're most likely to thrive — with salary ranges, skill gaps, and a
          personal AI advisor to guide every step.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <Link
            to="/register"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/40"
          >
            Get Started — It's Free
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all active:scale-95"
          >
            Learn More
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          className="mt-8 text-sm text-slate-400"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          No credit card required &middot; Results in under 10 seconds
        </motion.p>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      <motion.div
        className="text-center mb-14"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={0}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Everything you need to navigate your career
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          From resume parsing to live AI coaching — all in one place.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-md hover:border-blue-200 transition-all group"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={i}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-100 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Phase Journey */}
    <PhaseJourney />

    {/* CTA banner */}
    <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
        >
          Ready to find your best career path?
        </motion.h2>
        <motion.p
          className="text-slate-300 text-lg mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={1}
        >
          Join thousands of professionals making smarter career decisions with AI.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={2}
        >
          <Link
            to="/register"
            className="inline-block px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/40"
          >
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} Tcent.AI &middot; AI-powered career intelligence
    </footer>

  </div>
);

export default Landing;
