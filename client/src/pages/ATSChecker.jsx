import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertCircle } from 'lucide-react';
import ResumeUpload from '../components/ats/ResumeUpload';
import JobDescriptionInput from '../components/ats/JobDescriptionInput';
import ATSResults from '../components/ats/ATSResults';
import { analyzeATS } from '../services/atsService';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const ATSChecker = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canAnalyze = resumeFile && jobDescription.trim().length >= 50 && !loading;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setError('');
    setResults(null);
    setLoading(true);

    try {
      const data = await analyzeATS(resumeFile, jobDescription);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ATS Resume Matcher
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-13 text-sm">
          Upload your resume and paste a job description to get an instant ATS compatibility score with actionable improvements.
        </p>
      </motion.div>

      {/* Split-screen input area */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Left — Resume Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <ResumeUpload file={resumeFile} onChange={setResumeFile} />
        </div>

        {/* Right — Job Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
        </div>
      </motion.div>

      {/* Analyze button */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-5 flex flex-col items-center gap-3"
      >
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200
            ${canAnalyze
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg active:scale-95'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Zap size={16} />
              Analyze ATS Match
            </>
          )}
        </button>

        {/* Hint text */}
        {!resumeFile && (
          <p className="text-xs text-gray-400 dark:text-gray-500">Upload your resume PDF to get started</p>
        )}
        {resumeFile && jobDescription.trim().length < 50 && (
          <p className="text-xs text-gray-400 dark:text-gray-500">Paste a job description (at least 50 characters)</p>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </motion.div>
      )}

      {/* Results */}
      {results && <ATSResults results={results} />}
    </div>
  );
};

export default ATSChecker;
