/**
 * RIASEC Assessment Questions
 *
 * Based on Holland's Theory of Career Choice (John L. Holland, 1959).
 * RIASEC classifies personalities and work environments into six types:
 *
 *  R - Realistic:       Practical, hands-on, mechanical. Prefer working with
 *                       things, tools, or nature rather than people or ideas.
 *  I - Investigative:   Analytical, intellectual, scientific. Enjoy research,
 *                       data analysis, and solving complex abstract problems.
 *  A - Artistic:        Creative, expressive, original. Prefer unstructured
 *                       environments that allow imagination and self-expression.
 *  S - Social:          Helpful, empathetic, collaborative. Drawn to teaching,
 *                       counseling, mentoring, and community-oriented work.
 *  E - Enterprising:    Ambitious, persuasive, leadership-oriented. Enjoy
 *                       influencing people, leading teams, and driving results.
 *  C - Conventional:    Organized, detail-oriented, systematic. Prefer clear
 *                       procedures, accuracy, and data-driven environments.
 *
 * Each person's profile is expressed as a three-letter code (e.g. "ISE")
 * representing their top three types in descending strength order.
 *
 * Scoring: 5-point Likert scale per question (1 = Strongly Disagree,
 * 5 = Strongly Agree). Sum scores per trait; higher score = stronger fit.
 *
 * Questions below are tailored for Indian mid-career professionals (age 30–50).
 */

const riasecQuestions = [
  // ─── Realistic (R) ──────────────────────────────────────────────────────────
  {
    id: "R1",
    text: "I enjoy working with machines, tools, or equipment to get things done.",
    category: "riasec",
    trait: "realistic",
    direction: "positive",
  },
  {
    id: "R2",
    text: "I prefer hands-on tasks such as assembling, repairing, or operating physical systems over desk-based work.",
    category: "riasec",
    trait: "realistic",
    direction: "positive",
  },
  {
    id: "R3",
    text: "I find building or constructing things — whether on-site or in a workshop — deeply satisfying.",
    category: "riasec",
    trait: "realistic",
    direction: "positive",
  },
  {
    id: "R4",
    text: "I am comfortable working outdoors or in industrial settings such as factories, plants, or construction sites.",
    category: "riasec",
    trait: "realistic",
    direction: "positive",
  },
  {
    id: "R5",
    text: "I prefer solving practical, concrete problems over theoretical or abstract discussions.",
    category: "riasec",
    trait: "realistic",
    direction: "positive",
  },
  {
    id: "R6",
    text: "I take pride in producing tangible, physical results through my work — something I can see or touch.",
    category: "riasec",
    trait: "realistic",
    direction: "positive",
  },

  // ─── Investigative (I) ──────────────────────────────────────────────────────
  {
    id: "I1",
    text: "I enjoy analyzing large datasets or research findings to uncover patterns and insights.",
    category: "riasec",
    trait: "investigative",
    direction: "positive",
  },
  {
    id: "I2",
    text: "I like to thoroughly investigate a problem before proposing a solution.",
    category: "riasec",
    trait: "investigative",
    direction: "positive",
  },
  {
    id: "I3",
    text: "I am curious about how systems, technologies, or natural phenomena work at a deeper level.",
    category: "riasec",
    trait: "investigative",
    direction: "positive",
  },
  {
    id: "I4",
    text: "I enjoy roles that involve experimentation, hypothesis testing, or evidence-based decision making.",
    category: "riasec",
    trait: "investigative",
    direction: "positive",
  },
  {
    id: "I5",
    text: "I regularly seek out new technical knowledge, research papers, or industry studies relevant to my field.",
    category: "riasec",
    trait: "investigative",
    direction: "positive",
  },
  {
    id: "I6",
    text: "I find complex intellectual challenges — such as optimizing algorithms or diagnosing root causes — energizing rather than stressful.",
    category: "riasec",
    trait: "investigative",
    direction: "positive",
  },

  // ─── Artistic (A) ───────────────────────────────────────────────────────────
  {
    id: "A1",
    text: "I enjoy expressing ideas through creative mediums such as writing, design, video, or visual storytelling.",
    category: "riasec",
    trait: "artistic",
    direction: "positive",
  },
  {
    id: "A2",
    text: "I prefer work environments that give me freedom to experiment and innovate rather than follow fixed procedures.",
    category: "riasec",
    trait: "artistic",
    direction: "positive",
  },
  {
    id: "A3",
    text: "I am drawn to roles involving creative problem-solving — such as UX design, brand strategy, or product innovation.",
    category: "riasec",
    trait: "artistic",
    direction: "positive",
  },
  {
    id: "A4",
    text: "I bring an aesthetic sensibility to my work and care about how things look, feel, or are communicated.",
    category: "riasec",
    trait: "artistic",
    direction: "positive",
  },
  {
    id: "A5",
    text: "I often challenge conventional thinking and enjoy reimagining how things could be done differently.",
    category: "riasec",
    trait: "artistic",
    direction: "positive",
  },
  {
    id: "A6",
    text: "I find routine, repetitive tasks draining and feel most alive when working on something original.",
    category: "riasec",
    trait: "artistic",
    direction: "positive",
  },

  // ─── Social (S) ─────────────────────────────────────────────────────────────
  {
    id: "S1",
    text: "I actively mentor or coach junior colleagues and find it rewarding to help them grow professionally.",
    category: "riasec",
    trait: "social",
    direction: "positive",
  },
  {
    id: "S2",
    text: "I prefer working in collaborative teams over working independently on solo assignments.",
    category: "riasec",
    trait: "social",
    direction: "positive",
  },
  {
    id: "S3",
    text: "I am comfortable facilitating training sessions, workshops, or group discussions at work.",
    category: "riasec",
    trait: "social",
    direction: "positive",
  },
  {
    id: "S4",
    text: "I feel fulfilled when I can directly support a colleague's well-being or career development.",
    category: "riasec",
    trait: "social",
    direction: "positive",
  },
  {
    id: "S5",
    text: "I actively step in to resolve interpersonal conflicts or improve team dynamics.",
    category: "riasec",
    trait: "social",
    direction: "positive",
  },
  {
    id: "S6",
    text: "I am drawn to careers in education, healthcare, HR, social work, or community development.",
    category: "riasec",
    trait: "social",
    direction: "positive",
  },

  // ─── Enterprising (E) ───────────────────────────────────────────────────────
  {
    id: "E1",
    text: "I enjoy leading projects, setting ambitious goals, and holding the team accountable for results.",
    category: "riasec",
    trait: "enterprising",
    direction: "positive",
  },
  {
    id: "E2",
    text: "I am comfortable negotiating with clients, vendors, or senior stakeholders to reach favourable outcomes.",
    category: "riasec",
    trait: "enterprising",
    direction: "positive",
  },
  {
    id: "E3",
    text: "I thrive in competitive environments where taking initiative leads to visible business impact.",
    category: "riasec",
    trait: "enterprising",
    direction: "positive",
  },
  {
    id: "E4",
    text: "I aspire to — or currently hold — leadership roles where I have authority to make strategic decisions.",
    category: "riasec",
    trait: "enterprising",
    direction: "positive",
  },
  {
    id: "E5",
    text: "I enjoy pitching ideas, presenting business cases, or influencing key decisions in my organisation.",
    category: "riasec",
    trait: "enterprising",
    direction: "positive",
  },
  {
    id: "E6",
    text: "I am energised by entrepreneurial challenges — launching new ventures, products, or revenue streams.",
    category: "riasec",
    trait: "enterprising",
    direction: "positive",
  },

  // ─── Conventional (C) ───────────────────────────────────────────────────────
  {
    id: "C1",
    text: "I prefer clearly defined roles, structured workflows, and well-documented processes.",
    category: "riasec",
    trait: "conventional",
    direction: "positive",
  },
  {
    id: "C2",
    text: "I enjoy working with numbers, financial records, or spreadsheets and take care to ensure accuracy.",
    category: "riasec",
    trait: "conventional",
    direction: "positive",
  },
  {
    id: "C3",
    text: "I take pride in maintaining organised files, databases, and documentation that others can rely on.",
    category: "riasec",
    trait: "conventional",
    direction: "positive",
  },
  {
    id: "C4",
    text: "I am comfortable working within regulatory guidelines, compliance frameworks, or standard operating procedures.",
    category: "riasec",
    trait: "conventional",
    direction: "positive",
  },
  {
    id: "C5",
    text: "I am drawn to careers in accounting, finance, operations, auditing, supply chain, or administration.",
    category: "riasec",
    trait: "conventional",
    direction: "positive",
  },
  {
    id: "C6",
    text: "I find it satisfying to audit processes, spot inefficiencies, and ensure outputs consistently meet quality standards.",
    category: "riasec",
    trait: "conventional",
    direction: "positive",
  },
];

/**
 * Work Values Questions
 *
 * Work values are the intrinsic and extrinsic motivators that shape how people
 * find meaning and satisfaction in their careers. Understanding dominant values
 * helps match professionals to roles and cultures where they are likely to thrive.
 *
 * Six values assessed here:
 *  autonomy        – Need for independence and self-direction at work
 *  stability       – Preference for security, predictability, and financial certainty
 *  creativity      – Drive to innovate, experiment, and express original ideas
 *  impact          – Desire to do meaningful work that benefits others or society
 *  growth          – Motivation to learn continuously and advance professionally
 *  workLifeBalance – Priority placed on personal time, family, and well-being
 *
 * Scoring: 5-point Likert (1 = Strongly Disagree, 5 = Strongly Agree).
 * Reverse-scored items (direction: "negative") must be inverted before summing:
 *   adjusted score = 6 − raw score
 *
 * IDs follow the pattern WV_<TRAIT_CODE>_<N> for easy programmatic grouping.
 */

const workValuesQuestions = [
  // ─── Autonomy (WV_AUT) ──────────────────────────────────────────────────────
  {
    id: "WV_AUT_1",
    text: "I work best when I can decide how to approach my tasks without being told exactly what to do.",
    category: "workValues",
    trait: "autonomy",
    direction: "positive",
  },
  {
    id: "WV_AUT_2",
    text: "I find it frustrating when I need approval from multiple levels of management before taking action.",
    category: "workValues",
    trait: "autonomy",
    direction: "positive",
  },
  {
    id: "WV_AUT_3",
    text: "I prefer to have a senior leader closely monitor my day-to-day work to ensure I am on track.",
    category: "workValues",
    trait: "autonomy",
    direction: "negative",
  },

  // ─── Stability (WV_STB) ─────────────────────────────────────────────────────
  {
    id: "WV_STB_1",
    text: "Job security and a predictable monthly income are more important to me than a high-risk, high-reward role.",
    category: "workValues",
    trait: "stability",
    direction: "positive",
  },
  {
    id: "WV_STB_2",
    text: "Given my family's financial responsibilities, I need a role with a stable, assured salary.",
    category: "workValues",
    trait: "stability",
    direction: "positive",
  },
  {
    id: "WV_STB_3",
    text: "I am comfortable leaving a stable job to pursue an uncertain but exciting opportunity.",
    category: "workValues",
    trait: "stability",
    direction: "negative",
  },

  // ─── Creativity (WV_CRT) ────────────────────────────────────────────────────
  {
    id: "WV_CRT_1",
    text: "I actively look for opportunities to introduce new ideas or improve existing processes at work.",
    category: "workValues",
    trait: "creativity",
    direction: "positive",
  },
  {
    id: "WV_CRT_2",
    text: "I feel stifled in roles where I am expected to execute a fixed playbook without room for experimentation.",
    category: "workValues",
    trait: "creativity",
    direction: "positive",
  },
  {
    id: "WV_CRT_3",
    text: "I prefer to follow proven methods rather than experiment with new, untested approaches.",
    category: "workValues",
    trait: "creativity",
    direction: "negative",
  },

  // ─── Impact (WV_IMP) ────────────────────────────────────────────────────────
  {
    id: "WV_IMP_1",
    text: "I want my work to create a meaningful difference — for my organisation, community, or society at large.",
    category: "workValues",
    trait: "impact",
    direction: "positive",
  },
  {
    id: "WV_IMP_2",
    text: "I would accept a lower salary to work for an organisation whose mission I genuinely believe in.",
    category: "workValues",
    trait: "impact",
    direction: "positive",
  },
  {
    id: "WV_IMP_3",
    text: "The social or environmental contribution of my work does not influence my choice of employer.",
    category: "workValues",
    trait: "impact",
    direction: "negative",
  },

  // ─── Growth (WV_GRW) ────────────────────────────────────────────────────────
  {
    id: "WV_GRW_1",
    text: "I actively invest time in upskilling — through courses, certifications, or self-study — outside of work hours.",
    category: "workValues",
    trait: "growth",
    direction: "positive",
  },
  {
    id: "WV_GRW_2",
    text: "I evaluate job opportunities partly by how much they will accelerate my career progression in the next three to five years.",
    category: "workValues",
    trait: "growth",
    direction: "positive",
  },
  {
    id: "WV_GRW_3",
    text: "I am content staying in the same role for many years as long as the compensation is satisfactory.",
    category: "workValues",
    trait: "growth",
    direction: "negative",
  },

  // ─── Work-Life Balance (WV_WLB) ─────────────────────────────────────────────
  {
    id: "WV_WLB_1",
    text: "Protecting time for family, health, and personal interests is a non-negotiable priority when I evaluate a job.",
    category: "workValues",
    trait: "workLifeBalance",
    direction: "positive",
  },
  {
    id: "WV_WLB_2",
    text: "I value the flexibility to adjust my working hours so I can attend to family responsibilities without guilt.",
    category: "workValues",
    trait: "workLifeBalance",
    direction: "positive",
  },
  {
    id: "WV_WLB_3",
    text: "I am willing to regularly work late evenings and weekends if the role demands it.",
    category: "workValues",
    trait: "workLifeBalance",
    direction: "negative",
  },
];

/**
 * Big Five Personality Questions (mini-IPIP style)
 *
 * The Big Five (OCEAN) model is the most empirically validated framework for
 * measuring personality. Each of the five broad traits predicts distinct
 * career outcomes, leadership styles, and workplace behaviours.
 *
 *  Openness (O)          – Intellectual curiosity, imagination, and openness
 *                          to new experiences vs. preference for the familiar.
 *  Conscientiousness (C) – Self-discipline, organisation, and goal-directedness
 *                          vs. impulsivity and carelessness.
 *  Extraversion (E)      – Social energy, assertiveness, and positive affect
 *                          vs. introversion, quietness, and reserve.
 *  Agreeableness (A)     – Cooperation, trust, and empathy vs. competitiveness,
 *                          scepticism, and bluntness.
 *  Neuroticism (N)       – Tendency toward anxiety, moodiness, and emotional
 *                          reactivity vs. calm and emotional stability.
 *
 * Item structure: 4 questions per trait — 2 positive (direction: "positive")
 * and 2 reverse-scored (direction: "negative"). Reverse items must be inverted
 * before computing the trait total: adjusted = 6 − rawScore.
 *
 * Questions are written in the mini-IPIP validated style and adapted for
 * Indian mid-career professionals (age 30–50).
 *
 * IDs follow the pattern BF_<TRAIT_CODE>_<N>.
 */

const bigFiveQuestions = [
  // ─── Openness (BF_OPN) ──────────────────────────────────────────────────────
  {
    id: "BF_OPN_1",
    text: "I have a vivid imagination and often think about how things could be done in entirely new ways.",
    category: "bigFive",
    trait: "openness",
    direction: "positive",
  },
  {
    id: "BF_OPN_2",
    text: "I enjoy exploring ideas from fields outside my own domain — philosophy, art, science, or culture.",
    category: "bigFive",
    trait: "openness",
    direction: "positive",
  },
  {
    id: "BF_OPN_3",
    text: "I find abstract or theoretical discussions uninteresting and prefer to focus on practical realities.",
    category: "bigFive",
    trait: "openness",
    direction: "negative",
  },
  {
    id: "BF_OPN_4",
    text: "I prefer sticking to familiar routines rather than experimenting with new methods or approaches.",
    category: "bigFive",
    trait: "openness",
    direction: "negative",
  },

  // ─── Conscientiousness (BF_CON) ─────────────────────────────────────────────
  {
    id: "BF_CON_1",
    text: "I plan my work carefully, set clear priorities, and follow through on commitments reliably.",
    category: "bigFive",
    trait: "conscientiousness",
    direction: "positive",
  },
  {
    id: "BF_CON_2",
    text: "I pay close attention to detail and make sure my work is thorough before calling it done.",
    category: "bigFive",
    trait: "conscientiousness",
    direction: "positive",
  },
  {
    id: "BF_CON_3",
    text: "I often leave tasks unfinished and move on to the next thing before completing what I started.",
    category: "bigFive",
    trait: "conscientiousness",
    direction: "negative",
  },
  {
    id: "BF_CON_4",
    text: "I tend to be disorganised and find it difficult to keep track of deadlines and responsibilities.",
    category: "bigFive",
    trait: "conscientiousness",
    direction: "negative",
  },

  // ─── Extraversion (BF_EXT) ──────────────────────────────────────────────────
  {
    id: "BF_EXT_1",
    text: "I feel energised after spending time with a large group of colleagues or at professional networking events.",
    category: "bigFive",
    trait: "extraversion",
    direction: "positive",
  },
  {
    id: "BF_EXT_2",
    text: "I am talkative and find it easy to start conversations with people I have just met.",
    category: "bigFive",
    trait: "extraversion",
    direction: "positive",
  },
  {
    id: "BF_EXT_3",
    text: "I prefer to keep to myself at work and find extended social interaction draining.",
    category: "bigFive",
    trait: "extraversion",
    direction: "negative",
  },
  {
    id: "BF_EXT_4",
    text: "I am reserved in group settings and rarely speak up unless directly asked for my opinion.",
    category: "bigFive",
    trait: "extraversion",
    direction: "negative",
  },

  // ─── Agreeableness (BF_AGR) ─────────────────────────────────────────────────
  {
    id: "BF_AGR_1",
    text: "I go out of my way to help colleagues, even when it is not formally part of my responsibilities.",
    category: "bigFive",
    trait: "agreeableness",
    direction: "positive",
  },
  {
    id: "BF_AGR_2",
    text: "I trust people's intentions and give others the benefit of the doubt in ambiguous situations.",
    category: "bigFive",
    trait: "agreeableness",
    direction: "positive",
  },
  {
    id: "BF_AGR_3",
    text: "I am quick to point out flaws in others' ideas and do not soften criticism to spare feelings.",
    category: "bigFive",
    trait: "agreeableness",
    direction: "negative",
  },
  {
    id: "BF_AGR_4",
    text: "I prioritise winning an argument or achieving my goal over maintaining harmony with colleagues.",
    category: "bigFive",
    trait: "agreeableness",
    direction: "negative",
  },

  // ─── Neuroticism (BF_NEU) ───────────────────────────────────────────────────
  {
    id: "BF_NEU_1",
    text: "I frequently feel anxious or stressed about work deadlines, performance reviews, or job security.",
    category: "bigFive",
    trait: "neuroticism",
    direction: "positive",
  },
  {
    id: "BF_NEU_2",
    text: "My mood at work is significantly affected by setbacks, criticism, or unexpected changes in plans.",
    category: "bigFive",
    trait: "neuroticism",
    direction: "positive",
  },
  {
    id: "BF_NEU_3",
    text: "I remain calm and composed even when facing high-pressure situations or tight deadlines.",
    category: "bigFive",
    trait: "neuroticism",
    direction: "negative",
  },
  {
    id: "BF_NEU_4",
    text: "I recover quickly from professional setbacks and rarely dwell on mistakes for long.",
    category: "bigFive",
    trait: "neuroticism",
    direction: "negative",
  },
];

/**
 * Scoring Guide
 *
 * Centralises all scoring logic so callers never implement raw-score inversion
 * or trait aggregation ad-hoc. Import alongside the question arrays.
 *
 * Usage example:
 *   const raw = { BF_OPN_1: 4, BF_OPN_2: 5, BF_OPN_3: 2, BF_OPN_4: 1 };
 *   const score = scoringGuide.calculateTraitScore(raw, "openness", bigFiveQuestions);
 *   // returns (4 + 5 + (6-2) + (6-1)) / 4 = 18/4 = 4.5
 */
const scoringGuide = {
  likertScale: {
    min: 1,
    max: 5,
    labels: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree",
    ],
  },

  /** Invert a single Likert response for a reverse-scored item. */
  reverseScore(score) {
    return 6 - score;
  },

  /**
   * Calculate the mean trait score from a map of answers.
   *
   * @param {Object} answers   - Map of { questionId: rawScore (1-5) }
   * @param {string} trait     - Trait name to filter questions by
   * @param {Array}  questions - Question array (bigFiveQuestions, riasecQuestions, etc.)
   * @returns {number} Mean score (1–5), or 0 if no matching answers found.
   *
   * Reverse-scored items are automatically inverted before averaging.
   * Missing answers are skipped (partial completion is handled gracefully).
   */
  calculateTraitScore(answers, trait, questions) {
    const traitQuestions = questions.filter((q) => q.trait === trait);
    if (traitQuestions.length === 0) return 0;

    let total = 0;
    let count = 0;

    for (const question of traitQuestions) {
      const raw = answers[question.id];
      if (raw === undefined || raw === null) continue;

      const score =
        question.direction === "negative" ? this.reverseScore(raw) : raw;

      total += score;
      count += 1;
    }

    return count === 0 ? 0 : parseFloat((total / count).toFixed(2));
  },
};

module.exports = { riasecQuestions, workValuesQuestions, bigFiveQuestions, scoringGuide };
