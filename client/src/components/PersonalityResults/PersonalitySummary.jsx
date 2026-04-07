import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, Briefcase, MapPin, TrendingUp, Share2, Check,
} from 'lucide-react';

// ─── Section wrapper ──────────────────────────────────────────────────────────
const SummarySection = ({ icon: Icon, title, iconCls, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.28, ease: 'easeOut' }}
  >
    <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
      <Icon size={12} className={iconCls} />
      {title}
    </h4>
    {children}
  </motion.div>
);

// ─── Strength chip ────────────────────────────────────────────────────────────
const StrengthChip = ({ label, score, insight }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full text-left group"
      >
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/40 shrink-0">
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-blue-600 dark:text-blue-400">
            <path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.5 4.5 4z" />
          </svg>
        </span>
        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums text-blue-600 dark:text-blue-400 shrink-0">
          {score}%
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && insight && (
          <motion.p
            key="insight"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden mt-1 ml-7 text-[11px] text-slate-500 dark:text-slate-400 leading-snug"
          >
            {insight}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Work style chip ──────────────────────────────────────────────────────────
const WorkStyleItem = ({ trait, band, description }) => {
  const bandColor = {
    high:     'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    moderate: 'bg-amber-100   dark:bg-amber-900/40   text-amber-700   dark:text-amber-300',
    low:      'bg-red-100     dark:bg-red-900/40     text-red-700     dark:text-red-300',
  }[band] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-500';

  const traitLabel = trait.charAt(0).toUpperCase() + trait.slice(1);

  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
      <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${bandColor}`}>
        {band ?? '—'}
      </span>
      <div className="min-w-0">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{traitLabel}:</span>
        <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{description}</span>
      </div>
    </div>
  );
};

// ─── Growth area pill ─────────────────────────────────────────────────────────
const GrowthPill = ({ text }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 text-[11px] font-medium text-orange-700 dark:text-orange-300">
    <TrendingUp size={9} className="shrink-0" />
    {text}
  </span>
);

// ─── Share button ─────────────────────────────────────────────────────────────
const ShareButton = ({ hollandCode }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `My Holland Career Code is ${hollandCode || '...'} — personality-assessed via Career Intelligence on TCent AI.`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable — graceful fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200',
        copied
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
      ].join(' ')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <Check size={12} />
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <Share2 size={12} />
            Share Results
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * PersonalitySummary
 *
 * Props:
 *   summary: {
 *     hollandCode:      string
 *     narrative:        string
 *     strengths:        Array<{ trait, label, score, insight }>
 *     workStyle:        Array<{ trait, score, band, description }>
 *     idealEnvironment: string[]
 *     coreMotivators:   Array<{ value, score, description }>   // optional – used as growth hints
 *     growthAreas:      string[]   // optional explicit growth areas
 *   }
 */
const PersonalitySummary = ({ summary }) => {
  if (!summary) return null;

  const {
    hollandCode,
    narrative,
    strengths     = [],
    workStyle     = [],
    idealEnvironment = [],
    growthAreas   = [],
  } = summary;

  // Derive simple growth area labels when the explicit array is absent.
  // Use lower-scoring Big Five traits as proxy development areas.
  const growthItems = growthAreas.length > 0
    ? growthAreas
    : workStyle
        .filter((ws) => ws.band === 'low')
        .map((ws) => {
          const label = ws.trait.charAt(0).toUpperCase() + ws.trait.slice(1);
          return `Build ${label}`;
        });

  return (
    <div className="space-y-5">

      {/* ── Header: narrative + share ───────────────────────────────────── */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            <Lightbulb size={12} className="text-yellow-500" />
            Profile Summary
          </h3>
          <ShareButton hollandCode={hollandCode} />
        </div>
        {narrative && (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-[1.7]">
            {narrative}
          </p>
        )}
      </div>

      {/* ── Strengths ──────────────────────────────────────────────────── */}
      {strengths.length > 0 && (
        <SummarySection
          icon={Lightbulb}
          title="Your Strengths"
          iconCls="text-blue-500"
          delay={0.05}
        >
          <div className="space-y-2.5">
            {strengths.map((s) => (
              <StrengthChip
                key={s.trait}
                label={s.label}
                score={s.score}
                insight={s.insight}
              />
            ))}
          </div>
        </SummarySection>
      )}

      {/* ── Work Style ─────────────────────────────────────────────────── */}
      {workStyle.length > 0 && (
        <SummarySection
          icon={Briefcase}
          title="Your Work Style"
          iconCls="text-indigo-500"
          delay={0.1}
        >
          <div>
            {workStyle.map((ws) => (
              <WorkStyleItem
                key={ws.trait}
                trait={ws.trait}
                band={ws.band}
                description={ws.description}
              />
            ))}
          </div>
        </SummarySection>
      )}

      {/* ── Ideal Work Environment ─────────────────────────────────────── */}
      {idealEnvironment.length > 0 && (
        <SummarySection
          icon={MapPin}
          title="Ideal Work Environment"
          iconCls="text-emerald-500"
          delay={0.15}
        >
          <ul className="space-y-1.5">
            {idealEnvironment.map((env, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 shrink-0" />
                <span className="text-[12px] text-slate-600 dark:text-slate-400 leading-snug capitalize">
                  {env}
                </span>
              </li>
            ))}
          </ul>
        </SummarySection>
      )}

      {/* ── Growth Areas ──────────────────────────────────────────────── */}
      {growthItems.length > 0 && (
        <SummarySection
          icon={TrendingUp}
          title="Growth Areas"
          iconCls="text-orange-500"
          delay={0.2}
        >
          <div className="flex flex-wrap gap-2">
            {growthItems.map((item, idx) => (
              <GrowthPill key={idx} text={item} />
            ))}
          </div>
        </SummarySection>
      )}
    </div>
  );
};

export default PersonalitySummary;
