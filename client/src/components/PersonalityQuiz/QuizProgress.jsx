import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

// Default section config — used when parent doesn't supply a sections prop
const DEFAULT_SECTIONS = [
  { key: 'riasec',     label: 'RIASEC',       longLabel: 'Career Interests',   count: 36 },
  { key: 'workValues', label: 'Work Values',   longLabel: 'Work Values',        count: 18 },
  { key: 'bigFive',    label: 'Big Five',      longLabel: 'Personality Traits', count: 20 },
];

// Gradient tokens per section tab (active state)
const SECTION_GRADIENTS = [
  'from-blue-500   to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500  to-purple-500',
];

// Active tab text/ring colours
const SECTION_ACTIVE = [
  'ring-blue-400/60   bg-blue-50   text-blue-700   dark:bg-blue-950/40  dark:text-blue-300',
  'ring-emerald-400/60 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  'ring-violet-400/60  bg-violet-50  text-violet-700  dark:bg-violet-950/40  dark:text-violet-300',
];

/**
 * QuizProgress
 *
 * Props:
 *   currentSection  — active section key e.g. 'riasec'
 *   currentQuestion — 1-based overall question number (1–74)
 *   totalQuestions  — total questions across all sections (74)
 *   sections        — optional array of { key, label, count } objects
 */
const QuizProgress = ({
  currentSection,
  currentQuestion,
  totalQuestions,
  sections = DEFAULT_SECTIONS,
}) => {
  const activeSectionIdx = sections.findIndex((s) => s.key === currentSection);
  const activeSection = sections[activeSectionIdx] ?? sections[0];

  // ── Overall fill percentage ─────────────────────────────────────────────
  const pct = totalQuestions > 0
    ? Math.min(100, Math.round(((currentQuestion - 1) / totalQuestions) * 100))
    : 0;

  // ── Estimated time remaining ────────────────────────────────────────────
  // Assumption: average completion rate = 5 questions/minute
  const questionsLeft = Math.max(0, totalQuestions - currentQuestion + 1);
  const minsLeft = Math.ceil(questionsLeft / 5);
  const timeLabel = questionsLeft === 0
    ? 'Almost done!'
    : minsLeft === 1
    ? '~1 min left'
    : `~${minsLeft} mins left`;

  // ── Which section does the current overall question fall in? ──────────────
  // Used to shade the gradient progress bar's colours per-section.
  let runningCount = 0;
  const sectionRanges = sections.map((s) => {
    const start = runningCount + 1;
    const end = runningCount + s.count;
    runningCount = end;
    return { ...s, start, end };
  });

  const gradient = SECTION_GRADIENTS[activeSectionIdx] ?? SECTION_GRADIENTS[0];

  return (
    <div className="space-y-3 mb-7">

      {/* ── Row 1: Question counter + time estimate ──────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Question{' '}
            <span className="tabular-nums text-blue-600 dark:text-blue-400">
              {currentQuestion}
            </span>
            {' '}of{' '}
            <span className="tabular-nums">{totalQuestions}</span>
          </span>
          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
            — {activeSection?.longLabel ?? activeSection?.label}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Clock size={12} strokeWidth={2} />
          <span>{timeLabel}</span>
        </div>
      </div>

      {/* ── Row 2: Gradient progress bar ────────────────────────────────── */}
      <div className="relative h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* Segment markers */}
        {sectionRanges.slice(0, -1).map((s) => {
          const markerPct = (s.end / totalQuestions) * 100;
          return (
            <div
              key={s.key}
              className="absolute top-0 bottom-0 w-px bg-white/70 dark:bg-slate-900/60 z-10"
              style={{ left: `${markerPct}%` }}
            />
          );
        })}

        {/* Animated fill */}
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradient}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* ── Row 3: Section tabs ──────────────────────────────────────────── */}
      <div className="flex gap-2">
        {sections.map((section, idx) => {
          const isActive = section.key === currentSection;
          const isDone = idx < activeSectionIdx;

          return (
            <div
              key={section.key}
              className={[
                'flex-1 flex items-center justify-center gap-1.5',
                'rounded-lg py-1.5 px-2',
                'text-xs font-semibold',
                'border transition-all duration-200 select-none',
                isActive
                  ? `ring-2 border-transparent ${SECTION_ACTIVE[idx]}`
                  : isDone
                  ? 'border-transparent bg-slate-50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500'
                  : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600',
              ].join(' ')}
            >
              {isDone && (
                <CheckCircle2
                  size={11}
                  strokeWidth={2.5}
                  className="text-slate-400 dark:text-slate-500 shrink-0"
                />
              )}
              <span className="truncate">{section.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Row 4: Fine-grain section progress ──────────────────────────── */}
      {activeSection && (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-0.5">
            {Array.from({ length: activeSection.count }).map((_, i) => {
              // Determine the overall question number for this dot
              const sectionRange = sectionRanges[activeSectionIdx];
              const questionNum = sectionRange ? sectionRange.start + i : i + 1;
              const isAnswered = questionNum < currentQuestion;
              const isCurrent = questionNum === currentQuestion;

              return (
                <div
                  key={i}
                  className={[
                    'flex-1 h-1 rounded-full transition-all duration-200',
                    isCurrent
                      ? `bg-gradient-to-r ${gradient} scale-y-150`
                      : isAnswered
                      ? 'bg-blue-300 dark:bg-blue-700'
                      : 'bg-slate-100 dark:bg-slate-800',
                  ].join(' ')}
                />
              );
            })}
          </div>
          <span className="shrink-0 tabular-nums text-[10px] text-slate-400 dark:text-slate-500">
            {Math.max(0, currentQuestion - (sectionRanges[activeSectionIdx]?.start ?? 1) + 1)}/
            {activeSection.count}
          </span>
        </div>
      )}
    </div>
  );
};

export default QuizProgress;
