import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import OAuthButtons from '../components/auth/OAuthButtons';

const inputCls =
  'w-full px-4 py-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 transition';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already logged in → skip register page
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    setLoading(true);
    const result = await register(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0F172A' }}>
      <div className="max-w-md w-full rounded-2xl p-8" style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Start Growing</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>Join 450+ professionals on Tcent.AI</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            {loading ? 'Creating account…' : 'Register'}
          </Button>
        </form>

        <OAuthButtons label="Sign up" />

        <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline transition-colors" style={{ color: '#34D399' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
