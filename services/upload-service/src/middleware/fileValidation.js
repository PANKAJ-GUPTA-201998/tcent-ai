// ============================================
// File Validation Middleware
// ============================================
// Validates file type, size, and basic security checks

const multer = require('multer');

// Store files in memory as buffers
const storage = multer.memoryStorage();

/**
 * File filter for resume uploads
 * Only allows PDF files
 */
const resumeFileFilter = (req, file, cb) => {
  // Check MIME type
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resume upload'), false);
  }
};

/**
 * File filter for profile picture uploads
 * Only allows JPG and PNG
 */
const profilePicFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed for profile pictures'), false);
  }
};

/**
 * Multer config for resume upload
 * Max size: 5MB
 */
const uploadResume = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_RESUME_SIZE) || 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: resumeFileFilter
}).single('resume'); // Field name must be 'resume'

/**
 * Multer config for profile picture upload
 * Max size: 2MB
 */
const uploadProfilePicture = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_PROFILE_PIC_SIZE) || 2 * 1024 * 1024, // 2MB
    files: 1
  },
  fileFilter: profilePicFileFilter
}).single('profilePicture'); // Field name must be 'profilePicture'

/**
 * Handle multer errors
 */
const handleUploadErrors = (uploadFunction) => {
  return (req, res, next) => {
    uploadFunction(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is ' + 
                     (uploadFunction.name === 'uploadResume' ? '5MB' : '2MB')
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected field name. Use "resume" or "profilePicture"'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err) {
        // Custom errors
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
};

module.exports = {
  uploadResume: handleUploadErrors(uploadResume),
  uploadProfilePicture: handleUploadErrors(uploadProfilePicture)
};
