// ============================================
// Upload Controller
// ============================================
const cloudinaryService = require('../services/cloudinaryService');
const pdfService = require('../services/pdfService');
const File = require('../models/File');
const sharp = require('sharp');

/**
 * Upload Resume (PDF)
 * POST /api/upload/resume
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a PDF file.'
      });
    }

    const userId = req.user.id;
    const fileBuffer = req.file.buffer;

    // Extract text from PDF
    const pdfData = await pdfService.extractText(fileBuffer);
    const sections = pdfService.extractResumeSections(pdfData.text);

    // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadResume(
      fileBuffer,
      req.file.originalname,
      userId
    );

    // Save to database
    const fileRecord = new File({
      userId,
      fileType: 'resume',
      originalName: req.file.originalname,
      fileSize: req.file.size,
      cloudinaryUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      extractedText: pdfData.text,
      status: 'completed'
    });

    await fileRecord.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      extractedText: pdfData.text,
      sections,
      file: {
        id: fileRecord._id,
        url: uploadResult.url,
        name: req.file.originalname,
        size: req.file.size,
        pages: pdfData.pages,
        uploadedAt: fileRecord.uploadedAt
      }
    });

  } catch (error) {
    console.error('Resume Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resume'
    });
  }
};

/**
 * Upload Profile Picture
 * POST /api/upload/profile-picture
 */
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user.id;

    // Resize image to 400x400
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadProfilePicture(
      resizedBuffer,
      userId
    );

    // Save to database
    const fileRecord = new File({
      userId,
      fileType: 'profile-picture',
      originalName: req.file.originalname,
      fileSize: resizedBuffer.length,
      cloudinaryUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      dimensions: {
        width: uploadResult.width,
        height: uploadResult.height
      },
      status: 'completed'
    });

    await fileRecord.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      file: {
        id: fileRecord._id,
        url: uploadResult.url,
        dimensions: fileRecord.dimensions
      }
    });

  } catch (error) {
    console.error('Profile Picture Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload profile picture'
    });
  }
};

/**
 * Get user's uploaded files (latest resume)
 * GET /api/upload/my-files
 */
const getMyFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const resume = await File.findOne({ userId, fileType: 'resume', status: 'completed' })
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      resume: resume ? {
        id: resume._id,
        name: resume.originalName,
        url: resume.cloudinaryUrl,
        size: resume.fileSize,
        extractedText: resume.extractedText,
        uploadedAt: resume.uploadedAt
      } : null
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch files.' });
  }
};

/**
 * Get File Metadata
 * GET /api/upload/file/:fileId
 */
const getFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    const file = await File.findOne({ _id: fileId, userId });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      file: {
        id: file._id,
        type: file.fileType,
        name: file.originalName,
        url: file.cloudinaryUrl,
        size: file.fileSize,
        uploadedAt: file.uploadedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get file'
    });
  }
};

module.exports = {
  uploadResume,
  uploadProfilePicture,
  getFile,
  getMyFiles
};
