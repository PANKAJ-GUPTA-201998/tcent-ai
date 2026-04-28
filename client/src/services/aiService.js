import api from '../utils/api';

const AI_SERVICE_URL = '/api/ai';

export const getCareerAdvice = async (question, profile = null) => {
  try {
    const response = await api.post(`${AI_SERVICE_URL}/career-advice`, { question, profile });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get career advice' };
  }
};

export const reviewResume = async (resumeText) => {
  try {
    const response = await api.post(`${AI_SERVICE_URL}/resume-review`, { resumeText });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to review resume' };
  }
};

export const analyzeSkillGap = async (currentSkills, targetRole) => {
  try {
    const response = await api.post(`${AI_SERVICE_URL}/skill-gap`, { currentSkills, targetRole });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to analyze skill gap' };
  }
};

export const checkAIServiceHealth = async () => {
  try {
    const response = await api.get(`${AI_SERVICE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('AI Service is unavailable');
  }
};
