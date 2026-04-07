import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const PERSONALITY_API = 'http://localhost:3005/api/personality';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

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

const formatSalary = (min, max) => {
  const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
  return `${fmt(min)} – ${fmt(max)}`;
};

const CareerCard = ({ career, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{career.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{career.industry}</p>
      </div>
      <span className="shrink-0 text-lg font-bold text-blue-600 dark:text-blue-400">
        {Math.round(career.matchScore)}%
      </span>
    </div>

    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        initial={{ width: 0 }}
        animate={{ width: `${career.matchScore}%` }}
        transition={{ delay: index * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
      />
    </div>

    {career.salaryRange && (
      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
        {formatSalary(career.salaryRange.min, career.salaryRange.max)} / yr
      </p>
    )}

    {career.matchReasons?.length > 0 && (
      <ul className="space-y-1">
        {career.matchReasons.slice(0, 2).map((r, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <TrendingUp size={12} className="mt-0.5 shrink-0 text-blue-400" />
            {r}
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

const CareersPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    const userId = getUserIdFromToken();
    if (!userId) {
      setError('Please log in to view career matches.');
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(
        `${PERSONALITY_API}/career-matches/${userId}`,
        { headers: getAuthHeader() }
      );
      setMatches(data.data ?? data.matches ?? data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Complete the personality assessment first to get career matches.');
      } else {
        setError(err.response?.data?.message ?? 'Failed to load career matches.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <Skeleton variant="text" width="w-48" height="h-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <Skeleton variant="text" width="w-3/4" height="h-5" />
              <Skeleton variant="card" height="h-1.5" />
              <Skeleton.TextBlock lines={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const needsAssessment = error.toLowerCase().includes('assessment');
    return (
      <div className="max-w-md mx-auto mt-20 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
        <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-4">{error}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {needsAssessment ? (
            <Button variant="primary" onClick={() => navigate('/assessment')}>
              Take Assessment
            </Button>
          ) : (
            <Button variant="outline" icon={<RefreshCw size={14} />} onClick={fetchMatches}>
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  const careerList = Array.isArray(matches) ? matches : matches?.careers ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase size={22} className="text-blue-600 dark:text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Career Matches</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {careerList.length} careers matched to your personality profile
          </p>
        </div>
      </div>

      {careerList.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No matches found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {careerList.map((career, i) => (
            <CareerCard key={career.id ?? career._id ?? i} career={career} index={i} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={() => navigate('/personality/results')}>
          Back to Results
        </Button>
      </div>
    </div>
  );
};

export default CareersPage;
