const base = 'animate-pulse bg-gray-200 dark:bg-slate-700 rounded';

const variants = {
  text:   ({ width = 'w-full', height = 'h-4' } = {}) =>
    `${base} ${width} ${height} rounded-md`,

  card:   ({ width = 'w-full', height = 'h-32' } = {}) =>
    `${base} ${width} ${height} rounded-2xl`,

  circle: ({ size = 'w-12 h-12' } = {}) =>
    `${base} ${size} rounded-full`,
};

const Skeleton = ({ variant = 'text', width, height, size, className = '' }) => {
  const classes = variants[variant]?.({ width, height, size }) ?? variants.text();
  return <div className={`${classes} ${className}`} />;
};

// Convenience composites
Skeleton.TextBlock = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);

Skeleton.Card = ({ className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 space-y-4 ${className}`}>
    <div className="flex items-center gap-3">
      <Skeleton variant="circle" size="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="w-1/2" />
        <Skeleton variant="text" width="w-1/3" height="h-3" />
      </div>
    </div>
    <Skeleton.TextBlock lines={3} />
  </div>
);

Skeleton.StatCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl p-5 flex items-start gap-4 ${className}`}>
    <Skeleton variant="circle" size="w-10 h-10" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="w-1/3" height="h-3" />
      <Skeleton variant="text" width="w-1/2" height="h-7" />
    </div>
  </div>
);

export default Skeleton;
