import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import OAuthButtons from '../components/auth/OAuthButtons';

const inputCls =
  'w-full px-4 py-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 transition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already logged in → skip login page
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);

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
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>Sign in to your Tcent.AI account</p>
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
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <OAuthButtons label="Sign in" />

        <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold hover:underline transition-colors" style={{ color: '#34D399' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
