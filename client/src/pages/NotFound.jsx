import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div
    className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    style={{ background: '#0F172A' }}
  >
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="max-w-md w-full"
    >
      {/* Glowing 404 */}
      <div className="relative mb-8 select-none">
        <p
          className="text-8xl font-black tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #6366F1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 32px rgba(5,150,105,0.35))',
          }}
        >
          404
        </p>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(5,150,105,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <h1 className="text-2xl font-black text-white mb-3">Page not found</h1>
      <p className="text-sm mb-8" style={{ color: '#64748B' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #059669, #6366F1)' }}
        >
          <Home size={15} />
          Go home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ color: '#64748B', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
        >
          <ArrowLeft size={15} />
          Go back
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
