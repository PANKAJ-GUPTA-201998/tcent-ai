// ============================================
// FileDropzone Component
// ============================================

import React, { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

const FileDropzone = ({
  onFileSelect,
  acceptedTypes,
  maxSize,
  disabled,
  icon = '📄',
  title = 'Drag & Drop',
  description = 'or click to browse',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files?.length > 0) handleFileSelection(files[0]);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files?.length > 0) handleFileSelection(files[0]);
    // Reset input so selecting the same file again triggers onChange
    e.target.value = '';
  };

  const handleFileSelection = (file) => {
    setValidationError(null);

    if (acceptedTypes && !acceptedTypes.includes(file.type)) {
      setValidationError(
        `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`
      );
      return;
    }

    if (maxSize && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      setValidationError(`File too large. Maximum size is ${maxSizeMB} MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={[
          'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        <div className="text-5xl mb-3">{icon}</div>
        <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">{title}</div>
        <div className="text-sm text-gray-500 dark:text-slate-400">{description}</div>
        {acceptedTypes && (
          <div className="text-xs text-gray-400 dark:text-slate-500 mt-2">
            Accepted: {acceptedTypes.map(t => t.split('/')[1]).join(', ').toUpperCase()}
          </div>
        )}
        {maxSize && (
          <div className="text-xs text-gray-400 dark:text-slate-500">
            Max size: {(maxSize / (1024 * 1024)).toFixed(1)} MB
          </div>
        )}
      </div>

      {validationError && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5 rounded-lg">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          {validationError}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes?.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default FileDropzone;
