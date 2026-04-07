const TrendIndicator = ({ trend, trendLabel }) => {
  const isUp = trend === 'up';
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
      <svg
        className={`w-3.5 h-3.5 ${isUp ? '' : 'rotate-180'}`}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M8 3l5 6H3l5-6z" />
      </svg>
      {trendLabel}
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, trendLabel, className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-5 flex items-start gap-4 ${className}`}>
    {icon && (
      <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-xl">
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-none truncate">{value}</p>
      {trend && trendLabel && (
        <div className="mt-1.5">
          <TrendIndicator trend={trend} trendLabel={trendLabel} />
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
