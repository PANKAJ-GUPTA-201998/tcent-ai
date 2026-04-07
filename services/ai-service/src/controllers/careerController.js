// ============================================
// Career Controller
// ============================================
// Analyzes resume and returns career intelligence

const skillExtractor = require('../services/skillExtractor');
const cacheService = require('../services/cacheService');
const careerPaths = require('../data/careerPaths');

/**
 * POST /api/career/analyze
 * Body: { resumeText: string }
 * Extracts skills, scores career paths, computes health score
 */
const analyzeCareer = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is too short. Please provide at least 50 characters.'
      });
    }

    // Cache key based on first 300 chars of resume
    const cacheKey = `career:${Buffer.from(resumeText.slice(0, 300)).toString('base64').slice(0, 60)}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }

    // Extract skills via AI
    const extractedSkills = await skillExtractor.extractSkills(resumeText);

    // Normalize for comparison
    const userSkillsLower = extractedSkills.map(s => s.toLowerCase().trim());

    // Score each career path
    const scoredPaths = careerPaths.map(path => {
      const requiredLower = path.requiredSkills.map(s => s.toLowerCase());
      const bonusLower = path.bonusSkills.map(s => s.toLowerCase());

      const matchedRequired = path.requiredSkills.filter((_, i) =>
        userSkillsLower.some(us => us.includes(requiredLower[i]) || requiredLower[i].includes(us))
      );

      const matchedBonus = path.bonusSkills.filter((_, i) =>
        userSkillsLower.some(us => us.includes(bonusLower[i]) || bonusLower[i].includes(us))
      );

      // Required skills worth 80%, bonus 20%
      const requiredScore = (matchedRequired.length / path.requiredSkills.length) * 80;
      const bonusScore = path.bonusSkills.length > 0
        ? (matchedBonus.length / path.bonusSkills.length) * 20
        : 0;

      const matchPercent = Math.round(requiredScore + bonusScore);

      const missingSkills = path.requiredSkills.filter(
        (_, i) => !userSkillsLower.some(us => us.includes(requiredLower[i]) || requiredLower[i].includes(us))
      );

      return {
        id: path.id,
        title: path.title,
        emoji: path.emoji,
        description: path.description,
        salaryRange: path.salaryRange,
        demandLevel: path.demandLevel,
        growthRate: path.growthRate,
        matchPercent,
        matchedSkills: matchedRequired,
        missingSkills
      };
    });

    // Top 5 by match score
    const topCareers = scoredPaths
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 5);

    // Skill health score: weighted average of top 3 match scores
    const top3 = topCareers.slice(0, 3);
    const healthScore = Math.round(
      top3.reduce((sum, c) => sum + c.matchPercent, 0) / top3.length
    );

    // Skill gaps: missing skills from the #1 career path
    const skillGaps = topCareers[0]?.missingSkills || [];

    const result = {
      extractedSkills,
      healthScore,
      topCareers,
      skillGaps,
      totalSkills: extractedSkills.length
    };

    await cacheService.set(cacheKey, result, 3600); // 1 hour cache

    res.json({ success: true, ...result, cached: false });

  } catch (error) {
    console.error('Career Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze career intelligence.'
    });
  }
};

/**
 * GET /api/career/paths
 * Returns all career paths (no auth needed for browsing)
 */
const getCareerPaths = (req, res) => {
  res.json({
    success: true,
    paths: careerPaths.map(p => ({
      id: p.id,
      title: p.title,
      emoji: p.emoji,
      description: p.description,
      salaryRange: p.salaryRange,
      demandLevel: p.demandLevel,
      growthRate: p.growthRate,
      requiredSkills: p.requiredSkills
    }))
  });
};

module.exports = { analyzeCareer, getCareerPaths };
