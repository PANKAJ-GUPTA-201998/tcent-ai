import axios from 'axios';
import { getLogoutFn } from '../context/AuthContext';

const api = axios.create({
  baseURL: '',
  timeout: 30000, // 30s — prevents hung requests on slow AI endpoints
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401: call logout (clears all storage + React state) then redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const logout = getLogoutFn();
      if (logout) logout();
      else {
        // fallback if called before AuthProvider mounts
        ['token', 'userEmail', 'userName'].forEach((k) => localStorage.removeItem(k));
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
