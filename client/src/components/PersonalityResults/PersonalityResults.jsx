import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Calendar, RefreshCw, Trophy } from 'lucide-react';
import axios from 'axios';

import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import RiasecChart from './RiasecChart';
import WorkValuesRanking from './WorkValuesRanking';
import BigFiveChart from './BigFiveChart';
import PersonalitySummary from './PersonalitySummary';

// ─── Constants ────────────────────────────────────────────────────────────────

const PERSONALITY_API = '/api/personality';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

/**
 * Decode the JWT payload (without verifying signature) to extract userId.
 * The auth-service signs with { id: userId } in the payload.
 */
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

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const ResultsSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton variant="text" width="w-48" height="h-8" />
      <Skeleton variant="text" width="w-64" height="h-4" />
    </div>

    {/* 2-col grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <Skeleton variant="text" width="w-32" height="h-4" />
          <Skeleton variant="card" height="h-40" />
          <Skeleton.TextBlock lines={2} />
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="flex justify-center pt-2">
      <Skeleton variant="text" width="w-48" height="h-11" className="rounded-xl" />
    </div>
  </div>
);

// ─── Section card wrapper ─────────────────────────────────────────────────────

const SectionCard = ({ children, className = '' }) => (
  <div
    className={[
      'bg-white dark:bg-slate-900',
      'border border-slate-100 dark:border-slate-800',
      'rounded-2xl',
      'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.04)]',
      'dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3),0_4px_16px_-4px_rgba(0,0,0,0.25)]',
      'p-6',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PersonalityResults = () => {
  const navigate = useNavigate();
  // Support optional :userId route param; fall back to token-decoded id
  const { userId: paramUserId } = useParams();

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const userId = paramUserId ?? getUserIdFromToken();

    if (!userId) {
      setError('Unable to identify your account. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(
        `${PERSONALITY_API}/results/${userId}`,
        { headers: getAuthHeader() }
      );
      setResults(data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(
          "No assessment found. Complete the personality quiz to see your results."
        );
      } else if (err.response?.status === 403) {
        setError("You're not authorised to view these results.");
      } else {
        setError(
          err.response?.data?.message ??
          'Failed to load results. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [paramUserId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // ── Render states ─────────────────────────────────────────────────────────

  if (isLoading) return <ResultsSkeleton />;

  if (error) {
    const isNoAssessment = error.toLowerCase().includes('complete the personality quiz');
    return (
      <div className="max-w-md mx-auto mt-20 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
        <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-4">{error}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {isNoAssessment ? (
            <Button variant="primary" onClick={() => navigate('/personality/quiz')}>
              Take Assessment
            </Button>
          ) : (
            <Button
              variant="outline"
              icon={<RefreshCw size={14} />}
              onClick={fetchResults}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  const { assessment, summary } = results;
  const userName = localStorage.getItem('userName') ?? 'You';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={20} className="text-yellow-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Your Career DNA
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {userName}&apos;s personality profile
              {assessment?.dominantType && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-xs font-bold">
                  {assessment.dominantType} type
                </span>
              )}
            </p>
          </div>

          {assessment?.completedAt && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Calendar size={12} />
              <span>Assessed {formatDate(assessment.completedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2-column grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

        {/* 1. RIASEC hexagon/radar */}
        <SectionCard>
          <RiasecChart scores={assessment?.riasec} />
        </SectionCard>

        {/* 2. Work Values ranking */}
        <SectionCard>
          <WorkValuesRanking scores={assessment?.workValues} />
        </SectionCard>

        {/* 3. Big Five bars */}
        <SectionCard>
          <BigFiveChart scores={assessment?.bigFive} />
        </SectionCard>

        {/* 4. Personality Summary */}
        <SectionCard>
          <PersonalitySummary summary={summary} />
        </SectionCard>
      </div>

      {/* ── Retake note ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Want to update your profile?
        </span>
        <button
          onClick={() => navigate('/personality/quiz')}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Retake assessment
        </button>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          iconRight={<ArrowRight size={18} />}
          onClick={() => navigate('/personality/careers')}
          className="shadow-lg shadow-blue-500/20"
        >
          View Career Matches
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalityResults;
