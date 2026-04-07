import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ─── Value metadata ───────────────────────────────────────────────────────────
const VALUE_META = {
  autonomy:        {
    label: 'Autonomy',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zm0 2a7 7 0 110 14A7 7 0 0110 3zm.75 3.75a.75.75 0 00-1.5 0v3.5l-2.1 1.4a.75.75 0 10.82 1.26l2.4-1.6a.75.75 0 00.38-.66v-3.9z" clipRule="evenodd" />
      </svg>
    ),
    description: 'Freedom to work independently with minimal supervision.',
    barFrom: 'from-blue-400', barTo: 'to-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800',
    icon_bg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  },
  stability:       {
    label: 'Stability',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2z" />
      </svg>
    ),
    description: 'Secure, predictable income and job continuity.',
    barFrom: 'from-green-400', barTo: 'to-green-600',
    bgLight: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800',
    icon_bg: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
  },
  creativity:      {
    label: 'Creativity',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
      </svg>
    ),
    description: 'Space to innovate, experiment, and bring ideas to life.',
    barFrom: 'from-purple-400', barTo: 'to-purple-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800',
    icon_bg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  },
  impact:          {
    label: 'Impact',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
    description: 'Making a meaningful contribution to society or your organisation.',
    barFrom: 'from-rose-400', barTo: 'to-rose-600',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800',
    icon_bg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
  },
  growth:          {
    label: 'Growth',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.918z" clipRule="evenodd" />
      </svg>
    ),
    description: 'Continuous learning and tangible career advancement opportunities.',
    barFrom: 'from-emerald-400', barTo: 'to-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800',
    icon_bg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  },
  workLifeBalance: {
    label: 'Work-Life Balance',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
      </svg>
    ),
    description: 'Protected personal time and flexibility for family and wellbeing.',
    barFrom: 'from-teal-400', barTo: 'to-teal-600',
    bgLight: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200 dark:border-teal-800',
    icon_bg: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
  },
};

// ─── Medal SVGs ───────────────────────────────────────────────────────────────
const MEDALS = [
  // Gold
  <svg key="gold" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="14" r="8" fill="#FBBF24" />
    <circle cx="12" cy="14" r="6" fill="#F59E0B" />
    <text x="12" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">1</text>
    <path d="M9 6l3-6 3 6" fill="#F59E0B" />
    <path d="M7 6h10l-2 4H9L7 6z" fill="#FBBF24" />
  </svg>,
  // Silver
  <svg key="silver" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="14" r="8" fill="#CBD5E1" />
    <circle cx="12" cy="14" r="6" fill="#94A3B8" />
    <text x="12" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">2</text>
    <path d="M9 6l3-6 3 6" fill="#94A3B8" />
    <path d="M7 6h10l-2 4H9L7 6z" fill="#CBD5E1" />
  </svg>,
  // Bronze
  <svg key="bronze" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="14" r="8" fill="#D97706" />
    <circle cx="12" cy="14" r="6" fill="#B45309" />
    <text x="12" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">3</text>
    <path d="M9 6l3-6 3 6" fill="#B45309" />
    <path d="M7 6h10l-2 4H9L7 6z" fill="#D97706" />
  </svg>,
];

// ─── Single value row ─────────────────────────────────────────────────────────
const ValueRow = ({ rank, valueKey, score, isTop3, delay }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = VALUE_META[valueKey];
  if (!meta) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
    >
      <div
        className={[
          'rounded-xl border transition-colors duration-150',
          isTop3
            ? `${meta.bgLight} ${meta.border}`
            : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800',
        ].join(' ')}
      >
        {/* Main row */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-3 text-left"
          aria-expanded={expanded}
        >
          {/* Medal / rank */}
          <div className="shrink-0 w-6 flex items-center justify-center">
            {isTop3 ? MEDALS[rank] : (
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-5 text-center">
                {rank + 1}
              </span>
            )}
          </div>

          {/* Icon */}
          <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${meta.icon_bg}`}>
            {meta.icon}
          </div>

          {/* Name */}
          <span
            className={[
              'flex-1 text-sm font-medium',
              isTop3
                ? 'text-slate-800 dark:text-slate-100'
                : 'text-slate-600 dark:text-slate-400',
            ].join(' ')}
          >
            {meta.label}
          </span>

          {/* Score */}
          <span
            className={[
              'shrink-0 text-sm font-bold tabular-nums',
              isTop3
                ? 'text-slate-700 dark:text-slate-200'
                : 'text-slate-400 dark:text-slate-500',
            ].join(' ')}
          >
            {score}%
          </span>

          {/* Expand chevron */}
          <ChevronDown
            size={14}
            className={[
              'shrink-0 text-slate-400 transition-transform duration-200',
              expanded ? 'rotate-180' : '',
            ].join(' ')}
          />
        </button>

        {/* Progress bar */}
        <div className="px-3 pb-3">
          <div className="h-1.5 rounded-full bg-white/60 dark:bg-slate-700/50 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta.barFrom} ${meta.barTo}`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ delay: delay + 0.15, duration: 0.65, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Expandable description */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="desc"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="px-3 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-black/5 dark:border-white/5 pt-2">
                {meta.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const WorkValuesRanking = ({ scores }) => {
  const ranked = Object.entries(scores ?? {})
    .sort(([, a], [, b]) => b - a)
    .map(([key, score]) => ({ key, score }));

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">
        Work Values Ranking
      </p>

      <div className="space-y-2">
        {ranked.map(({ key, score }, idx) => (
          <ValueRow
            key={key}
            rank={idx}
            valueKey={key}
            score={score}
            isTop3={idx < 3}
            delay={idx * 0.06}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkValuesRanking;
