const express = require('express');
const router = express.Router();
const {
  getProfile,
  createOrUpdateProfile,
  deleteProfile,
} = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected (require JWT token)

// GET /api/profile - Get user profile
router.get('/', authMiddleware, getProfile);

// POST /api/profile - Create or update profile
router.post('/', authMiddleware, createOrUpdateProfile);

// DELETE /api/profile - Delete profile
router.delete('/', authMiddleware, deleteProfile);

module.exports = router;
