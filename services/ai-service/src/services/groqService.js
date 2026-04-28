// ============================================
// Groq Service - AI Integration
// ============================================
// This handles all communication with Groq API
// Uses Llama 3.3 70B model for career guidance

const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    // Initialize Groq client with API key
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    
    // Model configuration
    this.model = 'llama-3.3-70b-versatile';
    this.maxTokens = 1024;
    this.temperature = 0.7; // Balance between creative and factual
  }

  /**
   * Build a profile context string to inject into system prompt
   * @param {object|null} profile
   * @returns {string}
   */
  _buildProfileContext(profile) {
    if (!profile) return '';

    const parts = [];

    if (profile.skills && profile.skills.length > 0) {
      parts.push(`Current Skills: ${profile.skills.join(', ')}`);
    }

    if (profile.experience && profile.experience.length > 0) {
      const expStr = profile.experience
        .map(e => `${e.role} at ${e.company} (${e.years} yr${e.years !== 1 ? 's' : ''})`)
        .join('; ');
      parts.push(`Work Experience: ${expStr}`);
    }

    if (profile.careerGoals) {
      parts.push(`Career Goals: ${profile.careerGoals}`);
    }

    if (profile.preferences) {
      const prefs = [];
      if (profile.preferences.industry?.length > 0) {
        prefs.push(`industries: ${profile.preferences.industry.join(', ')}`);
      }
      if (profile.preferences.location) {
        prefs.push(`location: ${profile.preferences.location}`);
      }
      if (profile.preferences.workMode) {
        prefs.push(`work mode: ${profile.preferences.workMode}`);
      }
      if (prefs.length > 0) {
        parts.push(`Preferences: ${prefs.join(', ')}`);
      }
    }

    if (parts.length === 0) return '';

    return `\n\nUser Profile (use this to personalize your advice):\n${parts.join('\n')}`;
  }

  /**
   * Get Career Advice
   * @param {string} question - User's career question
   * @param {object|null} profile - Optional user profile for personalization
   * @returns {Promise<string>} AI's response
   */
  async getCareerAdvice(question, profile = null) {
    try {
      const profileContext = this._buildProfileContext(profile);

      const systemPrompt = `You are an expert career counselor for Tcent.AI platform.
Your role is to provide personalized, actionable career guidance.

Guidelines:
- Be encouraging and supportive
- Provide specific, actionable steps
- Consider the Indian job market context
- Mention relevant skills and courses when applicable
- Keep responses concise (200-300 words)
- Be empathetic and understanding
- If a user profile is provided, tailor your advice specifically to their skills, experience, goals, and preferences — reference them directly rather than giving generic advice${profileContext}

Always structure your advice with:
1. Understanding the situation
2. Key recommendations (personalized to their profile if available)
3. Next steps`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        top_p: 1,
        stream: false
      });

      return completion.choices[0].message.content;

    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  /**
   * Review Resume
   * @param {string} resumeText - Full resume text
   * @returns {Promise<Object>} Feedback and score
   */
  async reviewResume(resumeText) {
    try {
      const systemPrompt = `You are an expert resume reviewer for Tcent.AI.
Analyze the resume and provide:
1. Overall score (0-100)
2. Strengths (3-4 points)
3. Areas for improvement (3-4 points)
4. Specific suggestions

Focus on:
- Clarity and structure
- Skills relevance
- Achievement quantification
- Keywords for ATS systems
- Professional formatting`;

      const userPrompt = `Please review this resume and provide detailed feedback:

${resumeText}

Provide your response in JSON format:
{
  "score": <number 0-100>,
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "suggestions": "detailed suggestions here"
}`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.5, // More consistent for structured output
      });

      const responseText = completion.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        score: 70,
        strengths: ['Resume uploaded successfully'],
        improvements: ['Unable to parse detailed feedback'],
        suggestions: responseText
      };

    } catch (error) {
      console.error('Resume Review Error:', error);
      throw new Error('Failed to review resume. Please try again.');
    }
  }

  /**
   * Analyze Skill Gap
   * @param {Array} currentSkills - User's current skills
   * @param {string} targetRole - Desired job role
   * @returns {Promise<Object>} Missing skills and learning path
   */
  async analyzeSkillGap(currentSkills, targetRole) {
    try {
      const systemPrompt = `You are a career transition specialist for Tcent.AI.
Analyze skill gaps and create learning paths for career transitions.

Provide practical, achievable roadmaps considering:
- Indian job market requirements
- Free/affordable learning resources
- Realistic timelines (3-6 months)
- Project-based learning`;

      const userPrompt = `Target Role: ${targetRole}
Current Skills: ${currentSkills.join(', ')}

Provide a detailed skill gap analysis in JSON format:
{
  "missingSkills": [
    {
      "skill": "skill name",
      "importance": "high|medium|low",
      "reason": "why this skill matters"
    }
  ],
  "learningPath": [
    {
      "step": 1,
      "title": "step title",
      "duration": "2 weeks",
      "resources": ["resource 1", "resource 2"],
      "outcome": "what you'll achieve"
    }
  ],
  "estimatedTime": "3-6 months",
  "keyAdvice": "main advice here"
}`;

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.6,
      });

      const responseText = completion.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse skill gap analysis');

    } catch (error) {
      console.error('Skill Gap Analysis Error:', error);
      throw new Error('Failed to analyze skill gap. Please try again.');
    }
  }
}

module.exports = new GroqService();
