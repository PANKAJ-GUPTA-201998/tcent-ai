const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { googleRedirect, googleCallback, linkedinRedirect, linkedinCallback } = require('../controllers/oauth.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../utils/validators');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * OAuth Routes — Google
 */
router.get('/google',          googleRedirect);
router.get('/google/callback', googleCallback);

/**
 * OAuth Routes — LinkedIn
 */
router.get('/linkedin',          linkedinRedirect);
router.get('/linkedin/callback', linkedinCallback);

module.exports = router;
