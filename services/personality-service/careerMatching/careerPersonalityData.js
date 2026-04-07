/**
 * careerPersonalityData.js — Career Psychometric Profiles
 *
 * Each entry describes one tech career's ideal personality profile across
 * three instruments (RIASEC, Work Values, Big Five) plus Indian market data.
 *
 * ─── Schema ──────────────────────────────────────────────────────────────────
 *  id               — snake_case unique identifier
 *  title            — display name
 *  description      — one-sentence role summary
 *  industry         — broad category for UI grouping
 *  riasecCode       — 2–3 letter Holland code in priority order (e.g. "EIS")
 *  riasecWeights    — continuous weights per trait; values SUM TO 1.0
 *                     Only traits that meaningfully predict fit are included.
 *  workValuesIdeal  — ordered list of up to 3 most-satisfied work values;
 *                     position matters (index 0 = highest priority)
 *  bigFivePreference— ideal band per OCEAN trait: "high" | "medium" | "low" | "any"
 *                     "any" means the trait is not predictive for this career.
 *                     Band thresholds match scoringService.js: ≥70 high, ≥40 medium, <40 low
 *  salaryRange      — { min, max, currency } representative mid-career annual (INR)
 *  growthOutlook    — "low" | "medium" | "high" | "very_high"
 *  demandTrend      — "declining" | "stable" | "growing" | "high_growth"
 *  transitionFrom   — roles that commonly pivot into this career
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const CAREERS = [

  // ── 1. Product Manager ───────────────────────────────────────────────────────
  {
    id: 'product_manager',
    title: 'Product Manager',
    description:
      'Define product vision, own the roadmap, and coordinate engineering, design, and business stakeholders to ship customer value.',
    industry: 'technology',
    riasecCode: 'EIS',
    riasecWeights: { enterprising: 0.40, investigative: 0.35, social: 0.25 },
    workValuesIdeal: ['impact', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_500_000, max: 4_500_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'high_growth',
    transitionFrom: ['Software Engineer', 'Business Analyst', 'UX Designer'],
  },

  // ── 2. UX Designer ───────────────────────────────────────────────────────────
  {
    id: 'ux_designer',
    title: 'UX Designer',
    description:
      'Research user needs, create wireframes and prototypes, and craft intuitive experiences that solve real problems elegantly.',
    industry: 'design',
    riasecCode: 'AIS',
    riasecWeights: { artistic: 0.45, investigative: 0.30, social: 0.25 },
    workValuesIdeal: ['creativity', 'impact', 'growth'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'medium',
      extraversion:      'medium',
      agreeableness:     'high',
      neuroticism:       'low',
    },
    salaryRange: { min: 900_000, max: 2_800_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Graphic Designer', 'Frontend Developer', 'UX Researcher'],
  },

  // ── 3. Data Scientist ────────────────────────────────────────────────────────
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    description:
      'Extract actionable insights from large datasets using statistics, ML models, and data storytelling to drive business decisions.',
    industry: 'technology',
    riasecCode: 'IRA',
    riasecWeights: { investigative: 0.55, realistic: 0.30, artistic: 0.15 },
    workValuesIdeal: ['growth', 'autonomy', 'impact'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_400_000, max: 4_200_000, currency: 'INR' },
    growthOutlook: 'very_high',
    demandTrend: 'high_growth',
    transitionFrom: ['Data Analyst', 'Software Engineer', 'Research Scientist'],
  },

  // ── 4. Frontend Developer ────────────────────────────────────────────────────
  {
    id: 'frontend_developer',
    title: 'Frontend Developer',
    description:
      'Build responsive, accessible user interfaces using modern frameworks, translating designs into performant browser experiences.',
    industry: 'technology',
    riasecCode: 'AIR',
    riasecWeights: { artistic: 0.40, investigative: 0.35, realistic: 0.25 },
    workValuesIdeal: ['creativity', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'medium',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 700_000, max: 2_200_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['UI Designer', 'Full Stack Developer', 'Web Developer'],
  },

  // ── 5. Backend Developer ─────────────────────────────────────────────────────
  {
    id: 'backend_developer',
    title: 'Backend Developer',
    description:
      'Design and implement server-side logic, APIs, and data pipelines that power applications reliably at scale.',
    industry: 'technology',
    riasecCode: 'IRC',
    riasecWeights: { investigative: 0.40, realistic: 0.40, conventional: 0.20 },
    workValuesIdeal: ['growth', 'autonomy', 'stability'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 900_000, max: 2_800_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Full Stack Developer', 'Software Engineer', 'Systems Developer'],
  },

  // ── 6. DevOps Engineer ───────────────────────────────────────────────────────
  {
    id: 'devops_engineer',
    title: 'DevOps Engineer',
    description:
      'Automate CI/CD pipelines, manage cloud infrastructure, and bridge the gap between development and operations for faster, safer releases.',
    industry: 'technology',
    riasecCode: 'RIC',
    riasecWeights: { realistic: 0.45, investigative: 0.35, conventional: 0.20 },
    workValuesIdeal: ['stability', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_200_000, max: 3_500_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'high_growth',
    transitionFrom: ['Systems Administrator', 'Backend Developer', 'Cloud Engineer'],
  },

  // ── 7. ML Engineer ───────────────────────────────────────────────────────────
  {
    id: 'ml_engineer',
    title: 'ML Engineer',
    description:
      'Take ML models from research to production by building scalable training pipelines, serving infrastructure, and monitoring systems.',
    industry: 'technology',
    riasecCode: 'IRA',
    riasecWeights: { investigative: 0.50, realistic: 0.35, artistic: 0.15 },
    workValuesIdeal: ['growth', 'impact', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_600_000, max: 5_000_000, currency: 'INR' },
    growthOutlook: 'very_high',
    demandTrend: 'high_growth',
    transitionFrom: ['Data Scientist', 'Software Engineer', 'Research Engineer'],
  },

  // ── 8. Data Analyst ──────────────────────────────────────────────────────────
  {
    id: 'data_analyst',
    title: 'Data Analyst',
    description:
      'Transform raw data into clear reports and dashboards that guide product, marketing, and operations decisions.',
    industry: 'technology',
    riasecCode: 'ICR',
    riasecWeights: { investigative: 0.45, conventional: 0.35, realistic: 0.20 },
    workValuesIdeal: ['growth', 'stability', 'impact'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 600_000, max: 1_800_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Excel / BI Analyst', 'Software Engineer', 'Finance Analyst'],
  },

  // ── 9. QA Engineer ───────────────────────────────────────────────────────────
  {
    id: 'qa_engineer',
    title: 'QA Engineer',
    description:
      'Design and execute test strategies — manual and automated — to ensure software quality, reliability, and user confidence.',
    industry: 'technology',
    riasecCode: 'CIR',
    riasecWeights: { conventional: 0.45, investigative: 0.35, realistic: 0.20 },
    workValuesIdeal: ['stability', 'impact', 'growth'],
    bigFivePreference: {
      openness:          'low',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'medium',
    },
    salaryRange: { min: 500_000, max: 1_600_000, currency: 'INR' },
    growthOutlook: 'medium',
    demandTrend: 'stable',
    transitionFrom: ['Manual Tester', 'Software Engineer', 'Support Engineer'],
  },

  // ── 10. Tech Lead ────────────────────────────────────────────────────────────
  {
    id: 'tech_lead',
    title: 'Tech Lead',
    description:
      'Guide a small engineering team technically, set coding standards, make architecture decisions, and mentor junior engineers.',
    industry: 'technology',
    riasecCode: 'EIR',
    riasecWeights: { enterprising: 0.35, investigative: 0.40, realistic: 0.25 },
    workValuesIdeal: ['growth', 'impact', 'autonomy'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 2_500_000, max: 6_500_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Senior Software Engineer', 'Backend Developer', 'Full Stack Developer'],
  },

  // ── 11. Engineering Manager ──────────────────────────────────────────────────
  {
    id: 'engineering_manager',
    title: 'Engineering Manager',
    description:
      'Lead and grow engineering teams through hiring, performance management, and creating the conditions for high-velocity delivery.',
    industry: 'technology',
    riasecCode: 'ESI',
    riasecWeights: { enterprising: 0.40, social: 0.35, investigative: 0.25 },
    workValuesIdeal: ['impact', 'growth', 'workLifeBalance'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'high',
      neuroticism:       'low',
    },
    salaryRange: { min: 3_000_000, max: 8_000_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Tech Lead', 'Senior Engineer', 'Scrum Master'],
  },

  // ── 12. Scrum Master ─────────────────────────────────────────────────────────
  {
    id: 'scrum_master',
    title: 'Scrum Master',
    description:
      'Facilitate agile ceremonies, remove impediments, and coach teams to improve collaboration and delivery cadence.',
    industry: 'technology',
    riasecCode: 'SEC',
    riasecWeights: { social: 0.45, enterprising: 0.35, conventional: 0.20 },
    workValuesIdeal: ['impact', 'workLifeBalance', 'stability'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'high',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_000_000, max: 2_800_000, currency: 'INR' },
    growthOutlook: 'medium',
    demandTrend: 'stable',
    transitionFrom: ['Project Manager', 'Business Analyst', 'Team Lead'],
  },

  // ── 13. Business Analyst ─────────────────────────────────────────────────────
  {
    id: 'business_analyst',
    title: 'Business Analyst',
    description:
      'Bridge business and technology by gathering requirements, modelling processes, and defining acceptance criteria for software solutions.',
    industry: 'consulting',
    riasecCode: 'IEC',
    riasecWeights: { investigative: 0.40, enterprising: 0.35, conventional: 0.25 },
    workValuesIdeal: ['impact', 'growth', 'stability'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 700_000, max: 2_200_000, currency: 'INR' },
    growthOutlook: 'medium',
    demandTrend: 'stable',
    transitionFrom: ['Software Engineer', 'Project Manager', 'Operations Analyst'],
  },

  // ── 14. UX Researcher ────────────────────────────────────────────────────────
  {
    id: 'ux_researcher',
    title: 'UX Researcher',
    description:
      'Plan and conduct user interviews, usability studies, and surveys to generate insights that inform product and design strategy.',
    industry: 'design',
    riasecCode: 'ISA',
    riasecWeights: { investigative: 0.45, social: 0.35, artistic: 0.20 },
    workValuesIdeal: ['impact', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'high',
      neuroticism:       'low',
    },
    salaryRange: { min: 900_000, max: 2_500_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['UX Designer', 'Sociologist', 'Psychologist'],
  },

  // ── 15. UI Designer ──────────────────────────────────────────────────────────
  {
    id: 'ui_designer',
    title: 'UI Designer',
    description:
      'Create visually compelling, on-brand interfaces — component libraries, style guides, and high-fidelity mockups — that delight users.',
    industry: 'design',
    riasecCode: 'AIE',
    riasecWeights: { artistic: 0.55, investigative: 0.25, enterprising: 0.20 },
    workValuesIdeal: ['creativity', 'impact', 'growth'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'medium',
      extraversion:      'medium',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 600_000, max: 2_000_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Graphic Designer', 'Frontend Developer', 'UX Designer'],
  },

  // ── 16. Full Stack Developer ─────────────────────────────────────────────────
  {
    id: 'full_stack_developer',
    title: 'Full Stack Developer',
    description:
      'Own features end-to-end — from database schema and REST APIs to responsive UI — delivering complete product increments independently.',
    industry: 'technology',
    riasecCode: 'IAR',
    riasecWeights: { investigative: 0.40, artistic: 0.35, realistic: 0.25 },
    workValuesIdeal: ['growth', 'autonomy', 'creativity'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'medium',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_000_000, max: 3_200_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Frontend Developer', 'Backend Developer', 'Web Developer'],
  },

  // ── 17. Mobile Developer ─────────────────────────────────────────────────────
  {
    id: 'mobile_developer',
    title: 'Mobile Developer',
    description:
      'Build iOS and Android applications using native or cross-platform frameworks, with a focus on smooth UX and device performance.',
    industry: 'technology',
    riasecCode: 'IAR',
    riasecWeights: { investigative: 0.38, artistic: 0.37, realistic: 0.25 },
    workValuesIdeal: ['creativity', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'medium',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 900_000, max: 2_800_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Frontend Developer', 'Full Stack Developer', 'Java Developer'],
  },

  // ── 18. Cloud Architect ──────────────────────────────────────────────────────
  {
    id: 'cloud_architect',
    title: 'Cloud Architect',
    description:
      'Design scalable, cost-efficient cloud infrastructure on AWS/GCP/Azure, define governance standards, and guide teams on cloud adoption.',
    industry: 'technology',
    riasecCode: 'IER',
    riasecWeights: { investigative: 0.45, enterprising: 0.30, realistic: 0.25 },
    workValuesIdeal: ['growth', 'autonomy', 'stability'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 2_500_000, max: 7_000_000, currency: 'INR' },
    growthOutlook: 'very_high',
    demandTrend: 'high_growth',
    transitionFrom: ['DevOps Engineer', 'Backend Developer', 'Systems Engineer'],
  },

  // ── 19. Security Engineer ────────────────────────────────────────────────────
  {
    id: 'security_engineer',
    title: 'Security Engineer',
    description:
      'Identify vulnerabilities, implement defensive controls, conduct threat modelling, and respond to incidents to protect systems and data.',
    industry: 'technology',
    riasecCode: 'IRE',
    riasecWeights: { investigative: 0.50, realistic: 0.30, enterprising: 0.20 },
    workValuesIdeal: ['stability', 'impact', 'growth'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'medium',
    },
    salaryRange: { min: 1_200_000, max: 3_800_000, currency: 'INR' },
    growthOutlook: 'very_high',
    demandTrend: 'high_growth',
    transitionFrom: ['Backend Developer', 'Network Engineer', 'Systems Administrator'],
  },

  // ── 20. Site Reliability Engineer ───────────────────────────────────────────
  {
    id: 'sre',
    title: 'Site Reliability Engineer',
    description:
      'Apply software engineering to operations problems — SLOs, error budgets, on-call rotations — to maximise system reliability at scale.',
    industry: 'technology',
    riasecCode: 'RIC',
    riasecWeights: { realistic: 0.40, investigative: 0.40, conventional: 0.20 },
    workValuesIdeal: ['stability', 'impact', 'growth'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_600_000, max: 4_500_000, currency: 'INR' },
    growthOutlook: 'very_high',
    demandTrend: 'high_growth',
    transitionFrom: ['DevOps Engineer', 'Backend Developer', 'Systems Engineer'],
  },

  // ── 21. Technical Writer ─────────────────────────────────────────────────────
  {
    id: 'technical_writer',
    title: 'Technical Writer',
    description:
      'Translate complex technical concepts into clear developer docs, API references, tutorials, and in-product help content.',
    industry: 'technology',
    riasecCode: 'AIC',
    riasecWeights: { artistic: 0.45, investigative: 0.35, conventional: 0.20 },
    workValuesIdeal: ['autonomy', 'creativity', 'workLifeBalance'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'high',
      neuroticism:       'low',
    },
    salaryRange: { min: 500_000, max: 1_600_000, currency: 'INR' },
    growthOutlook: 'medium',
    demandTrend: 'stable',
    transitionFrom: ['Software Engineer', 'Content Writer', 'QA Engineer'],
  },

  // ── 22. Solutions Architect ──────────────────────────────────────────────────
  {
    id: 'solutions_architect',
    title: 'Solutions Architect',
    description:
      'Design end-to-end technical solutions for enterprise clients, translating business requirements into scalable architectures.',
    industry: 'consulting',
    riasecCode: 'IER',
    riasecWeights: { investigative: 0.40, enterprising: 0.38, realistic: 0.22 },
    workValuesIdeal: ['impact', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'medium',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 2_500_000, max: 7_500_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Cloud Architect', 'Backend Developer', 'Tech Lead'],
  },

  // ── 23. CTO ──────────────────────────────────────────────────────────────────
  {
    id: 'cto',
    title: 'CTO',
    description:
      'Set technical strategy, build and lead the engineering organisation, and represent technology at the executive level.',
    industry: 'technology',
    riasecCode: 'EIS',
    riasecWeights: { enterprising: 0.50, investigative: 0.30, social: 0.20 },
    workValuesIdeal: ['impact', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'high',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 8_000_000, max: 25_000_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['VP Engineering', 'Engineering Manager', 'Tech Lead'],
  },

  // ── 24. VP Engineering ───────────────────────────────────────────────────────
  {
    id: 'vp_engineering',
    title: 'VP Engineering',
    description:
      'Own engineering culture, headcount planning, and cross-team execution to translate product strategy into delivered software.',
    industry: 'technology',
    riasecCode: 'ESI',
    riasecWeights: { enterprising: 0.45, social: 0.30, investigative: 0.25 },
    workValuesIdeal: ['impact', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'high',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 5_000_000, max: 15_000_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Engineering Manager', 'Director of Engineering', 'CTO'],
  },

  // ── 25. Data Engineer ────────────────────────────────────────────────────────
  {
    id: 'data_engineer',
    title: 'Data Engineer',
    description:
      'Build and maintain data pipelines, warehouses, and lakes that provide clean, reliable data for analytics and ML teams.',
    industry: 'technology',
    riasecCode: 'IRC',
    riasecWeights: { investigative: 0.45, realistic: 0.35, conventional: 0.20 },
    workValuesIdeal: ['growth', 'stability', 'autonomy'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_200_000, max: 3_600_000, currency: 'INR' },
    growthOutlook: 'very_high',
    demandTrend: 'high_growth',
    transitionFrom: ['Backend Developer', 'Software Engineer', 'Data Analyst'],
  },

  // ── 26. AI Researcher ────────────────────────────────────────────────────────
  {
    id: 'ai_researcher',
    title: 'AI Researcher',
    description:
      'Advance the state of the art in machine learning through novel algorithms, large-scale experiments, and published research.',
    industry: 'science',
    riasecCode: 'IA',
    riasecWeights: { investigative: 0.62, artistic: 0.25, realistic: 0.13 },
    workValuesIdeal: ['growth', 'autonomy', 'impact'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 2_500_000, max: 8_000_000, currency: 'INR' },
    growthOutlook: 'very_high',
    demandTrend: 'high_growth',
    transitionFrom: ['Data Scientist', 'ML Engineer', 'Research Scientist'],
  },

  // ── 27. Blockchain Developer ─────────────────────────────────────────────────
  {
    id: 'blockchain_developer',
    title: 'Blockchain Developer',
    description:
      'Design and implement smart contracts, DeFi protocols, and distributed ledger systems for Web3 and enterprise blockchain projects.',
    industry: 'technology',
    riasecCode: 'IRC',
    riasecWeights: { investigative: 0.48, realistic: 0.32, conventional: 0.20 },
    workValuesIdeal: ['autonomy', 'growth', 'impact'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'medium',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 1_200_000, max: 4_000_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Backend Developer', 'Software Engineer', 'Cryptography Researcher'],
  },

  // ── 28. Game Developer ───────────────────────────────────────────────────────
  {
    id: 'game_developer',
    title: 'Game Developer',
    description:
      'Develop interactive game experiences — gameplay systems, rendering, physics, and tooling — using engines like Unity or Unreal.',
    industry: 'media',
    riasecCode: 'AIR',
    riasecWeights: { artistic: 0.45, investigative: 0.35, realistic: 0.20 },
    workValuesIdeal: ['creativity', 'impact', 'growth'],
    bigFivePreference: {
      openness:          'high',
      conscientiousness: 'medium',
      extraversion:      'medium',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 700_000, max: 2_800_000, currency: 'INR' },
    growthOutlook: 'high',
    demandTrend: 'growing',
    transitionFrom: ['Software Engineer', 'Frontend Developer', 'Graphic Designer'],
  },

  // ── 29. Embedded Systems Engineer ───────────────────────────────────────────
  {
    id: 'embedded_systems_engineer',
    title: 'Embedded Systems Engineer',
    description:
      'Write low-level firmware and real-time software for microcontrollers and SoCs in automotive, IoT, industrial, and consumer devices.',
    industry: 'engineering',
    riasecCode: 'RIC',
    riasecWeights: { realistic: 0.52, investigative: 0.33, conventional: 0.15 },
    workValuesIdeal: ['stability', 'growth', 'autonomy'],
    bigFivePreference: {
      openness:          'medium',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 700_000, max: 2_500_000, currency: 'INR' },
    growthOutlook: 'medium',
    demandTrend: 'stable',
    transitionFrom: ['Electronics Engineer', 'Firmware Developer', 'Systems Programmer'],
  },

  // ── 30. Network Engineer ─────────────────────────────────────────────────────
  {
    id: 'network_engineer',
    title: 'Network Engineer',
    description:
      'Design, implement, and troubleshoot LAN/WAN networks, routers, and security appliances to keep organisations reliably connected.',
    industry: 'technology',
    riasecCode: 'RIC',
    riasecWeights: { realistic: 0.45, investigative: 0.35, conventional: 0.20 },
    workValuesIdeal: ['stability', 'growth', 'workLifeBalance'],
    bigFivePreference: {
      openness:          'low',
      conscientiousness: 'high',
      extraversion:      'low',
      agreeableness:     'medium',
      neuroticism:       'low',
    },
    salaryRange: { min: 600_000, max: 1_800_000, currency: 'INR' },
    growthOutlook: 'medium',
    demandTrend: 'stable',
    transitionFrom: ['Systems Administrator', 'IT Support Engineer', 'Telecom Engineer'],
  },
];

// ─── Helpers (consumed by matchingAlgorithm.js) ───────────────────────────────

/** Look up a career by its id. Returns undefined if not found. */
const findById = (id) => CAREERS.find((c) => c.id === id);

/** Return careers filtered by industry. */
const findByIndustry = (industry) =>
  CAREERS.filter((c) => c.industry === industry);

/** Return careers whose riasecCode contains at least one of the given letters. */
const findByRiasecLetters = (letters) => {
  const set = new Set(letters.map((l) => l.toUpperCase()));
  return CAREERS.filter((c) => c.riasecCode.split('').some((l) => set.has(l)));
};

module.exports = {
  CAREERS,
  findById,
  findByIndustry,
  findByRiasecLetters,
};
