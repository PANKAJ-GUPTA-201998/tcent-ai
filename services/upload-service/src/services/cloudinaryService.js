// ============================================
// Cloudinary Service
// ============================================
// Handles file uploads to Cloudinary cloud storage

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudinaryService {
  /**
   * Upload Resume (PDF) to Cloudinary
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original filename
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Upload result
   */
  async uploadResume(fileBuffer, fileName, userId) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `tcent-ai/resumes/${userId}`,
            resource_type: 'raw', // For PDFs
            public_id: `resume_${Date.now()}`,
            format: 'pdf'
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                size: result.bytes,
                format: result.format
              });
            }
          }
        );

        uploadStream.end(fileBuffer);
      });

    } catch (error) {
      console.error('Cloudinary Resume Upload Error:', error);
      throw new Error('Failed to upload resume to cloud storage');
    }
  }

  /**
   * Upload Profile Picture to Cloudinary
   * @param {Buffer} fileBuffer - Image buffer (already resized)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Upload result
   */
  async uploadProfilePicture(fileBuffer, userId) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `tcent-ai/profile-pictures/${userId}`,
            resource_type: 'image',
            public_id: `profile_${Date.now()}`,
            transformation: [
              { width: 400, height: 400, crop: 'fill' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format
              });
            }
          }
        );

        uploadStream.end(fileBuffer);
      });

    } catch (error) {
      console.error('Cloudinary Profile Picture Upload Error:', error);
      throw new Error('Failed to upload profile picture to cloud storage');
    }
  }

  /**
   * Delete file from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @param {string} resourceType - 'raw' for PDFs, 'image' for pictures
   * @returns {Promise<Object>} Deletion result
   */
  async deleteFile(publicId, resourceType = 'image') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });

      return result;

    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      throw new Error('Failed to delete file from cloud storage');
    }
  }

  /**
   * Get file info from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise<Object>} File info
   */
  async getFileInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;

    } catch (error) {
      console.error('Cloudinary Get Info Error:', error);
      throw new Error('Failed to get file info');
    }
  }
}

module.exports = new CloudinaryService();
