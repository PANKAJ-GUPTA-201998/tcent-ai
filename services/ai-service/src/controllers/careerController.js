// ============================================
// Career Controller
// ============================================
// Analyzes resume and returns career intelligence
// Personalizes results using user profile data

const skillExtractor = require('../services/skillExtractor');
const cacheService = require('../services/cacheService');
const careerPaths = require('../data/careerPaths');

/**
 * POST /api/career/analyze
 * Body: { resumeText: string, profile?: { skills, careerGoals, preferences } }
 * Extracts skills, scores career paths, computes health score
 * If profile is provided, merges skills and boosts relevant paths
 */
const analyzeCareer = async (req, res) => {
  try {
    const { resumeText, profile } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is too short. Please provide at least 50 characters.'
      });
    }

    // Cache key: resume + profile snapshot
    const profileKey = profile
      ? Buffer.from(JSON.stringify({
          skills: profile.skills || [],
          goals: (profile.careerGoals || '').slice(0, 100),
          industry: (profile.preferences?.industry || []).join(','),
        })).toString('base64').slice(0, 40)
      : 'no-profile';
    const cacheKey = `career:${Buffer.from(resumeText.slice(0, 300)).toString('base64').slice(0, 60)}:${profileKey}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ success: true, ...cached, cached: true });
    }

    // Extract skills from resume via AI
    const resumeSkills = await skillExtractor.extractSkills(resumeText);

    // Merge profile skills (manual skills user added) with resume skills — deduplicate
    const profileSkills = (profile?.skills || []).map(s => s.trim()).filter(Boolean);
    const allSkillsSet = new Set([
      ...resumeSkills.map(s => s.toLowerCase()),
      ...profileSkills.map(s => s.toLowerCase()),
    ]);
    // Keep display-friendly versions (prefer resume version, fallback to profile)
    const skillDisplayMap = {};
    [...resumeSkills, ...profileSkills].forEach(s => {
      skillDisplayMap[s.toLowerCase()] = s;
    });
    const extractedSkills = [...allSkillsSet].map(s => skillDisplayMap[s] || s);

    // Normalize for comparison
    const userSkillsLower = extractedSkills.map(s => s.toLowerCase().trim());

    // Build a set of preferred industries/domains from profile
    const preferredIndustries = (profile?.preferences?.industry || [])
      .map(i => i.toLowerCase());

    // Parse career goals for keyword hints
    const careerGoalsLower = (profile?.careerGoals || '').toLowerCase();

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

      let matchPercent = Math.round(requiredScore + bonusScore);

      // Profile-based boost (max +10 points, won't exceed 100)
      let profileBoost = 0;
      let boostReasons = [];

      // Boost if path title/description aligns with career goals
      if (careerGoalsLower) {
        const pathWords = `${path.title} ${path.description} ${path.id}`.toLowerCase();
        const goalWords = careerGoalsLower.split(/\s+/).filter(w => w.length > 3);
        const goalMatches = goalWords.filter(w => pathWords.includes(w));
        if (goalMatches.length > 0) {
          profileBoost += Math.min(goalMatches.length * 2, 6);
          boostReasons.push('career goals');
        }
      }

      // Boost if industry preference aligns with path
      if (preferredIndustries.length > 0) {
        const pathText = `${path.title} ${path.description} ${path.id}`.toLowerCase();
        const industryMatch = preferredIndustries.some(ind => pathText.includes(ind));
        if (industryMatch) {
          profileBoost += 4;
          boostReasons.push('industry preference');
        }
      }

      matchPercent = Math.min(100, matchPercent + profileBoost);

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
        missingSkills,
        profileBoost,
        boostReasons,
      };
    });

    // Top 5 by match score
    const topCareers = scoredPaths
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 5);

    // Skill health score: weighted average of top 3 match scores
    const top3 = topCareers.slice(0, 3);
    const healthScore = top3.length > 0
      ? Math.round(top3.reduce((sum, c) => sum + c.matchPercent, 0) / top3.length)
      : 0;

    // Skill gaps: missing skills from the #1 career path
    const skillGaps = topCareers[0]?.missingSkills || [];

    // Personalization summary for UI
    const isPersonalized = !!(profile && (profileSkills.length > 0 || profile.careerGoals || preferredIndustries.length > 0));
    const personalizationNote = isPersonalized
      ? [
          profileSkills.length > 0 ? `${profileSkills.length} profile skill${profileSkills.length > 1 ? 's' : ''} merged` : null,
          profile?.careerGoals ? 'career goals applied' : null,
          preferredIndustries.length > 0 ? 'industry preferences applied' : null,
        ].filter(Boolean).join(', ')
      : null;

    const result = {
      extractedSkills,
      resumeSkillCount: resumeSkills.length,
      profileSkillCount: profileSkills.length,
      healthScore,
      topCareers,
      skillGaps,
      totalSkills: extractedSkills.length,
      isPersonalized,
      personalizationNote,
    };

    await cacheService.set(cacheKey, result, 3600); // 1 hour cache

    res.json({ success: true, ...result, cached: false });

  } catch (error) {
    console.error('Career Analysis Error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze career intelligence.' });
  }
};

/**
 * GET /api/career/paths
 * Returns all career paths (no auth needed for browsing)
 */
const getCareerPaths = (_req, res) => {
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
