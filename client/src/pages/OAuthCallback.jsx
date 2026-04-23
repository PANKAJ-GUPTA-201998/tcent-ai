import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * OAuthCallback — /oauth/callback
 *
 * The backend redirects here after a successful Google / LinkedIn OAuth.
 * Query params:
 *   ?token=<jwt>&email=<email>&name=<name>   — success
 *   ?error=<message>                          — failure
 */
const OAuthCallback = () => {
  const [params]    = useSearchParams();
  const { loginWithOAuth, isAuthenticated } = useAuth();
  const navigate    = useNavigate();
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const token = params.get('token');
    const email = params.get('email');
    const name  = params.get('name');
    const error = params.get('error');

    if (error) {
      setErrMsg(error);
      return;
    }

    if (token && email) {
      loginWithOAuth(token, email, name || '');
      navigate('/dashboard', { replace: true });
    } else {
      setErrMsg('Authentication failed. Please try again.');
    }
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  if (errMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: '#0F172A' }}>
        <div className="max-w-sm w-full rounded-2xl p-8 text-center" style={{ background: '#1E293B', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-white font-bold mb-1">Sign-in failed</p>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>{errMsg}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ background: '#059669' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state while processing
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: '#0F172A' }}>
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      <p className="text-sm" style={{ color: '#475569' }}>Signing you in…</p>
    </div>
  );
};

export default OAuthCallback;
