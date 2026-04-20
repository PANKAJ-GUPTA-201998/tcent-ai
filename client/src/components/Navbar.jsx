import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, ChevronDown, User, Upload, ScanSearch, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/* ── Active link style ─────────────────────────────────────── */
const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors px-1 py-0.5 rounded ${
    isActive
      ? 'text-gray-900 dark:text-white'
      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
  }`;

/* ── User dropdown ─────────────────────────────────────────── */
const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase();
  const name = user?.name ?? user?.email?.split('@')[0] ?? 'User';

  const handleLogout = () => {
    setOpen(false);
    onLogout();
    navigate('/login');
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center select-none">
          {initial}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate hidden sm:block">
          {name}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">
          {/* User info */}
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* Secondary nav items */}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <User size={15} className="text-gray-400" /> Profile
          </Link>
          <Link
            to="/upload-resume"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Upload size={15} className="text-gray-400" /> Upload Resume
          </Link>
          <Link
            to="/ats-checker"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ScanSearch size={15} className="text-gray-400" /> ATS Checker
          </Link>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Mobile menu ───────────────────────────────────────────── */
const MobileMenu = ({ open, onClose, isAuthenticated, onLogout }) => {
  if (!open) return null;
  return (
    <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pb-4 pt-2 space-y-1">
      {isAuthenticated ? (
        <>
          <NavLink to="/dashboard" onClick={onClose} className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/career"    onClick={onClose} className={navLinkClass}>Career</NavLink>
          <NavLink to="/assessment" onClick={onClose} className={navLinkClass}>Assessment</NavLink>
          <NavLink to="/ai-advisor" onClick={onClose} className={navLinkClass}>AI Advisor</NavLink>
          <NavLink to="/profile"    onClick={onClose} className={navLinkClass}>Profile</NavLink>
          <NavLink to="/upload-resume" onClick={onClose} className={navLinkClass}>Upload Resume</NavLink>
          <NavLink to="/ats-checker"   onClick={onClose} className={navLinkClass}>ATS Checker</NavLink>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full text-left text-sm text-red-600 dark:text-red-400 px-1 py-0.5"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login"    onClick={onClose} className={navLinkClass}>Login</NavLink>
          <NavLink to="/register" onClick={onClose} className={navLinkClass}>Register</NavLink>
        </>
      )}
    </div>
  );
};

/* ── Navbar ────────────────────────────────────────────────── */
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
            Tcent<span className="text-blue-600">.AI</span>
          </Link>

          {/* Primary nav — desktop */}
          {isAuthenticated && (
            <nav className="hidden sm:flex items-center gap-5">
              <NavLink to="/dashboard"  className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/career"     className={navLinkClass}>Career</NavLink>
              <NavLink to="/assessment" className={navLinkClass}>Assessment</NavLink>
              <NavLink to="/ai-advisor"
                className={({ isActive }) =>
                  `text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`
                }
              >
                AI Advisor
              </NavLink>
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isAuthenticated ? (
              <>
                <UserMenu user={user} onLogout={handleLogout} />
                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileOpen((o) => !o)}
                  className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1"
                >
                  Login
                </Link>
                <Link to="/register"
                  className="text-sm font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
