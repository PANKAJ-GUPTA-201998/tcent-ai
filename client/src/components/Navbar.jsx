import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, User, Upload, ScanSearch, LogOut, Menu, X, Star, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Active link ────────────────────────────────────────────── */
const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors px-1 py-0.5 ${
    isActive
      ? 'text-white'
      : 'text-slate-400 hover:text-white'
  }`;

/* ── Tools dropdown ─────────────────────────────────────────── */
const TOOLS = [
  { to: '/ats-checker',   icon: ScanSearch, label: 'ATS Checker',    desc: 'Match resume to job description' },
  { to: '/upload-resume', icon: Upload,     label: 'Upload Resume',  desc: 'Parse & score your resume' },
  { to: '/careers',       icon: Star,       label: 'Career Matches', desc: 'Personality-based career suggestions' },
];

const ToolsMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-sm font-medium transition-colors px-1 py-0.5 text-slate-400 hover:text-white"
      >
        <LayoutGrid size={13} />
        Tools
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 pb-1.5">Quick Access</p>
          {TOOLS.map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-start gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── User avatar dropdown ───────────────────────────────────── */
const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase();
  const name    = user?.name ?? user?.email?.split('@')[0] ?? 'User';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center select-none">
          {initial}
        </div>
        <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate hidden sm:block">{name}</span>
        <ChevronDown size={13} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
          <div className="px-3 py-2 border-b border-slate-700/60">
            <p className="text-xs font-semibold text-slate-200 truncate">{name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          {[
            { to: '/profile', icon: User, label: 'Profile' },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
              <Icon size={14} className="text-slate-500" /> {label}
            </Link>
          ))}
          <div className="border-t border-slate-700/60 mt-1 pt-1">
            <button onClick={() => { setOpen(false); onLogout(); navigate('/login'); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Mobile menu ────────────────────────────────────────────── */
const MobileMenu = ({ open, onClose, isAuthenticated, onLogout }) => {
  if (!open) return null;
  return (
    <div className="sm:hidden border-t border-slate-800 bg-[#0F172A] px-4 pb-5 pt-3 space-y-1">
      {isAuthenticated ? (
        <>
          <NavLink to="/dashboard"    onClick={onClose} className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/career"       onClick={onClose} className={navLinkClass}>Career Intel</NavLink>
          <NavLink to="/assessment"   onClick={onClose} className={navLinkClass}>Assessment</NavLink>
          <NavLink to="/ai-advisor"   onClick={onClose} className={navLinkClass}>AI Advisor</NavLink>
          <NavLink to="/ats-checker"  onClick={onClose} className={navLinkClass}>ATS Checker</NavLink>
          <NavLink to="/upload-resume" onClick={onClose} className={navLinkClass}>Upload Resume</NavLink>
          <NavLink to="/careers"      onClick={onClose} className={navLinkClass}>Career Matches</NavLink>
          <NavLink to="/profile"      onClick={onClose} className={navLinkClass}>Profile</NavLink>
          <div className="pt-2">
            <button onClick={() => { onLogout(); onClose(); }}
              className="w-full text-left text-sm text-red-400 px-1 py-0.5">Logout</button>
          </div>
        </>
      ) : (
        <>
          <NavLink to="/"         onClick={onClose} className={navLinkClass}>Home</NavLink>
          <NavLink to="/career"   onClick={onClose} className={navLinkClass}>Services</NavLink>
          <NavLink to="/login"    onClick={onClose} className={navLinkClass}>Login</NavLink>
          <div className="pt-2">
            <Link to="/register" onClick={onClose}
              className="block w-full text-center px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors">
              Book Strategy Call
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Navbar ─────────────────────────────────────────────────── */
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl'
          : 'bg-[#0F172A]/80 backdrop-blur-sm border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-base font-black text-white tracking-tight">
              Tcent<span className="text-emerald-400">.AI</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold text-emerald-500/70 border border-emerald-800/50 rounded px-1.5 py-0.5 tracking-wider uppercase">
              Premium
            </span>
          </Link>

          {/* Primary nav — desktop */}
          <nav className="hidden sm:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard"  className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/career"     className={navLinkClass}>Career Intel</NavLink>
                <NavLink to="/assessment" className={navLinkClass}>Assessment</NavLink>
                <NavLink to="/ai-advisor" className={navLinkClass}>AI Advisor</NavLink>
                <ToolsMenu />
              </>
            ) : (
              <>
                <NavLink to="/"                end className={navLinkClass}>Home</NavLink>
                <a href="/#services"           className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Services</a>
                <a href="/#testimonials"       className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Success Stories</a>
                <a href="/#pricing"            className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
              </>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <UserMenu user={user} onLogout={handleLogout} />
                <button onClick={() => setMobileOpen(o => !o)}
                  className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
                  aria-label="Toggle menu">
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors px-2 py-1">
                  Login
                </Link>
                <Link to="/register"
                  className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    boxShadow: '0 0 18px rgba(5,150,105,0.35)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(5,150,105,0.55)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(5,150,105,0.35)'; }}
                >
                  Book Call
                </Link>
                <button onClick={() => setMobileOpen(o => !o)}
                  className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 transition-colors">
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Navbar;
