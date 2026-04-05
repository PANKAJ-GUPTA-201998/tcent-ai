// ============================================
// ResumeUpload Component
// ============================================
// Complete resume upload with drag-drop and progress

import React, { useState } from 'react';
import FileDropzone from './FileDropzone';
import UploadProgress from './UploadProgress';
import { uploadResume } from '../../services/uploadService';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [sections, setSections] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
    setUploadedFile(null);
    setExtractedText(null);
    setSections(null);
    setUploadProgress(0);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadResume(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      // Upload successful - log full response to debug
      console.log('Upload response:', result);
      console.log('extractedText:', result.extractedText);
      console.log('sections:', result.sections);

      setUploadedFile(result.file);
      setExtractedText(result.extractedText || result.file?.extractedText || null);
      setSections(result.sections || result.file?.sections || null);
      setSelectedFile(null);

      // Save resume URL to user profile (if needed)
      localStorage.setItem('resumeUrl', result.file.url);

    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message || 'Failed to upload resume');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete uploaded resume
  const handleDelete = () => {
    setUploadedFile(null);
    setExtractedText(null);
    setSections(null);
    setSelectedFile(null);
    setUploadProgress(0);
    localStorage.removeItem('resumeUrl');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📄 Upload Your Resume
        </h2>
        <p className="text-gray-600">
          Upload your resume (PDF only, max 5MB) for AI-powered review and analysis
        </p>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Show dropzone if no file uploaded */}
        {!uploadedFile && (
          <>
            <FileDropzone
              onFileSelect={handleFileSelect}
              acceptedTypes={['application/pdf']}
              maxSize={5 * 1024 * 1024} // 5MB
              disabled={isUploading}
              icon="📄"
              title="Drop your resume here"
              description="or click to browse (PDF only)"
            />

            {/* Selected file info */}
            {selectedFile && (
              <div className="mt-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <div className="font-medium text-gray-800">
                        {selectedFile.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Upload button */}
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isUploading ? '⏳ Uploading...' : '📤 Upload Resume'}
                </button>
              </div>
            )}

            {/* Upload progress */}
            {isUploading && (
              <div className="mt-6">
                <UploadProgress
                  progress={uploadProgress}
                  fileName={selectedFile?.name || 'resume.pdf'}
                />
              </div>
            )}
          </>
        )}

        {/* Uploaded file display */}
        {uploadedFile && (
          <div className="text-center">
            {/* Success icon */}
            <div className="text-6xl mb-4">✅</div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Resume Uploaded Successfully!
            </h3>
            
            <p className="text-gray-600 mb-6">
              Your resume has been uploaded and processed
            </p>

            {/* File details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">File Name</div>
                  <div className="font-medium text-gray-800">
                    {uploadedFile.name}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Pages</div>
                  <div className="font-medium text-gray-800">
                    {uploadedFile.pages || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Size</div>
                  <div className="font-medium text-gray-800">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Uploaded</div>
                  <div className="font-medium text-gray-800">
                    {new Date(uploadedFile.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume sections detected */}
            {sections && (
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-green-800 mb-2">
                  ✓ Sections Detected:
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {sections.hasEmail && (
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                      Email
                    </span>
                  )}
                  {sections.hasPhone && (
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                      Phone
                    </span>
                  )}
                  {sections.hasExperience && (
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                      Experience
                    </span>
                  )}
                  {sections.hasEducation && (
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                      Education
                    </span>
                  )}
                  {sections.hasSkills && (
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                      Skills
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href={uploadedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                👁️ View Resume
              </a>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-red-600">⚠️</span>
              <p className="text-sm text-red-700 flex-1">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Resume Content - outside upload card */}
      {extractedText && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📄 Extracted Resume Content
          </h3>

          {/* Section badges */}
          {sections && (
            <div className="flex flex-wrap gap-2 mb-4">
              {sections.hasEmail && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  ✉️ Email
                </span>
              )}
              {sections.hasPhone && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  📞 Phone
                </span>
              )}
              {sections.hasExperience && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  💼 Experience
                </span>
              )}
              {sections.hasEducation && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  🎓 Education
                </span>
              )}
              {sections.hasSkills && (
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                  🛠️ Skills
                </span>
              )}
            </div>
          )}

          {/* Scrollable extracted text */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Raw extracted text</span>
              <span className="text-xs text-gray-400">
                {extractedText.length.toLocaleString()} characters
              </span>
            </div>
            <pre className="p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-y-auto max-h-64">
              {extractedText}
            </pre>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for best results:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Use a clear, well-formatted PDF</li>
          <li>Include contact information</li>
          <li>List your experience and education</li>
          <li>Add relevant skills and keywords</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;
