import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, ScanSearch, Upload, MessageCircle, ClipboardList, Star, LayoutGrid } from 'lucide-react';

const TOOLS = [
  {
    label: 'Career Intelligence',
    desc: 'Analyze your best career paths & salary data',
    to: '/career',
    icon: Target,
    color: '#10B981',
    rgb: '16,185,129',
  },
  {
    label: 'ATS Checker',
    desc: 'Match your resume to any job description',
    to: '/ats-checker',
    icon: ScanSearch,
    color: '#3B82F6',
    rgb: '59,130,246',
  },
  {
    label: 'Upload Resume',
    desc: 'Parse, score & improve your resume',
    to: '/upload-resume',
    icon: Upload,
    color: '#F59E0B',
    rgb: '245,158,11',
  },
  {
    label: 'AI Career Advisor',
    desc: 'Chat with AI — get personalised career advice',
    to: '/ai-advisor',
    icon: MessageCircle,
    color: '#A78BFA',
    rgb: '167,139,250',
  },
  {
    label: 'Personality Test',
    desc: 'Discover your work style & strengths',
    to: '/assessment',
    icon: ClipboardList,
    color: '#EC4899',
    rgb: '236,72,153',
  },
  {
    label: 'Career Matches',
    desc: 'Roles matched to your personality profile',
    to: '/careers',
    icon: Star,
    color: '#06B6D4',
    rgb: '6,182,212',
  },
];

const ToolCard = ({ tool, index }) => {
  const Icon = tool.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.06 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={tool.to}
        className="flex flex-col gap-3 p-4 rounded-2xl h-full group transition-all duration-200"
        style={{
          background: '#1E293B',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = `rgba(${tool.rgb},0.07)`;
          e.currentTarget.style.borderColor = `rgba(${tool.rgb},0.25)`;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#1E293B';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `rgba(${tool.rgb},0.12)` }}
        >
          <Icon size={17} style={{ color: tool.color }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white mb-0.5 leading-tight">{tool.label}</p>
          <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{tool.desc}</p>
        </div>

        {/* Arrow */}
        <div
          className="flex items-center gap-1 text-xs font-bold mt-auto"
          style={{ color: tool.color }}
        >
          Open
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition-transform duration-150"
          />
        </div>
      </Link>
    </motion.div>
  );
};

const FeatureHub = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl p-5"
    style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}
  >
    {/* Header */}
    <div className="flex items-center gap-2 mb-4">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(16,185,129,0.12)' }}
      >
        <LayoutGrid size={14} style={{ color: '#10B981' }} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">All Tools</h3>
        <p className="text-xs" style={{ color: '#475569' }}>Everything available to you — click to launch</p>
      </div>
    </div>

    {/* 6-tool grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {TOOLS.map((tool, i) => (
        <ToolCard key={tool.to} tool={tool} index={i} />
      ))}
    </div>
  </motion.div>
);

export default FeatureHub;
