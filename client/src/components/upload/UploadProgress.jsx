// ============================================
// UploadProgress Component
// ============================================
// Shows upload progress with animated bar

import React from 'react';

const UploadProgress = ({ progress, fileName }) => {
  return (
    <div className="w-full">
      {/* File name */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700 truncate">
          📄 {fileName}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>

      {/* Upload status text */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {progress < 100 ? 'Uploading...' : 'Upload complete! ✓'}
      </div>
    </div>
  );
};

export default UploadProgress;
