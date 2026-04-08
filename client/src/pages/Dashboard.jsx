import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, BarChart2, MessageCircle, Upload, Brain, ArrowRight, ClipboardList } from 'lucide-react';
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

// Compute profile completion % from profile data
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

const QUICK_ACTIONS = [
  {
    icon: User,
    label: 'Edit Profile',
    description: 'Update your skills, experience, and career goals.',
    to: '/profile',
    color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  },
  {
    icon: Upload,
    label: 'Upload Resume',
    description: 'Let AI extract your skills automatically.',
    to: '/upload-resume',
    color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
  },
  {
    icon: Brain,
    label: 'Career Intelligence',
    description: 'See which career paths match your profile best.',
    to: '/career',
    color: 'bg-green-50 text-green-600 group-hover:bg-green-100',
  },
  {
    icon: MessageCircle,
    label: 'AI Advisor',
    description: 'Chat with your personal AI career coach.',
    to: '/ai-advisor',
    color: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
  },
  {
    icon: ClipboardList,
    label: 'Personality Assessment',
    description: 'Discover your ideal career path in 15 mins.',
    to: '/assessment',
    color: 'bg-violet-100 text-violet-600 group-hover:bg-violet-200',
    highlight: true,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [assessmentCompleted, setAssessmentCompleted] = useState(null); // null = loading

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Welcome header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
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
          <>
            <Skeleton.StatCard />
            <Skeleton.StatCard />
            <Skeleton.StatCard />
          </>
        ) : (
          <>
            <StatCard
              icon="🛠️"
              label="Skills Listed"
              value={skillsCount}
              trend={skillsCount > 0 ? 'up' : undefined}
              trendLabel={skillsCount > 0 ? `${skillsCount} skill${skillsCount !== 1 ? 's' : ''} added` : undefined}
            />
            <StatCard
              icon="💼"
              label="Experience Entries"
              value={expCount}
              trend={expCount > 0 ? 'up' : undefined}
              trendLabel={expCount > 0 ? `${expCount} role${expCount !== 1 ? 's' : ''} added` : undefined}
            />
            <StatCard
              icon="✅"
              label="Profile Completion"
              value={`${completion}%`}
              trend={completion >= 50 ? 'up' : 'down'}
              trendLabel={completion === 100 ? 'Complete!' : `${100 - completion}% remaining`}
            />
          </>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_ACTIONS.map(({ icon: Icon, label, description, to, color, highlight }, i) => (
              <motion.div
                key={to}
                variants={fadeUp} initial="hidden" animate="visible" custom={i}
                className={highlight ? 'p-px rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500' : ''}
              >
                <Link
                  to={to}
                  className={[
                    'group flex items-start gap-4 p-4 rounded-xl transition-all hover:shadow-sm',
                    highlight
                      ? 'bg-gray-900 hover:bg-gray-800/80'
                      : 'bg-gray-800/50 border border-gray-700 hover:border-blue-500',
                  ].join(' ')}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${highlight ? 'text-violet-300' : 'text-white'}`}>{label}</span>
                      {highlight
                        ? <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300">New</span>
                        : <ArrowRight size={14} className="text-gray-200 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      }
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Assessment CTA — shown only when not completed */}
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
              {/* Progress bar */}
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
