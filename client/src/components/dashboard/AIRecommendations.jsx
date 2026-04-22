import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const RecoCard = ({ reco, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, delay: 0.15 + index * 0.09 }}
    className="flex items-start gap-4 p-4 rounded-xl group transition-all duration-200 cursor-default"
    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(5,150,105,0.06)';
      e.currentTarget.style.borderColor = 'rgba(5,150,105,0.2)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
    }}
  >
    {/* Emoji icon */}
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
      style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.15)' }}>
      {reco.icon}
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white mb-0.5">{reco.text}</p>
      <p className="text-xs" style={{ color: '#475569' }}>{reco.metadata}</p>
    </div>

    {/* CTA */}
    <Link to={reco.to}
      className="flex-shrink-0 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all"
      style={{ color: '#34D399' }}>
      {reco.cta} <ArrowRight size={11} />
    </Link>
  </motion.div>
);

const AIRecommendations = ({ recommendations }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl p-5 relative overflow-hidden"
    style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}
  >
    <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '150px', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

    <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.15)' }}>
          <Sparkles size={14} style={{ color: '#A78BFA' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Personalised for You</h3>
          <p className="text-xs" style={{ color: '#475569' }}>AI-generated based on your profile</p>
        </div>
        <span className="ml-auto text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>
          AI
        </span>
      </div>

      {/* Recommendation list */}
      <div className="space-y-2">
        {recommendations.map((reco, i) => (
          <RecoCard key={i} reco={reco} index={i} />
        ))}
      </div>
    </div>
  </motion.div>
);

export default AIRecommendations;
