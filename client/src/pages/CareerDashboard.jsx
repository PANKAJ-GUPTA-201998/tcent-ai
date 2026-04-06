// ============================================
// Career Intelligence Dashboard
// ============================================

import React, { useState } from 'react';
import { getMyResume, analyzeCareer } from '../services/careerService';
import { Link } from 'react-router-dom';

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
    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
      <div
        className={`${color} h-2 rounded-full transition-all duration-700`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

const CareerDashboard = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [resumeText, setResumeText] = useState('');

  const handleAnalyze = async () => {
    setStatus('loading');
    setError(null);

    try {
      // Step 1: fetch resume from upload-service
      const filesData = await getMyResume();

      if (!filesData.resume?.extractedText) {
        setError('No resume found. Please upload your resume first.');
        setStatus('error');
        return;
      }

      const text = filesData.resume.extractedText;
      setResumeText(text);

      // Step 2: analyze via ai-service
      const result = await analyzeCareer(text);
      setData(result);
      setStatus('done');

    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧠 Career Intelligence</h1>
        <p className="text-gray-500">AI-powered career matching based on your resume skills</p>
      </div>

      {/* Idle state */}
      {status === 'idle' && (
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analyze Your Career Fit</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            We'll extract your skills from your uploaded resume and match them against 10 career paths to show your best opportunities.
          </p>
          <button
            onClick={handleAnalyze}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-lg"
          >
            Analyze My Resume
          </button>
          <p className="mt-4 text-sm text-gray-400">
            No resume yet?{' '}
            <Link to="/upload-resume" className="text-blue-500 hover:underline">Upload one here</Link>
          </p>
        </div>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="animate-spin text-5xl mb-4">⚙️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Analyzing your resume...</h2>
          <p className="text-gray-400">Extracting skills and matching career paths</p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Try Again
            </button>
            <Link
              to="/upload-resume"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Upload Resume
            </Link>
          </div>
        </div>
      )}

      {/* Results */}
      {status === 'done' && data && (
        <div className="space-y-6">

          {/* Top stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Skill Health Score */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Skill Health Score
              </h3>
              <div className="relative">
                <CircularProgress value={data.healthScore} size={120} strokeWidth={10} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{data.healthScore}%</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {data.healthScore >= 70 ? '🟢 Strong profile' : data.healthScore >= 40 ? '🟡 Developing' : '🔴 Needs work'}
              </p>
            </div>

            {/* Skills Extracted */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Skills Detected ({data.totalSkills})
              </h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {data.extractedSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Match */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Best Career Match
              </h3>
              {data.topCareers[0] && (
                <>
                  <div className="text-4xl mb-2">{data.topCareers[0].emoji}</div>
                  <div className="text-xl font-bold text-gray-800">{data.topCareers[0].title}</div>
                  <div className="text-green-600 font-semibold text-lg">{data.topCareers[0].matchPercent}% match</div>
                  <div className="text-gray-500 text-sm mt-1">
                    ₹{data.topCareers[0].salaryRange.min}–{data.topCareers[0].salaryRange.max} {data.topCareers[0].salaryRange.currency}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Top 5 Career Recommendations */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">🎯 Top Career Recommendations</h2>
            <div className="space-y-5">
              {data.topCareers.map((career, idx) => (
                <div key={career.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{career.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{career.title}</span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Best Match
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">{career.description}</p>
                        <MatchBar percent={career.matchPercent} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-blue-600">{career.matchPercent}%</div>
                      <div className="text-xs text-gray-500">match</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>💰 ₹{career.salaryRange.min}–{career.salaryRange.max} {career.salaryRange.currency}</span>
                    <span>📈 {career.growthRate} growth</span>
                    <span>🔥 {career.demandLevel} demand</span>
                  </div>

                  {/* Matched skills */}
                  {career.matchedSkills.length > 0 && (
                    <div className="mt-3">
                      <span className="text-xs text-gray-400 mr-2">You have:</span>
                      <div className="inline-flex flex-wrap gap-1">
                        {career.matchedSkills.slice(0, 5).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">✓ {s}</span>
                        ))}
                        {career.matchedSkills.length > 5 && (
                          <span className="text-xs text-gray-400">+{career.matchedSkills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          {data.skillGaps.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">📚 Skills to Learn</h2>
              <p className="text-gray-500 text-sm mb-4">
                Add these skills for your top career match: <strong>{data.topCareers[0]?.title}</strong>
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
            </div>
          )}

          {/* Re-analyze button */}
          <div className="text-center">
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Re-analyze
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CareerDashboard;
