import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertCircle, CheckCircle, ScanSearch } from 'lucide-react';
import ResumeUpload from '../components/ats/ResumeUpload';
import JobDescriptionInput from '../components/ats/JobDescriptionInput';
import ATSResults from '../components/ats/ATSResults';
import { analyzeATS } from '../services/atsService';

// ─── Analyzing Phase Steps ────────────────────────────────────────────────────

const STEPS = [
  'Extracting resume keywords...',
  'Parsing job description...',
  'Matching skills against requirements...',
  'Calculating ATS compatibility score...',
];

const AnalyzingPhase = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length - 1) return;
    const t = setTimeout(() => setCurrentStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm"
    >
      {/* Pulsing AI icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-500"
          />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap size={24} className="text-white" />
          </div>
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
        AI Analysis in Progress
      </p>

      <div className="max-w-sm mx-auto space-y-3">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              {/* Status icon */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {done ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle size={18} className="text-green-500" />
                  </motion.div>
                ) : active ? (
                  <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin block" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 block" />
                )}
              </div>

              {/* Step text */}
              <span
                className={`text-sm transition-colors duration-300 ${
                  done
                    ? 'text-green-600 dark:text-green-400 line-through decoration-green-400/50'
                    : active
                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Scanning bar */}
      <div className="mt-7 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden max-w-sm mx-auto">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        />
      </div>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

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
      // Small delay so the last step's checkmark is visible before results appear
      await new Promise((r) => setTimeout(r, 600));
      setResults(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}>
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              ATS Resume Matcher
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Paste a job description + upload your resume — get an instant ATS score with fixes.
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mt-5">
          {[
            { n: '1', label: 'Upload resume', done: !!resumeFile },
            { n: '2', label: 'Paste job description', done: jobDescription.trim().length >= 50 },
            { n: '3', label: 'Get your score', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step.done
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}>
                {step.done ? <CheckCircle size={14} className="text-white" /> : step.n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                {step.label}
              </span>
              {i < 2 && <div className="w-6 h-px bg-gray-200 dark:bg-gray-700 mx-1" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Input cards ── */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`rounded-2xl border p-5 transition-all duration-200 ${
          resumeFile
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
        }`}>
          <ResumeUpload file={resumeFile} onChange={setResumeFile} />
        </div>
        <div className={`rounded-2xl border p-5 transition-all duration-200 ${
          jobDescription.trim().length >= 50
            ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
        }`}>
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
        </div>
      </motion.div>

      {/* ── Analyze button ── */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="mt-5 flex flex-col items-center gap-2">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={`flex items-center gap-2.5 px-10 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
            canAnalyze
              ? 'text-white active:scale-95 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
          style={canAnalyze ? {
            background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
            boxShadow: '0 0 28px rgba(99,102,241,0.35)',
          } : {}}
          onMouseEnter={(e) => { if (canAnalyze) e.currentTarget.style.boxShadow = '0 0 44px rgba(99,102,241,0.55)'; }}
          onMouseLeave={(e) => { if (canAnalyze) e.currentTarget.style.boxShadow = '0 0 28px rgba(99,102,241,0.35)'; }}
        >
          <Zap size={16} />
          Analyze ATS Match
        </button>
        <p className="text-xs text-gray-400 h-4">
          {!resumeFile ? 'Upload your resume PDF to get started'
            : jobDescription.trim().length < 50 ? 'Paste a job description (at least 50 characters)'
            : 'Ready — click to analyze'}
        </p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyzing phase / Results */}
      <AnimatePresence mode="wait">
        {loading && !results && (
          <AnalyzingPhase key="analyzing" />
        )}
        {results && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ATSResults results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ATSChecker;
