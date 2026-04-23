import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-base font-bold text-white mb-3">{title}</h2>
    <div className="text-sm leading-relaxed space-y-2" style={{ color: '#94A3B8' }}>
      {children}
    </div>
  </section>
);

const Privacy = () => (
  <div className="min-h-screen" style={{ background: '#0F172A' }}>
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: '#475569' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <h1 className="text-2xl font-black text-white mb-1">Privacy Policy</h1>
        <p className="text-xs mb-10" style={{ color: '#475569' }}>Last updated: April 2025</p>

        <Section title="1. Information We Collect">
          <p>We collect information you provide directly — such as your name, email address, and any resume content you upload — when you register for and use Tcent.AI.</p>
          <p>We also collect usage data (pages visited, features used, device type) to improve the platform.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>Your data is used solely to provide, improve, and personalise the Tcent.AI service — including resume analysis, career path recommendations, and AI-powered advice.</p>
          <p>We do not sell your personal information to third parties.</p>
        </Section>

        <Section title="3. Resume and Career Data">
          <p>Resume files you upload are stored securely via Cloudinary and are used exclusively to power ATS analysis and career recommendations within the platform. You can delete your resume at any time from your profile settings.</p>
        </Section>

        <Section title="4. Data Security">
          <p>All data is transmitted over HTTPS. Passwords are hashed using bcrypt. API keys and credentials are stored server-side and are never exposed to the client.</p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>We use the following third-party services: Cloudinary (file storage), MongoDB Atlas (database), Groq (AI inference), and Google/LinkedIn OAuth (optional sign-in). Each is governed by their own privacy policies.</p>
        </Section>

        <Section title="6. Cookies">
          <p>We use only essential session cookies required for authentication. We do not use advertising or tracking cookies.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:info@tcent.ai" className="underline hover:text-white transition-colors">info@tcent.ai</a>.</p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>We may update this policy from time to time. We will notify registered users of material changes by email.</p>
        </Section>

        <Section title="9. Contact">
          <p>For privacy questions, contact us at <a href="mailto:info@tcent.ai" className="underline hover:text-white transition-colors">info@tcent.ai</a>.</p>
        </Section>
      </motion.div>
    </div>
  </div>
);

export default Privacy;
