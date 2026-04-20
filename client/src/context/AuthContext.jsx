import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AUTH_URL = '/api/auth';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

/* ── Check if a JWT is expired ────────────────────────────────────────────── */
const isTokenExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds; subtract 30s buffer so we catch near-expiry too
    return Date.now() >= (exp - 30) * 1000;
  } catch {
    return true; // malformed token → treat as expired
  }
};

/* ── Clear all auth keys from localStorage ────────────────────────────────── */
const clearStorage = () => {
  ['token', 'userEmail', 'userName'].forEach((k) => localStorage.removeItem(k));
};

/* ── Singleton logout reference so api.js interceptor can call it ─────────── */
let _logoutFn = null;
export const getLogoutFn = () => _logoutFn;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* On mount: restore session only if token is still valid */
  useEffect(() => {
    const token     = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userEmail && !isTokenExpired(token)) {
      setUser({
        email: userEmail,
        name: localStorage.getItem('userName') || userEmail.split('@')[0],
      });
    } else if (token) {
      // Token exists but is expired — clean up silently
      clearStorage();
    }

    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setUser(null);
  }, []);

  // Register the logout fn so api.js interceptor can call it without importing AuthContext
  useEffect(() => {
    _logoutFn = logout;
    return () => { _logoutFn = null; };
  }, [logout]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${AUTH_URL}/login`, { email, password });
      const { token, user: u } = data.data;

      localStorage.setItem('token',     token);
      localStorage.setItem('userEmail', u.email);
      localStorage.setItem('userName',  u.name ?? '');

      setUser({ email: u.email, name: u.name });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await axios.post(`${AUTH_URL}/register`, { email, password });
      const { token, user: u } = data.data;

      localStorage.setItem('token',     token);
      localStorage.setItem('userEmail', u.email);
      localStorage.setItem('userName',  u.name ?? '');

      setUser({ email: u.email, name: u.name });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const getToken = () => localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getToken, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
