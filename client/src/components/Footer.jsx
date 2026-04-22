import { Link } from 'react-router-dom';
import { X, Globe } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About',   to: '/landing' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Contact', to: '/contact' },
];

const GithubIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: GithubIcon, href: 'https://github.com',   label: 'GitHub' },
  { icon: X,          href: 'https://twitter.com',  label: 'Twitter' },
  { icon: Globe,      href: 'https://linkedin.com', label: 'LinkedIn' },
];

const Footer = () => (
  <footer className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950">

    {/* Trust bar */}
    <div className="border-b border-gray-100 dark:border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#3B82F6" strokeOpacity="0.5" />
            <path d="M5 8l2 2 4-4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Trusted by{' '}
          <span className="font-semibold text-gray-600 dark:text-slate-400">1,200+ students</span>
          {' '}across India
        </span>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

      {/* Brand + copyright */}
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500">
        <span className="font-semibold text-gray-700 dark:text-slate-300">Tcent.AI</span>
        <span>&middot;</span>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-5">
        {NAV_LINKS.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="text-sm text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Social icons */}
      <div className="flex items-center gap-3">
        {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

    </div>
  </footer>
);

export default Footer;
