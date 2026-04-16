import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

const ResumeUpload = ({ file, onChange }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (selected) => {
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }
    onChange(selected);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <FileText size={20} className="text-blue-500" />
        Your Resume
      </h2>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex-1 min-h-[280px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 select-none
              ${dragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
              }`}
          >
            <motion.div
              animate={dragging ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-3 text-center px-6"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Upload size={26} className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {dragging ? 'Drop your PDF here' : 'Drop PDF or click to upload'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  PDF only · Max 5MB
                </p>
              </div>
            </motion.div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-h-[280px] flex flex-col items-center justify-center border-2 border-green-400 dark:border-green-600 rounded-xl bg-green-50 dark:bg-green-900/10 p-6"
          >
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-green-500" />
            </div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-center break-all">
              {file.name}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {(file.size / 1024).toFixed(1)} KB · PDF
            </p>
            <button
              onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ''; }}
              className="mt-5 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              <X size={14} />
              Remove
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUpload;
