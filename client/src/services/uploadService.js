// ============================================
// Upload Service - Frontend API Calls
// ============================================
// Handles file upload requests

import axios from 'axios';

const UPLOAD_SERVICE_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3004/api/upload';
console.log('Upload URL:', UPLOAD_SERVICE_URL);

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

/**
 * Upload Resume (PDF)
 * @param {File} file - PDF file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Upload result
 */
export const uploadResume = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post(
      `${UPLOAD_SERVICE_URL}/resume`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // Let axios set Content-Type with the correct multipart boundary automatically
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) onProgress(progress);
        }
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload resume' };
  }
};

/**
 * Upload Profile Picture
 * @param {File} file - Image file (JPG/PNG)
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Upload result
 */
export const uploadProfilePicture = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axios.post(
      `${UPLOAD_SERVICE_URL}/profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) onProgress(progress);
        }
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload profile picture' };
  }
};

/**
 * Get File Info
 * @param {string} fileId - File ID
 * @returns {Promise} File metadata
 */
export const getFileInfo = async (fileId) => {
  try {
    const response = await axios.get(
      `${UPLOAD_SERVICE_URL}/file/${fileId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get file info' };
  }
};
