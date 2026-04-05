// ============================================
// FileDropzone Component
// ============================================
// Reusable drag-and-drop file upload zone

import React, { useState, useRef } from 'react';

const FileDropzone = ({ 
  onFileSelect, 
  acceptedTypes, 
  maxSize, 
  disabled,
  icon = '📄',
  title = 'Drag & Drop',
  description = 'or click to browse'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
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
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Validate and process file
  const handleFileSelection = (file) => {
    // Check file type
    if (acceptedTypes && !acceptedTypes.includes(file.type)) {
      alert(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      alert(`File too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    // Call parent handler
    onFileSelect(file);
  };

  // Trigger file input click
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      {/* Dropzone area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Icon */}
        <div className="text-5xl mb-3">
          {icon}
        </div>

        {/* Title */}
        <div className="text-lg font-medium text-gray-700 mb-1">
          {title}
        </div>

        {/* Description */}
        <div className="text-sm text-gray-500">
          {description}
        </div>

        {/* Accepted types */}
        {acceptedTypes && (
          <div className="text-xs text-gray-400 mt-2">
            Accepted: {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()}
          </div>
        )}

        {/* Max size */}
        {maxSize && (
          <div className="text-xs text-gray-400">
            Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
          </div>
        )}
      </div>

      {/* Hidden file input */}
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
