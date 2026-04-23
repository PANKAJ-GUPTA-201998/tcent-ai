/**
 * OAuth Controller — Google & LinkedIn
 *
 * Stateless flow (no sessions, works in Vercel serverless):
 *   1. /google         → redirect browser to Google consent screen
 *   2. /google/callback → exchange code → find/create user → JWT → redirect to frontend
 *
 * Required env vars (add to .env.local and Vercel project settings):
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 *   LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET
 *   FRONTEND_URL  (e.g. http://localhost:5174 or https://tcent-ai.vercel.app)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Build the base URL the API is being served from.
 * Vercel terminates TLS at the edge, so trust x-forwarded-proto.
 */
const apiBaseUrl = (req) => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return `${proto}://${req.get('host')}`;
};

const frontendUrl = () =>
  process.env.FRONTEND_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5174');

/* ── Google OAuth ───────────────────────────────────────────────────────────── */

exports.googleRedirect = (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID.' });
  }
  // Sign a short-lived JWT as the state param (stateless CSRF protection)
  const state = jwt.sign({ ts: Date.now(), provider: 'google' }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  `${apiBaseUrl(req)}/api/auth/google/callback`,
    scope:         'openid email profile',
    response_type: 'code',
    access_type:   'offline',
    prompt:        'select_account',
    state,
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

exports.googleCallback = async (req, res) => {
  const { code, state, error: oauthError } = req.query;
  const fe = frontendUrl();

  if (oauthError) {
    return res.redirect(`${fe}/oauth/callback?error=${encodeURIComponent(oauthError)}`);
  }

  try {
    // Verify state to prevent CSRF
    jwt.verify(state, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    // Exchange code → access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:  `${apiBaseUrl(req)}/api/auth/google/callback`,
        grant_type:    'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData);
      throw new Error('Google token exchange failed');
    }

    // Fetch user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    if (!profile.email) throw new Error('Could not fetch Google profile');

    // Find existing user (by googleId or email) or create new
    let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.email }] });
    if (!user) {
      user = await User.create({
        email:    profile.email,
        name:     profile.name || profile.email.split('@')[0],
        googleId: profile.id,
        avatar:   profile.picture || null,
        provider: 'google',
      });
    } else if (!user.googleId) {
      // Existing email/password user — link Google account
      user.googleId = profile.id;
      user.provider = 'google';
      if (profile.picture && !user.avatar) user.avatar = profile.picture;
      await user.save();
    }

    const token = generateToken(user._id);
    const qs = new URLSearchParams({ token, email: user.email, name: user.name || '' });
    res.redirect(`${fe}/oauth/callback?${qs}`);
  } catch (err) {
    console.error('Google callback error:', err.message);
    res.redirect(`${fe}/oauth/callback?error=${encodeURIComponent('Google sign-in failed. Please try again.')}`);
  }
};

/* ── LinkedIn OAuth ─────────────────────────────────────────────────────────── */

exports.linkedinRedirect = (req, res) => {
  if (!process.env.LINKEDIN_CLIENT_ID) {
    return res.status(503).json({ message: 'LinkedIn OAuth not configured. Set LINKEDIN_CLIENT_ID.' });
  }
  const state = jwt.sign({ ts: Date.now(), provider: 'linkedin' }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     process.env.LINKEDIN_CLIENT_ID,
    redirect_uri:  `${apiBaseUrl(req)}/api/auth/linkedin/callback`,
    scope:         'openid profile email',
    state,
  });

  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
};

exports.linkedinCallback = async (req, res) => {
  const { code, state, error: oauthError } = req.query;
  const fe = frontendUrl();

  if (oauthError) {
    return res.redirect(`${fe}/oauth/callback?error=${encodeURIComponent(oauthError)}`);
  }

  try {
    // Verify state
    jwt.verify(state, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    // Exchange code → access token
    const tokenParams = new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  `${apiBaseUrl(req)}/api/auth/linkedin/callback`,
      client_id:     process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    tokenParams.toString(),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('LinkedIn token exchange failed:', tokenData);
      throw new Error('LinkedIn token exchange failed');
    }

    // Fetch user info (OpenID Connect userinfo endpoint)
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    if (!profile.email) throw new Error('Could not fetch LinkedIn profile');

    const linkedinId = profile.sub;
    const name = profile.name || `${profile.given_name ?? ''} ${profile.family_name ?? ''}`.trim() || profile.email.split('@')[0];
    const avatar = profile.picture || null;

    // Find or create user
    let user = await User.findOne({ $or: [{ linkedinId }, { email: profile.email }] });
    if (!user) {
      user = await User.create({
        email:      profile.email,
        name,
        linkedinId,
        avatar,
        provider:   'linkedin',
      });
    } else if (!user.linkedinId) {
      user.linkedinId = linkedinId;
      user.provider = 'linkedin';
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = generateToken(user._id);
    const qs = new URLSearchParams({ token, email: user.email, name: user.name || '' });
    res.redirect(`${fe}/oauth/callback?${qs}`);
  } catch (err) {
    console.error('LinkedIn callback error:', err.message);
    res.redirect(`${fe}/oauth/callback?error=${encodeURIComponent('LinkedIn sign-in failed. Please try again.')}`);
  }
};
