import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Zap, Mic, Users } from 'lucide-react';

/* ── Shared animated circular mini-ring ─────────────────────── */
const MiniRing = ({ score, color, size = 64, stroke = 6 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOff(circ - (score / 100) * circ), 300);
    return () => clearTimeout(t);
  }, [score, circ]);

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="absolute text-sm font-black" style={{ color }}>{score}</span>
    </div>
  );
};

/* ── Animated bar ───────────────────────────────────────────── */
const Bar = ({ value, color }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 400); return () => clearTimeout(t); }, [value]);
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${w}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
  );
};

/* ── Status badge ───────────────────────────────────────────── */
const Badge = ({ label, color, bg, border }) => (
  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
    style={{ background: bg, color, border: `1px solid ${border}` }}>
    {label}
  </span>
);

/* ── Base card shell ────────────────────────────────────────── */
const CardShell = ({ children, delay = 0, accentRgb = '255,255,255' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col rounded-2xl p-5 relative overflow-hidden"
    style={{
      background: '#1E293B',
      border: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle, rgba(${accentRgb},0.06) 0%, transparent 70%)`, pointerEvents: 'none' }} />
    {children}
  </motion.div>
);

const CtaLink = ({ to, label }) => (
  <Link to={to}
    className="mt-auto pt-4 flex items-center gap-1 text-xs font-bold transition-colors group"
    style={{ color: '#059669' }}
    onMouseEnter={e => { e.currentTarget.style.color = '#34D399'; }}
    onMouseLeave={e => { e.currentTarget.style.color = '#059669'; }}>
    {label} <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
  </Link>
);

/* ── Card A: Resume Score ───────────────────────────────────── */
export const ResumeScoreCard = ({ scores }) => {
  const { resumeScore, industryAvgResume } = scores;
  return (
    <CardShell delay={0.05} accentRgb="245,158,11">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ background: 'rgba(245,158,11,0.12)' }}>
            <FileText size={16} style={{ color: '#F59E0B' }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#475569' }}>Resume Score</p>
        </div>
        <Badge label="Can Improve" color="#F59E0B" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.2)" />
      </div>

      <div className="flex items-end gap-4 mb-4">
        <MiniRing score={resumeScore} color="#F59E0B" />
        <div>
          <p className="text-2xl font-black text-white">{resumeScore}<span className="text-sm text-slate-500 font-normal">/100</span></p>
          <p className="text-xs" style={{ color: '#475569' }}>Industry avg: {industryAvgResume}/100</p>
        </div>
      </div>

      <Bar value={resumeScore} color="#F59E0B" />
      <p className="text-xs mt-2" style={{ color: '#475569' }}>You're {resumeScore - industryAvgResume} points above average — push to 85+</p>
      <CtaLink to="/upload-resume" label="Improve Resume" />
    </CardShell>
  );
};

/* ── Card B: Skills Gap ─────────────────────────────────────── */
export const SkillsGapCard = ({ skillsGap }) => {
  const { missing, timeToLearn } = skillsGap;
  return (
    <CardShell delay={0.1} accentRgb="239,68,68">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ background: 'rgba(239,68,68,0.12)' }}>
            <Zap size={16} style={{ color: '#EF4444' }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#475569' }}>Skills Gap</p>
        </div>
        <Badge label="Action Needed" color="#EF4444" bg="rgba(239,68,68,0.1)" border="rgba(239,68,68,0.2)" />
      </div>

      <p className="text-3xl font-black text-white mb-1">{missing.length} <span className="text-sm font-normal text-slate-500">missing skills</span></p>
      <p className="text-xs mb-4" style={{ color: '#475569' }}>Time to learn: {timeToLearn}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {missing.map(skill => (
          <span key={skill} className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}>
            {skill}
          </span>
        ))}
      </div>

      <CtaLink to="/career" label="View Learning Path" />
    </CardShell>
  );
};

/* ── Card C: Interview Readiness ────────────────────────────── */
export const InterviewCard = ({ scores }) => {
  const { interviewReadiness } = scores;
  return (
    <CardShell delay={0.15} accentRgb="249,115,22">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ background: 'rgba(249,115,22,0.12)' }}>
            <Mic size={16} style={{ color: '#F97316' }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#475569' }}>Interview Readiness</p>
        </div>
        <Badge label="Needs Work" color="#F97316" bg="rgba(249,115,22,0.1)" border="rgba(249,115,22,0.2)" />
      </div>

      <div className="flex items-end gap-4 mb-4">
        <MiniRing score={interviewReadiness} color="#F97316" />
        <div>
          <p className="text-2xl font-black text-white">{interviewReadiness}<span className="text-sm text-slate-500 font-normal">/100</span></p>
          <p className="text-xs" style={{ color: '#475569' }}>Practice: 12/50 questions done</p>
        </div>
      </div>

      <Bar value={interviewReadiness} color="#F97316" />
      <p className="text-xs mt-2" style={{ color: '#475569' }}>Target 80+ before applying to FAANG roles</p>
      <CtaLink to="/ai-advisor" label="Practice Now" />
    </CardShell>
  );
};

/* ── Card D: Network Strength ───────────────────────────────── */
export const NetworkCard = ({ network }) => {
  const { linkedinConnections, pendingReferrals, status } = network;
  return (
    <CardShell delay={0.2} accentRgb="139,92,246">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ background: 'rgba(139,92,246,0.12)' }}>
            <Users size={16} style={{ color: '#8B5CF6' }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#475569' }}>Network Strength</p>
        </div>
        <Badge label={status} color="#8B5CF6" bg="rgba(139,92,246,0.1)" border="rgba(139,92,246,0.2)" />
      </div>

      <p className="text-3xl font-black text-white mb-1">{linkedinConnections.toLocaleString('en-IN')}</p>
      <p className="text-xs mb-4" style={{ color: '#475569' }}>LinkedIn connections · 500+ is strong</p>

      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <span className="text-lg">🔔</span>
        <p className="text-xs" style={{ color: '#A78BFA' }}>
          <span className="font-bold">{pendingReferrals} referral requests</span> pending reply
        </p>
      </div>

      <CtaLink to="/ai-advisor" label="Expand Network" />
    </CardShell>
  );
};
