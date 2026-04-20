/**
 * OnboardingChecklist
 *
 * Shows guided next steps for new users on the Dashboard.
 * Disappears automatically once all steps are complete.
 *
 * Usage:
 *   <OnboardingChecklist
 *     hasResume={!!profile?.resumeUrl}
 *     hasAssessment={assessmentCompleted}
 *     hasCareerView={profile?.careerViewedAt != null}
 *   />
 */

import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Upload, ClipboardList, BarChart2, MessageCircle, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    id: 'resume',
    icon: Upload,
    title: 'Upload your resume',
    description: 'AI extracts your skills and gaps in seconds.',
    to: '/upload-resume',
    cta: 'Upload now',
  },
  {
    id: 'assessment',
    icon: ClipboardList,
    title: 'Take the personality quiz',
    description: 'Discover your Big Five traits and RIASEC type.',
    to: '/assessment',
    cta: 'Start quiz',
  },
  {
    id: 'career',
    icon: BarChart2,
    title: 'See your career matches',
    description: 'Find which careers fit your profile best.',
    to: '/career',
    cta: 'View matches',
  },
  {
    id: 'ai',
    icon: MessageCircle,
    title: 'Ask the AI Advisor',
    description: 'Get a personalised answer to your biggest career question.',
    to: '/ai-advisor',
    cta: 'Ask now',
  },
];

const OnboardingChecklist = ({ hasResume, hasAssessment, hasCareerView }) => {
  // Map step IDs to completion state
  const completed = {
    resume: !!hasResume,
    assessment: !!hasAssessment,
    career: !!hasCareerView,
    ai: false, // tracked separately if needed; always show as next action
  };

  const doneCount = Object.values(completed).filter(Boolean).length;

  // Hide once all 4 done
  if (doneCount === STEPS.length) return null;

  // Find the first incomplete step (the "next action")
  const nextStepId = STEPS.find((s) => !completed[s.id])?.id;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Get started — {doneCount} of {STEPS.length} done
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Follow these steps to unlock your full career profile.
          </p>
        </div>
        {/* Progress bar */}
        <div className="w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 ml-4 shrink-0">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {STEPS.map((step) => {
          const done = completed[step.id];
          const isNext = step.id === nextStepId;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                isNext ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''
              }`}
            >
              {/* Status icon */}
              {done ? (
                <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              ) : (
                <Circle size={20} className={`shrink-0 ${isNext ? 'text-blue-400' : 'text-gray-300 dark:text-gray-600'}`} />
              )}

              {/* Step icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                done    ? 'bg-green-50 dark:bg-green-950/30' :
                isNext  ? 'bg-blue-100 dark:bg-blue-900/30' :
                          'bg-gray-100 dark:bg-gray-800'
              }`}>
                <Icon
                  size={15}
                  className={
                    done    ? 'text-green-500' :
                    isNext  ? 'text-blue-600 dark:text-blue-400' :
                              'text-gray-400'
                  }
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                  {step.title}
                </p>
                {!done && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{step.description}</p>
                )}
              </div>

              {/* CTA — only on the next incomplete step */}
              {isNext && (
                <Link
                  to={step.to}
                  className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                >
                  {step.cta} <ChevronRight size={13} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingChecklist;
