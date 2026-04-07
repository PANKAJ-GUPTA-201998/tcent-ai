// ============================================
// Career Service - Frontend API Calls
// ============================================

import axios from 'axios';

const AI_SERVICE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:3003/api/career';
const UPLOAD_SERVICE_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3004/api/upload';
console.log('Upload URL:', UPLOAD_SERVICE_URL);

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
 * Analyze resume text for career intelligence
 * @param {string} resumeText
 */
export const analyzeCareer = async (resumeText) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/analyze`,
      { resumeText },
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
