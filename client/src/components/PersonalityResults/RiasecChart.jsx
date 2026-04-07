import { useId } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// ─── Trait definitions in Holland hexagon order ───────────────────────────────
// Starting at top (−90°) going clockwise: R → I → A → S → E → C
const TRAITS = [
  { key: 'realistic',     short: 'R', label: 'Realistic',     angle: -Math.PI / 2 },
  { key: 'investigative', short: 'I', label: 'Investigative', angle: -Math.PI / 2 + (1 * Math.PI) / 3 },
  { key: 'artistic',      short: 'A', label: 'Artistic',      angle: -Math.PI / 2 + (2 * Math.PI) / 3 },
  { key: 'social',        short: 'S', label: 'Social',        angle: -Math.PI / 2 + (3 * Math.PI) / 3 },
  { key: 'enterprising',  short: 'E', label: 'Enterprising',  angle: -Math.PI / 2 + (4 * Math.PI) / 3 },
  { key: 'conventional',  short: 'C', label: 'Conventional',  angle: -Math.PI / 2 + (5 * Math.PI) / 3 },
];

// ─── SVG layout ───────────────────────────────────────────────────────────────
const VB_SIZE = 280;          // square viewBox
const CX      = VB_SIZE / 2;  // 140
const CY      = VB_SIZE / 2;  // 140
const R       = 84;            // max score radius
const LABEL_R = 110;           // short-letter label radius
const SCORE_R = 123;           // score-% label radius
const GRIDS   = [0.25, 0.5, 0.75, 1];

// ─── Maths helpers ────────────────────────────────────────────────────────────
const px = (r, angle) => CX + r * Math.cos(angle);
const py = (r, angle) => CY + r * Math.sin(angle);

const hexRingPoints = (frac) =>
  TRAITS.map((t) => `${px(R * frac, t.angle)},${py(R * frac, t.angle)}`).join(' ');

const scorePolygonPoints = (scores) =>
  TRAITS.map((t) => {
    const s = (scores?.[t.key] ?? 0) / 100;
    return `${px(R * s, t.angle)},${py(R * s, t.angle)}`;
  }).join(' ');

// ─── Derive dominant type from scores (top 3 by score, then alpha for ties) ──
const dominantLetters = (scores) => {
  if (!scores) return new Set();
  return new Set(
    Object.entries(scores)
      .sort(([ka, a], [kb, b]) => b - a || ka.localeCompare(kb))
      .slice(0, 3)
      .map(([key]) => TRAITS.find((t) => t.key === key)?.short)
      .filter(Boolean)
  );
};

const hollandCode = (scores) => {
  if (!scores) return '---';
  return [...dominantLetters(scores)].join('');
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const TraitLegendItem = ({ trait, score, isDominant }) => (
  <div className="flex items-center gap-2">
    <span
      className={[
        'inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold shrink-0',
        isDominant
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
      ].join(' ')}
    >
      {trait.short}
    </span>
    <span
      className={[
        'text-[11px] flex-1 truncate',
        isDominant
          ? 'text-slate-700 dark:text-slate-200 font-medium'
          : 'text-slate-500 dark:text-slate-400',
      ].join(' ')}
    >
      {trait.label}
    </span>
    <span className="text-[11px] font-bold tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
      {score}%
    </span>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const RiasecChart = ({ scores }) => {
  const uid = useId().replace(/:/g, '');
  const { dark } = useTheme();

  const code = hollandCode(scores);
  const dominant = dominantLetters(scores);

  // Gradient stops differ slightly between themes for readability
  const gradFill   = dark ? 'rgba(129,140,248,0.38)' : 'rgba(99,102,241,0.32)';
  const gradEdge   = dark ? 'rgba(59,130,246,0.04)'  : 'rgba(59,130,246,0.04)';
  const strokeCol  = dark ? '#818cf8' : '#6366f1';
  const gridStroke = dark ? '#334155' : '#e2e8f0';
  const axisStroke = dark ? '#1e293b' : '#f1f5f9';
  const centerFill = dark ? '#f1f5f9' : '#1e293b';
  const subFill    = dark ? '#64748b' : '#94a3b8';

  return (
    <div>
      {/* ── Section title ──────────────────────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">
        RIASEC Interest Profile
      </p>

      {/* ── SVG radar ──────────────────────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${VB_SIZE} ${VB_SIZE}`}
        width="100%"
        style={{ maxHeight: VB_SIZE }}
        aria-label="RIASEC hexagon radar chart"
      >
        <defs>
          {/* Radial gradient: bright centre fades outward */}
          <radialGradient id={`rg-fill-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={gradFill} />
            <stop offset="100%" stopColor={gradEdge} />
          </radialGradient>
          {/* Glow for dominant-vertex dots */}
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Grid rings ─────────────────────────────────────────────────── */}
        {GRIDS.map((frac) => (
          <polygon
            key={frac}
            points={hexRingPoints(frac)}
            fill="none"
            stroke={gridStroke}
            strokeWidth={frac === 1 ? 1.5 : 1}
            strokeDasharray={frac === 1 ? undefined : '4 3'}
          />
        ))}

        {/* ── Axis spokes ────────────────────────────────────────────────── */}
        {TRAITS.map((t) => (
          <line
            key={t.key}
            x1={CX} y1={CY}
            x2={px(R, t.angle)} y2={py(R, t.angle)}
            stroke={axisStroke}
            strokeWidth="1.5"
          />
        ))}

        {/* ── Score polygon (animated scale from center) ─────────────────── */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {/* Filled area */}
          <polygon
            points={scorePolygonPoints(scores)}
            fill={`url(#rg-fill-${uid})`}
            stroke={strokeCol}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Vertex dots */}
          {TRAITS.map((t) => {
            const s = (scores?.[t.key] ?? 0) / 100;
            const vx = px(R * s, t.angle);
            const vy = py(R * s, t.angle);
            const isDom = dominant.has(t.short);
            return isDom ? (
              <circle
                key={t.key}
                cx={vx} cy={vy}
                r={5}
                fill={strokeCol}
                stroke="white"
                strokeWidth="1.5"
                filter={`url(#glow-${uid})`}
              />
            ) : (
              <circle
                key={t.key}
                cx={vx} cy={vy}
                r={3}
                fill={dark ? '#818cf8' : '#a5b4fc'}
                stroke="white"
                strokeWidth="1.5"
              />
            );
          })}
        </motion.g>

        {/* ── Vertex labels: short code + score ──────────────────────────── */}
        {TRAITS.map((t) => {
          const lx    = px(LABEL_R, t.angle);
          const ly    = py(LABEL_R, t.angle);
          const sx    = px(SCORE_R, t.angle);
          const sy    = py(SCORE_R, t.angle);
          const isDom = dominant.has(t.short);
          const score = scores?.[t.key] ?? 0;

          return (
            <g key={t.key}>
              {/* Short letter */}
              <text
                x={lx} y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isDom ? strokeCol : subFill}
                style={{
                  fontSize:   isDom ? 12 : 11,
                  fontWeight: isDom ? 700 : 500,
                  fontFamily: 'inherit',
                }}
              >
                {t.short}
              </text>
              {/* Score value */}
              <text
                x={sx} y={sy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={subFill}
                style={{ fontSize: 9, fontFamily: 'inherit' }}
              >
                {score}%
              </text>
            </g>
          );
        })}

        {/* ── Center: Holland code ────────────────────────────────────────── */}
        <text
          x={CX} y={CY - 8}
          textAnchor="middle"
          dominantBaseline="central"
          fill={centerFill}
          style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, fontFamily: 'inherit' }}
        >
          {code}
        </text>
        <text
          x={CX} y={CY + 12}
          textAnchor="middle"
          dominantBaseline="central"
          fill={subFill}
          style={{ fontSize: 9, fontFamily: 'inherit' }}
        >
          Holland Code
        </text>
      </svg>

      {/* ── Trait legend (2 × 3 grid) ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {TRAITS.map((t) => (
          <TraitLegendItem
            key={t.key}
            trait={t}
            score={scores?.[t.key] ?? 0}
            isDominant={dominant.has(t.short)}
          />
        ))}
      </div>
    </div>
  );
};

export default RiasecChart;
