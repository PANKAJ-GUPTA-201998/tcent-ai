import { motion, AnimatePresence } from 'framer-motion';
import LikertScale from './LikertScale';

// Maps question.trait values to display labels and color tokens
const TRAIT_META = {
  // RIASEC
  realistic:      { label: 'Realistic',      color: 'amber'  },
  investigative:  { label: 'Investigative',  color: 'blue'   },
  artistic:       { label: 'Artistic',       color: 'purple' },
  social:         { label: 'Social',         color: 'pink'   },
  enterprising:   { label: 'Enterprising',   color: 'orange' },
  conventional:   { label: 'Conventional',   color: 'teal'   },
  // Work Values
  autonomy:       { label: 'Autonomy',       color: 'blue'   },
  stability:      { label: 'Stability',      color: 'green'  },
  creativity:     { label: 'Creativity',     color: 'purple' },
  impact:         { label: 'Impact',         color: 'rose'   },
  growth:         { label: 'Growth',         color: 'emerald'},
  workLifeBalance:{ label: 'Work-Life',      color: 'teal'   },
  // Big Five
  openness:         { label: 'Openness',         color: 'violet' },
  conscientiousness:{ label: 'Conscientiousness', color: 'blue'   },
  extraversion:     { label: 'Extraversion',     color: 'yellow' },
  agreeableness:    { label: 'Agreeableness',    color: 'green'  },
  neuroticism:      { label: 'Neuroticism',      color: 'red'    },
};

const TAG_COLORS = {
  amber:   'bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-950/30  dark:text-amber-400  dark:border-amber-800',
  blue:    'bg-blue-50    text-blue-700    border-blue-200    dark:bg-blue-950/30   dark:text-blue-400   dark:border-blue-800',
  purple:  'bg-purple-50  text-purple-700  border-purple-200  dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800',
  pink:    'bg-pink-50    text-pink-700    border-pink-200    dark:bg-pink-950/30   dark:text-pink-400   dark:border-pink-800',
  orange:  'bg-orange-50  text-orange-700  border-orange-200  dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800',
  teal:    'bg-teal-50    text-teal-700    border-teal-200    dark:bg-teal-950/30   dark:text-teal-400   dark:border-teal-800',
  green:   'bg-green-50   text-green-700   border-green-200   dark:bg-green-950/30  dark:text-green-400  dark:border-green-800',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
  rose:    'bg-rose-50    text-rose-700    border-rose-200    dark:bg-rose-950/30   dark:text-rose-400   dark:border-rose-800',
  violet:  'bg-violet-50  text-violet-700  border-violet-200  dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800',
  yellow:  'bg-yellow-50  text-yellow-700  border-yellow-200  dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800',
  red:     'bg-red-50     text-red-700     border-red-200     dark:bg-red-950/30    dark:text-red-400    dark:border-red-800',
  slate:   'bg-slate-50   text-slate-600   border-slate-200   dark:bg-slate-800/40  dark:text-slate-400  dark:border-slate-700',
};

/**
 * QuestionCard
 *
 * Props:
 *   question       — question object from the API { id, text, trait, category, direction }
 *   selectedScore  — currently selected Likert value (1–5) or undefined
 *   onAnswer       — (questionId, score) => void
 *   questionNumber — 1-based overall question number, used for the badge
 */
const QuestionCard = ({ question, selectedScore, onAnswer, questionNumber }) => {
  const traitMeta = TRAIT_META[question?.trait] ?? { label: question?.trait ?? '', color: 'slate' };
  const tagClass = TAG_COLORS[traitMeta.color] ?? TAG_COLORS.slate;

  return (
    <AnimatePresence mode="wait">
      {question && (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: -16 }}
          transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
          className={[
            // Card shell
            'relative rounded-2xl',
            'bg-white dark:bg-slate-900',
            'border border-slate-100 dark:border-slate-800',
            // Layered shadow for depth
            'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08),0_8px_24px_-4px_rgba(0,0,0,0.06)]',
            'dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4),0_8px_24px_-4px_rgba(0,0,0,0.3)]',
            'px-6 pt-6 pb-7 sm:px-8 sm:pt-7 sm:pb-8',
          ].join(' ')}
        >
          {/* ── Question number badge (top-left) ────────────────────────── */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Number badge */}
              <span className={[
                'inline-flex items-center justify-center',
                'w-7 h-7 rounded-full shrink-0',
                'text-xs font-bold',
                'bg-slate-100 text-slate-500',
                'dark:bg-slate-800 dark:text-slate-400',
                'ring-1 ring-slate-200 dark:ring-slate-700',
              ].join(' ')}>
                {questionNumber}
              </span>

              {/* Category tag */}
              <span className={[
                'inline-flex items-center gap-1',
                'px-2.5 py-0.5 rounded-full',
                'text-xs font-semibold',
                'border',
                tagClass,
              ].join(' ')}>
                {traitMeta.label}
              </span>
            </div>

            {/* Answered checkmark */}
            <motion.div
              initial={false}
              animate={{ opacity: selectedScore ? 1 : 0, scale: selectedScore ? 1 : 0.7 }}
              transition={{ duration: 0.18, type: 'spring', stiffness: 300 }}
              className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>

          {/* ── Question text ────────────────────────────────────────────── */}
          <p className={[
            'text-base sm:text-[17px] font-medium leading-relaxed',
            'text-slate-800 dark:text-slate-100',
            'min-h-[3rem] mb-1',
          ].join(' ')}>
            {question.text}
          </p>

          {/* Reverse-scored notice */}
          {question.direction === 'negative' && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mb-0.5">
              Note: this statement is intentionally phrased in the opposite direction.
            </p>
          )}

          {/* ── Likert scale ─────────────────────────────────────────────── */}
          <LikertScale
            selectedScore={selectedScore}
            onSelect={(score) => onAnswer(question.id, score)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestionCard;
