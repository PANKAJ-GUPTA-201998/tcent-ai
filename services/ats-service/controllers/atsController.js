// ============================================
// ATS Controller - Business Logic
// ============================================
// Accepts resume PDF + job description,
// extracts text, calls Groq, returns ATS report.

const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const { buildATSPrompt } = require('../prompts/atsPrompt');
const { extractKeywords, calculateBasicMatch } = require('../utils/keywordExtractor');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Analyze Resume Against Job Description
 * POST /api/ats/analyze
 * Body: multipart/form-data
 *   - resume       : PDF file (field name "resume")
 *   - jobDescription : string (in form body)
 */
const analyzeATS = async (req, res) => {
  try {
    // Validate uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume PDF file.',
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job description (minimum 50 characters).',
      });
    }

    if (jobDescription.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Job description too long. Maximum 5000 characters.',
      });
    }

    // Extract text from PDF buffer
    let resumeText;
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Could not read PDF. Make sure the file is not password-protected or corrupted.',
      });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from this PDF. Please upload a text-based PDF (not a scanned image).',
      });
    }

    // Build prompt and call Groq
    const { systemPrompt, userPrompt } = buildATSPrompt(resumeText, jobDescription);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.3, // Low temperature for consistent JSON output
    });

    const responseText = completion.choices[0].message.content;

    // Parse JSON from Groq response
    let analysis;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
      } catch {
        // JSON parse failed — fall back to regex-based matching
        analysis = buildFallbackAnalysis(resumeText, jobDescription);
      }
    } else {
      analysis = buildFallbackAnalysis(resumeText, jobDescription);
    }

    return res.json({
      success: true,
      score: analysis.score ?? 0,
      matchedKeywords: analysis.matchedKeywords ?? [],
      missingKeywords: analysis.missingKeywords ?? [],
      suggestions: analysis.suggestions ?? [],
      keywordDensity: analysis.keywordDensity ?? { total: 0, matched: 0 },
      sectionFeedback: analysis.sectionFeedback ?? {},
      resumeWordCount: resumeText.split(/\s+/).length,
      analyzedAt: new Date().toISOString(),
      user: req.user.name,
    });

  } catch (error) {
    console.error('ATS Analysis Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume. Please try again.',
    });
  }
};

/**
 * Build a fallback analysis using regex keyword matching
 * when Groq response cannot be parsed as JSON.
 */
const buildFallbackAnalysis = (resumeText, jobDescription) => {
  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jobDescription);
  const { score, matched, missing } = calculateBasicMatch(resumeKeywords, jdKeywords);

  return {
    score,
    matchedKeywords: matched,
    missingKeywords: missing,
    suggestions: [
      'Add missing keywords naturally throughout your resume',
      'Mirror the exact language and terminology used in the job description',
      'Quantify your achievements with numbers and measurable outcomes',
      'Ensure your skills section lists all relevant technologies from the JD',
    ],
    keywordDensity: { total: jdKeywords.length, matched: matched.length },
    sectionFeedback: {
      skills: 'Include all required technical skills listed in the job description.',
      experience: 'Align your experience bullet points with the key responsibilities in the JD.',
      education: 'Mention relevant certifications and degrees prominently.',
    },
  };
};

/**
 * Health Check
 * GET /api/ats/health
 */
const healthCheck = (req, res) => {
  res.json({
    success: true,
    service: 'ATS Service',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { analyzeATS, healthCheck };
