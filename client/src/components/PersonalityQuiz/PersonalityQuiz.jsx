import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Send, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Skeleton from '../ui/Skeleton';
import { useToast } from '../ui/Toast';
import QuizProgress from './QuizProgress';
import QuestionCard from './QuestionCard';

// ─── Constants ────────────────────────────────────────────────────────────────

const PERSONALITY_API = '/api/personality';
const LS_KEY = 'tcent_quiz_progress';
const QUESTIONS_PER_PAGE = 3;
const RESUME_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const SECTION_ORDER = ['riasec', 'workValues', 'bigFive'];

const EMPTY_QUESTIONS = { riasec: [], workValues: [], bigFive: [] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const loadSavedProgress = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveProgress = (state) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() }));
  } catch {
    // Storage quota exceeded — fail silently
  }
};

const clearProgress = () => {
  try { localStorage.removeItem(LS_KEY); } catch { /* noop */ }
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const QuizSkeleton = () => (
  <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
    {/* Progress skeleton */}
    <div className="space-y-3 mb-7">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="w-40" height="h-4" />
        <Skeleton variant="text" width="w-20" height="h-4" />
      </div>
      <Skeleton variant="text" width="w-full" height="h-2.5" className="rounded-full" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="text" height="h-8" className="flex-1 rounded-lg" />
        ))}
      </div>
      <div className="flex gap-0.5 mt-1">
        {Array.from({ length: 18 }).map((_, i) => (
          <Skeleton key={i} variant="text" height="h-1" className="flex-1 rounded-full" />
        ))}
      </div>
    </div>

    {/* Question card skeleton */}
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 pt-6 pb-7 sm:px-8 sm:pt-7 sm:pb-8 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Skeleton variant="circle" size="w-7 h-7" />
          <Skeleton variant="text" width="w-28" height="h-5" />
        </div>
        <Skeleton variant="circle" size="w-6 h-6" />
      </div>
      <Skeleton.TextBlock lines={2} />
      {/* Likert — desktop */}
      <div className="mt-6 hidden sm:flex gap-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="card" height="h-24" className="flex-1 rounded-2xl" />
        ))}
      </div>
      {/* Likert — mobile */}
      <div className="flex flex-col gap-2 sm:hidden mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="text" height="h-14" className="rounded-xl" />
        ))}
      </div>
    </div>

    {/* Nav buttons skeleton */}
    <div className="flex items-center gap-3 mt-6">
      <Skeleton variant="text" width="w-24 sm:w-28" height="h-10" className="rounded-xl" />
      <div className="flex-1" />
      <Skeleton variant="text" width="w-24 sm:w-28" height="h-10" className="rounded-xl" />
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PersonalityQuiz = ({ onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ── Remote data ─────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState(EMPTY_QUESTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Quiz navigation state ────────────────────────────────────────────────
  const [currentSection, setCurrentSection] = useState('riasec');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(1); // +1 forward, -1 backward

  // ── Answers: { [questionId]: score 1-5 } ────────────────────────────────
  const [answers, setAnswers] = useState({});

  // ── UI state ─────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768
  );

  // ── Modals ────────────────────────────────────────────────────────────────
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [savedProgressData, setSavedProgressData] = useState(null);

  // ── Desktop media query ───────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Fetch questions ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchQuestions = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const { data } = await axios.get(`${PERSONALITY_API}/questions`);
        if (cancelled) return;

        const qs = data.data;
        setQuestions({
          riasec:     qs.riasec     ?? [],
          workValues: qs.workValues ?? [],
          bigFive:    qs.bigFive    ?? [],
        });

        // Check for saved progress after questions load (only within 24h)
        const saved = loadSavedProgress();
        if (
          saved?.answers &&
          Object.keys(saved.answers).length > 0 &&
          saved.savedAt &&
          Date.now() - new Date(saved.savedAt).getTime() < RESUME_TTL_MS
        ) {
          setSavedProgressData(saved);
          setShowResumeModal(true);
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(
            err.response?.data?.message ?? 'Failed to load quiz questions. Please refresh and try again.'
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchQuestions();
    return () => { cancelled = true; };
  }, []);

  // ── Persist answers to localStorage on every change ──────────────────────
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    saveProgress({ answers, currentSection, currentQuestionIndex });
  }, [answers, currentSection, currentQuestionIndex]);

  // ── Resume saved progress ─────────────────────────────────────────────────
  const handleResume = useCallback(() => {
    if (!savedProgressData) return;
    setAnswers(savedProgressData.answers ?? {});
    if (savedProgressData.currentSection) setCurrentSection(savedProgressData.currentSection);
    if (savedProgressData.currentQuestionIndex !== undefined) {
      setCurrentQuestionIndex(savedProgressData.currentQuestionIndex);
    }
    setShowResumeModal(false);
  }, [savedProgressData]);

  const handleStartFresh = useCallback(() => {
    clearProgress();
    setAnswers({});
    setCurrentSection('riasec');
    setCurrentQuestionIndex(0);
    setShowResumeModal(false);
    setSavedProgressData(null);
  }, []);

  // ── Answer a question ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((questionId, score) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  }, []);

  // ── Navigation derived state ──────────────────────────────────────────────
  const currentSectionQuestions = questions[currentSection] ?? [];
  const currentSectionIndex = SECTION_ORDER.indexOf(currentSection);
  const isLastSection = currentSectionIndex === SECTION_ORDER.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  // Desktop: compute window of up to 3 questions; mobile: single question
  const windowStart = isDesktop
    ? Math.floor(currentQuestionIndex / QUESTIONS_PER_PAGE) * QUESTIONS_PER_PAGE
    : currentQuestionIndex;

  const visibleQuestions = isDesktop
    ? currentSectionQuestions.slice(windowStart, windowStart + QUESTIONS_PER_PAGE)
    : currentSectionQuestions.slice(currentQuestionIndex, currentQuestionIndex + 1);

  const isLastPage = isDesktop
    ? windowStart + QUESTIONS_PER_PAGE >= currentSectionQuestions.length
    : currentQuestionIndex === currentSectionQuestions.length - 1;

  const isFirstPage = windowStart === 0;

  // "Active" question for keyboard input — always currentQuestionIndex within the section
  const activeQuestion = currentSectionQuestions[currentQuestionIndex] ?? null;

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions =
    questions.riasec.length + questions.workValues.length + questions.bigFive.length;

  const canGoNext = visibleQuestions.length > 0 &&
    visibleQuestions.every((q) => q && answers[q.id] !== undefined);
  const canGoPrev = !(isFirstSection && isFirstPage);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    const payload = Object.entries(answers).map(([questionId, score]) => ({
      questionId,
      score,
    }));

    try {
      const { data } = await axios.post(
        `${PERSONALITY_API}/submit`,
        { answers: payload },
        { headers: getAuthHeader() }
      );

      clearProgress();
      onComplete?.(data.data);
      navigate('/personality/results');
    } catch (err) {
      let msg;
      if (err.response?.status === 429) {
        msg = "You've reached the daily limit. Try again tomorrow.";
      } else {
        msg = err.response?.data?.message ?? 'Failed to submit assessment. Please try again.';
      }
      setSubmitError(msg);
      toast.error(msg, { duration: 5000 });
      setIsSubmitting(false);
    }
  }, [answers, onComplete, navigate, toast]);

  // ── Next / Prev ───────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    setDirection(1);

    if (!isLastPage) {
      const nextIndex = isDesktop
        ? windowStart + QUESTIONS_PER_PAGE
        : currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      return;
    }

    if (!isLastSection) {
      setCurrentSection(SECTION_ORDER[currentSectionIndex + 1]);
      setCurrentQuestionIndex(0);
      return;
    }

    // Last page of last section — submit
    handleSubmit();
  }, [isLastPage, isLastSection, currentSectionIndex, isDesktop, windowStart, currentQuestionIndex, handleSubmit]);

  const handlePrev = useCallback(() => {
    setDirection(-1);

    if (!isFirstPage) {
      const prevIndex = isDesktop
        ? Math.max(0, windowStart - QUESTIONS_PER_PAGE)
        : currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      return;
    }

    if (!isFirstSection) {
      const prevSection = SECTION_ORDER[currentSectionIndex - 1];
      const prevSectionLength = questions[prevSection]?.length ?? 0;
      setCurrentSection(prevSection);
      if (isDesktop) {
        const lastPageStart = Math.max(
          0,
          Math.floor((prevSectionLength - 1) / QUESTIONS_PER_PAGE) * QUESTIONS_PER_PAGE
        );
        setCurrentQuestionIndex(lastPageStart);
      } else {
        setCurrentQuestionIndex(Math.max(0, prevSectionLength - 1));
      }
    }
  }, [isFirstPage, isFirstSection, currentSectionIndex, questions, isDesktop, windowStart, currentQuestionIndex]);

  // ── Keyboard support ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't fire if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (isSubmitting || showResumeModal || showClearModal) return;

      // 1–5: select score for active question
      if (e.key >= '1' && e.key <= '5') {
        if (activeQuestion) {
          e.preventDefault();
          handleAnswer(activeQuestion.id, parseInt(e.key, 10));
        }
        return;
      }

      // Arrow keys: navigate
      if (e.key === 'ArrowRight' && canGoNext && !isSubmitting) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && canGoPrev && !isSubmitting) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSubmitting, showResumeModal, showClearModal,
    activeQuestion, handleAnswer,
    canGoNext, canGoPrev, handleNext, handlePrev,
  ]);

  // ── Clear progress confirmation ───────────────────────────────────────────
  const handleConfirmClear = useCallback(() => {
    handleStartFresh();
    setShowClearModal(false);
  }, [handleStartFresh]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render states
  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading) return <QuizSkeleton />;

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto mt-16 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-6 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
        <p className="text-sm text-red-700 dark:text-red-300 font-medium">{fetchError}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  // ── Overall question number (1-based) for the active question ─────────────
  const overallQuestionNumber =
    (currentSectionIndex > 0
      ? SECTION_ORDER.slice(0, currentSectionIndex).reduce(
          (sum, key) => sum + (questions[key]?.length ?? 0), 0
        )
      : 0) + currentQuestionIndex + 1;

  return (
    <>
      {/* ── Resume modal ──────────────────────────────────────────────────── */}
      <Modal
        open={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        title="Resume your assessment?"
        size="sm"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          You have a quiz in progress (
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {savedProgressData ? Object.keys(savedProgressData.answers ?? {}).length : 0}/
            {totalQuestions || 74}
          </span>{' '}
          completed). Would you like to continue where you left off?
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" className="flex-1" onClick={handleResume}>
            Resume
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleStartFresh}>
            Start Fresh
          </Button>
        </div>
      </Modal>

      {/* ── Clear progress confirmation modal ─────────────────────────────── */}
      <Modal
        open={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear all answers?"
        size="sm"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          This will erase all your current answers and restart the quiz from the beginning. This cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="danger" className="flex-1" onClick={handleConfirmClear}>
            Clear & Restart
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* ── Quiz shell ────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Personality Assessment
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              74 questions · ~12 minutes
            </p>
          </div>

          <button
            onClick={() => setShowClearModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Restart quiz"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Progress tracker */}
        <QuizProgress
          currentSection={currentSection}
          currentQuestion={overallQuestionNumber}
          totalQuestions={totalQuestions || 74}
          sections={[
            { key: 'riasec',     label: 'RIASEC',      longLabel: 'Career Interests',   count: questions.riasec.length     || 36 },
            { key: 'workValues', label: 'Work Values',  longLabel: 'Work Values',        count: questions.workValues.length || 18 },
            { key: 'bigFive',    label: 'Big Five',     longLabel: 'Personality Traits', count: questions.bigFive.length    || 20 },
          ]}
        />

        {/* ── Question area ─────────────────────────────────────────────── */}
        {isDesktop && visibleQuestions.length > 1 ? (
          /* Desktop multi-question view */
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSection}-${windowStart}`}
              initial={{ opacity: 0, y: direction > 0 ? 16 : -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -16 : 16 }}
              transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-4"
            >
              {visibleQuestions.map((question, pageIdx) => {
                const sectionIdx = windowStart + pageIdx;
                const qOverallNum =
                  (currentSectionIndex > 0
                    ? SECTION_ORDER.slice(0, currentSectionIndex).reduce(
                        (sum, key) => sum + (questions[key]?.length ?? 0), 0
                      )
                    : 0) + sectionIdx + 1;
                const isActive = sectionIdx === currentQuestionIndex;

                return (
                  <div
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(sectionIdx)}
                    className={[
                      'rounded-2xl transition-all duration-150 cursor-pointer',
                      isActive
                        ? 'ring-2 ring-blue-400/60 dark:ring-blue-500/50'
                        : 'ring-1 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700',
                    ].join(' ')}
                  >
                    <QuestionCard
                      question={question}
                      questionNumber={qOverallNum}
                      selectedScore={answers[question.id]}
                      onAnswer={handleAnswer}
                    />
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Mobile / single-question view */
          <QuestionCard
            question={activeQuestion}
            questionNumber={overallQuestionNumber}
            selectedScore={activeQuestion ? answers[activeQuestion.id] : undefined}
            onAnswer={handleAnswer}
          />
        )}

        {/* Submit error */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-4 py-3"
            >
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={!canGoPrev || isSubmitting}
            icon={<ChevronLeft size={16} />}
            className="w-24 sm:w-28"
          >
            Back
          </Button>

          <div className="flex-1 text-center">
            <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
              {totalAnswered} of {totalQuestions || 74} answered
            </span>
          </div>

          {isLastSection && isLastPage ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!canGoNext || isSubmitting}
              icon={!isSubmitting ? <Send size={15} /> : undefined}
              className="w-36 sm:w-40"
            >
              {isSubmitting ? 'Submitting' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canGoNext || isSubmitting}
              iconRight={<ChevronRight size={16} />}
              className="w-24 sm:w-28"
            >
              Next
            </Button>
          )}
        </div>

        {/* Answer hint + keyboard hint */}
        <div className="mt-3 flex items-center justify-center gap-4">
          {!canGoNext && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {isDesktop && visibleQuestions.length > 1
                ? 'Answer all questions above to continue'
                : 'Select an answer above to continue'}
            </p>
          )}
          {canGoNext && (
            <p className="text-xs text-slate-300 dark:text-slate-600 hidden sm:block">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px]">→</kbd> to advance
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalityQuiz;
