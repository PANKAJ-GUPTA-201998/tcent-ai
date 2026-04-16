// ============================================
// Keyword Extractor - Fallback Utility
// ============================================
// Used as fallback when Groq JSON parsing fails.
// Regex-matches known tech keywords against text.

const TECH_KEYWORDS = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB',
  // Frontend
  'React', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind', 'Bootstrap',
  'Next.js', 'Nuxt', 'Svelte', 'Redux', 'Webpack', 'Vite',
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Laravel', 'Rails', 'NestJS', 'GraphQL', 'REST API', 'gRPC',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Cassandra',
  'DynamoDB', 'Elasticsearch', 'Firebase', 'Supabase',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins',
  'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Nginx',
  // AI/ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
  'LLM', 'OpenAI', 'Pandas', 'NumPy', 'Scikit-learn', 'Keras',
  // Tools & Practices
  'Git', 'Agile', 'Scrum', 'Jira', 'Microservices', 'REST',
  'Unit Testing', 'Jest', 'Selenium', 'Postman', 'Figma',
  // Mobile
  'React Native', 'Flutter', 'Android', 'iOS', 'Jetpack Compose',
];

/**
 * Extract known tech keywords from text
 * @param {string} text
 * @returns {string[]}
 */
const extractKeywords = (text) => {
  const found = [];
  const lowerText = text.toLowerCase();

  TECH_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  });

  return [...new Set(found)];
};

/**
 * Calculate basic keyword match between resume and JD
 * @param {string[]} resumeKeywords
 * @param {string[]} jdKeywords
 * @returns {{ score: number, matched: string[], missing: string[] }}
 */
const calculateBasicMatch = (resumeKeywords, jdKeywords) => {
  const matched = jdKeywords.filter((kw) =>
    resumeKeywords.some((rk) => rk.toLowerCase() === kw.toLowerCase())
  );
  const missing = jdKeywords.filter(
    (kw) => !resumeKeywords.some((rk) => rk.toLowerCase() === kw.toLowerCase())
  );
  const score =
    jdKeywords.length > 0
      ? Math.round((matched.length / jdKeywords.length) * 100)
      : 0;

  return { score, matched, missing };
};

module.exports = { extractKeywords, calculateBasicMatch };
