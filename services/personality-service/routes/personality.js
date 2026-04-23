const express = require('express');
const { body, param, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const { assessmentLimiter, dailyAssessmentLimiter } = require('../middleware/rateLimiter');

const CareerPersonalityMatch = require('../../auth-service/src/models/CareerPersonalityMatch');

// Assessment model is defined in auth-service. In this monorepo both services
// share the same MongoDB instance, so we reuse the schema registration directly.
// In a polyrepo setup this model definition would be duplicated or extracted to
// a shared package.
const Assessment = require('../../auth-service/src/models/Assessment');

// Quiz questions live in auth-service/src/data — single source of truth so
// both services always serve identical question sets.
const {
  riasecQuestions,
  workValuesQuestions,
  bigFiveQuestions,
} = require('../../auth-service/src/data/quizQuestions');

const {
  calculateFullAssessment,
} = require('../services/scoringService');

const router = express.Router();

// ─── Validation helpers ───────────────────────────────────────────────────────

const TOTAL_QUESTIONS =
  riasecQuestions.length + workValuesQuestions.length + bigFiveQuestions.length;
// 36 + 18 + 20 = 74

/** Collect express-validator errors and short-circuit with 422 if any exist. */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/** Submission validation rules for POST /submit */
const submitValidation = [
  body('answers')
    .isArray({ min: TOTAL_QUESTIONS, max: TOTAL_QUESTIONS })
    .withMessage(`answers must be an array of exactly ${TOTAL_QUESTIONS} items`),

  body('answers.*.questionId')
    .isString()
    .notEmpty()
    .withMessage('Each answer must have a non-empty questionId string'),

  body('answers.*.score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Each score must be an integer between 1 and 5'),
];

// ─── Route 1: GET /api/personality/questions ─────────────────────────────────
//
// Public — no auth required.
// Returns the full question bank split by instrument so the client can render
// each section independently and track progress.

router.get('/questions', (req, res) => {
  res.json({
    success: true,
    data: {
      riasec: riasecQuestions,
      workValues: workValuesQuestions,
      bigFive: bigFiveQuestions,
      totalQuestions: TOTAL_QUESTIONS,
    },
  });
});

// ─── Route 2: POST /api/personality/submit ───────────────────────────────────
//
// Auth required. Validates the full answer set, runs the scoring engine,
// persists the result, and returns the scored assessment with summary.
//
// Per-user daily submission cap (3/day) is enforced via a DB count check
// rather than express-rate-limit because:
//   a) rate-limit runs before auth, so req.user is unavailable there, and
//   b) IP-based limiting would incorrectly throttle users behind shared IPs
//      (corporate networks, NAT, etc.) — common for Indian enterprise users.

router.post(
  '/submit',
  dailyAssessmentLimiter, // IP-level guard; per-user cap enforced below via DB count
  auth,
  submitValidation,
  validate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { answers } = req.body;

      // ── Per-user daily cap ──────────────────────────────────────────────────
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const submissionsToday = await Assessment.countDocuments({
        userId,
        completedAt: { $gte: startOfDay },
      });

      if (submissionsToday >= 3) {
        return res.status(429).json({
          success: false,
          message:
            'You have reached the daily limit of 3 assessment submissions. Please try again tomorrow.',
        });
      }

      // ── Validate all expected question IDs are present ──────────────────────
      const allQuestionIds = new Set([
        ...riasecQuestions.map((q) => q.id),
        ...workValuesQuestions.map((q) => q.id),
        ...bigFiveQuestions.map((q) => q.id),
      ]);

      const answeredIds = new Set(answers.map((a) => a.questionId));
      const missing = [...allQuestionIds].filter((id) => !answeredIds.has(id));

      if (missing.length > 0) {
        return res.status(422).json({
          success: false,
          message: 'Some questions have not been answered',
          missingQuestions: missing,
        });
      }

      // ── Score ───────────────────────────────────────────────────────────────
      const result = calculateFullAssessment(answers, {
        riasecQuestions,
        workValuesQuestions,
        bigFiveQuestions,
      });

      // ── Persist ─────────────────────────────────────────────────────────────
      const assessment = await Assessment.create({
        userId,
        riasec: result.scores.riasec,
        workValues: result.scores.workValues,
        bigFive: result.scores.bigFive,
        // dominantType is derived automatically by the pre-save hook on the model
        completedAt: new Date(),
      });

      res.status(201).json({
        success: true,
        data: {
          assessment,
          summary: result.summary,
          meta: result.meta,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Route 3: GET /api/personality/results/:userId ───────────────────────────
//
// Auth required. Users may only fetch their own results; admin role bypasses
// this restriction. Returns the most recent assessment with the scored summary.

router.get(
  '/results/:userId',
  auth,
  [
    param('userId')
      .isMongoId()
      .withMessage('userId must be a valid MongoDB ObjectId'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const requestedUserId = req.params.userId;
      const requestingUserId = req.user.userId;
      const requestingRole = req.user.role;

      // Authorisation: own record or admin only
      const isOwner = String(requestingUserId) === String(requestedUserId);
      const isAdmin = requestingRole === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorised to view this assessment.',
        });
      }

      const assessment = await Assessment.findLatestByUser(requestedUserId);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'No assessment found for this user. Please complete the personality quiz first.',
        });
      }

      // Re-generate the human-readable summary from stored scores so the
      // summary copy can be updated without re-running the assessment.
      const { generatePersonalitySummary, calculateDominantType } = require('../services/scoringService');

      const summary = generatePersonalitySummary(
        assessment.riasec,
        assessment.workValues,
        assessment.bigFive,
        assessment.dominantType || calculateDominantType(assessment.riasec)
      );

      res.json({
        success: true,
        data: {
          assessment,
          summary,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Scoring helpers (career matching) ───────────────────────────────────────

const RIASEC_FULL = {
  R: 'realistic', I: 'investigative', A: 'artistic',
  S: 'social',    E: 'enterprising',  C: 'conventional',
};

const BIG_FIVE_BAND = (score) => (score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low');

/**
 * Format a raw INR integer into a human-readable lakh string.
 * 1500000 → "₹15L"  |  500000 → "₹5L"
 */
const formatINR = (amount) => `₹${Math.round(amount / 100000)}L`;

/**
 * Build the salary display string from a career's salaryRange.
 * Uses mid-level range as the representative figure; falls back to entry or senior.
 */
const formatSalaryRange = (salaryRange) => {
  const level = salaryRange.mid || salaryRange.senior || salaryRange.entry;
  if (!level) return 'Salary data unavailable';
  return `${formatINR(level.min)} - ${formatINR(level.max)} yearly`;
};

/**
 * Calculate a 0–100 compatibility score between a user's assessment and one career.
 *
 * Weighting:
 *   RIASEC alignment   — 50 pts  (primary predictor of career interest fit)
 *   Work values overlap — 30 pts  (motivational fit)
 *   Big Five alignment  — 20 pts  (personality-environment fit)
 *
 * RIASEC (50 pts):
 *   The user's dominant type is a 3-letter code e.g. "IAS". Each letter that
 *   appears in the career's idealProfile.riasecCodes earns points. The first
 *   letter (primary type) earns 3× weight, second 2×, third 1× — reflecting
 *   that the primary type is the strongest predictor.
 *
 * Work Values (30 pts):
 *   The career's workValuesPriority lists up to 3 values in importance order.
 *   We find the user's top 3 work values (by score) and count how many overlap,
 *   weighted by position in the career's priority list.
 *
 * Big Five (20 pts):
 *   Career specifies 'high'/'medium'/'low'/'any' per trait. We band the user's
 *   score and award full points for exact match, half for adjacent band, zero
 *   for 'any' (no requirement) to avoid penalising neutral traits.
 */
const calculateMatchScore = (career, assessment) => {
  const { riasec, workValues, bigFive } = assessment;
  const { idealProfile } = career;
  let score = 0;

  // ── RIASEC (max 50) ───────────────────────────────────────────────────────
  const userCodes = career.dominantType
    ? career.dominantType.split('')  // shouldn't exist on CareerPersonalityMatch, guard anyway
    : [];

  // We receive dominantType separately — use the codes array from idealProfile
  const careerCodes = new Set(idealProfile.riasecCodes || []);
  const weights = [3, 2, 1]; // primary, secondary, tertiary
  const totalWeight = weights.reduce((a, b) => a + b, 0); // 6

  let riasecRaw = 0;
  // assessment.dominantType is the user's code, passed into this function via closure
  // (handled in the route below)

  // ── Work Values (max 30) ──────────────────────────────────────────────────
  const careerValuePriority = idealProfile.workValuesPriority || [];
  const userTopValues = Object.entries(workValues)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => key);

  let valueScore = 0;
  careerValuePriority.forEach((val, idx) => {
    if (userTopValues.includes(val)) {
      // Earlier positions in career priority list earn more
      valueScore += [15, 10, 5][idx] || 5;
    }
  });
  score += Math.min(valueScore, 30);

  // ── Big Five (max 20) ─────────────────────────────────────────────────────
  const bigFiveIdeal = idealProfile.bigFiveIdeal || {};
  const bigFiveTraits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  const pointsPerTrait = 20 / bigFiveTraits.length; // 4 pts each

  bigFiveTraits.forEach((trait) => {
    const ideal = bigFiveIdeal[trait];
    if (!ideal || ideal === 'any') {
      score += pointsPerTrait; // no requirement — full points
      return;
    }
    const userBand = BIG_FIVE_BAND(bigFive[trait] || 0);
    if (userBand === ideal) {
      score += pointsPerTrait;
    } else if (
      (ideal === 'high'   && userBand === 'medium') ||
      (ideal === 'low'    && userBand === 'medium') ||
      (ideal === 'medium' && userBand !== 'medium')
    ) {
      score += pointsPerTrait / 2; // adjacent band — half credit
    }
  });

  return Math.round(score);
};

/**
 * Compute the RIASEC sub-score separately so calculateMatchScore stays pure.
 * Called in the route where dominantType is available.
 */
const riasecMatchPoints = (userDominantType, careerRiasecCodes) => {
  const careerSet = new Set(careerRiasecCodes || []);
  const userLetters = (userDominantType || '').split('');
  const weights = [3, 2, 1];
  const totalWeight = 6; // 3+2+1
  let raw = 0;
  userLetters.forEach((letter, idx) => {
    if (careerSet.has(letter)) raw += weights[idx] || 1;
  });
  return Math.round((raw / totalWeight) * 50);
};

/**
 * Generate human-readable match reasons for a career.
 * Returns 2–4 bullet strings explaining why this career fits the user.
 */
const buildMatchReasons = (career, assessment, userDominantType, matchedCodes) => {
  const reasons = [];
  const { workValues, bigFive } = assessment;
  const { idealProfile } = career;

  // RIASEC reasons
  matchedCodes.forEach((letter) => {
    const trait = RIASEC_FULL[letter];
    if (!trait) return;
    const traitScore = assessment.riasec[trait] || 0;
    if (traitScore >= 60) {
      const labels = {
        realistic:     'hands-on, practical nature',
        investigative: 'analytical and research-oriented thinking',
        artistic:      'creative and innovative approach',
        social:        'people-first, collaborative mindset',
        enterprising:  'leadership drive and business acumen',
        conventional:  'structured, process-oriented work style',
      };
      reasons.push(`High ${trait.charAt(0).toUpperCase() + trait.slice(1)} score aligns with your ${labels[trait]}`);
    }
  });

  // Work values reason
  const careerValues = idealProfile.workValuesPriority || [];
  const userTopValues = Object.entries(workValues)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key);

  const overlappingValues = careerValues.filter((v) => userTopValues.includes(v));
  if (overlappingValues.length > 0) {
    const valueLabels = {
      autonomy: 'independent work', stability: 'job security',
      creativity: 'creative freedom', impact: 'meaningful contribution',
      growth: 'career growth', workLifeBalance: 'work-life balance',
    };
    reasons.push(
      `Matches your core motivators: ${overlappingValues.map((v) => valueLabels[v]).join(' and ')}`
    );
  }

  // Big Five reason
  if (bigFive.conscientiousness >= 70 && (idealProfile.bigFiveIdeal?.conscientiousness === 'high' || !idealProfile.bigFiveIdeal?.conscientiousness)) {
    reasons.push('Your high conscientiousness signals strong delivery reliability valued in this role');
  }
  if (bigFive.openness >= 70 && idealProfile.bigFiveIdeal?.openness === 'high') {
    reasons.push('Your openness to new ideas aligns with the innovation demands of this career');
  }

  // Demand trend reason
  if (career.demandTrend === 'high_growth') {
    reasons.push('High-growth career with strong hiring demand in the Indian market');
  } else if (career.demandTrend === 'growing') {
    reasons.push('Growing career with expanding opportunities across Indian industries');
  }

  return reasons.slice(0, 4); // cap at 4 for readability
};

// ─── Route 4: GET /api/personality/career-matches/:userId ────────────────────
//
// Returns the top 10 career matches ranked by compatibility with the user's
// latest personality assessment. Auth required; own data only.

router.get(
  '/career-matches/:userId',
  auth,
  [
    param('userId')
      .isMongoId()
      .withMessage('userId must be a valid MongoDB ObjectId'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const requestedUserId = req.params.userId;
      const requestingUserId = req.user.userId;

      if (String(requestingUserId) !== String(requestedUserId) && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You are not authorised to view these career matches.',
        });
      }

      // ── Fetch latest assessment ───────────────────────────────────────────
      const assessment = await Assessment.findLatestByUser(requestedUserId);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: 'Complete assessment first',
          message: 'No personality assessment found. Please complete the quiz before viewing career matches.',
        });
      }

      const { generatePersonalitySummary, calculateDominantType } = require('../services/scoringService');
      const dominantType = assessment.dominantType || calculateDominantType(assessment.riasec);

      // ── Fetch candidate careers via RIASEC codes ──────────────────────────
      const candidateCareers = await CareerPersonalityMatch.findByRiasecCode(dominantType);

      if (candidateCareers.length === 0) {
        return res.json({
          success: true,
          data: { dominantType, matches: [] },
        });
      }

      // ── Score and rank ────────────────────────────────────────────────────
      const scored = candidateCareers.map((career) => {
        // Determine which of the user's dominant letters matched this career
        const userLetters = dominantType.split('');
        const careerCodes = new Set(career.idealProfile?.riasecCodes || []);
        const matchedCodes = userLetters.filter((l) => careerCodes.has(l));

        // Base score from work values + big five components
        const baseScore = calculateMatchScore(career, assessment);
        // Add RIASEC component (computed separately to avoid closure over dominantType)
        const riasecPts = riasecMatchPoints(dominantType, career.idealProfile?.riasecCodes);
        const matchScore = Math.min(baseScore + riasecPts, 100);

        const matchReasons = buildMatchReasons(career, assessment, dominantType, matchedCodes);

        return {
          career: {
            title: career.title,
            slug: career.slug,
            industry: career.industry,
            shortDescription: career.description,
            demandTrend: career.demandTrend,
          },
          matchScore,
          salaryRange: formatSalaryRange(career.salaryRange || {}),
          matchReasons,
        };
      });

      const topMatches = scored
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      res.json({
        success: true,
        data: {
          dominantType,
          matches: topMatches,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Route 5: PUT /api/personality/retake ────────────────────────────────────
//
// Allows a user to check their retake eligibility and declare intent to retake.
// Does not delete prior assessments — history is preserved for trend analysis.
//
// "Setting a flag" is implemented as a DB-count check: the submit endpoint
// already enforces the 3/day cap, so no separate flag field is needed. This
// endpoint validates eligibility and returns the remaining attempts count so
// the frontend can gate the quiz navigation accordingly.
//
// Optional body: { reason } — logged for analytics but not persisted (Assessment
// schema has no reason field; add one if retention is required later).

router.put(
  '/retake',
  dailyAssessmentLimiter,
  auth,
  [
    body('reason')
      .optional()
      .isIn(['career_change', 'life_event', 'recheck'])
      .withMessage('reason must be one of: career_change, life_event, recheck'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { reason } = req.body;

      // Count today's submissions to determine remaining attempts
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const submissionsToday = await Assessment.countDocuments({
        userId,
        completedAt: { $gte: startOfDay },
      });

      const MAX_DAILY = 3;
      const attemptsRemaining = Math.max(0, MAX_DAILY - submissionsToday);

      if (attemptsRemaining === 0) {
        return res.status(429).json({
          success: false,
          message: 'You have used all 3 assessment attempts for today. Please try again tomorrow.',
          attemptsRemaining: 0,
        });
      }

      // reason is intentionally not persisted — add a RetakeLog model if persistence is needed.

      res.json({
        success: true,
        message: 'You can now retake the assessment',
        attemptsRemaining,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
