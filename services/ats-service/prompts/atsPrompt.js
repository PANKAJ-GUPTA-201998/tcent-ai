// ============================================
// ATS Prompt Builder
// ============================================
// Builds Groq prompts for ATS resume analysis

/**
 * Build ATS analysis prompt
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Pasted job description
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
const buildATSPrompt = (resumeText, jobDescription) => {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst for Tcent.AI.
Your job is to compare a resume against a job description and produce a detailed ATS compatibility report.

Analysis approach:
- Extract all keywords from the job description: technical skills, tools, technologies, frameworks, qualifications, certifications, soft skills, and domain terms
- Match those keywords against the resume content (case-insensitive, consider common synonyms and abbreviations)
- Calculate an honest match percentage (0-100)
- Identify important missing keywords that would improve the ATS score
- Provide specific, actionable suggestions to improve the match

Context:
- Consider the Indian job market (mention INR, Indian companies, popular Indian tech stacks when relevant)
- Be precise and honest — do not inflate the score
- Prioritize high-frequency and high-importance keywords from the JD`;

  const userPrompt = `Analyze this resume against the job description and provide an ATS compatibility report.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Respond ONLY with valid JSON in this exact format (no extra text before or after):
{
  "score": <integer 0-100>,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3"
  ],
  "keywordDensity": {
    "total": <total keywords extracted from JD>,
    "matched": <number matched in resume>
  },
  "sectionFeedback": {
    "skills": "Feedback on the skills section",
    "experience": "Feedback on the experience section",
    "education": "Feedback on the education section"
  }
}`;

  return { systemPrompt, userPrompt };
};

module.exports = { buildATSPrompt };
