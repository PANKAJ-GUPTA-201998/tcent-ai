import { Link } from 'react-router-dom';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const NAV_LINKS = [
  { label: 'About',   to: '/' },
  { label: 'Privacy', to: '/login' },
  { label: 'Terms',   to: '/login' },
  { label: 'Contact', to: '/login' },
];

const SOCIAL_LINKS = [
  { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: XIcon,        href: 'https://twitter.com',  label: 'Twitter'  },
  { icon: GithubIcon,   href: 'https://github.com',   label: 'GitHub'   },
];

const Footer = () => (
  <footer style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.04)' }}>

    {/* Trust bar */}
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#475569' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#059669" strokeOpacity="0.5" />
            <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Trusted by{' '}
          <span className="font-semibold" style={{ color: '#64748B' }}>450+ working professionals</span>
          {' '}earning ₹5L–₹50L annually
        </div>
      </div>
    </div>

    {/* Main footer row */}
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">

      {/* Brand */}
      <div className="flex flex-col items-center sm:items-start gap-1">
        <span className="text-sm font-black text-white tracking-tight">
          Tcent<span style={{ color: '#059669' }}>.AI</span>
        </span>
        <span className="text-xs" style={{ color: '#1E293B' }}>
          © {new Date().getFullYear()} Tcent.AI · Premium Career Growth Platform
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-5">
        {NAV_LINKS.map(({ label, to }) => (
          <Link key={label} to={to}
            className="text-xs transition-colors"
            style={{ color: '#334155' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#64748B'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#334155'; }}>
            {label}
          </Link>
        ))}
      </nav>

      {/* Social icons */}
      <div className="flex items-center gap-3">
        {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="transition-colors" style={{ color: '#334155' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#059669'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#334155'; }}>
            <Icon size={17} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
