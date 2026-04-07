// ============================================
// Upload Routes
// ============================================
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/auth');
const { uploadResume: uploadResumeMiddleware, uploadProfilePicture } = require('../middleware/fileValidation');

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Upload Service',
    status: 'running'
  });
});

// Protected routes
router.post(
  '/resume',
  verifyToken,
  uploadResumeMiddleware,
  uploadController.uploadResume
);

router.post(
  '/profile-picture',
  verifyToken,
  uploadProfilePicture,
  uploadController.uploadProfilePicture
);

router.get(
  '/my-files',
  verifyToken,
  uploadController.getMyFiles
);

router.get(
  '/file/:fileId',
  verifyToken,
  uploadController.getFile
);

module.exports = router;
