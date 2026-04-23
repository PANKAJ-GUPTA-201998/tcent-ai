import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AICareerAdvisor from './components/ai/AICareerAdvisor';
import ResumeUpload from './components/upload/ResumeUpload';
import CareerDashboard from './pages/CareerDashboard';
import CareerPathDetail from './pages/CareerPathDetail';
import Landing from './pages/Landing';
import Footer from './components/Footer';
import PersonalityResults from './components/PersonalityResults';
import { default as PersonalityQuiz } from './components/PersonalityQuiz';
import AssessmentPage from './pages/AssessmentPage';
import CareersPage from './pages/CareersPage';
import ATSChecker from './pages/ATSChecker';
import OAuthCallback from './pages/OAuthCallback';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login"          element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register"       element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/privacy"        element={<PageWrapper><Privacy /></PageWrapper>} />
        <Route path="/terms"          element={<PageWrapper><Terms /></PageWrapper>} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-advisor"
          element={
            <ProtectedRoute>
              <PageWrapper><AICareerAdvisor /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute>
              <PageWrapper><ResumeUpload /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/career"
          element={
            <ProtectedRoute>
              <PageWrapper><CareerDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/career/:pathId"
          element={
            <ProtectedRoute>
              <PageWrapper><CareerPathDetail /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/personality/quiz"
          element={
            <ProtectedRoute>
              <PageWrapper><PersonalityQuiz /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/personality/results"
          element={
            <ProtectedRoute>
              <PageWrapper><PersonalityResults /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/personality/results/:userId"
          element={
            <ProtectedRoute>
              <PageWrapper><PersonalityResults /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <PageWrapper><AssessmentPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <PageWrapper><CareersPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ats-checker"
          element={
            <ProtectedRoute>
              <PageWrapper><ATSChecker /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* 404 — must be last */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col" style={{ background: '#0F172A', color: '#F1F5F9' }}>
            <Navbar />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
