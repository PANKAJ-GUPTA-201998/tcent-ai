// ============================================
// QuickQuestions Component
// ============================================
// Shows pre-defined questions; if a profile is available,
// the first 2-3 slots are replaced with profile-specific questions

import React from 'react';

const DEFAULT_QUESTIONS = [
  { id: 'q1', icon: '💻', question: 'How to become a software engineer?', category: 'Career Path' },
  { id: 'q2', icon: '📈', question: 'Best skills for 2026 job market?', category: 'Skills' },
  { id: 'q3', icon: '🔄', question: 'Career change from marketing to tech?', category: 'Transition' },
  { id: 'q4', icon: '🎯', question: 'How to negotiate a higher salary?', category: 'Salary' },
  { id: 'q5', icon: '📊', question: 'Should I learn data science or AI?', category: 'Learning' },
  { id: 'q6', icon: '🚀', question: 'How to prepare for product manager role?', category: 'Career Path' },
];

/**
 * Build personalized questions from user profile.
 * Returns up to 3 targeted questions; the rest are filled from defaults.
 */
const buildProfileQuestions = (profile) => {
  if (!profile) return DEFAULT_QUESTIONS;

  const personal = [];

  // Career goal question
  if (profile.careerGoals) {
    const goal = profile.careerGoals.slice(0, 60);
    personal.push({
      id: 'pq-goal',
      icon: '🎯',
      question: `How do I achieve: "${goal}"?`,
      category: 'Your Goal',
    });
  }

  // Skill-gap question from top skill
  if (profile.skills && profile.skills.length > 0) {
    const topSkill = profile.skills[0];
    personal.push({
      id: 'pq-skill',
      icon: '📚',
      question: `I know ${topSkill} — what should I learn next to grow?`,
      category: 'Next Skill',
    });
  }

  // Experience-based question
  if (profile.experience && profile.experience.length > 0) {
    const latest = profile.experience[0];
    personal.push({
      id: 'pq-exp',
      icon: '🔝',
      question: `How to advance from ${latest.role} to a senior or lead role?`,
      category: 'Career Growth',
    });
  }

  // Industry preference question
  if (profile.preferences?.industry?.length > 0) {
    const ind = profile.preferences.industry[0];
    personal.push({
      id: 'pq-industry',
      icon: '🏢',
      question: `What are the best career paths in ${ind}?`,
      category: 'Industry',
    });
  }

  // Work mode question
  if (profile.preferences?.workMode === 'remote') {
    personal.push({
      id: 'pq-remote',
      icon: '🌍',
      question: 'How to find and land high-paying remote jobs?',
      category: 'Remote Work',
    });
  }

  // Fill remaining slots with defaults (skip ones that overlap by topic)
  const merged = [...personal.slice(0, 3)];
  for (const def of DEFAULT_QUESTIONS) {
    if (merged.length >= 6) break;
    merged.push(def);
  }

  return merged;
};

const QuickQuestions = ({ onQuestionClick, disabled, profile }) => {
  const questions = buildProfileQuestions(profile);
  const isPersonalized = !!profile && (
    profile.skills?.length > 0 || profile.careerGoals || profile.experience?.length > 0
  );

  return (
    <div className="mb-6 w-full max-w-xl">
      <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
        Quick Questions
        {isPersonalized && (
          <span className="text-xs text-indigo-500 font-normal">✨ tailored for you</span>
        )}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((item) => (
          <button
            key={item.id}
            onClick={() => onQuestionClick(item.question)}
            disabled={disabled}
            className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {item.question}
              </p>
              <span className={`text-xs mt-1 inline-block font-medium ${
                item.id?.startsWith('pq-')
                  ? 'text-indigo-500'
                  : 'text-gray-500 dark:text-slate-400'
              }`}>
                {item.category}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestions;
