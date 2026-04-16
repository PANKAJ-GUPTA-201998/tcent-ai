import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import {
  CheckCircle, XCircle, Lightbulb, LayoutGrid, FileText, AlertTriangle,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

// ─── Animated Score Ring ──────────────────────────────────────────────────────

const ScoreRing = ({ score }) => {
  const size = 150;
  const strokeWidth = 13;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const color =
    score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const glowColor =
    score >= 75 ? 'rgba(34,197,94,0.25)' : score >= 50 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)';

  // Animate stroke offset
  const spring = useSpring(circumference, { stiffness: 45, damping: 16 });
  const offset = useTransform(spring, (v) => v);

  // Animate counter
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = circumference - (score / 100) * circumference;
    spring.set(target);

    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      setDisplay(Math.round(score * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Glow behind ring */}
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: glowColor }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
          className="dark:stroke-gray-700"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {/* Counter */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-none tabular-nums">
          {display}
        </span>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">ATS Score</span>
      </div>
    </div>
  );
};

// ─── Keyword Chip ─────────────────────────────────────────────────────────────

const KeywordChip = ({ label, variant, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25, delay: index * 0.04 }}
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-default
      transition-all duration-200
      ${variant === 'matched'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]'
        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.4)]'
      }`}
  >
    {variant === 'matched' ? <CheckCircle size={11} /> : <XCircle size={11} />}
    {label}
  </motion.span>
);

// ─── Typewriter Suggestion ────────────────────────────────────────────────────

const TypewriterText = ({ text, delay = 0, onDone }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 18);
    return () => clearTimeout(t);
  }, [started, displayed, text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-3.5 bg-yellow-500 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
};

const SuggestionItem = ({ text, index, active, onDone }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
    transition={{ duration: 0.3 }}
    className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 min-h-[1.5rem]"
  >
    <motion.span
      animate={active ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.4 }}
      className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-xs font-bold mt-0.5"
    >
      {index + 1}
    </motion.span>
    {active && (
      <TypewriterText
        text={text}
        delay={100}
        onDone={onDone}
      />
    )}
  </motion.li>
);

// ─── Radar Chart ─────────────────────────────────────────────────────────────

const buildRadarData = ({ score, matchedKeywords, missingKeywords, resumeWordCount, sectionFeedback }) => {
  const total = matchedKeywords.length + missingKeywords.length;
  const keywordMatch = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 0;

  // Skill coverage: skill-type keywords matched vs missing
  const skillTerms = ['react','node','python','java','sql','aws','docker','kubernetes','typescript','javascript','css','html','git','linux','mongodb','redis'];
  const matchedSkills = matchedKeywords.filter(k => skillTerms.some(t => k.toLowerCase().includes(t))).length;
  const totalSkills = [...matchedKeywords, ...missingKeywords].filter(k => skillTerms.some(t => k.toLowerCase().includes(t))).length;
  const skillScore = totalSkills > 0 ? Math.round((matchedSkills / totalSkills) * 100) : keywordMatch;

  // Content richness: 300 words → 40, 500 → 70, 700+ → 90, capped at 95
  const contentScore = resumeWordCount
    ? Math.min(95, Math.round((resumeWordCount / 700) * 90))
    : 50;

  // Format completeness: based on sectionFeedback keys
  const sections = Object.keys(sectionFeedback || {});
  const formatScore = sections.length >= 3 ? 85 : sections.length === 2 ? 70 : 55;

  return [
    { axis: 'ATS Score',       value: score },
    { axis: 'Keywords',        value: keywordMatch },
    { axis: 'Skills',          value: skillScore },
    { axis: 'Content',         value: contentScore },
    { axis: 'Format',          value: formatScore },
  ];
};

const AnimatedRadar = ({ data }) => {
  const [animated, setAnimated] = useState(false);
  const [displayData, setDisplayData] = useState(data.map(d => ({ ...d, value: 0 })));

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimated(true);
      setDisplayData(data);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={displayData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid
          stroke="rgba(156,163,175,0.2)"
          gridType="polygon"
        />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, '']}
          contentStyle={{
            background: 'rgba(17,24,39,0.9)',
            border: '1px solid rgba(75,85,99,0.4)',
            borderRadius: 8,
            fontSize: 12,
            color: '#e5e7eb',
          }}
        />
        <Radar
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
          isAnimationActive={true}
          animationDuration={900}
          animationEasing="ease-out"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

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

  // Typewriter: reveal suggestions one after another
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const radarData = buildRadarData({ score, matchedKeywords, missingKeywords, resumeWordCount, sectionFeedback });

  const scoreColor =
    score >= 75 ? 'text-green-600 dark:text-green-400' :
    score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
    'text-red-500 dark:text-red-400';

  const scoreLabel =
    score >= 75 ? 'Strong Match' :
    score >= 50 ? 'Moderate Match' :
    'Weak Match';

  const scoreBadge =
    score >= 75
      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      : score >= 50
        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300';

  const scoreMessage =
    score >= 75 ? 'Your resume is well-optimised for this role.'
    : score >= 50 ? 'Good start — add the missing keywords to improve your score.'
    : 'Significant gaps found. Review the suggestions below.';

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="mt-8 space-y-5"
    >
      {/* ── Score Banner ── */}
      <motion.div
        variants={slideUp}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
      >
        <ScoreRing score={score} />

        <div className="flex-1 text-center sm:text-left">
          <h3 className={`text-2xl font-black ${scoreColor}`}>{scoreLabel}</h3>

          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {keywordDensity.matched ?? matchedKeywords.length} of{' '}
            {keywordDensity.total ?? (matchedKeywords.length + missingKeywords.length)} keywords matched
          </p>

          {resumeWordCount && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
              Resume: {resumeWordCount.toLocaleString()} words
            </p>
          )}
          {analyzedAt && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
              Analyzed at {new Date(analyzedAt).toLocaleTimeString()}
            </p>
          )}

          <div className={`mt-3 inline-block px-3 py-1.5 rounded-lg text-sm font-medium ${scoreBadge}`}>
            {scoreMessage}
          </div>
        </div>

        {/* Radar chart inside score banner on wide screens */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center mb-1">
            Skills Radar
          </p>
          <AnimatedRadar data={radarData} />
        </div>
      </motion.div>

      {/* ── Radar chart on small screens (below banner) ── */}
      <motion.div
        variants={slideUp}
        className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
      >
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-2">Skills Radar</h4>
        <AnimatedRadar data={radarData} />
      </motion.div>

      {/* ── Keywords Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched */}
        <motion.div
          variants={slideUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
            <CheckCircle size={17} className="text-green-500" />
            Matched Keywords
            <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              {matchedKeywords.length}
            </span>
          </h4>
          {matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((kw, i) => (
                <KeywordChip key={kw} label={kw} variant="matched" index={i} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No keyword matches found.</p>
          )}
        </motion.div>

        {/* Missing */}
        <motion.div
          variants={slideUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
            <XCircle size={17} className="text-red-500" />
            Missing Keywords
            <span className="ml-auto text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
              {missingKeywords.length}
            </span>
          </h4>
          {missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <KeywordChip key={kw} label={kw} variant="missing" index={i} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No missing keywords — great job!</p>
          )}
        </motion.div>
      </div>

      {/* ── Suggestions (typewriter) ── */}
      {suggestions.length > 0 && (
        <motion.div
          variants={slideUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
            >
              {score < 50
                ? <AlertTriangle size={17} className="text-red-500" />
                : <Lightbulb size={17} className="text-yellow-500" />
              }
            </motion.div>
            {score < 50 ? 'Critical Improvements Needed' : 'Suggestions to Improve Your Score'}
          </h4>

          <ul className="space-y-4">
            {suggestions.map((s, i) => (
              <SuggestionItem
                key={i}
                text={s}
                index={i}
                active={i <= activeSuggestion}
                onDone={() => {
                  if (i === activeSuggestion && i < suggestions.length - 1) {
                    setTimeout(() => setActiveSuggestion((a) => a + 1), 200);
                  }
                }}
              />
            ))}
          </ul>
        </motion.div>
      )}

      {/* ── Section Feedback ── */}
      {Object.keys(sectionFeedback).length > 0 && (
        <motion.div
          variants={slideUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <LayoutGrid size={17} className="text-blue-500" />
            Section Feedback
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(sectionFeedback).map(([section, feedback], i) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.1 }}
                className="rounded-xl bg-gray-50 dark:bg-gray-700/40 p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={13} className="text-blue-400" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {section}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feedback}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ATSResults;
