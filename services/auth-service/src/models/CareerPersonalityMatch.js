const mongoose = require('mongoose');

/**
 * CareerPersonalityMatch Model
 * Each document represents a career path with its ideal psychometric profile.
 * Used to match users to careers based on their Assessment results.
 */

// ── Sub-schemas ─────────────────────────────────────────────────────────────

/**
 * Salary range for a single experience level.
 * min/max are annual figures in the given currency.
 */
const salaryLevelSchema = new mongoose.Schema(
  {
    min:      { type: Number, required: true },
    max:      { type: Number, required: true },
    currency: { type: String, default: 'INR', uppercase: true }
  },
  { _id: false }
);

/**
 * Ideal Big Five trait level for this career.
 * 'any' means the trait does not strongly influence fit.
 */
const bigFiveIdealSchema = new mongoose.Schema(
  {
    openness:          { type: String, enum: ['high', 'medium', 'low', 'any'], default: 'any' },
    conscientiousness: { type: String, enum: ['high', 'medium', 'low', 'any'], default: 'any' },
    extraversion:      { type: String, enum: ['high', 'medium', 'low', 'any'], default: 'any' },
    agreeableness:     { type: String, enum: ['high', 'medium', 'low', 'any'], default: 'any' },
    neuroticism:       { type: String, enum: ['high', 'medium', 'low', 'any'], default: 'any' }
  },
  { _id: false }
);

// ── Main Schema ──────────────────────────────────────────────────────────────

const careerPersonalityMatchSchema = new mongoose.Schema(
  {
    // Display name of the career path (e.g. "UX Designer", "Data Scientist")
    title: {
      type: String,
      required: [true, 'title is required'],
      unique: true,
      trim: true
    },

    /**
     * URL-friendly identifier auto-generated from title in pre-save.
     * e.g. "UX Designer" → "ux-designer"
     * Do not set manually.
     */
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    // Short paragraph describing the career path
    description: {
      type: String,
      trim: true
    },

    // Broad industry category for filtering
    industry: {
      type: String,
      enum: [
        'technology',
        'healthcare',
        'finance',
        'design',
        'education',
        'marketing',
        'engineering',
        'legal',
        'science',
        'media',
        'consulting',
        'nonprofit',
        'government',
        'hospitality',
        'other'
      ],
      required: [true, 'industry is required']
    },

    /**
     * Ideal psychometric profile for a person suited to this career.
     * Used during matching to compute a compatibility score.
     */
    idealProfile: {
      /**
       * RIASEC codes that strongly align with this career.
       * e.g. ['I', 'A'] means Investigative + Artistic types fit best.
       * Order matters — first code is the primary fit.
       */
      riasecCodes: {
        type: [String],
        enum: ['R', 'I', 'A', 'S', 'E', 'C'],
        validate: {
          validator: (arr) => arr.length >= 1 && arr.length <= 3,
          message: 'riasecCodes must contain 1–3 codes'
        }
      },

      /**
       * Work values that are most satisfied by this career, in priority order.
       * e.g. ['creativity', 'autonomy', 'growth']
       */
      workValuesPriority: {
        type: [String],
        enum: ['autonomy', 'stability', 'creativity', 'impact', 'growth', 'workLifeBalance']
      },

      // Ideal Big Five personality trait levels for this career
      bigFiveIdeal: {
        type: bigFiveIdealSchema,
        default: () => ({})
      }
    },

    /**
     * Expected annual salary ranges by experience level.
     * All figures are in the currency specified per level (default INR).
     */
    salaryRange: {
      entry:  { type: salaryLevelSchema },
      mid:    { type: salaryLevelSchema },
      senior: { type: salaryLevelSchema }
    },

    /**
     * Current market demand trend for this career.
     * declining  - shrinking job market
     * stable     - steady, not growing or shrinking noticeably
     * growing    - above-average job growth
     * high_growth - rapidly expanding, strong demand
     */
    demandTrend: {
      type: String,
      enum: ['declining', 'stable', 'growing', 'high_growth'],
      default: 'stable'
    },

    // Soft-delete flag — inactive careers are hidden from recommendations
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // adds createdAt / updatedAt
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────

// Full-text search across title and description
careerPersonalityMatchSchema.index(
  { title: 'text', description: 'text' },
  { name: 'career_text_search', weights: { title: 10, description: 5 } }
);

// Speed up RIASEC-based lookups
careerPersonalityMatchSchema.index({ 'idealProfile.riasecCodes': 1 });

// Common filter: active careers by industry
careerPersonalityMatchSchema.index({ isActive: 1, industry: 1 });

// ── Pre-save hook ─────────────────────────────────────────────────────────────

/**
 * Auto-generate slug from title.
 * "Data Scientist" → "data-scientist"
 * "UX / UI Designer" → "ux-ui-designer"
 */
careerPersonalityMatchSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars except spaces/hyphens
      .trim()
      .replace(/\s+/g, '-')          // spaces → hyphens
      .replace(/-+/g, '-');          // collapse multiple hyphens
  }
  next();
});

// ── Static Methods ────────────────────────────────────────────────────────────

/**
 * Find active careers that match any of the RIASEC codes in a dominant type string.
 * @param {string} dominantType - e.g. "IAS" (top 3 codes from Assessment)
 * @returns {Promise<CareerPersonalityMatch[]>}
 *
 * Example:
 *   CareerPersonalityMatch.findByRiasecCode('IAS')
 *   → finds careers whose idealProfile.riasecCodes includes 'I', 'A', or 'S'
 */
careerPersonalityMatchSchema.statics.findByRiasecCode = function (dominantType) {
  // Split "IAS" → ['I', 'A', 'S']
  const codes = dominantType.toUpperCase().split('');

  return this.find({
    isActive: true,
    'idealProfile.riasecCodes': { $in: codes }
  })
    .sort({ demandTrend: -1 }) // surface high-growth careers first
    .lean();
};

module.exports = mongoose.model('CareerPersonalityMatch', careerPersonalityMatchSchema);
