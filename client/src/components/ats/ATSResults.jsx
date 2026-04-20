import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import {
  CheckCircle, XCircle, Lightbulb, LayoutGrid, FileText,
  AlertTriangle, TrendingUp, Target, Zap,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

// ─── Score config (single source of truth) ───────────────────────────────────

const scoreConfig = (score) => {
  if (score >= 75) return {
    label: 'Strong Match',
    message: 'Your resume is well-optimised for this role.',
    color: '#22c55e',
    colorRgb: '34,197,94',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-900/50',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    icon: TrendingUp,
  };
  if (score >= 50) return {
    label: 'Moderate Match',
    message: 'Good start — add the missing keywords to improve your score.',
    color: '#f59e0b',
    colorRgb: '245,158,11',
    textClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-900/50',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    icon: Target,
  };
  return {
    label: 'Weak Match',
    message: 'Significant gaps found. Review the suggestions below carefully.',
    color: '#ef4444',
    colorRgb: '239,68,68',
    textClass: 'text-red-500 dark:text-red-400',
    bgClass: 'bg-red-50 dark:bg-red-950/40',
    borderClass: 'border-red-200 dark:border-red-900/50',
    badgeBg: 'bg-red-100 dark:bg-red-900/40',
    badgeText: 'text-red-700 dark:text-red-300',
    icon: AlertTriangle,
  };
};

// ─── Animated Score Ring ──────────────────────────────────────────────────────

const ScoreRing = ({ score, color }) => {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const spring = useSpring(circumference, { stiffness: 40, damping: 15 });
  const offset = useTransform(spring, (v) => v);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    spring.set(circumference - (score / 100) * circumference);
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1000, 1);
      setDisplay(Math.round(score * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30"
        style={{ background: color }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={strokeWidth}
          className="dark:stroke-white/10"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black leading-none tabular-nums" style={{ color }}>
          {display}
        </span>
        <span className="text-xs font-semibold text-gray-400 mt-1 tracking-wide uppercase">/ 100</span>
      </div>
    </div>
  );
};

// ─── Keyword chip ─────────────────────────────────────────────────────────────

const KeywordChip = ({ label, variant, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, delay: index * 0.03 }}
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-default select-none
      ${variant === 'matched'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
        : 'bg-red-100 text-red-600 dark:bg-red-900/35 dark:text-red-400 border border-red-200 dark:border-red-800/50'
      }`}
  >
    {variant === 'matched'
      ? <CheckCircle size={11} />
      : <XCircle size={11} />
    }
    {label}
  </motion.span>
);

// ─── Typewriter ───────────────────────────────────────────────────────────────

const TypewriterText = ({ text, delay = 0, onDone }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 16);
    return () => clearTimeout(t);
  }, [started, displayed, text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-3.5 bg-amber-400 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
};

const SuggestionItem = ({ text, index, active, onDone }) => (
  <motion.li
    initial={{ opacity: 0, x: -8 }}
    animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
    transition={{ duration: 0.3 }}
    className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 min-h-[1.5rem]"
  >
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold mt-0.5">
      {index + 1}
    </span>
    {active && <TypewriterText text={text} delay={80} onDone={onDone} />}
  </motion.li>
);

// ─── Radar chart ──────────────────────────────────────────────────────────────

const buildRadarData = ({ score, matchedKeywords, missingKeywords, resumeWordCount, sectionFeedback }) => {
  const total = matchedKeywords.length + missingKeywords.length;
  const keywordMatch = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 0;
  const skillTerms = ['react','node','python','java','sql','aws','docker','kubernetes','typescript','javascript','css','html','git','linux','mongodb','redis'];
  const matchedSkills = matchedKeywords.filter(k => skillTerms.some(t => k.toLowerCase().includes(t))).length;
  const totalSkills = [...matchedKeywords, ...missingKeywords].filter(k => skillTerms.some(t => k.toLowerCase().includes(t))).length;
  const skillScore = totalSkills > 0 ? Math.round((matchedSkills / totalSkills) * 100) : keywordMatch;
  const contentScore = resumeWordCount ? Math.min(95, Math.round((resumeWordCount / 700) * 90)) : 50;
  const sections = Object.keys(sectionFeedback || {});
  const formatScore = sections.length >= 3 ? 85 : sections.length === 2 ? 70 : 55;
  return [
    { axis: 'ATS Score', value: score },
    { axis: 'Keywords',  value: keywordMatch },
    { axis: 'Skills',    value: skillScore },
    { axis: 'Content',   value: contentScore },
    { axis: 'Format',    value: formatScore },
  ];
};

const AnimatedRadar = ({ data }) => {
  const [displayData, setDisplayData] = useState(data.map(d => ({ ...d, value: 0 })));
  useEffect(() => { const t = setTimeout(() => setDisplayData(data), 300); return () => clearTimeout(t); }, []);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={displayData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="rgba(156,163,175,0.15)" gridType="polygon" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} />
        <Tooltip
          formatter={(v) => [`${v}%`, '']}
          contentStyle={{ background: 'rgba(15,16,23,0.95)', border: '1px solid rgba(75,85,99,0.3)', borderRadius: 10, fontSize: 12, color: '#e5e7eb' }}
        />
        <Radar
          dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2}
          strokeWidth={2} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
          isAnimationActive animationDuration={900} animationEasing="ease-out"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// ─── Section Feedback card ────────────────────────────────────────────────────

const SECTION_COLORS = [
  { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-100 dark:border-blue-900/40', icon: 'text-blue-500' },
  { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-100 dark:border-violet-900/40', icon: 'text-violet-500' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/30', border: 'border-cyan-100 dark:border-cyan-900/40', icon: 'text-cyan-500' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/40', icon: 'text-emerald-500' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const slideUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

const ATSResults = ({ results }) => {
  const {
    score = 0,
    matchedKeywords = [],
    missingKeywords = [],
    suggestions = [],
    keywordDensity = {},
    sectionFeedback = {},
    resumeWordCount,
    analyzedAt,
  } = results;

  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const cfg = scoreConfig(score);
  const StatusIcon = cfg.icon;
  const radarData = buildRadarData({ score, matchedKeywords, missingKeywords, resumeWordCount, sectionFeedback });
  const matchedCount = keywordDensity.matched ?? matchedKeywords.length;
  const totalCount = keywordDensity.total ?? (matchedKeywords.length + missingKeywords.length);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-8 space-y-4">

      {/* ── Score Banner ────────────────────────────────────────── */}
      <motion.div
        variants={slideUp}
        className={`rounded-2xl border p-6 ${cfg.bgClass} ${cfg.borderClass}`}
      >
        {/* Top badge */}
        <div className="flex items-center gap-2 mb-5">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.badgeBg} ${cfg.badgeText}`}>
            <StatusIcon size={12} />
            {cfg.label}
          </div>
          {analyzedAt && (
            <span className="text-xs text-gray-400 ml-auto">
              {new Date(analyzedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Ring */}
          <div className="flex-shrink-0">
            <ScoreRing score={score} color={cfg.color} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className={`text-lg font-bold mb-1 ${cfg.textClass}`}>{cfg.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{matchedCount}</span> of{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-200">{totalCount}</span> keywords matched
            </p>
            {resumeWordCount && (
              <p className="text-xs text-gray-400 mt-0.5">Resume length: {resumeWordCount.toLocaleString()} words</p>
            )}

            {/* Mini keyword bar */}
            <div className="mt-4 max-w-xs">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-emerald-600 dark:text-emerald-400">{matchedCount} matched</span>
                <span className="text-red-500 dark:text-red-400">{totalCount - matchedCount} missing</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: totalCount > 0 ? `${(matchedCount / totalCount) * 100}%` : '0%' }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}aa)` }}
                />
              </div>
            </div>
          </div>

          {/* Radar — desktop */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-1">Skills Radar</p>
            <AnimatedRadar data={radarData} />
          </div>
        </div>
      </motion.div>

      {/* ── Radar — mobile ──────────────────────────────────────── */}
      <motion.div
        variants={slideUp}
        className="lg:hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
      >
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills Radar</h4>
        <AnimatedRadar data={radarData} />
      </motion.div>

      {/* ── Keywords Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Matched */}
        <motion.div
          variants={slideUp}
          className="bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <CheckCircle size={15} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Matched Keywords</h4>
            <span className="ml-auto text-xs font-bold bg-emerald-200 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
              {matchedKeywords.length}
            </span>
          </div>
          {matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((kw, i) => <KeywordChip key={kw} label={kw} variant="matched" index={i} />)}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No keyword matches found.</p>
          )}
        </motion.div>

        {/* Missing */}
        <motion.div
          variants={slideUp}
          className="bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <XCircle size={15} className="text-red-500 dark:text-red-400" />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Missing Keywords</h4>
            <span className="ml-auto text-xs font-bold bg-red-200 dark:bg-red-900/60 text-red-600 dark:text-red-300 px-2.5 py-0.5 rounded-full">
              {missingKeywords.length}
            </span>
          </div>
          {missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => <KeywordChip key={kw} label={kw} variant="missing" index={i} />)}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No missing keywords — great job!</p>
          )}
        </motion.div>
      </div>

      {/* ── Suggestions ─────────────────────────────────────────── */}
      {suggestions.length > 0 && (
        <motion.div
          variants={slideUp}
          className="bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
              >
                {score < 50
                  ? <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />
                  : <Lightbulb size={15} className="text-amber-600 dark:text-amber-400" />
                }
              </motion.div>
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              {score < 50 ? 'Critical Improvements Needed' : 'Suggestions to Improve Your Score'}
            </h4>
          </div>
          <ul className="space-y-4">
            {suggestions.map((s, i) => (
              <SuggestionItem
                key={i} text={s} index={i}
                active={i <= activeSuggestion}
                onDone={() => {
                  if (i === activeSuggestion && i < suggestions.length - 1)
                    setTimeout(() => setActiveSuggestion((a) => a + 1), 200);
                }}
              />
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── Section Feedback ────────────────────────────────────── */}
      {Object.keys(sectionFeedback).length > 0 && (
        <motion.div
          variants={slideUp}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <LayoutGrid size={15} className="text-blue-500" />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Section Feedback</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(sectionFeedback).map(([section, feedback], i) => {
              const c = SECTION_COLORS[i % SECTION_COLORS.length];
              return (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                  className={`rounded-xl p-4 border ${c.bg} ${c.border}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={13} className={c.icon} />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {section}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{feedback}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default ATSResults;
