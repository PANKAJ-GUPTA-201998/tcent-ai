export const userDashboardData = {
  user: {
    name: 'Pankaj Kumar',
    currentSalary: 12,
    targetSalary: 28,
    currentRole: 'Software Engineer',
    targetRole: 'Senior SDE',
    nextMilestone: 'Senior SDE in 8 months',
    company: 'Current Company',
  },
  scores: {
    careerCompatibility: 87,
    resumeScore: 72,
    interviewReadiness: 45,
    industryAvgResume: 65,
  },
  skillsGap: {
    missing: ['React', 'AWS', 'System Design'],
    timeToLearn: '4–6 months',
  },
  network: {
    linkedinConnections: 342,
    pendingReferrals: 2,
    status: 'Below average',
  },
  actionPlan: {
    progress: 40,
    tasks: [
      { id: 1, text: 'Complete System Design course', status: 'in_progress', detail: '2/5 modules' },
      { id: 2, text: 'Update LinkedIn with new skills', status: 'pending', detail: null },
      { id: 3, text: 'Practice 10 coding questions', status: 'pending', detail: null },
      { id: 4, text: 'Apply to 5 target companies', status: 'pending', detail: null },
    ],
  },
  careerPath: [
    { time: 'Now', salary: 12, role: 'Software Engineer' },
    { time: '6 months', salary: 15, role: 'SDE II' },
    { time: '12 months', salary: 28, role: 'Senior SDE' },
  ],
  aiRecommendations: [
    { icon: '🎯', text: 'Apply to Google — 78% profile match', metadata: 'Based on your skills + experience', cta: 'View Job', to: '/career' },
    { icon: '📝', text: "Add 'microservices' to resume keywords", metadata: 'Found in 85% of Senior SDE job descriptions', cta: 'Update Resume', to: '/upload-resume' },
    { icon: '🤝', text: '3 alumni work at Amazon — get a referral', metadata: 'Referrals increase selection chances by 40%', cta: 'Connect Now', to: '/ai-advisor' },
    { icon: '📚', text: 'Complete AWS Solutions Architect cert', metadata: 'Top missing credential in your target roles', cta: 'View Path', to: '/career' },
  ],
  recentActivity: [
    { icon: '📄', text: 'Resume reviewed by AI', time: '3 days ago' },
    { icon: '🎯', text: 'Personality assessment completed', time: '1 week ago' },
    { icon: '💼', text: '5 jobs saved to wishlist', time: 'Yesterday' },
    { icon: '📚', text: 'Started AWS Solutions Architect course', time: '2 days ago' },
    { icon: '🔍', text: 'ATS score checked — 72/100', time: '4 days ago' },
  ],
};
