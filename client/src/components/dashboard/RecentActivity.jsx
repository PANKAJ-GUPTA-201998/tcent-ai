import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const RecentActivity = ({ activity }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl p-5"
    style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}
  >
    <div className="flex items-center gap-2 mb-5">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(100,116,139,0.15)' }}>
        <Activity size={14} style={{ color: '#64748B' }} />
      </div>
      <h3 className="text-sm font-bold text-white">Recent Activity</h3>
    </div>

    <div className="space-y-0">
      {activity.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 + i * 0.07 }}
          className="flex items-center gap-3 py-2.5"
          style={{ borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
        >
          <span className="text-base flex-shrink-0">{item.icon}</span>
          <p className="text-sm flex-1 text-slate-300">{item.text}</p>
          <span className="text-xs flex-shrink-0" style={{ color: '#334155' }}>{item.time}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default RecentActivity;
