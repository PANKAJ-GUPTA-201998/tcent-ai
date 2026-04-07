// ============================================
// ResumeUpload Component
// ============================================

import React, { useState } from 'react';
import { ExternalLink, Trash2, AlertCircle } from 'lucide-react';
import FileDropzone from './FileDropzone';
import UploadProgress from './UploadProgress';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { uploadResume } from '../../services/uploadService';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [sections, setSections] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
    setUploadedFile(null);
    setExtractedText(null);
    setSections(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadResume(selectedFile, setUploadProgress);
      setUploadedFile(result.file);
      setExtractedText(result.extractedText || result.file?.extractedText || null);
      setSections(result.sections || result.file?.sections || null);
      setSelectedFile(null);
      localStorage.setItem('resumeUrl', result.file.url);
    } catch (err) {
      setError(err.message || 'Failed to upload resume. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setExtractedText(null);
    setSections(null);
    setSelectedFile(null);
    setUploadProgress(0);
    localStorage.removeItem('resumeUrl');
  };

  const SECTION_BADGES = [
    { key: 'hasEmail',      label: 'Email',      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { key: 'hasPhone',      label: 'Phone',      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { key: 'hasExperience', label: 'Experience', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { key: 'hasEducation',  label: 'Education',  color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { key: 'hasSkills',     label: 'Skills',     color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Upload Your Resume</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm">
          PDF only, max 5 MB — AI will extract and analyse your skills automatically.
        </p>
      </div>

      {/* Upload card */}
      <Card>
        {!uploadedFile && (
          <>
            <FileDropzone
              onFileSelect={handleFileSelect}
              acceptedTypes={['application/pdf']}
              maxSize={5 * 1024 * 1024}
              disabled={isUploading}
              icon="📄"
              title="Drop your resume here"
              description="or click to browse (PDF only)"
            />

            {selectedFile && (
              <div className="mt-5">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  loading={isUploading}
                  onClick={handleUpload}
                  className="w-full mt-4"
                >
                  {isUploading ? 'Uploading…' : 'Upload Resume'}
                </Button>
              </div>
            )}

            {isUploading && (
              <div className="mt-5">
                <UploadProgress
                  progress={uploadProgress}
                  fileName={selectedFile?.name || 'resume.pdf'}
                />
              </div>
            )}
          </>
        )}

        {/* Success state */}
        {uploadedFile && (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
              Resume Uploaded Successfully
            </h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
              Your resume has been processed and is ready for analysis.
            </p>

            {/* File details */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 mb-4 text-left">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'File Name', value: uploadedFile.name },
                  { label: 'Pages',     value: uploadedFile.pages || 'N/A' },
                  { label: 'Size',      value: `${(uploadedFile.size / 1024).toFixed(1)} KB` },
                  { label: 'Uploaded',  value: new Date(uploadedFile.uploadedAt).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-gray-500 dark:text-slate-400 text-xs">{label}</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detected sections */}
            {sections && (
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                {SECTION_BADGES.filter(b => sections[b.key]).map(b => (
                  <span key={b.key} className={`px-3 py-1 rounded-full text-xs font-medium ${b.color}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href={uploadedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="primary" icon={<ExternalLink size={15} />} className="w-full">
                  View Resume
                </Button>
              </a>
              <Button variant="danger" icon={<Trash2 size={15} />} onClick={handleDelete} className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </Card>

      {/* Extracted text */}
      {extractedText && (
        <Card title="Extracted Resume Content" className="mt-6">
          {sections && (
            <div className="flex flex-wrap gap-2 mb-4">
              {SECTION_BADGES.filter(b => sections[b.key]).map(b => (
                <span key={b.key} className={`px-3 py-1 rounded-full text-xs font-medium ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>
          )}
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Raw extracted text</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">{extractedText.length.toLocaleString()} chars</span>
            </div>
            <pre className="p-4 text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-y-auto max-h-64 bg-white dark:bg-slate-900">
              {extractedText}
            </pre>
          </div>
        </Card>
      )}

      {/* Tips */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm">Tips for best results</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
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
