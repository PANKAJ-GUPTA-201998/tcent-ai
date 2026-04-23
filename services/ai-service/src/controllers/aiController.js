// ============================================
// AI Controller - Business Logic
// ============================================
// Handles all AI-related requests
// Implements caching and error handling

const groqService = require('../services/groqService');
const cacheService = require('../services/cacheService');

/**
 * Get Career Advice
 * POST /api/ai/career-advice
 * Body: { question: "How to become a data scientist?" }
 */
const getCareerAdvice = async (req, res) => {
  try {
    const { question } = req.body;

    // Validation
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question.'
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Question too long. Maximum 500 characters.'
      });
    }

    // Check cache first
    const cacheKey = cacheService.generateCareerAdviceKey(question);
    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      return res.json({
        success: true,
        answer: cachedResponse,
        cached: true
      });
    }

    // Get fresh response from Groq
    const answer = await groqService.getCareerAdvice(question);

    // Cache the response
    await cacheService.set(cacheKey, answer);

    res.json({
      success: true,
      answer,
      cached: false
    });

  } catch (error) {
    console.error('Career Advice Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get career advice.' });
  }
};

/**
 * Review Resume
 * POST /api/ai/resume-review
 * Body: { resumeText: "..." }
 */
const reviewResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    // Validation
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resume text.'
      });
    }

    if (resumeText.length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Resume text too short. Minimum 100 characters.'
      });
    }

    if (resumeText.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Resume text too long. Maximum 10,000 characters.'
      });
    }

    // Check cache
    const cacheKey = cacheService.generateResumeKey(resumeText);
    const cachedReview = await cacheService.get(cacheKey);

    if (cachedReview) {
      return res.json({
        success: true,
        ...cachedReview,
        cached: true
      });
    }

    // Get fresh review from Groq
    const review = await groqService.reviewResume(resumeText);

    // Cache the review
    await cacheService.set(cacheKey, review);

    res.json({
      success: true,
      ...review,
      cached: false
    });

  } catch (error) {
    console.error('Resume Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review resume.'
    });
  }
};

/**
 * Analyze Skill Gap
 * POST /api/ai/skill-gap
 * Body: { currentSkills: ["JavaScript", "React"], targetRole: "Full Stack Developer" }
 */
const analyzeSkillGap = async (req, res) => {
  try {
    const { currentSkills, targetRole } = req.body;

    // Validation
    if (!currentSkills || !Array.isArray(currentSkills) || currentSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your current skills as an array.'
      });
    }

    if (!targetRole || targetRole.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your target role.'
      });
    }

    // Check cache
    const cacheKey = cacheService.generateSkillGapKey(currentSkills, targetRole);
    const cachedAnalysis = await cacheService.get(cacheKey);

    if (cachedAnalysis) {
      return res.json({
        success: true,
        ...cachedAnalysis,
        cached: true
      });
    }

    // Get fresh analysis from Groq
    const analysis = await groqService.analyzeSkillGap(currentSkills, targetRole);

    // Cache the analysis
    await cacheService.set(cacheKey, analysis);

    res.json({
      success: true,
      ...analysis,
      cached: false
    });

  } catch (error) {
    console.error('Skill Gap Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze skill gap.'
    });
  }
};

/**
 * Health Check
 * GET /api/ai/health
 */
const healthCheck = async (req, res) => {
  res.json({
    success: true,
    service: 'AI Service',
    status: 'running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getCareerAdvice,
  reviewResume,
  analyzeSkillGap,
  healthCheck
};
