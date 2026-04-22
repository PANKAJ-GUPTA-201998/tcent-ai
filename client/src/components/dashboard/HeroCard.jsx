import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Target } from 'lucide-react';

/* ── Animated circular progress ─────────────────────────────── */
const CircularScore = ({ score, size = 96, strokeWidth = 7, color = '#059669' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
      let s = 0;
      const step = setInterval(() => {
        s += 2;
        if (s >= score) { setDisplay(score); clearInterval(step); }
        else setDisplay(s);
      }, 18);
      return () => clearInterval(step);
    }, 400);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-0 rounded-full blur-xl opacity-30" style={{ background: color }} />
      <svg width={size} height={size} className="-rotate-90 relative">
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white leading-none">{display}</span>
        <span className="text-[10px] font-semibold text-slate-400 tracking-wide">/100</span>
      </div>
    </div>
  );
};

/* ── Salary counter ─────────────────────────────────────────── */
const SalaryCount = ({ target, delay = 0 }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let s = 0;
      const step = setInterval(() => {
        s += 1;
        if (s >= target) { setDisplay(target); clearInterval(step); }
        setVal(s);
      }, 40);
      return () => clearInterval(step);
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [target]);
  return <>₹{val} LPA</>;
};

const HeroCard = ({ data, userName }) => {
  const { currentSalary, targetSalary, currentRole, targetRole, nextMilestone } = data.user;
  const { careerCompatibility } = data.scores;
  const jumpPct = Math.round(((targetSalary - currentSalary) / currentSalary) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0D2818 100%)',
        border: '1px solid rgba(5,150,105,0.2)',
        boxShadow: '0 0 60px rgba(5,150,105,0.08)',
      }}
    >
      {/* Radial glow overlays */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(5,150,105,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-30%', left: '10%', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">

          {/* Left — greeting + salary info */}
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#059669' }}>
              Career Growth Dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
              Welcome back, {userName?.split(' ')[0] || 'Professional'} 👋
            </h1>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>{currentRole} · on track for {targetRole}</p>

            {/* Salary row */}
            <div className="flex flex-wrap items-end gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Current CTC</p>
                <p className="text-3xl font-black" style={{ color: '#94A3B8' }}>₹{currentSalary} LPA</p>
              </div>
              <div className="flex items-center pb-1">
                <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, #334155, #059669)' }} />
                <TrendingUp size={18} className="mx-2" style={{ color: '#059669' }} />
                <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, #059669, #334155)' }} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Target CTC</p>
                <p className="text-3xl font-black" style={{ color: '#34D399' }}>₹{targetSalary} LPA</p>
              </div>
              {/* Jump badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
                ↑ {jumpPct}% salary jump
              </div>
            </div>

            {/* Milestone */}
            <div className="flex items-center gap-2 mb-6">
              <Target size={15} style={{ color: '#059669' }} />
              <span className="text-sm font-semibold" style={{ color: '#94A3B8' }}>
                Next milestone: <span className="text-white">{nextMilestone}</span>
              </span>
            </div>

            <Link to="/career"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 0 24px rgba(5,150,105,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(5,150,105,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(5,150,105,0.4)'; }}>
              View Full Roadmap <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right — career score ring */}
          <div className="flex flex-row lg:flex-col items-center gap-6 lg:gap-3 lg:text-center lg:min-w-[140px]">
            <CircularScore score={careerCompatibility} size={110} strokeWidth={8} color="#059669" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>Career Score</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Top 15% in your domain</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(5,150,105,0.12)', color: '#34D399', border: '1px solid rgba(5,150,105,0.2)' }}>
                Excellent ✓
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default HeroCard;
