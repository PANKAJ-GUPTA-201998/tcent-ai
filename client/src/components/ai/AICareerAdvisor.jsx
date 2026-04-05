// ============================================
// AI Career Advisor Component
// ============================================
// Main AI chat page with full functionality

import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import QuickQuestions from './QuickQuestions';
import { getCareerAdvice } from '../../services/aiService';

const AICareerAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingQuestions, setRemainingQuestions] = useState(10);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (question = inputText) => {
    if (!question.trim() || isLoading) return;

    // Clear error
    setError(null);

    // Add user message
    const userMessage = {
      text: question,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call AI service
      const response = await getCareerAdvice(question);

      // Add AI response
      const aiMessage = {
        text: response.answer,
        isUser: false,
        timestamp: new Date().toISOString(),
        cached: response.cached
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update remaining questions (if provided by API)
      if (response.remainingQuestions !== undefined) {
        setRemainingQuestions(response.remainingQuestions);
      }

    } catch (err) {
      console.error('AI Error:', err);
      
      // Handle rate limit error
      if (err.message?.includes('Daily limit')) {
        setError('Daily limit reached! You can ask 10 questions per day. Try again tomorrow.');
        setRemainingQuestions(0);
      } else if (err.message?.includes('token') || err.message?.includes('login')) {
        setError('Please login to use AI Career Advisor');
      } else {
        setError(err.message || 'Failed to get AI response. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                🤖 AI Career Advisor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Get personalized career guidance powered by AI
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Questions remaining today
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {remainingQuestions}/10
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="bg-white shadow-lg" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          {/* Empty state or messages */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome to AI Career Advisor!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Ask me anything about your career - transitions, skills, salary negotiation, or job search tips.
              </p>
              <QuickQuestions
                onQuestionClick={handleSendMessage}
                disabled={isLoading || remainingQuestions === 0}
              />
            </div>
          ) : (
            <>
              {/* Chat messages */}
              <ChatBox messages={messages} isLoading={isLoading} />

              {/* Clear chat button */}
              <div className="px-4 pb-2">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  🗑️ Clear chat history
                </button>
              </div>
            </>
          )}
        </div>

        {/* Input area */}
        <div className="bg-white rounded-b-2xl shadow-lg p-4 border-t">
          {/* Error message */}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <span className="text-red-600">⚠️</span>
              <p className="text-sm text-red-700 flex-1">{error}</p>
            </div>
          )}

          {/* Input box */}
          <div className="flex gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your career..."
              maxLength={500}
              rows={2}
              disabled={isLoading || remainingQuestions === 0}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading || remainingQuestions === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? '⏳' : '📤'} Send
            </button>
          </div>

          {/* Character count */}
          <div className="mt-2 text-xs text-gray-500 text-right">
            {inputText.length}/500 characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICareerAdvisor;
