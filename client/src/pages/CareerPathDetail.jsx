import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, ExternalLink, TrendingUp, Zap } from 'lucide-react';
import careerPaths from '../data/careerPaths';
import Card from '../components/ui/Card';
import SkillBadge from '../components/ui/SkillBadge';

// ── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' },
  }),
};

// ── Salary chart data: 5 experience levels ────────────────────────────────────

const salaryChartData = ({ min, max }) => {
  const mid = Math.round((min + max) / 2);
  return [
    { level: '0–1 yr',  salary: min },
    { level: '1–3 yr',  salary: Math.round(min + (mid - min) * 0.4) },
    { level: '3–5 yr',  salary: mid },
    { level: '5–8 yr',  salary: Math.round(mid + (max - mid) * 0.6) },
    { level: '8+ yr',   salary: max },
  ];
};

// ── Custom tooltip ────────────────────────────────────────────────────────────

const SalaryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
      <p className="text-blue-600 dark:text-blue-400 font-medium">₹{payload[0].value} LPA</p>
    </div>
  );
};

// ── Resource type pill ────────────────────────────────────────────────────────

const TYPE_COLORS = {
  Course: 'blue',
  Docs:   'purple',
  Video:  'orange',
  Blog:   'green',
  Tool:   'green',
};

// ── Demand badge ──────────────────────────────────────────────────────────────

const demandColor = (level) =>
  level === 'Very High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';

// ── Main component ────────────────────────────────────────────────────────────

const CareerPathDetail = () => {
  const { pathId } = useParams();
  const path = careerPaths.find(c => c.id === pathId);

  if (!path) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Career path not found</h1>
        <p className="text-gray-500 mb-6">The path <code className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm">{pathId}</code> doesn't exist.</p>
        <Link to="/career" className="text-blue-600 hover:underline text-sm">← Back to Career Intelligence</Link>
      </div>
    );
  }

  const chartData = salaryChartData(path.salaryRange);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-7">

      {/* Back link */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <Link
          to="/career"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={15} /> Career Intelligence
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{path.emoji}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{path.title}</h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">{path.description}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${demandColor(path.demandLevel)}`}>
                    {path.demandLevel} Demand
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    <TrendingUp size={11} /> {path.growthRate} growth
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Salary Range</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{path.salaryRange.min}–{path.salaryRange.max}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">{path.salaryRange.currency}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Salary area chart */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <Card title="Salary Progression by Experience">
          <p className="text-sm text-gray-400 dark:text-slate-500 -mt-2 mb-5">Approximate annual salary (INR LPA) at each career stage</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="level"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `₹${v}L`}
                width={48}
              />
              <Tooltip content={<SalaryTooltip />} cursor={{ stroke: '#dbeafe', strokeWidth: 2 }} />
              <Area
                type="monotone"
                dataKey="salary"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#salaryGrad)"
                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Skills */}
      <motion.div
        className="grid sm:grid-cols-2 gap-5"
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
      >
        <Card title="Required Skills">
          <div className="flex flex-wrap gap-2">
            {path.requiredSkills.map(skill => (
              <SkillBadge key={skill} label={skill} variant="blue" />
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} className="text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Bonus Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {path.bonusSkills.map(skill => (
              <SkillBadge key={skill} label={skill} variant="orange" />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Roadmap */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
        <Card title="Learning Roadmap">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gray-100 dark:bg-slate-700" />

            <div className="space-y-8">
              {path.roadmap.map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  className="relative flex gap-5"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={i}
                >
                  {/* Node */}
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm z-10">
                    {i + 1}
                  </div>

                  <div className="flex-1 pb-1">
                    <div className="flex items-baseline gap-3 flex-wrap mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{phase.phase}</h3>
                      <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-2 py-0.5 rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {phase.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Resources */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
        <Card title="Learning Resources">
          <div className="divide-y divide-gray-50 dark:divide-slate-800 -mx-6 px-6">
            {path.resources.map((res, i) => (
              <a
                key={res.label}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/50 -mx-6 px-6 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <SkillBadge label={res.type} variant={TYPE_COLORS[res.type] ?? 'blue'} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {res.label}
                  </span>
                </div>
                <ExternalLink size={14} className="text-gray-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </Card>
      </motion.div>

    </div>
  );
};

export default CareerPathDetail;
