import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

const STATUS_CONFIG = {
  completed:   { icon: CheckCircle2, color: '#059669', bg: 'rgba(5,150,105,0.1)',  label: 'Done' },
  in_progress: { icon: Clock,        color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'In progress' },
  pending:     { icon: Circle,       color: '#334155', bg: 'transparent',           label: 'Pending' },
};

const TaskRow = ({ task, index }) => {
  const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const done = task.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
    >
      <Icon size={18} style={{ color: cfg.color, flexShrink: 0 }} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${done ? 'line-through' : ''}`}
          style={{ color: done ? '#475569' : '#E2E8F0' }}>
          {task.text}
        </p>
        {task.detail && (
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{task.detail}</p>
        )}
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.label}
      </span>
    </motion.div>
  );
};

const ActionPlan = ({ actionPlan }) => {
  const { progress, tasks } = actionPlan;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(progress), 500);
    return () => clearTimeout(t);
  }, [progress]);

  const doneCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Glow */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '150px', background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">This Week's Focus</h3>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{doneCount}/{tasks.length} tasks complete</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black" style={{ color: '#059669' }}>{progress}%</p>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#334155' }}>Progress</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${barWidth}%`,
              background: 'linear-gradient(90deg, #059669, #34D399)',
              boxShadow: '0 0 12px rgba(5,150,105,0.5)',
            }}
          />
        </div>

        {/* Task list */}
        <div>
          {tasks.map((task, i) => <TaskRow key={task.id} task={task} index={i} />)}
        </div>
      </div>
    </motion.div>
  );
};

export default ActionPlan;
