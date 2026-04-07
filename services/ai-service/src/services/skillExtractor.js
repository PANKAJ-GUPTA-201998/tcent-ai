// ============================================
// Skill Extractor Service
// ============================================
// Uses Groq AI to extract skills from resume text

const Groq = require('groq-sdk');

class SkillExtractor {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    this.model = 'llama-3.3-70b-versatile';
  }

  /**
   * Extract skills from resume text using AI
   * @param {string} resumeText - Full resume text
   * @returns {Promise<string[]>} Array of extracted skills
   */
  async extractSkills(resumeText) {
    const prompt = `Extract all technical and professional skills from this resume text.

Return ONLY a JSON array of skill strings. No explanation, no markdown, just the JSON array.

Rules:
- Include programming languages, frameworks, tools, platforms, methodologies
- Normalize names (e.g., "ReactJS" → "React", "nodejs" → "Node.js")
- Include soft skills only if clearly stated (Leadership, Communication)
- Maximum 40 skills
- Each skill should be 1-3 words

Resume text:
${resumeText.slice(0, 4000)}

Response (JSON array only):`;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.2
      });

      const text = completion.choices[0].message.content.trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return this._fallbackExtract(resumeText);

      const skills = JSON.parse(jsonMatch[0]);
      return Array.isArray(skills) ? skills.filter(s => typeof s === 'string') : this._fallbackExtract(resumeText);

    } catch (err) {
      console.error('Skill extraction error:', err.message);
      return this._fallbackExtract(resumeText);
    }
  }

  /**
   * Regex-based fallback if AI call fails
   * @param {string} text
   * @returns {string[]}
   */
  _fallbackExtract(text) {
    const knownSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'Kotlin', 'Go', 'Rust', 'C++', 'C#', 'PHP', 'Ruby',
      'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
      'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'SASS',
      'MongoDB', 'PostgreSQL', 'MySQL', 'SQL', 'Redis', 'Firebase',
      'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Linux',
      'Git', 'CI/CD', 'REST APIs', 'GraphQL', 'Microservices',
      'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
      'Android SDK', 'React Native', 'Flutter',
      'Terraform', 'Ansible', 'Networking', 'Security'
    ];

    const found = knownSkills.filter(skill =>
      new RegExp(`\\b${skill.replace(/[.+]/g, '\\$&')}\\b`, 'i').test(text)
    );

    return found.length > 0 ? found : ['JavaScript', 'Git', 'REST APIs'];
  }
}

module.exports = new SkillExtractor();
