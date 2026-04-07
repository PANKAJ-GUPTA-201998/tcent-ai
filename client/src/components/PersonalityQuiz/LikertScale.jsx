import { motion } from 'framer-motion';

const OPTIONS = [
  {
    value: 1,
    label: 'Strongly Disagree',
    shortLabel: 'Strongly\nDisagree',
    selectedBg: 'bg-red-600',
    selectedBorder: 'border-red-600',
    selectedText: 'text-white',
    idleBorder: 'border-red-200 dark:border-red-800',
    idleBg: 'bg-red-50 dark:bg-red-950/30',
    idleText: 'text-red-700 dark:text-red-400',
    hoverBorder: 'hover:border-red-400 dark:hover:border-red-600',
    hoverBg: 'hover:bg-red-100 dark:hover:bg-red-900/40',
    ring: 'focus-visible:ring-red-500',
    dot: 'bg-red-200',
  },
  {
    value: 2,
    label: 'Disagree',
    shortLabel: 'Disagree',
    selectedBg: 'bg-red-400',
    selectedBorder: 'border-red-400',
    selectedText: 'text-white',
    idleBorder: 'border-red-100 dark:border-red-900',
    idleBg: 'bg-red-50/60 dark:bg-red-950/20',
    idleText: 'text-red-500 dark:text-red-500',
    hoverBorder: 'hover:border-red-300 dark:hover:border-red-700',
    hoverBg: 'hover:bg-red-50 dark:hover:bg-red-950/30',
    ring: 'focus-visible:ring-red-400',
    dot: 'bg-red-100',
  },
  {
    value: 3,
    label: 'Neutral',
    shortLabel: 'Neutral',
    selectedBg: 'bg-slate-500',
    selectedBorder: 'border-slate-500',
    selectedText: 'text-white',
    idleBorder: 'border-slate-200 dark:border-slate-600',
    idleBg: 'bg-slate-50 dark:bg-slate-800/40',
    idleText: 'text-slate-500 dark:text-slate-400',
    hoverBorder: 'hover:border-slate-400 dark:hover:border-slate-500',
    hoverBg: 'hover:bg-slate-100 dark:hover:bg-slate-800/60',
    ring: 'focus-visible:ring-slate-400',
    dot: 'bg-slate-200',
  },
  {
    value: 4,
    label: 'Agree',
    shortLabel: 'Agree',
    selectedBg: 'bg-green-500',
    selectedBorder: 'border-green-500',
    selectedText: 'text-white',
    idleBorder: 'border-green-100 dark:border-green-900',
    idleBg: 'bg-green-50/60 dark:bg-green-950/20',
    idleText: 'text-green-600 dark:text-green-500',
    hoverBorder: 'hover:border-green-300 dark:hover:border-green-700',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-950/30',
    ring: 'focus-visible:ring-green-400',
    dot: 'bg-green-100',
  },
  {
    value: 5,
    label: 'Strongly Agree',
    shortLabel: 'Strongly\nAgree',
    selectedBg: 'bg-green-600',
    selectedBorder: 'border-green-600',
    selectedText: 'text-white',
    idleBorder: 'border-green-200 dark:border-green-800',
    idleBg: 'bg-green-50 dark:bg-green-950/30',
    idleText: 'text-green-700 dark:text-green-400',
    hoverBorder: 'hover:border-green-400 dark:hover:border-green-600',
    hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/40',
    ring: 'focus-visible:ring-green-500',
    dot: 'bg-green-200',
  },
];

const LikertScale = ({ selectedScore, onSelect }) => (
  <fieldset className="mt-6 border-0 p-0 m-0">
    <legend className="sr-only">Rate your agreement from 1 (Strongly Disagree) to 5 (Strongly Agree)</legend>

    {/* ── Mobile: vertical stack ──────────────────────────────────────────── */}
    <div className="flex flex-col gap-2 sm:hidden">
      {OPTIONS.map((opt) => {
        const isSelected = selectedScore === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            whileTap={{ scale: 0.98 }}
            aria-pressed={isSelected}
            aria-label={opt.label}
            className={[
              'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2',
              'transition-all duration-150 text-left',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'dark:focus-visible:ring-offset-slate-950',
              opt.ring,
              isSelected
                ? `${opt.selectedBg} ${opt.selectedBorder} ${opt.selectedText} shadow-md`
                : `${opt.idleBg} ${opt.idleBorder} ${opt.hoverBg} ${opt.hoverBorder}`,
            ].join(' ')}
          >
            {/* Score number */}
            <span className={[
              'flex-none w-8 h-8 rounded-full flex items-center justify-center',
              'text-sm font-bold leading-none',
              isSelected
                ? 'bg-white/20 text-white'
                : `${opt.dot} ${opt.idleText}`,
            ].join(' ')}>
              {opt.value}
            </span>

            {/* Label */}
            <span className={[
              'font-semibold text-sm',
              isSelected ? 'text-white' : opt.idleText,
            ].join(' ')}>
              {opt.label}
            </span>

            {/* Check mark */}
            {isSelected && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="ml-auto flex-none w-5 h-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
            )}
          </motion.button>
        );
      })}
    </div>

    {/* ── Desktop: horizontal row ──────────────────────────────────────────── */}
    <div className="hidden sm:flex gap-2.5">
      {OPTIONS.map((opt) => {
        const isSelected = selectedScore === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={isSelected}
            aria-label={opt.label}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-2',
              'py-4 px-2 rounded-2xl border-2',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'dark:focus-visible:ring-offset-slate-950',
              opt.ring,
              isSelected
                ? `${opt.selectedBg} ${opt.selectedBorder} ${opt.selectedText} shadow-lg`
                : `${opt.idleBg} ${opt.idleBorder} ${opt.hoverBg} ${opt.hoverBorder}`,
            ].join(' ')}
          >
            {/* Score number */}
            <span className={[
              'w-9 h-9 rounded-full flex items-center justify-center',
              'text-base font-bold leading-none',
              'transition-colors duration-150',
              isSelected
                ? 'bg-white/20 text-white'
                : `${opt.dot} ${opt.idleText}`,
            ].join(' ')}>
              {opt.value}
            </span>

            {/* Multi-line label */}
            <span className={[
              'text-center leading-tight whitespace-pre-line font-medium',
              'text-[11px]',
              isSelected ? 'text-white/90' : opt.idleText,
            ].join(' ')}>
              {opt.shortLabel}
            </span>
          </motion.button>
        );
      })}
    </div>

    {/* Endpoint hints — mobile only */}
    <div className="flex justify-between mt-3 px-1 sm:hidden">
      <span className="text-[10px] text-slate-400">← Less agreement</span>
      <span className="text-[10px] text-slate-400">More agreement →</span>
    </div>
  </fieldset>
);

export default LikertScale;
