import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, BarChart2, MessageCircle, Upload, Brain,
  ArrowRight, ClipboardList, ScanSearch, ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

const PERSONALITY_API = '/api/personality';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id ?? payload.userId ?? null;
  } catch {
    return null;
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const computeCompletion = (profile) => {
  if (!profile) return 0;
  const checks = [
    (profile.skills?.length ?? 0) > 0,
    (profile.experience?.length ?? 0) > 0,
    !!profile.careerGoals?.trim(),
    (profile.preferences?.industry?.length ?? 0) > 0,
    !!profile.preferences?.location?.trim(),
    !!profile.preferences?.workMode,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

/* ─── Phase → Services map ─────────────────────────────────── */
const PHASES = [
  {
    number: '01',
    title: 'Finding Direction',
    subtitle: 'The Fresher Fog',
    years: '0–2 years',
    color: '#3B82F6',
    colorRgb: '59, 130, 246',
    tagline: 'No map. No mentor. Just noise.',
    stuckPercent: 68,
    services: [
      {
        icon: Upload,
        label: 'Resume Analysis',
        description: 'Upload your resume — AI extracts your skills, strengths, and gaps instantly.',
        to: '/upload-resume',
        badge: null,
      },
      {
        icon: Brain,
        label: 'Career Path Matching',
        description: 'See which of 10+ career paths fit your profile and by how much.',
        to: '/career',
        badge: 'Most used',
      },
      {
        icon: ClipboardList,
        label: 'Personality Assessment',
        description: 'Discover your Big Five traits and RIASEC type to find your natural fit.',
        to: '/assessment',
        badge: 'Recommended',
      },
      {
        icon: MessageCircle,
        label: 'AI Career Advisor',
        description: 'Ask anything — which stream to pick, which skills matter, what to do next.',
        to: '/ai-advisor',
        badge: null,
      },
    ],
  },
  {
    number: '02',
    title: 'Breaking the Plateau',
    subtitle: 'The Stagnation Years',
    years: '2–5 years',
    color: '#8B5CF6',
    colorRgb: '139, 92, 246',
    tagline: 'Working hard. Going nowhere.',
    stuckPercent: 54,
    services: [
      {
        icon: Brain,
        label: 'Skill Gap Detection',
        description: 'Know exactly which skills to add to unlock the next level of career matches.',
        to: '/career',
        badge: 'Start here',
      },
      {
        icon: ScanSearch,
        label: 'ATS Resume Checker',
        description: 'Find out why your resume gets rejected — and fix it before you apply.',
        to: '/ats-checker',
        badge: null,
      },
      {
        icon: MessageCircle,
        label: 'AI Career Advisor',
        description: 'Switch companies, switch domains, or go for an MBA? Get a clear answer.',
        to: '/ai-advisor',
        badge: null,
      },
      {
        icon: Upload,
        label: 'Resume Upgrade',
        description: 'Re-analyse your resume to surface skills that match higher-paying roles.',
        to: '/upload-resume',
        badge: null,
      },
    ],
  },
  {
    number: '03',
    title: 'The Manager Trap',
    subtitle: 'Leadership vs. Craft',
    years: '5–10 years',
    color: '#F59E0B',
    colorRgb: '245, 158, 11',
    tagline: 'Promoted. Now what?',
    stuckPercent: 41,
    services: [
      {
        icon: ClipboardList,
        label: 'Personality Assessment',
        description: 'IC vs manager — find out which path fits your actual personality type.',
        to: '/assessment',
        badge: 'Start here',
      },
      {
        icon: MessageCircle,
        label: 'AI Career Advisor',
        description: 'Leadership coaching, senior IC strategy, political navigation — all in chat.',
        to: '/ai-advisor',
        badge: 'Most used',
      },
      {
        icon: Brain,
        label: 'Career Path Matching',
        description: 'Explore VP, Director, Staff Engineer, and Principal tracks by match score.',
        to: '/career',
        badge: null,
      },
      {
        icon: Upload,
        label: 'Senior Resume Analysis',
        description: 'Optimise your resume for senior IC or leadership positions.',
        to: '/upload-resume',
        badge: null,
      },
    ],
  },
  {
    number: '04',
    title: 'The Pivot Problem',
    subtitle: 'Escape Without a Parachute',
    years: 'Any stage',
    color: '#EF4444',
    colorRgb: '239, 68, 68',
    tagline: "Trapped in the wrong field.",
    stuckPercent: 79,
    services: [
      {
        icon: Brain,
        label: 'Pivot Path Finder',
        description: 'Discover which new careers best match your existing skills and experience.',
        to: '/career',
        badge: 'Start here',
      },
      {
        icon: Upload,
        label: 'Resume Reframing',
        description: 'AI rewrites your resume narrative to fit a completely different field.',
        to: '/upload-resume',
        badge: 'Most used',
      },
      {
        icon: ScanSearch,
        label: 'ATS Checker',
        description: "Make sure your pivoted resume actually passes the new field's filters.",
        to: '/ats-checker',
        badge: null,
      },
      {
        icon: MessageCircle,
        label: 'AI Pivot Strategist',
        description: 'Build your pivot roadmap — timeline, pay expectations, skill bridges.',
        to: '/ai-advisor',
        badge: null,
      },
    ],
  },
];

/* ─── Service card ──────────────────────────────────────────── */
const ServiceCard = ({ service, phase, index }) => {
  const Icon = service.icon;
  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
    >
      <Link
        to={service.to}
        className="group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md block"
        style={{
          background: `rgba(${phase.colorRgb}, 0.04)`,
          borderColor: `rgba(${phase.colorRgb}, 0.18)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `rgba(${phase.colorRgb}, 0.1)`;
          e.currentTarget.style.borderColor = `rgba(${phase.colorRgb}, 0.4)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `rgba(${phase.colorRgb}, 0.04)`;
          e.currentTarget.style.borderColor = `rgba(${phase.colorRgb}, 0.18)`;
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `rgba(${phase.colorRgb}, 0.15)` }}
        >
          <Icon size={18} style={{ color: phase.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {service.label}
            </span>
            {service.badge && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `rgba(${phase.colorRgb}, 0.15)`,
                  color: phase.color,
                }}
              >
                {service.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {service.description}
          </p>
        </div>
        <ArrowRight
          size={15}
          className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
          style={{ color: phase.color }}
        />
      </Link>
    </motion.div>
  );
};

/* ─── Phase selector card ───────────────────────────────────── */
const PhaseCard = ({ phase, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left rounded-xl border p-4 transition-all duration-250 group"
    style={{
      background: isSelected ? `rgba(${phase.colorRgb}, 0.1)` : 'rgba(255,255,255,0.02)',
      borderColor: isSelected ? `rgba(${phase.colorRgb}, 0.5)` : 'rgba(0,0,0,0.08)',
      boxShadow: isSelected ? `0 0 20px rgba(${phase.colorRgb}, 0.12)` : 'none',
    }}
  >
    <div className="flex items-start gap-3">
      <span
        className="font-black text-2xl leading-none select-none flex-shrink-0"
        style={{ color: isSelected ? phase.color : 'rgba(0,0,0,0.12)' }}
      >
        {phase.number}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className="text-sm font-bold"
            style={{ color: isSelected ? phase.color : '#374151' }}
          >
            {phase.title}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: `rgba(${phase.colorRgb}, 0.1)`,
              color: phase.color,
            }}
          >
            {phase.stuckPercent}% stuck
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate">{phase.tagline}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{phase.years}</p>
      </div>
      <ChevronRight
        size={15}
        className="shrink-0 mt-0.5 transition-transform"
        style={{
          color: isSelected ? phase.color : '#D1D5DB',
          transform: isSelected ? 'rotate(90deg)' : 'none',
        }}
      />
    </div>
  </button>
);

/* ─── Dashboard ─────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [assessmentCompleted, setAssessmentCompleted] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(0);

  useEffect(() => {
    api.get('/api/profile')
      .then(({ data }) => setProfile(data.profile))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));

    const userId = getUserIdFromToken();
    if (userId) {
      axios.get(`${PERSONALITY_API}/results/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(() => setAssessmentCompleted(true))
        .catch((err) => setAssessmentCompleted(err.response?.status === 404 ? false : true));
    } else {
      setAssessmentCompleted(false);
    }
  }, []);

  const skillsCount = profile?.skills?.length ?? 0;
  const expCount = profile?.experience?.length ?? 0;
  const completion = computeCompletion(profile);
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const phase = PHASES[selectedPhase];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Welcome header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
            <Link
              to="/career"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shrink-0"
            >
              <BarChart2 size={16} /> Run Career Analysis
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
      >
        {loadingProfile ? (
          <><Skeleton.StatCard /><Skeleton.StatCard /><Skeleton.StatCard /></>
        ) : (
          <>
            <StatCard
              icon="🛠️" label="Skills Listed" value={skillsCount}
              trend={skillsCount > 0 ? 'up' : undefined}
              trendLabel={skillsCount > 0 ? `${skillsCount} skill${skillsCount !== 1 ? 's' : ''} added` : undefined}
            />
            <StatCard
              icon="💼" label="Experience Entries" value={expCount}
              trend={expCount > 0 ? 'up' : undefined}
              trendLabel={expCount > 0 ? `${expCount} role${expCount !== 1 ? 's' : ''} added` : undefined}
            />
            <StatCard
              icon="✅" label="Profile Completion" value={`${completion}%`}
              trend={completion >= 50 ? 'up' : 'down'}
              trendLabel={completion === 100 ? 'Complete!' : `${100 - completion}% remaining`}
            />
          </>
        )}
      </motion.div>

      {/* ── Phase-based service navigator ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Where are you right now?
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Select your career phase — we'll show the tools that will help you most.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row">

            {/* Phase list — left column */}
            <div className="lg:w-72 flex-shrink-0 p-4 space-y-2 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
              {PHASES.map((p, i) => (
                <PhaseCard
                  key={p.number}
                  phase={p}
                  isSelected={selectedPhase === i}
                  onClick={() => setSelectedPhase(i)}
                />
              ))}
            </div>

            {/* Services panel — right column */}
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPhase}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Phase title */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-1 h-8 rounded-full flex-shrink-0"
                      style={{ background: phase.color }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {phase.title}
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          — {phase.subtitle}
                        </span>
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: phase.color }}>
                        {phase.stuckPercent}% of professionals get stuck here
                      </p>
                    </div>
                  </div>

                  {/* Service cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {phase.services.map((service, i) => (
                      <ServiceCard
                        key={service.to + service.label}
                        service={service}
                        phase={phase}
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Assessment CTA */}
      {assessmentCompleted === false && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-100 dark:border-violet-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                <ClipboardList size={20} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">
                  Discover your Career DNA
                </p>
                <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                  Take the 15-min personality assessment to unlock personalised career matches.
                </p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 active:scale-95 transition-all"
            >
              Take Assessment <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Profile completion nudge */}
      {!loadingProfile && completion < 100 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Complete your profile to unlock better matches</p>
              <p className="text-xs text-blue-100 mt-1">
                {completion === 0
                  ? 'Your profile is empty — add skills, experience, and preferences to get started.'
                  : `You're ${completion}% done. A complete profile improves career match accuracy.`}
              </p>
              <div className="mt-3 w-48 bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
            <Link
              to="/profile"
              className="shrink-0 px-5 py-2 bg-white text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Complete Profile
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default Dashboard;
