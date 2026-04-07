const mongoose = require('mongoose');

/**
 * Assessment Model
 * Stores psychometric assessment results for career matching.
 * Three frameworks are used:
 *   1. RIASEC  - Holland's career interest codes
 *   2. Work Values - what the user wants from a job
 *   3. Big Five - personality dimensions
 */

const assessmentSchema = new mongoose.Schema(
  {
    // Reference to the user who took this assessment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true
    },

    /**
     * RIASEC Scores (Holland's Career Interest Model)
     * R - Realistic:      likes working with hands, tools, machines
     * I - Investigative:  likes research, analysis, problem-solving
     * A - Artistic:       likes creativity, self-expression, design
     * S - Social:         likes helping, teaching, counselling people
     * E - Enterprising:   likes leading, persuading, business
     * C - Conventional:   likes organisation, data, structured tasks
     */
    riasec: {
      realistic:     { type: Number, min: 0, max: 100, required: true, default: 0 },
      investigative: { type: Number, min: 0, max: 100, required: true, default: 0 },
      artistic:      { type: Number, min: 0, max: 100, required: true, default: 0 },
      social:        { type: Number, min: 0, max: 100, required: true, default: 0 },
      enterprising:  { type: Number, min: 0, max: 100, required: true, default: 0 },
      conventional:  { type: Number, min: 0, max: 100, required: true, default: 0 }
    },

    /**
     * Work Values Scores
     * What the user values most in a job/career environment.
     * autonomy        - freedom to work independently
     * stability       - job security and predictable environment
     * creativity      - opportunity to innovate and create
     * impact          - making a meaningful difference
     * growth          - learning and career advancement opportunities
     * workLifeBalance - time for personal life outside work
     */
    workValues: {
      autonomy:        { type: Number, min: 0, max: 100, required: true, default: 0 },
      stability:       { type: Number, min: 0, max: 100, required: true, default: 0 },
      creativity:      { type: Number, min: 0, max: 100, required: true, default: 0 },
      impact:          { type: Number, min: 0, max: 100, required: true, default: 0 },
      growth:          { type: Number, min: 0, max: 100, required: true, default: 0 },
      workLifeBalance: { type: Number, min: 0, max: 100, required: true, default: 0 }
    },

    /**
     * Big Five Personality Scores (OCEAN model)
     * openness          - curiosity, creativity, openness to new experiences
     * conscientiousness - organisation, dependability, self-discipline
     * extraversion      - sociability, assertiveness, positive emotions
     * agreeableness     - cooperativeness, trust, empathy
     * neuroticism       - emotional instability, anxiety, moodiness
     */
    bigFive: {
      openness:          { type: Number, min: 0, max: 100, required: true, default: 0 },
      conscientiousness: { type: Number, min: 0, max: 100, required: true, default: 0 },
      extraversion:      { type: Number, min: 0, max: 100, required: true, default: 0 },
      agreeableness:     { type: Number, min: 0, max: 100, required: true, default: 0 },
      neuroticism:       { type: Number, min: 0, max: 100, required: true, default: 0 }
    },

    /**
     * Dominant RIASEC Type (e.g. "IAS", "REC")
     * Top 3 RIASEC codes sorted by descending score.
     * Auto-calculated in the pre-save hook — do not set manually.
     */
    dominantType: {
      type: String,
      maxlength: 3,
      uppercase: true
    },

    // When the assessment was completed
    completedAt: {
      type: Date,
      default: Date.now
    },

    // Schema version — increment if assessment structure changes
    version: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true // adds createdAt / updatedAt
  }
);

// ── Compound index ──────────────────────────────────────────────────────────
// Speeds up queries like "latest assessment for user X"
assessmentSchema.index({ userId: 1, completedAt: -1 });

// ── Pre-save hook ───────────────────────────────────────────────────────────
// Automatically derive dominantType from the top 3 RIASEC scores
assessmentSchema.pre('save', function (next) {
  if (this.isModified('riasec') || this.isNew) {
    const RIASEC_KEYS = {
      realistic:     'R',
      investigative: 'I',
      artistic:      'A',
      social:        'S',
      enterprising:  'E',
      conventional:  'C'
    };

    // Sort keys by score descending, take top 3, map to single-letter codes
    this.dominantType = Object.entries(this.riasec)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => RIASEC_KEYS[key])
      .join('');
  }
  next();
});

// ── Static Methods ──────────────────────────────────────────────────────────

/**
 * Find the most recent assessment for a given user.
 * @param {string|ObjectId} userId
 * @returns {Promise<Assessment|null>}
 */
assessmentSchema.statics.findLatestByUser = function (userId) {
  return this.findOne({ userId })
    .sort({ completedAt: -1 })
    .lean();
};

module.exports = mongoose.model('Assessment', assessmentSchema);
