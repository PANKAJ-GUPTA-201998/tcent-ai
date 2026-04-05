// ============================================
// QuickQuestions Component
// ============================================
// Pre-defined career questions for quick access

import React from 'react';

const QuickQuestions = ({ onQuestionClick, disabled }) => {
  const quickQuestions = [
    {
      id: 1,
      icon: '💻',
      question: 'How to become a software engineer?',
      category: 'Career Path'
    },
    {
      id: 2,
      icon: '📈',
      question: 'Best skills for 2026 job market?',
      category: 'Skills'
    },
    {
      id: 3,
      icon: '🔄',
      question: 'Career change from marketing to tech?',
      category: 'Transition'
    },
    {
      id: 4,
      icon: '🎯',
      question: 'How to negotiate a higher salary?',
      category: 'Salary'
    },
    {
      id: 5,
      icon: '📊',
      question: 'Should I learn data science or AI?',
      category: 'Learning'
    },
    {
      id: 6,
      icon: '🚀',
      question: 'How to prepare for product manager role?',
      category: 'Career Path'
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Quick Questions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quickQuestions.map((item) => (
          <button
            key={item.id}
            onClick={() => onQuestionClick(item.question)}
            disabled={disabled}
            className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {item.question}
              </p>
              <span className="text-xs text-gray-500 mt-1 inline-block">
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
