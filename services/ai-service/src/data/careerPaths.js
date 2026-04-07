// ============================================
// Career Paths Data
// ============================================
// Static career path definitions with required skills,
// salary ranges (INR LPA), and growth info

const careerPaths = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    emoji: '🎨',
    description: 'Build user interfaces and web experiences',
    salaryRange: { min: 4, max: 18, currency: 'LPA' },
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git', 'REST APIs'],
    bonusSkills: ['Next.js', 'Vue.js', 'Tailwind CSS', 'Webpack', 'Testing'],
    demandLevel: 'High',
    growthRate: '25%'
  },
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    emoji: '⚙️',
    description: 'Build APIs, databases, and server-side logic',
    salaryRange: { min: 5, max: 22, currency: 'LPA' },
    requiredSkills: ['Node.js', 'Python', 'SQL', 'REST APIs', 'Git', 'MongoDB', 'Authentication'],
    bonusSkills: ['Docker', 'Redis', 'Microservices', 'GraphQL', 'AWS'],
    demandLevel: 'Very High',
    growthRate: '28%'
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    emoji: '🚀',
    description: 'Work across frontend and backend systems',
    salaryRange: { min: 6, max: 28, currency: 'LPA' },
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'Git', 'REST APIs', 'CSS'],
    bonusSkills: ['TypeScript', 'Docker', 'AWS', 'Redis', 'Testing'],
    demandLevel: 'Very High',
    growthRate: '30%'
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    emoji: '📊',
    description: 'Analyze data and build ML models for insights',
    salaryRange: { min: 7, max: 35, currency: 'LPA' },
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization'],
    bonusSkills: ['TensorFlow', 'PyTorch', 'Spark', 'Tableau', 'R'],
    demandLevel: 'High',
    growthRate: '35%'
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    emoji: '🤖',
    description: 'Deploy and scale machine learning models in production',
    salaryRange: { min: 10, max: 45, currency: 'LPA' },
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Docker', 'AWS', 'REST APIs', 'Git'],
    bonusSkills: ['Kubernetes', 'MLflow', 'PyTorch', 'Spark', 'CI/CD'],
    demandLevel: 'Very High',
    growthRate: '40%'
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    emoji: '🔧',
    description: 'Automate deployments and manage cloud infrastructure',
    salaryRange: { min: 8, max: 32, currency: 'LPA' },
    requiredSkills: ['Linux', 'Docker', 'AWS', 'CI/CD', 'Git', 'Shell Scripting', 'Kubernetes'],
    bonusSkills: ['Terraform', 'Ansible', 'Monitoring', 'Security', 'Python'],
    demandLevel: 'High',
    growthRate: '32%'
  },
  {
    id: 'android-dev',
    title: 'Android Developer',
    emoji: '📱',
    description: 'Build native Android mobile applications',
    salaryRange: { min: 4, max: 20, currency: 'LPA' },
    requiredSkills: ['Kotlin', 'Java', 'Android SDK', 'REST APIs', 'Git', 'SQL', 'XML'],
    bonusSkills: ['Jetpack Compose', 'MVVM', 'Firebase', 'Testing', 'Play Store'],
    demandLevel: 'High',
    growthRate: '20%'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    emoji: '📈',
    description: 'Turn raw data into business insights',
    salaryRange: { min: 4, max: 16, currency: 'LPA' },
    requiredSkills: ['SQL', 'Excel', 'Python', 'Data Visualization', 'Statistics', 'Tableau'],
    bonusSkills: ['Power BI', 'R', 'Pandas', 'A/B Testing', 'Google Analytics'],
    demandLevel: 'High',
    growthRate: '22%'
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architect',
    emoji: '☁️',
    description: 'Design scalable cloud infrastructure solutions',
    salaryRange: { min: 15, max: 55, currency: 'LPA' },
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Networking', 'Security', 'Linux', 'Terraform'],
    bonusSkills: ['GCP', 'Azure', 'Cost Optimization', 'Microservices', 'CI/CD'],
    demandLevel: 'Very High',
    growthRate: '38%'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    emoji: '🔐',
    description: 'Protect systems and data from security threats',
    salaryRange: { min: 6, max: 30, currency: 'LPA' },
    requiredSkills: ['Networking', 'Linux', 'Security', 'Python', 'Risk Assessment', 'Firewalls'],
    bonusSkills: ['Penetration Testing', 'SIEM', 'Compliance', 'Cloud Security', 'Forensics'],
    demandLevel: 'Very High',
    growthRate: '33%'
  }
];

module.exports = careerPaths;
