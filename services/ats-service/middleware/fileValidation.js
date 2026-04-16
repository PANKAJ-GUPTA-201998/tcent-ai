// ============================================
// File Validation Middleware - ATS Service
// ============================================
// Validates resume PDF upload for ATS analysis

const multer = require('multer');

const storage = multer.memoryStorage();

const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for ATS analysis'), false);
  }
};

const multerUpload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_RESUME_SIZE) || 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: resumeFileFilter,
}).single('resume'); // Field name must be 'resume'

/**
 * Wraps multer to return clean JSON errors instead of raw Multer errors
 */
const uploadResume = (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum resume size is 5MB.',
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'Unexpected field. Use field name "resume".',
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = { uploadResume };
