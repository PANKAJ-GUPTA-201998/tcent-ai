/**
 * matchingAlgorithm.js — Career Personality Matching Engine
 *
 * Computes a 0–100 compatibility score between a user's psychometric profile
 * and each career in careerPersonalityData.js using three instruments:
 *
 *   RIASEC       — 40 % (interest alignment via weighted trait scores)
 *   Work Values  — 35 % (motivational fit via priority-ordered values)
 *   Big Five     — 25 % (personality-environment fit via band matching)
 *
 * ─── Partial data handling ───────────────────────────────────────────────────
 * If bigFive scores are absent or all-zero the algorithm reweights automatically:
 *   RIASEC → 55 %   Work Values → 45 %   Big Five → 0 %
 * This lets the system produce useful matches even before a full assessment.
 *
 * ─── Scoring conventions ────────────────────────────────────────────────────
 * Scores are normalised 0–100 by scoringService.js (see that module for band
 * thresholds: ≥70 high, ≥40 medium, <40 low).
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const { CAREERS } = require('./careerPersonalityData');

// ─── Internal constants ───────────────────────────────────────────────────────

const BIG_FIVE_TRAITS = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'neuroticism',
];

// Position weights for workValuesIdeal[0..2].
// Index 0 = primary motivator carries 50 % of work-values contribution.
const VALUE_POSITION_WEIGHTS = [0.50, 0.35, 0.15];

// Human-readable labels used inside reason strings
const RIASEC_TRAIT_PHRASES = {
  realistic:     'practical, hands-on approach',
  investigative: 'analytical and research-oriented mindset',
  artistic:      'creative and innovative thinking',
  social:        'people-focused, collaborative nature',
  enterprising:  'leadership drive and business acumen',
  conventional:  'structured, process-oriented work style',
};

const WORK_VALUE_PHRASES = {
  autonomy:        'independent work',
  stability:       'job security',
  creativity:      'creative freedom',
  impact:          'meaningful impact',
  growth:          'career growth',
  workLifeBalance: 'work-life balance',
};

// Per-trait insight for Big Five reason strings: [pref_band] → sentence fragment
const BIG_FIVE_INSIGHTS = {
  openness: {
    high:   'your high openness suits the innovative, exploratory nature of this career',
    low:    'your preference for structure aligns well with the defined scope of this role',
  },
  conscientiousness: {
    high:   'your high conscientiousness signals the delivery reliability this role demands',
    medium: 'your balanced approach blends well with this role\'s mix of flexibility and accountability',
    low:    'this role\'s fluid environment complements your exploratory work style',
  },
  extraversion: {
    high:   'your extraverted energy suits the collaborative, client-facing aspects of this career',
    low:    'your focused, independent style fits the deep-work nature of this role',
    medium: 'your adaptable social style works across both collaborative and solo aspects of the role',
  },
  agreeableness: {
    high:   'your cooperative, empathetic nature is a strong asset in the team-based work involved',
    low:    'your direct, assertive style suits the decision-making and negotiation demands here',
  },
  neuroticism: {
    low:    'your emotional steadiness is a key advantage in the high-stakes environments of this career',
    medium: 'your moderate stress tolerance is well-matched to the variable pace of this role',
    high:   'this role\'s structured, predictable environment aligns with your preference for stability',
  },
};

// ─── Band helper ──────────────────────────────────────────────────────────────

/**
 * Convert a 0–100 score to a band label.
 * Thresholds match scoringService.js: ≥70 high, ≥40 medium, <40 low.
 *
 * @param {number} score
 * @returns {'high'|'medium'|'low'}
 */
const bandOf = (score) => (score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low');

// ─── Data presence checks ─────────────────────────────────────────────────────

/**
 * True when the bigFive object exists and contains at least one non-zero score.
 * A zero-filled object indicates the instrument was skipped or not yet scored.
 */
const hasBigFiveData = (bigFive) =>
  bigFive != null && Object.values(bigFive).some((v) => v > 0);

// ─── Sub-scorers (return 0–1 normalised) ─────────────────────────────────────

/**
 * RIASEC alignment — 0.0 to 1.0
 *
 * Strategy: weighted dot product between the user's normalised RIASEC scores
 * and the career's riasecWeights.
 *
 * Because riasecWeights always sums to 1.0, the result is naturally bounded
 * [0, 1] when user scores ∈ [0, 100] are divided by 100.
 *
 * @param {{ realistic, investigative, artistic, social, enterprising, conventional }} riasec
 * @param {{ [traitName]: number }} riasecWeights  — values sum to 1.0
 * @returns {number}  0.0–1.0
 */
const computeRiasecRaw = (riasec, riasecWeights) => {
  let raw = 0;
  for (const [trait, weight] of Object.entries(riasecWeights)) {
    raw += ((riasec[trait] ?? 0) / 100) * weight;
  }
  return Math.min(1, raw); // clamp for safety
};

/**
 * Work Values alignment — 0.0 to 1.0
 *
 * Strategy: the career's top-priority value contributes 50 %, the second 35 %,
 * the third 15 % of the work-values sub-score (matching VALUE_POSITION_WEIGHTS).
 * Each contribution is the user's normalised score for that value.
 *
 * @param {{ autonomy, stability, creativity, impact, growth, workLifeBalance }} workValues
 * @param {string[]} workValuesIdeal  — ordered array, up to 3 entries
 * @returns {number}  0.0–1.0
 */
const computeWorkValuesRaw = (workValues, workValuesIdeal) => {
  let raw = 0;
  workValuesIdeal.forEach((valueKey, idx) => {
    const posWeight = VALUE_POSITION_WEIGHTS[idx] ?? 0.10;
    raw += ((workValues[valueKey] ?? 0) / 100) * posWeight;
  });
  return Math.min(1, raw);
};

/**
 * Big Five alignment — raw points (0 to `maxPoints`)
 *
 * Strategy: for each of the 5 OCEAN traits:
 *   - Preference "any"  → full points (trait not predictive for this career)
 *   - Exact band match  → full points
 *   - Adjacent band     → half points  (e.g. career wants "high", user is "medium")
 *   - Opposite band     → 0 points     (e.g. career wants "high", user is "low")
 *
 * @param {{ openness, conscientiousness, extraversion, agreeableness, neuroticism }} bigFive
 * @param {{ [trait]: 'high'|'medium'|'low'|'any' }} bigFivePreference
 * @param {number} maxPoints  — total points available for Big Five sub-score
 * @returns {number}  0 to maxPoints
 */
const computeBigFivePoints = (bigFive, bigFivePreference, maxPoints) => {
  const perTrait = maxPoints / BIG_FIVE_TRAITS.length;
  let points = 0;

  BIG_FIVE_TRAITS.forEach((trait) => {
    const pref = bigFivePreference[trait];

    // No preference specified — award full credit; trait does not discriminate.
    if (!pref || pref === 'any') {
      points += perTrait;
      return;
    }

    const userBand = bandOf(bigFive[trait] ?? 50);

    if (userBand === pref) {
      // Perfect match
      points += perTrait;
    } else if (
      (pref === 'high'   && userBand === 'medium') ||
      (pref === 'low'    && userBand === 'medium') ||
      (pref === 'medium' && userBand !== 'medium')
    ) {
      // One band away — partial credit
      points += perTrait * 0.5;
    }
    // Opposite band (high vs low): 0 points — no increment
  });

  return points;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * calculateCareerMatch
 *
 * Computes a 0–100 compatibility score between one user profile and one career.
 *
 * @param {Object} userProfile
 *   @param {{ realistic, investigative, artistic, social, enterprising, conventional }} userProfile.riasec
 *   @param {{ autonomy, stability, creativity, impact, growth, workLifeBalance }}       userProfile.workValues
 *   @param {{ openness, conscientiousness, extraversion, agreeableness, neuroticism }}  [userProfile.bigFive]
 *   @param {string} [userProfile.dominantType]  — e.g. "IAS" (optional; not used in scoring but may be useful to callers)
 *
 * @param {Object} career  — a career entry from careerPersonalityData.js
 *
 * @returns {{
 *   score: number,                     // 0–100 final compatibility score
 *   breakdown: {
 *     riasec:     { points: number, max: number, pct: number },
 *     workValues: { points: number, max: number, pct: number },
 *     bigFive:    { points: number, max: number, pct: number|null },
 *   }
 * }}
 */
const calculateCareerMatch = (userProfile, career) => {
  const { riasec, workValues, bigFive } = userProfile;

  // ── Determine weights based on available data ─────────────────────────────
  const useBigFive = hasBigFiveData(bigFive);

  const MAX_RIASEC      = useBigFive ? 40 : 55;
  const MAX_WORK_VALUES = useBigFive ? 35 : 45;
  const MAX_BIG_FIVE    = useBigFive ? 25 :  0;

  // ── RIASEC sub-score ──────────────────────────────────────────────────────
  let riasecPoints = 0;
  if (riasec) {
    const raw = computeRiasecRaw(riasec, career.riasecWeights);
    riasecPoints = Math.round(raw * MAX_RIASEC);
  }

  // ── Work Values sub-score ─────────────────────────────────────────────────
  let workValuesPoints = 0;
  if (workValues) {
    const raw = computeWorkValuesRaw(workValues, career.workValuesIdeal);
    workValuesPoints = Math.round(raw * MAX_WORK_VALUES);
  }

  // ── Big Five sub-score ────────────────────────────────────────────────────
  let bigFivePoints = 0;
  if (useBigFive) {
    bigFivePoints = Math.round(computeBigFivePoints(bigFive, career.bigFivePreference, MAX_BIG_FIVE));
  }

  const totalScore = Math.min(100, riasecPoints + workValuesPoints + bigFivePoints);

  return {
    score: totalScore,
    breakdown: {
      riasec: {
        points: riasecPoints,
        max:    MAX_RIASEC,
        pct:    MAX_RIASEC > 0 ? Math.round((riasecPoints / MAX_RIASEC) * 100) : 0,
      },
      workValues: {
        points: workValuesPoints,
        max:    MAX_WORK_VALUES,
        pct:    MAX_WORK_VALUES > 0 ? Math.round((workValuesPoints / MAX_WORK_VALUES) * 100) : 0,
      },
      bigFive: {
        points: bigFivePoints,
        max:    MAX_BIG_FIVE,
        pct:    useBigFive ? Math.round((bigFivePoints / MAX_BIG_FIVE) * 100) : null,
      },
    },
  };
};

/**
 * generateMatchReasons
 *
 * Produces 2–3 human-readable sentences explaining why a career matches the user.
 * Reasons are ordered: RIASEC first (strongest predictor), then Work Values, then
 * Big Five. A fallback reason is appended when fewer than 2 explanations fire.
 *
 * @param {Object} userProfile  — same shape as calculateCareerMatch's first param
 * @param {Object} career       — career entry from careerPersonalityData.js
 * @param {Object} matchResult  — return value of calculateCareerMatch
 *
 * @returns {string[]}  2–3 reason strings
 */
const generateMatchReasons = (userProfile, career, matchResult) => {
  const { riasec, workValues, bigFive } = userProfile;
  const reasons = [];

  // ── Reason 1: RIASEC ───────────────────────────────────────────────────────
  if (riasec && matchResult.breakdown.riasec.pct >= 45) {
    // Find the career's highest-weighted trait and check if user scores strongly there
    const topCareerEntry = Object.entries(career.riasecWeights)
      .sort(([, a], [, b]) => b - a)[0];

    if (topCareerEntry) {
      const [topTrait, topWeight] = topCareerEntry;
      const userScore = riasec[topTrait] ?? 0;

      // Report on the primary trait if user scores ≥60 there
      if (userScore >= 60) {
        const phrase = RIASEC_TRAIT_PHRASES[topTrait] ?? topTrait;
        const label = topTrait.charAt(0).toUpperCase() + topTrait.slice(1);
        reasons.push(
          `Your ${label} score (${userScore}%) reflects a ${phrase} that is central to succeeding as a ${career.title}.`
        );
      } else {
        // User's Holland code overall aligns with career code even if top trait is weak
        const userTopTrait = Object.entries(riasec).sort(([, a], [, b]) => b - a)[0];
        if (userTopTrait && career.riasecCode.includes(
          { realistic:'R', investigative:'I', artistic:'A', social:'S', enterprising:'E', conventional:'C' }[userTopTrait[0]] ?? ''
        )) {
          const phrase = RIASEC_TRAIT_PHRASES[userTopTrait[0]] ?? userTopTrait[0];
          const label = userTopTrait[0].charAt(0).toUpperCase() + userTopTrait[0].slice(1);
          reasons.push(`Your dominant ${label} interest (${userTopTrait[1]}%) aligns with the core demands of a ${career.title}.`);
        }
      }
    }
  }

  // ── Reason 2: Work Values ──────────────────────────────────────────────────
  if (workValues && matchResult.breakdown.workValues.pct >= 40) {
    // Find which of the career's ideal values the user also prioritises
    const userTopValues = Object.entries(workValues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k]) => k);

    const overlapping = career.workValuesIdeal.filter((v) => userTopValues.includes(v));

    if (overlapping.length >= 2) {
      const labels = overlapping.slice(0, 2).map((v) => WORK_VALUE_PHRASES[v] ?? v);
      reasons.push(
        `Your top motivators — ${labels.join(' and ')} — are core to what makes this role fulfilling.`
      );
    } else if (overlapping.length === 1) {
      const label = WORK_VALUE_PHRASES[overlapping[0]] ?? overlapping[0];
      reasons.push(
        `This role strongly satisfies your desire for ${label}, one of your primary career motivators.`
      );
    } else if (matchResult.breakdown.workValues.pct >= 55) {
      // Values overlap indirectly — acknowledge the good match without naming traits
      reasons.push(
        `The work environment for a ${career.title} aligns well with your overall motivational profile.`
      );
    }
  }

  // ── Reason 3: Big Five ─────────────────────────────────────────────────────
  if (hasBigFiveData(bigFive) && matchResult.breakdown.bigFive.pct >= 50) {
    // Surface the first trait where user band exactly matches the career's preference
    let bf5Reason = null;

    for (const trait of BIG_FIVE_TRAITS) {
      const pref = career.bigFivePreference[trait];
      if (!pref || pref === 'any') continue;

      const userBand = bandOf(bigFive[trait] ?? 50);
      if (userBand === pref) {
        const insight = BIG_FIVE_INSIGHTS[trait]?.[pref];
        if (insight) {
          bf5Reason = insight.charAt(0).toUpperCase() + insight.slice(1) + '.';
          break;
        }
      }
    }

    // Fall back to a medium-band match if no exact match produced a reason
    if (!bf5Reason) {
      for (const trait of BIG_FIVE_TRAITS) {
        const pref = career.bigFivePreference[trait];
        if (!pref || pref === 'any') continue;
        const userBand = bandOf(bigFive[trait] ?? 50);
        if (userBand !== pref) continue;
        const insight = BIG_FIVE_INSIGHTS[trait]?.[userBand];
        if (insight) {
          bf5Reason = insight.charAt(0).toUpperCase() + insight.slice(1) + '.';
          break;
        }
      }
    }

    if (bf5Reason) reasons.push(bf5Reason);
  }

  // ── Fallback: ensure at least 2 reasons exist ─────────────────────────────
  if (reasons.length < 2) {
    const scoreLabel =
      matchResult.score >= 80 ? 'an excellent'
      : matchResult.score >= 65 ? 'a strong'
      : 'a solid';

    reasons.push(
      `Your overall psychometric profile shows ${scoreLabel} fit with the demands of a ${career.title} role.`
    );
  }

  // Never return more than 3 (keeps UI scannable)
  return reasons.slice(0, 3);
};

/**
 * getTopCareerMatches
 *
 * Scores all 30 careers against the user profile, sorts descending, and returns
 * the top N entries with their scores, breakdowns, and match reasons.
 *
 * @param {Object} userProfile   — see calculateCareerMatch signature
 * @param {Object} [options]
 *   @param {number}   [options.limit=10]           — max results to return
 *   @param {string}   [options.industry]           — optional industry filter applied before scoring
 *   @param {number}   [options.minScore=0]         — exclude results below this score
 *
 * @returns {Array<{
 *   career: {
 *     id, title, description, industry,
 *     riasecCode, salaryRange, growthOutlook, demandTrend, transitionFrom
 *   },
 *   matchScore: number,
 *   breakdown: Object,
 *   reasons: string[],
 * }>}
 */
const getTopCareerMatches = (userProfile, options = {}) => {
  const { limit = 10, industry = null, minScore = 0 } = options;

  // Optionally pre-filter by industry
  const pool = industry
    ? CAREERS.filter((c) => c.industry === industry)
    : CAREERS;

  const scored = pool.map((career) => {
    const matchResult = calculateCareerMatch(userProfile, career);
    const reasons     = generateMatchReasons(userProfile, career, matchResult);

    return {
      career: {
        id:            career.id,
        title:         career.title,
        description:   career.description,
        industry:      career.industry,
        riasecCode:    career.riasecCode,
        salaryRange:   career.salaryRange,
        growthOutlook: career.growthOutlook,
        demandTrend:   career.demandTrend,
        transitionFrom: career.transitionFrom,
      },
      matchScore: matchResult.score,
      breakdown:  matchResult.breakdown,
      reasons,
    };
  });

  return scored
    .filter((r) => r.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  calculateCareerMatch,
  generateMatchReasons,
  getTopCareerMatches,

  // Expose helpers for unit tests
  _internal: {
    bandOf,
    hasBigFiveData,
    computeRiasecRaw,
    computeWorkValuesRaw,
    computeBigFivePoints,
  },
};
