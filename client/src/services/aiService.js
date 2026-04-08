// ============================================
// AI Service - Frontend API Calls
// ============================================
// Handles all AI-related API requests

import axios from 'axios';

const AI_SERVICE_URL = (import.meta.env.VITE_AI_URL || 'http://localhost:3003') + '/api/ai';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

/**
 * Get Career Advice
 * @param {string} question - User's career question
 * @returns {Promise} AI response
 */
export const getCareerAdvice = async (question) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/career-advice`,
      { question },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get career advice' };
  }
};

/**
 * Review Resume
 * @param {string} resumeText - Full resume text
 * @returns {Promise} Resume review with score
 */
export const reviewResume = async (resumeText) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/resume-review`,
      { resumeText },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to review resume' };
  }
};

/**
 * Analyze Skill Gap
 * @param {Array} currentSkills - User's current skills
 * @param {string} targetRole - Target job role
 * @returns {Promise} Skill gap analysis
 */
export const analyzeSkillGap = async (currentSkills, targetRole) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/skill-gap`,
      { currentSkills, targetRole },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to analyze skill gap' };
  }
};

/**
 * Check service health
 * @returns {Promise} Health status
 */
export const checkAIServiceHealth = async () => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('AI Service is unavailable');
  }
};
