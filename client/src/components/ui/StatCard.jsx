const TrendIndicator = ({ trend, trendLabel }) => {
  const isUp = trend === 'up';
  return (
    <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
      <svg className={`w-3 h-3 ${isUp ? '' : 'rotate-180'}`} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 3l5 6H3l5-6z" />
      </svg>
      {trendLabel}
    </div>
  );
};

/* accent: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' */
const ACCENT_MAP = {
  blue:    { bg: 'bg-blue-50 dark:bg-blue-950/40',   icon: 'bg-blue-100 dark:bg-blue-900/50',   text: 'text-blue-600 dark:text-blue-400',   bar: 'bg-blue-500',   border: 'border-blue-100 dark:border-blue-900/40' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-950/40', icon: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-600 dark:text-violet-400', bar: 'bg-violet-500', border: 'border-violet-100 dark:border-violet-900/40' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500', border: 'border-emerald-100 dark:border-emerald-900/40' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-950/40',  icon: 'bg-amber-100 dark:bg-amber-900/50',  text: 'text-amber-600 dark:text-amber-400',  bar: 'bg-amber-500',  border: 'border-amber-100 dark:border-amber-900/40' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-950/40',    icon: 'bg-rose-100 dark:bg-rose-900/50',    text: 'text-rose-600 dark:text-rose-400',    bar: 'bg-rose-500',   border: 'border-rose-100 dark:border-rose-900/40' },
  cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-950/40',    icon: 'bg-cyan-100 dark:bg-cyan-900/50',    text: 'text-cyan-600 dark:text-cyan-400',    bar: 'bg-cyan-500',   border: 'border-cyan-100 dark:border-cyan-900/40' },
};

const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendLabel,
  accent = 'blue',
  subtitle,
  className = '',
}) => {
  const a = ACCENT_MAP[accent] ?? ACCENT_MAP.blue;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 ${a.bg} ${a.border} ${className}`}>
      {/* Decorative circle — top right */}
      <div
        aria-hidden="true"
        className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 ${a.bar}`}
      />

      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        {icon && (
          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${a.icon}`}>
            {icon}
          </div>
        )}

        {/* Trend pill */}
        {trend && trendLabel && (
          <div className="shrink-0 mt-0.5">
            <TrendIndicator trend={trend} trendLabel={trendLabel} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className={`text-3xl font-black leading-none ${a.text}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
