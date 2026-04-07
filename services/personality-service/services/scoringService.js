/**
 * scoringService.js — Personality Assessment Scoring Engine
 *
 * Handles all score computation for the three assessment instruments:
 *   1. RIASEC  — Holland's career typology (6 traits, 6 questions each)
 *   2. Work Values — intrinsic/extrinsic motivators (6 values, 3 questions each)
 *   3. Big Five (OCEAN) — personality dimensions (5 traits, 4 questions each)
 *
 * ─── Scoring conventions ────────────────────────────────────────────────────
 *  Raw input : Likert 1–5 per question
 *  Reverse items (direction: "negative"): adjusted = 6 − raw
 *  Trait raw total  : sum of adjusted scores for all questions in the trait
 *  Normalisation    : 0–100 scale so results are comparable across instruments
 *    score_0_100 = ((rawTotal − minPossible) / (maxPossible − minPossible)) × 100
 *  All output percentages are rounded to the nearest integer.
 * ────────────────────────────────────────────────────────────────────────────
 */

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Invert a Likert score for a reverse-keyed item.
 * Scale is always 1–5, so the formula is constant.
 */
const reverseScore = (raw) => 6 - raw;

/**
 * Given an answers array and a single question object, return the adjusted score.
 * Falls back to the midpoint (3) when the question has no answer, so unanswered
 * items neither inflate nor deflate trait totals.
 *
 * @param {Array<{questionId: string, score: number}>} answers
 * @param {{id: string, direction: string}} question
 * @returns {number} adjusted score 1–5
 */
const getAdjustedScore = (answers, question) => {
  const answer = answers.find((a) => a.questionId === question.id);
  const raw = answer ? answer.score : 3; // neutral fallback for missing answers
  return question.direction === 'negative' ? reverseScore(raw) : raw;
};

/**
 * Aggregate adjusted scores for all questions belonging to a given trait,
 * then normalise to 0–100.
 *
 * @param {Array<{questionId: string, score: number}>} answers
 * @param {Array<Object>} questions  — full question bank for this instrument
 * @param {string} trait            — trait name to filter on
 * @returns {number} normalised score 0–100
 */
const scoreOneTrait = (answers, questions, trait) => {
  const traitQuestions = questions.filter((q) => q.trait === trait);
  if (traitQuestions.length === 0) return 0;

  const n = traitQuestions.length;
  const minPossible = n * 1; // all scores = 1
  const maxPossible = n * 5; // all scores = 5

  const rawTotal = traitQuestions.reduce(
    (sum, q) => sum + getAdjustedScore(answers, q),
    0
  );

  const normalised = ((rawTotal - minPossible) / (maxPossible - minPossible)) * 100;
  return Math.round(normalised);
};

// ─── 1. RIASEC ───────────────────────────────────────────────────────────────

/**
 * Calculate normalised RIASEC scores.
 *
 * All 6 RIASEC questions are positive-keyed, so no reversals occur here.
 * Min possible per trait: 6 × 1 = 6. Max: 6 × 5 = 30.
 *
 * @param {Array<{questionId: string, score: number}>} answers
 * @param {Array<Object>} questions — riasecQuestions array
 * @returns {{ realistic, investigative, artistic, social, enterprising, conventional }}
 *           each value 0–100
 */
const calculateRiasecScores = (answers, questions) => {
  const traits = [
    'realistic',
    'investigative',
    'artistic',
    'social',
    'enterprising',
    'conventional',
  ];

  return traits.reduce((acc, trait) => {
    acc[trait] = scoreOneTrait(answers, questions, trait);
    return acc;
  }, {});
};

// ─── 2. Dominant RIASEC type ─────────────────────────────────────────────────

/**
 * Derive the three-letter Holland code from RIASEC scores.
 *
 * The code is formed by the first letters of the top-3 scoring types,
 * capitalised, sorted descending by score (ties broken alphabetically
 * to ensure deterministic output).
 *
 * Examples: scores { R:80, I:75, A:60, S:55, E:50, C:45 } → "RIA"
 *
 * @param {{ realistic, investigative, artistic, social, enterprising, conventional }} riasecScores
 * @returns {string} three-letter code e.g. "IAS"
 */
const calculateDominantType = (riasecScores) => {
  const INITIAL = {
    realistic: 'R',
    investigative: 'I',
    artistic: 'A',
    social: 'S',
    enterprising: 'E',
    conventional: 'C',
  };

  const ranked = Object.entries(riasecScores)
    .sort(([traitA, scoreA], [traitB, scoreB]) =>
      scoreB !== scoreA ? scoreB - scoreA : traitA.localeCompare(traitB)
    )
    .slice(0, 3)
    .map(([trait]) => INITIAL[trait]);

  return ranked.join('');
};

// ─── 3. Work Values ──────────────────────────────────────────────────────────

/**
 * Calculate normalised Work Values scores.
 *
 * Each value has 3 questions; 1 is reverse-keyed (direction: "negative").
 * Min per value: 3 × 1 = 3. Max: 3 × 5 = 15.
 *
 * @param {Array<{questionId: string, score: number}>} answers
 * @param {Array<Object>} questions — workValuesQuestions array
 * @returns {{ autonomy, stability, creativity, impact, growth, workLifeBalance }}
 *           each value 0–100
 */
const calculateWorkValuesScores = (answers, questions) => {
  const values = [
    'autonomy',
    'stability',
    'creativity',
    'impact',
    'growth',
    'workLifeBalance',
  ];

  return values.reduce((acc, value) => {
    acc[value] = scoreOneTrait(answers, questions, value);
    return acc;
  }, {});
};

// ─── 4. Big Five ─────────────────────────────────────────────────────────────

/**
 * Calculate normalised Big Five (OCEAN) scores.
 *
 * Each trait has 4 questions: 2 positive + 2 reverse-keyed.
 * Min per trait: 4 × 1 = 4. Max: 4 × 5 = 20.
 *
 * Note on neuroticism: a high raw neuroticism score means higher anxiety.
 * The score is reported as-is (higher = more neurotic). Callers should
 * consider inverting for display if they prefer to show "emotional stability".
 *
 * @param {Array<{questionId: string, score: number}>} answers
 * @param {Array<Object>} questions — bigFiveQuestions array
 * @returns {{ openness, conscientiousness, extraversion, agreeableness, neuroticism }}
 *           each value 0–100
 */
const calculateBigFiveScores = (answers, questions) => {
  const traits = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ];

  return traits.reduce((acc, trait) => {
    acc[trait] = scoreOneTrait(answers, questions, trait);
    return acc;
  }, {});
};

// ─── 5. Personality summary ──────────────────────────────────────────────────

/**
 * Lookup tables for human-readable interpretation.
 * Thresholds: low < 40, moderate 40–69, high ≥ 70.
 */
const RIASEC_DESCRIPTORS = {
  realistic:     { label: 'Hands-On Executor',    high: 'You excel at practical, technical problem-solving and prefer tangible outcomes over abstract ideas.' },
  investigative: { label: 'Analytical Thinker',   high: 'You thrive on research, data, and intellectual inquiry — a natural fit for technical and scientific roles.' },
  artistic:      { label: 'Creative Innovator',   high: 'You bring originality and imagination to your work and need creative freedom to perform at your best.' },
  social:        { label: 'People Champion',       high: 'You are energised by helping, teaching, and collaborating — a strong asset in team leadership and HR.' },
  enterprising:  { label: 'Strategic Leader',     high: 'You are persuasive, ambitious, and comfortable driving business outcomes and managing stakeholders.' },
  conventional:  { label: 'Systems Organiser',    high: 'You value precision, process, and reliability — critical qualities in finance, operations, and compliance.' },
};

const WORK_VALUE_DESCRIPTORS = {
  autonomy:       'Independent work with minimal supervision',
  stability:      'Secure, predictable income and job continuity',
  creativity:     'Innovation and freedom to experiment',
  impact:         'Meaningful contribution to society or organisation',
  growth:         'Continuous learning and career advancement',
  workLifeBalance:'Protected personal time and family flexibility',
};

const BIG_FIVE_WORK_STYLE = {
  openness:          { high: 'Embraces ambiguity and new ideas; thrives in evolving industries.',        low: 'Prefers structured, well-defined domains with established practices.' },
  conscientiousness: { high: 'Highly reliable, organised, and goal-driven; strong delivery track record.', low: 'Works better in fluid, exploratory environments than rigid schedules.' },
  extraversion:      { high: 'Energised by collaboration, networking, and stakeholder engagement.',       low: 'Works best in focused, independent settings with fewer interruptions.' },
  agreeableness:     { high: 'Builds trust easily; effective mediator and team player.',                  low: 'Direct and results-focused; comfortable with assertive negotiation.' },
  neuroticism:       { high: 'Benefits from stable, low-ambiguity environments and clear expectations.', low: 'Calm under pressure; suited to high-stakes, fast-moving roles.' },
};

const ENVIRONMENT_MAP = {
  R: 'manufacturing plants, engineering teams, field operations, or skilled-trade environments',
  I: 'R&D labs, data science teams, consulting practices, or academic/research institutions',
  A: 'design studios, product innovation teams, media organisations, or creative agencies',
  S: 'education institutions, healthcare settings, NGOs, HR functions, or community organisations',
  E: 'corporate leadership, start-ups, sales organisations, or management consulting firms',
  C: 'financial services, audit firms, government agencies, ERP-driven operations, or compliance teams',
};

/**
 * Return the top N keys from a score object, sorted descending.
 */
const topN = (scoreObj, n) =>
  Object.entries(scoreObj)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([key]) => key);

/**
 * Classify a 0-100 score into a band.
 */
const band = (score) => (score >= 70 ? 'high' : score >= 40 ? 'moderate' : 'low');

/**
 * Generate a structured, human-readable personality summary.
 *
 * @param {{ realistic, investigative, ... }} riasec
 * @param {{ autonomy, stability, ... }} workValues
 * @param {{ openness, conscientiousness, ... }} bigFive
 * @param {string} dominantType — three-letter Holland code e.g. "IAS"
 * @returns {Object} summary object ready for API response or DB storage
 */
const generatePersonalitySummary = (riasec, workValues, bigFive, dominantType) => {
  // ── RIASEC strengths ──────────────────────────────────────────────────────
  const topRiasec = topN(riasec, 3);
  const strengths = topRiasec.map((trait) => ({
    trait,
    label: RIASEC_DESCRIPTORS[trait].label,
    score: riasec[trait],
    insight: RIASEC_DESCRIPTORS[trait].high,
  }));

  // ── Ideal work environment (from dominant type letters) ───────────────────
  const idealEnvironment = dominantType
    .split('')
    .map((letter) => ENVIRONMENT_MAP[letter])
    .filter(Boolean);

  // ── Work style from Big Five ──────────────────────────────────────────────
  const workStyle = Object.entries(bigFive).map(([trait, score]) => {
    const b = band(score);
    return {
      trait,
      score,
      band: b,
      description: BIG_FIVE_WORK_STYLE[trait][b === 'high' ? 'high' : 'low'],
    };
  });

  // ── Core motivators from Work Values ──────────────────────────────────────
  const coreMotivators = topN(workValues, 3).map((value) => ({
    value,
    score: workValues[value],
    description: WORK_VALUE_DESCRIPTORS[value],
  }));

  // ── Overall narrative ─────────────────────────────────────────────────────
  const [primary, secondary] = topRiasec;
  const conscientiousnessNote =
    bigFive.conscientiousness >= 70
      ? 'Your high conscientiousness signals strong delivery reliability.'
      : bigFive.conscientiousness < 40
      ? 'You may benefit from structured accountability systems to sustain momentum.'
      : 'You balance flexibility with adequate follow-through on commitments.';

  const narrative = `Your dominant Holland type is ${dominantType}, reflecting a profile that combines ${
    RIASEC_DESCRIPTORS[primary]?.label ?? primary
  } tendencies with ${
    RIASEC_DESCRIPTORS[secondary]?.label ?? secondary
  } strengths. ${conscientiousnessNote} Your top work motivators — ${coreMotivators
    .map((m) => m.description.toLowerCase())
    .join(', ')} — suggest roles that offer ${
    workValues.autonomy >= 60 ? 'independence and ownership' : 'collaborative structure'
  } will suit you best.`;

  return {
    hollandCode: dominantType,
    narrative,
    strengths,
    idealEnvironment,
    workStyle,
    coreMotivators,
  };
};

// ─── 6. Full assessment orchestrator ─────────────────────────────────────────

/**
 * Run the complete scoring pipeline and return a result object ready for
 * persistence or API response.
 *
 * @param {Array<{questionId: string, score: number}>} allAnswers
 *   Flat array of all answers from all three instruments combined.
 * @param {{ riasecQuestions, workValuesQuestions, bigFiveQuestions }} quizQuestions
 *   Destructured question banks — import from auth-service/src/data/quizQuestions
 *   or a local copy placed in personality-service/data/.
 * @returns {Object} complete assessment result
 */
const calculateFullAssessment = (allAnswers, quizQuestions) => {
  const { riasecQuestions, workValuesQuestions, bigFiveQuestions } = quizQuestions;

  // Partition answers by instrument using question ID prefix conventions
  // (R/I/A/S/E/C for RIASEC, WV_ for Work Values, BF_ for Big Five).
  // Using the full question bank filter is more robust than string matching.
  const riasecIds     = new Set(riasecQuestions.map((q) => q.id));
  const workValuesIds = new Set(workValuesQuestions.map((q) => q.id));
  const bigFiveIds    = new Set(bigFiveQuestions.map((q) => q.id));

  const riasecAnswers     = allAnswers.filter((a) => riasecIds.has(a.questionId));
  const workValuesAnswers = allAnswers.filter((a) => workValuesIds.has(a.questionId));
  const bigFiveAnswers    = allAnswers.filter((a) => bigFiveIds.has(a.questionId));

  // Score each instrument
  const riasec     = calculateRiasecScores(riasecAnswers, riasecQuestions);
  const workValues = calculateWorkValuesScores(workValuesAnswers, workValuesQuestions);
  const bigFive    = calculateBigFiveScores(bigFiveAnswers, bigFiveQuestions);

  // Derive Holland code
  const dominantType = calculateDominantType(riasec);

  // Build summary
  const summary = generatePersonalitySummary(riasec, workValues, bigFive, dominantType);

  return {
    scores: {
      riasec,
      workValues,
      bigFive,
    },
    dominantType,
    summary,
    meta: {
      totalAnswered: allAnswers.length,
      totalExpected: riasecQuestions.length + workValuesQuestions.length + bigFiveQuestions.length,
      completionRate: Math.round(
        (allAnswers.length /
          (riasecQuestions.length + workValuesQuestions.length + bigFiveQuestions.length)) *
          100
      ),
      scoredAt: new Date().toISOString(),
    },
  };
};

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  calculateRiasecScores,
  calculateDominantType,
  calculateWorkValuesScores,
  calculateBigFiveScores,
  generatePersonalitySummary,
  calculateFullAssessment,
};
