// ============================================
// AI Career Advisor Component
// ============================================

import React, { useState, useEffect } from 'react';
import { Send, Trash2, AlertCircle } from 'lucide-react';
import ChatBox from './ChatBox';
import QuickQuestions from './QuickQuestions';
import Button from '../ui/Button';
import { getCareerAdvice } from '../../services/aiService';
import { getMyProfile } from '../../services/careerService';

const AICareerAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingQuestions, setRemainingQuestions] = useState(10);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) setMessages(JSON.parse(saved));

    // Fetch user profile silently for personalization
    getMyProfile().then(p => setProfile(p)).catch(() => {});
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (question = inputText) => {
    if (!question.trim() || isLoading) return;

    setError(null);
    setMessages(prev => [...prev, { text: question, isUser: true, timestamp: new Date().toISOString() }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await getCareerAdvice(question, profile);
      setMessages(prev => [...prev, {
        text: response.answer,
        isUser: false,
        timestamp: new Date().toISOString(),
        cached: response.cached,
      }]);
      if (response.remainingQuestions !== undefined) {
        setRemainingQuestions(response.remainingQuestions);
      }
    } catch (err) {
      if (err.message?.includes('Daily limit')) {
        setError('Daily limit reached. You can ask 10 questions per day. Try again tomorrow.');
        setRemainingQuestions(0);
      } else if (err.message?.includes('token') || err.message?.includes('login')) {
        setError('Please log in to use the AI Career Advisor.');
      } else {
        setError(err.message || 'Failed to get a response. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem('chatMessages');
  };

  const canSend = !!inputText.trim() && !isLoading && remainingQuestions > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-t-2xl p-6 border-b-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Career Advisor</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Personalised career guidance powered by AI
            </p>
            {profile && (
              <span className="inline-flex items-center gap-1.5 mt-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-full">
                ✨ Personalized
                {profile.skills?.length > 0 && ` · ${profile.skills.length} skills`}
                {profile.careerGoals && ' · goals set'}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Today's questions</p>
            <p className={`text-2xl font-bold ${remainingQuestions === 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
              {remainingQuestions}<span className="text-sm font-normal text-gray-400">/10</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div
        className="bg-white dark:bg-slate-900 border-x border-gray-200 dark:border-slate-700"
        style={{ height: 480, display: 'flex', flexDirection: 'column' }}
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Welcome to AI Career Advisor
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 max-w-md">
              {profile?.careerGoals
                ? `I'll help you with: "${profile.careerGoals.slice(0, 80)}${profile.careerGoals.length > 80 ? '…' : ''}"`
                : 'Ask anything about career transitions, skills, salary negotiation, or job search tips.'}
            </p>
            <QuickQuestions
              onQuestionClick={handleSendMessage}
              disabled={isLoading || remainingQuestions === 0}
              profile={profile}
            />
          </div>
        ) : (
          <>
            <ChatBox messages={messages} isLoading={isLoading} />
            <div className="px-4 pb-2 border-t border-gray-50 dark:border-slate-800 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                icon={<Trash2 size={13} />}
              >
                Clear history
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Input area */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-b-2xl p-4">
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {remainingQuestions === 0 && !error && (
          <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-lg mb-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            Daily limit reached. Your quota resets at midnight.
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={remainingQuestions === 0 ? 'Daily limit reached…' : 'Ask me about your career…'}
            maxLength={500}
            rows={2}
            disabled={isLoading || remainingQuestions === 0}
            className="flex-1 px-4 py-3 text-sm border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition"
          />
          <Button
            variant="primary"
            onClick={() => handleSendMessage()}
            disabled={!canSend}
            loading={isLoading}
            icon={!isLoading ? <Send size={16} /> : undefined}
            className="self-end"
          >
            Send
          </Button>
        </div>

        <div className="mt-2 text-xs text-gray-400 dark:text-slate-500 text-right">
          {inputText.length}/500
        </div>
      </div>

    </div>
  );
};

export default AICareerAdvisor;
