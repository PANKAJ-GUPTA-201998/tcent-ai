/**
 * OAuthButtons — Google + LinkedIn sign-in buttons
 *
 * Uses window.location.href (full browser redirect) so the backend can
 * respond with a 302 → OAuth provider → callback → frontend /oauth/callback.
 */

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const OAuthButtons = ({ label = 'Continue' }) => {
  const handleGoogle   = () => { window.location.href = '/api/auth/google'; };
  const handleLinkedIn = () => { window.location.href = '/api/auth/linkedin'; };

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span className="text-xs font-medium" style={{ color: '#475569' }}>or</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border:     '1px solid rgba(255,255,255,0.1)',
          color:      '#E2E8F0',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <GoogleIcon />
        {label} with Google
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={handleLinkedIn}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border:     '1px solid rgba(255,255,255,0.1)',
          color:      '#E2E8F0',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <LinkedInIcon />
        {label} with LinkedIn
      </button>
    </div>
  );
};

export default OAuthButtons;
