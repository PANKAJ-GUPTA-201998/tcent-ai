// ============================================
// Career Service - Frontend API Calls
// ============================================

import axios from 'axios';

const AI_SERVICE_URL = '/api/career';
const UPLOAD_SERVICE_URL = '/api/upload';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch user's latest uploaded resume from upload-service
 */
export const getMyResume = async () => {
  try {
    const response = await axios.get(`${UPLOAD_SERVICE_URL}/my-files`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch resume' };
  }
};

/**
 * Fetch user profile from user-service
 * Returns null (not throws) if profile doesn't exist yet
 */
export const getMyProfile = async () => {
  try {
    const response = await axios.get('/api/profile', getAuthHeader());
    return response.data.profile || null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    return null; // silently ignore — profile is optional for analysis
  }
};

/**
 * Analyze resume text for career intelligence
 * @param {string} resumeText
 * @param {object|null} profile - optional user profile for personalization
 */
export const analyzeCareer = async (resumeText, profile = null) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/analyze`,
      { resumeText, profile },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to analyze career' };
  }
};

/**
 * Get all available career paths
 */
export const getCareerPaths = async () => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/paths`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch career paths' };
  }
};
