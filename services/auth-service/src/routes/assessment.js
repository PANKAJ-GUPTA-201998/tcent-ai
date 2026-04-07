const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const { protect } = require('../middleware/auth.middleware');

// All routes require a valid JWT
router.use(protect);

/**
 * POST /api/assessments
 * Save a new assessment for the logged-in user.
 *
 * Body: { riasec, workValues, bigFive }
 * Returns: { success: true, data: { assessment } }
 */
router.post('/', async (req, res) => {
  try {
    const { riasec, workValues, bigFive } = req.body;

    // Basic presence check — schema validators handle value ranges
    if (!riasec || !workValues || !bigFive) {
      return res.status(400).json({
        success: false,
        error: 'riasec, workValues, and bigFive are all required'
      });
    }

    const assessment = await Assessment.create({
      userId: req.user._id,
      riasec,
      workValues,
      bigFive
      // dominantType is auto-calculated by pre-save hook
    });

    res.status(201).json({
      success: true,
      data: { assessment }
    });

  } catch (err) {
    console.error('POST /api/assessments error:', err);

    // Mongoose validation error — surface the message clearly
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to save assessment'
    });
  }
});

/**
 * GET /api/assessments/latest
 * Return the most recent assessment for the logged-in user.
 *
 * Returns: { success: true, data: { assessment } }
 *          { success: false, error: 'No assessment found' }  (404)
 */
router.get('/latest', async (req, res) => {
  try {
    const assessment = await Assessment.findLatestByUser(req.user._id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'No assessment found. Please complete the assessment first.'
      });
    }

    res.json({
      success: true,
      data: { assessment }
    });

  } catch (err) {
    console.error('GET /api/assessments/latest error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest assessment'
    });
  }
});

/**
 * GET /api/assessments/history
 * Return all assessments for the logged-in user, newest first.
 *
 * Returns: { success: true, data: { assessments, count } }
 */
router.get('/history', async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        assessments,
        count: assessments.length
      }
    });

  } catch (err) {
    console.error('GET /api/assessments/history error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assessment history'
    });
  }
});

module.exports = router;
