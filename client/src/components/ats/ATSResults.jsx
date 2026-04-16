import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, LayoutGrid, FileText } from 'lucide-react';
import ProgressCircle from '../ui/ProgressCircle';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const ScoreLabel = ({ score }) => {
  if (score >= 75) return <span className="text-green-600 dark:text-green-400 font-semibold">Strong Match</span>;
  if (score >= 50) return <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Moderate Match</span>;
  return <span className="text-red-500 dark:text-red-400 font-semibold">Weak Match</span>;
};

const KeywordChip = ({ label, variant }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
      ${variant === 'matched'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      }`}
  >
    {variant === 'matched'
      ? <CheckCircle size={11} />
      : <XCircle size={11} />
    }
    {label}
  </span>
);

const ATSResults = ({ results }) => {
  const {
    score = 0,
    matchedKeywords = [],
    missingKeywords = [],
    suggestions = [],
    keywordDensity = {},
    sectionFeedback = {},
    resumeWordCount,
    analyzedAt,
  } = results;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mt-8 space-y-6"
    >
      {/* Score banner */}
      <motion.div
        custom={0}
        variants={fadeUp}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
      >
        <ProgressCircle value={score} size={130} strokeWidth={12} label="ATS Score" />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            <ScoreLabel score={score} />
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {keywordDensity.matched ?? matchedKeywords.length} of {keywordDensity.total ?? (matchedKeywords.length + missingKeywords.length)} keywords matched
          </p>
          {resumeWordCount && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
              Resume length: {resumeWordCount.toLocaleString()} words
            </p>
          )}
          {analyzedAt && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
              Analyzed {new Date(analyzedAt).toLocaleTimeString()}
            </p>
          )}

          {/* Score interpretation */}
          <div className={`mt-3 inline-block px-3 py-1.5 rounded-lg text-sm
            ${score >= 75
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : score >= 50
                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300'
            }`}
          >
            {score >= 75
              ? 'Your resume is well-optimised for this role.'
              : score >= 50
                ? 'Good start — add the missing keywords to improve your score.'
                : 'Significant gaps found. Review the suggestions below.'
            }
          </div>
        </div>
      </motion.div>

      {/* Keywords grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched */}
        <motion.div
          custom={1}
          variants={fadeUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
            <CheckCircle size={17} className="text-green-500" />
            Matched Keywords
            <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              {matchedKeywords.length}
            </span>
          </h4>
          {matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((kw) => (
                <KeywordChip key={kw} label={kw} variant="matched" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No keyword matches found.</p>
          )}
        </motion.div>

        {/* Missing */}
        <motion.div
          custom={2}
          variants={fadeUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
            <XCircle size={17} className="text-red-500" />
            Missing Keywords
            <span className="ml-auto text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
              {missingKeywords.length}
            </span>
          </h4>
          {missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw) => (
                <KeywordChip key={kw} label={kw} variant="missing" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No missing keywords — great job!</p>
          )}
        </motion.div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          custom={3}
          variants={fadeUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <Lightbulb size={17} className="text-yellow-500" />
            Suggestions to Improve Your Score
          </h4>
          <ul className="space-y-3">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Section feedback */}
      {Object.keys(sectionFeedback).length > 0 && (
        <motion.div
          custom={4}
          variants={fadeUp}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <LayoutGrid size={17} className="text-blue-500" />
            Section Feedback
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(sectionFeedback).map(([section, feedback]) => (
              <div
                key={section}
                className="rounded-xl bg-gray-50 dark:bg-gray-700/40 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-blue-400" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {section}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feedback}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ATSResults;
