import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Trait definitions ────────────────────────────────────────────────────────
const TRAITS = [
  {
    key: 'openness',
    label: 'Openness',
    letter: 'O',
    shortDesc: 'Curiosity & creativity',
    highDesc: 'You embrace novelty and thrive in evolving industries — a strong fit for innovation-led roles.',
    lowDesc:  'You prefer structured, well-defined domains with established practices and predictable routines.',
    gradient: 'from-violet-400 to-violet-600',
    letter_bg: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  },
  {
    key: 'conscientiousness',
    label: 'Conscientiousness',
    letter: 'C',
    shortDesc: 'Organisation & reliability',
    highDesc: 'Highly organised and goal-driven — a strong delivery track record is a key asset of yours.',
    lowDesc:  'You work best in fluid, exploratory environments rather than rigid schedules or tight deadlines.',
    gradient: 'from-blue-400 to-blue-600',
    letter_bg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
  {
    key: 'extraversion',
    label: 'Extraversion',
    letter: 'E',
    shortDesc: 'Sociability & assertiveness',
    highDesc: 'Energised by collaboration, networking, and stakeholder engagement — a natural in social roles.',
    lowDesc:  'You work best in focused, independent settings with fewer interruptions and smaller teams.',
    gradient: 'from-amber-400 to-amber-600',
    letter_bg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  {
    key: 'agreeableness',
    label: 'Agreeableness',
    letter: 'A',
    shortDesc: 'Empathy & cooperation',
    highDesc: 'You build trust easily and act as an effective mediator — valuable in team-based or service roles.',
    lowDesc:  'Direct and results-focused; comfortable with assertive negotiation and independent decision-making.',
    gradient: 'from-green-400 to-green-600',
    letter_bg: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  },
  {
    key: 'neuroticism',
    label: 'Neuroticism',
    letter: 'N',
    shortDesc: 'Emotional sensitivity',
    highDesc: 'You benefit from stable, low-ambiguity environments with clear expectations and steady workloads.',
    lowDesc:  'Calm under pressure — well-suited to high-stakes, fast-moving roles with frequent context-switching.',
    gradient: 'from-red-400 to-red-500',
    letter_bg: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  },
];

// ─── Band logic ───────────────────────────────────────────────────────────────
// Using ≥70 = High, ≥30 = Moderate, <30 = Low  (spec says >70 High, <30 Low)
const getBand = (score) =>
  score >= 70 ? 'High' : score >= 30 ? 'Moderate' : 'Low';

const BAND_STYLE = {
  High:     { pill: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  Moderate: { pill: 'bg-amber-100   dark:bg-amber-900/40   text-amber-700   dark:text-amber-300   border-amber-200   dark:border-amber-800',   dot: 'bg-amber-500'   },
  Low:      { pill: 'bg-red-100     dark:bg-red-900/40     text-red-700     dark:text-red-300     border-red-200     dark:border-red-800',     dot: 'bg-red-400'     },
};

// ─── Individual trait row ─────────────────────────────────────────────────────
const TraitRow = ({ trait, score, delay }) => {
  const [hovered, setHovered] = useState(false);
  const band = getBand(score);
  const styles = BAND_STYLE[band];
  const desc = band === 'High' ? trait.highDesc : trait.lowDesc;

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Top row: letter + label + band pill + score ─────────────────── */}
      <div className="flex items-center gap-3 mb-1.5">
        {/* OCEAN letter badge */}
        <span className={`shrink-0 inline-flex w-6 h-6 items-center justify-center rounded-md text-xs font-bold ${trait.letter_bg}`}>
          {trait.letter}
        </span>

        {/* Label + short desc */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {trait.label}
          </span>
          <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            {trait.shortDesc}
          </span>
        </div>

        {/* Band pill */}
        <span className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${styles.pill}`}>
          {band}
        </span>

        {/* Numeric score */}
        <span className="shrink-0 w-10 text-right text-sm font-bold tabular-nums text-slate-600 dark:text-slate-300">
          {score}%
        </span>
      </div>

      {/* ── Bar track with colour zones ──────────────────────────────────── */}
      <div className="relative h-3 rounded-full overflow-hidden mb-1">
        {/* Zone background: Low (red) → Moderate (amber) → High (green) */}
        <div className="absolute inset-0 flex">
          <div className="w-[30%] bg-red-100   dark:bg-red-950/30  rounded-l-full" />
          <div className="w-[40%] bg-amber-100  dark:bg-amber-950/30" />
          <div className="w-[30%] bg-green-100  dark:bg-green-950/30 rounded-r-full" />
        </div>

        {/* Zone boundary markers */}
        <div className="absolute top-0 bottom-0 w-px bg-red-300/60 dark:bg-red-800/60" style={{ left: '30%' }} />
        <div className="absolute top-0 bottom-0 w-px bg-green-300/60 dark:bg-green-800/60" style={{ left: '70%' }} />

        {/* Filled score bar */}
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${trait.gradient} opacity-90`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        />

        {/* Score thumb indicator */}
        <motion.div
          className={`absolute top-0.5 bottom-0.5 w-1.5 rounded-full ${styles.dot} shadow-sm`}
          initial={{ left: '0%' }}
          animate={{ left: `calc(${score}% - 3px)` }}
          transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* ── Zone labels ──────────────────────────────────────────────────── */}
      <div className="flex text-[9px] text-slate-400 dark:text-slate-600 mb-0.5">
        <span className="w-[30%]">Low</span>
        <span className="w-[40%] text-center">Moderate</span>
        <span className="w-[30%] text-right">High</span>
      </div>

      {/* ── Description (hover reveal or always-on below) ──────────────── */}
      <AnimatePresence initial={false}>
        {hovered && (
          <motion.p
            key="desc"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1"
          >
            {desc}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const BigFiveChart = ({ scores }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-4">
      Big Five (OCEAN)
    </p>

    <div className="space-y-5">
      {TRAITS.map((trait, idx) => (
        <TraitRow
          key={trait.key}
          trait={trait}
          score={scores?.[trait.key] ?? 0}
          delay={idx * 0.08 + 0.1}
        />
      ))}
    </div>

    {/* ── Legend ──────────────────────────────────────────────────────────── */}
    <div className="flex items-center gap-4 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mr-1">Zones:</p>
      {[
        { label: 'Low',      range: '< 30',   dot: 'bg-red-400'    },
        { label: 'Moderate', range: '30–70',  dot: 'bg-amber-400'  },
        { label: 'High',     range: '> 70',   dot: 'bg-emerald-500'},
      ].map(({ label, range, dot }) => (
        <div key={label} className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">({range})</span>
        </div>
      ))}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto hidden sm:block">
        Hover a row for insight
      </p>
    </div>
  </div>
);

export default BigFiveChart;
