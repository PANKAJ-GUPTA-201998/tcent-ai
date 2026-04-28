// ============================================
// Career Intelligence Dashboard
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { getMyResume, analyzeCareer, getMyProfile } from '../services/careerService';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Circular progress using SVG
const CircularProgress = ({ value, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
};

// Horizontal match bar
const MatchBar = ({ percent }) => {
  const color = percent >= 70 ? 'bg-green-500' : percent >= 40 ? 'bg-yellow-500' : 'bg-red-400';
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-1.5">
      <div
        className={`${color} h-2 rounded-full transition-all duration-700`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

// Bar colors — blue gradient shades light → dark by rank
const BAR_COLORS = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

const SalaryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      <p className="text-gray-500">
        Min: <span className="text-blue-600 font-medium">₹{payload[0]?.value}L</span>
      </p>
      <p className="text-gray-500">
        Max: <span className="text-blue-600 font-medium">₹{payload[1]?.value}L</span>
      </p>
    </div>
  );
};

const CareerDashboard = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleAnalyze = async () => {
    setStatus('loading');
    setError(null);

    try {
      // Fetch resume and profile in parallel
      const [filesData, profile] = await Promise.all([
        getMyResume(),
        getMyProfile(),
      ]);

      if (!filesData.resume?.extractedText) {
        setError('No resume found. Please upload your resume first.');
        setStatus('error');
        return;
      }

      const result = await analyzeCareer(filesData.resume.extractedText, profile);
      setData(result);
      setStatus('done');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <motion.div
        className="mb-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Career Intelligence</h1>
        <p className="text-gray-500">AI-powered career matching based on your resume skills</p>
        {data?.isPersonalized && data?.personalizationNote && (
          <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <span>✨</span>
            <span>Personalized · {data.personalizationNote}</span>
          </div>
        )}
      </motion.div>

      {/* Idle state */}
      {status === 'idle' && (
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="text-6xl mb-5">🚀</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analyze Your Career Fit</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            We'll extract your skills from your uploaded resume and match them against 10 career paths to show your best opportunities.
          </p>
          <Button variant="primary" size="lg" onClick={handleAnalyze}>
            Analyze My Resume
          </Button>
          <p className="mt-5 text-sm text-gray-400">
            No resume yet?{' '}
            <Link to="/upload-resume" className="text-blue-500 hover:underline transition-colors">Upload one here</Link>
          </p>
        </motion.div>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <div className="animate-spin text-5xl mb-5">⚙️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Analyzing your resume...</h2>
          <p className="text-gray-400">Extracting skills and matching career paths</p>
        </motion.div>
      )}

      {/* Error */}
      {status === 'error' && (
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-left max-w-sm mx-auto">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setStatus('idle')}>Try Again</Button>
            <Link to="/upload-resume">
              <Button variant="primary">Upload Resume</Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {status === 'done' && data && (
        <motion.div
          className="space-y-6"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >

          {/* Bento top row — 3 cols */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Skill Health Score */}
            <motion.div
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 flex flex-col items-center"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Skill Health Score
              </h3>
              <div className="relative">
                <CircularProgress value={data.healthScore} size={120} strokeWidth={10} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{data.healthScore}%</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {data.healthScore >= 70 ? '🟢 Strong profile' : data.healthScore >= 40 ? '🟡 Developing' : '🔴 Needs work'}
              </p>
            </motion.div>

            {/* Skills Extracted */}
            <motion.div
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Skills Detected ({data.totalSkills})
                {data.profileSkillCount > 0 && (
                  <span className="ml-2 text-indigo-400 normal-case font-normal">
                    +{data.profileSkillCount} from profile
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {data.extractedSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Best Career Match */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-sm p-7 flex flex-col justify-center"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
                Best Career Match
              </h3>
              {data.topCareers[0] && (
                <>
                  <div className="text-4xl mb-2">{data.topCareers[0].emoji}</div>
                  <div className="text-xl font-bold text-gray-800 leading-snug">{data.topCareers[0].title}</div>
                  <div className="text-green-600 font-semibold text-lg mt-1">{data.topCareers[0].matchPercent}% match</div>
                  <div className="text-gray-500 text-sm mt-1">
                    ₹{data.topCareers[0].salaryRange.min}–{data.topCareers[0].salaryRange.max} {data.topCareers[0].salaryRange.currency}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Career Recommendations */}
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <h2 className="text-base font-bold text-gray-800 mb-6">🎯 Top Career Recommendations</h2>
            <div className="space-y-4">
              {data.topCareers.map((career, idx) => (
                <motion.div
                  key={career.id}
                  className="border border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={idx}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <span className="text-3xl shrink-0">{career.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800">{career.title}</span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Best Match
                            </span>
                          )}
                          {career.profileBoost > 0 && (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium" title={`Boosted by: ${career.boostReasons.join(', ')}`}>
                              ✨ +{career.profileBoost}% profile boost
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">{career.description}</p>
                        <MatchBar percent={career.matchPercent} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-blue-600">{career.matchPercent}%</div>
                      <div className="text-xs text-gray-400">match</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>💰 ₹{career.salaryRange.min}–{career.salaryRange.max} {career.salaryRange.currency}</span>
                    <span>📈 {career.growthRate} growth</span>
                    <span>🔥 {career.demandLevel} demand</span>
                  </div>

                  {career.matchedSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-gray-400 mr-1">You have:</span>
                      {career.matchedSkills.slice(0, 5).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">✓ {s}</span>
                      ))}
                      {career.matchedSkills.length > 5 && (
                        <span className="text-xs text-gray-400">+{career.matchedSkills.length - 5} more</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Salary Range Chart */}
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <h2 className="text-base font-bold text-gray-800 mb-1">💰 Salary Ranges by Career Path</h2>
            <p className="text-gray-400 text-sm mb-6">Annual salary in lakhs (INR) — min and max for your top 5 matches</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data.topCareers.slice(0, 5).map((c) => ({
                  name: c.title.length > 18 ? c.title.slice(0, 16) + '…' : c.title,
                  fullName: c.title,
                  min: c.salaryRange.min,
                  max: c.salaryRange.max,
                }))}
                margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
                barCategoryGap="28%"
                barGap={3}
              >
                <defs>
                  {BAR_COLORS.map((color, i) => (
                    <linearGradient key={i} id={`blueGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.55} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}L`}
                  width={52}
                />
                <Tooltip content={<SalaryTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="min" name="Min Salary" radius={[4, 4, 0, 0]}>
                  {data.topCareers.slice(0, 5).map((_, i) => (
                    <Cell key={i} fill={`url(#blueGrad${i})`} />
                  ))}
                </Bar>
                <Bar dataKey="max" name="Max Salary" radius={[4, 4, 0, 0]}>
                  {data.topCareers.slice(0, 5).map((_, i) => (
                    <Cell key={i} fill={`url(#blueGrad${i})`} fillOpacity={0.4} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" /> Min salary
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-300 inline-block" /> Max salary
              </span>
            </div>
          </motion.div>

          {/* Skill Gaps */}
          {data.skillGaps.length > 0 && (
            <motion.div
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
            >
              <h2 className="text-base font-bold text-gray-800 mb-1">📚 Skills to Learn</h2>
              <p className="text-gray-500 text-sm mb-5">
                Add these to strengthen your fit for <strong>{data.topCareers[0]?.title}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {data.skillGaps.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm font-medium"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Re-analyze */}
          <motion.div
            className="text-center pt-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
          >
            <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
              Re-analyze
            </Button>
          </motion.div>

        </motion.div>
      )}
    </div>
  );
};

export default CareerDashboard;
