const express = require('express');
const router = express.Router();
const CareerPersonalityMatch = require('../models/CareerPersonalityMatch');

/**
 * GET /api/careers
 * List all active careers.
 * Optional query param: ?industry=technology
 *
 * Returns: { success: true, data: { careers, count } }
 */
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.industry) {
      filter.industry = req.query.industry.toLowerCase();
    }

    const careers = await CareerPersonalityMatch.find(filter)
      .select('title slug description industry demandTrend salaryRange idealProfile.riasecCodes')
      .sort({ title: 1 })
      .lean();

    res.json({
      success: true,
      data: {
        careers,
        count: careers.length
      }
    });

  } catch (err) {
    console.error('GET /api/careers error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch careers'
    });
  }
});

/**
 * GET /api/careers/match/:dominantType
 * Get careers matching a RIASEC dominant type string (e.g. "IAS").
 * Must be declared BEFORE /:slug to avoid "match" being treated as a slug.
 *
 * Returns: { success: true, data: { careers, count, dominantType } }
 */
router.get('/match/:dominantType', async (req, res) => {
  try {
    const { dominantType } = req.params;

    // Validate: 1–3 uppercase RIASEC letters
    if (!/^[RIAESC]{1,3}$/i.test(dominantType)) {
      return res.status(400).json({
        success: false,
        error: 'dominantType must be 1–3 RIASEC letters (e.g. "IAS")'
      });
    }

    const careers = await CareerPersonalityMatch.findByRiasecCode(dominantType);

    res.json({
      success: true,
      data: {
        careers,
        count: careers.length,
        dominantType: dominantType.toUpperCase()
      }
    });

  } catch (err) {
    console.error('GET /api/careers/match/:dominantType error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matching careers'
    });
  }
});

/**
 * GET /api/careers/:slug
 * Get a single career by its slug (e.g. "data-scientist").
 *
 * Returns: { success: true, data: { career } }
 *          { success: false, error: '...' }  (404)
 */
router.get('/:slug', async (req, res) => {
  try {
    const career = await CareerPersonalityMatch.findOne({
      slug: req.params.slug.toLowerCase(),
      isActive: true
    }).lean();

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    res.json({
      success: true,
      data: { career }
    });

  } catch (err) {
    console.error('GET /api/careers/:slug error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch career'
    });
  }
});

module.exports = router;
