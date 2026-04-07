import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            Tcent.AI
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-slate-300 hover:text-white transition">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-slate-300 hover:text-white transition">
                  Profile
                </Link>
                <Link to="/ai-advisor" className="text-slate-300 hover:text-white transition">
                  AI Career Advisor
                </Link>
                <Link to="/upload-resume" className="text-slate-300 hover:text-white transition">
                  Upload Resume
                </Link>
                <Link to="/career" className="text-slate-300 hover:text-white transition">
                  Career Intelligence
                </Link>
                <Link to="/assessment" className="text-slate-300 hover:text-white transition">
                  Assessment
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 text-sm">{user?.email}</span>
                  <Button variant="danger" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition">
                  Login
                </Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Register
                </Link>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
