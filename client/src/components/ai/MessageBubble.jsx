// ============================================
// MessageBubble Component
// ============================================
// Single chat message (user or AI)

import React, { useState } from 'react';

const MessageBubble = ({ message, isUser }) => {
  const [copied, setCopied] = useState(false);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Copy message to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {/* Message text */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>

          {/* Cached indicator (for AI messages) */}
          {!isUser && message.cached && (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              ⚡ Cached
            </span>
          )}
        </div>

        {/* Timestamp and actions */}
        <div className={`flex items-center gap-2 mt-1 px-2 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>

          {/* Copy button (only for AI messages) */}
          {!isUser && (
            <button
              onClick={copyToClipboard}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy message"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
