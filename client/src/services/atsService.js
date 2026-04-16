// ============================================
// ATS Service - Frontend API Calls
// ============================================

import axios from 'axios';

const ATS_URL = '/api/ats';

/**
 * Analyze resume PDF against a job description
 * @param {File} resumeFile - PDF file object
 * @param {string} jobDescription - Pasted JD text
 * @returns {Promise} ATS analysis result
 */
export const analyzeATS = async (resumeFile, jobDescription) => {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    const token = localStorage.getItem('token');
    const response = await axios.post(`${ATS_URL}/analyze`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type — axios sets multipart/form-data + boundary automatically
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to analyze resume. Please try again.' };
  }
};

/**
 * Check ATS service health
 */
export const checkATSHealth = async () => {
  try {
    const response = await axios.get(`${ATS_URL}/health`);
    return response.data;
  } catch {
    throw new Error('ATS Service is unavailable');
  }
};
