import { useAuth } from '../context/AuthContext';
import { userDashboardData } from '../data/dashboardData';

import HeroCard          from '../components/dashboard/HeroCard';
import { ResumeScoreCard, SkillsGapCard, InterviewCard, NetworkCard } from '../components/dashboard/StatCards';
import ActionPlan        from '../components/dashboard/ActionPlan';
import CareerTimeline    from '../components/dashboard/CareerTimeline';
import AIRecommendations from '../components/dashboard/AIRecommendations';
import RecentActivity    from '../components/dashboard/RecentActivity';
import PremiumUpsell     from '../components/dashboard/PremiumUpsell';
import FeatureHub        from '../components/dashboard/FeatureHub';

const Dashboard = () => {
  const { user } = useAuth();

  // Merge auth user name into mock data (real data would come from API)
  const data = {
    ...userDashboardData,
    user: {
      ...userDashboardData.user,
      name: user?.name || user?.email?.split('@')[0] || userDashboardData.user.name,
    },
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── Hero ── */}
        <HeroCard data={data} userName={data.user.name} />

        {/* ── All Tools hub ── */}
        <FeatureHub />

        {/* ── 4-col stat grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <ResumeScoreCard scores={data.scores} />
          <SkillsGapCard   skillsGap={data.skillsGap} />
          <InterviewCard   scores={data.scores} />
          <NetworkCard     network={data.network} />
        </div>

        {/* ── Action plan + Career timeline (side by side on lg) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActionPlan   actionPlan={data.actionPlan} />
          <CareerTimeline careerPath={data.careerPath} />
        </div>

        {/* ── AI recommendations (full width) ── */}
        <AIRecommendations recommendations={data.aiRecommendations} />

        {/* ── Activity + Premium upsell (side by side on lg) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentActivity activity={data.recentActivity} />
          <PremiumUpsell />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
