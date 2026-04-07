import { forwardRef } from 'react';

const VARIANTS = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border-transparent dark:bg-blue-500 dark:hover:bg-blue-600',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border-transparent dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600',
  outline:   'bg-transparent text-slate-700 hover:bg-slate-50 active:bg-slate-100 border-slate-300 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 border-transparent dark:bg-red-600 dark:hover:bg-red-700',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
};

const SPINNER_SIZES = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const Spinner = ({ size }) => (
  <svg
    className={`${SPINNER_SIZES[size]} animate-spin shrink-0`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  children,
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium border',
        'transition-all duration-150 active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className,
      ].join(' ')}
      {...props}
    >
      {loading
        ? <Spinner size={size} />
        : icon && <span className="shrink-0">{icon}</span>}

      {children && (
        <span>{children}</span>
      )}

      {!loading && iconRight && (
        <span className="shrink-0">{iconRight}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
