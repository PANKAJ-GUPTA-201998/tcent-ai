import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// ── Config ──────────────────────────────────────────────────────────────────

const VARIANTS = {
  success: {
    icon: CheckCircle,
    bar: 'bg-green-500',
    iconCls: 'text-green-500 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  error: {
    icon: XCircle,
    bar: 'bg-red-500',
    iconCls: 'text-red-500 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  info: {
    icon: Info,
    bar: 'bg-blue-500',
    iconCls: 'text-blue-500 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
};

const DURATION = 3000; // ms

// ── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

let _id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) =>
    setToasts(prev => prev.filter(t => t.id !== id)), []);

  const show = useCallback(({ message, variant = 'info', duration = DURATION }) => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, message, variant }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  // Convenience shorthands
  const toast = {
    success: (message, opts) => show({ message, variant: 'success', ...opts }),
    error:   (message, opts) => show({ message, variant: 'error',   ...opts }),
    info:    (message, opts) => show({ message, variant: 'info',    ...opts }),
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// ── Individual Toast ──────────────────────────────────────────────────────────

const ToastItem = ({ id, message, variant = 'info', dismiss }) => {
  const { icon: Icon, bar, iconCls, border } = VARIANTS[variant] ?? VARIANTS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 64, scale: 0.95 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{    opacity: 0, x: 64, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`relative flex items-start gap-3 w-80 bg-white dark:bg-slate-900 border ${border} rounded-xl shadow-lg overflow-hidden px-4 py-3.5`}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${bar}`} />

      <Icon size={18} className={`shrink-0 mt-0.5 ${iconCls}`} />

      <p className="flex-1 text-sm text-gray-800 dark:text-gray-100 leading-snug pr-1">
        {message}
      </p>

      <button
        onClick={() => dismiss(id)}
        aria-label="Dismiss"
        className="shrink-0 text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400 transition-colors mt-0.5"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

// ── Container (portal-like, fixed bottom-right) ───────────────────────────────

const ToastContainer = ({ toasts, dismiss }) => (
  <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 items-end">
    <AnimatePresence initial={false}>
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} dismiss={dismiss} />
      ))}
    </AnimatePresence>
  </div>
);
