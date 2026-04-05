// ============================================
// File Model - MongoDB Schema
// ============================================
// Stores metadata about uploaded files

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  // User who uploaded the file
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  // File type: 'resume' or 'profile-picture'
  fileType: {
    type: String,
    required: true,
    enum: ['resume', 'profile-picture']
  },

  // Original filename
  originalName: {
    type: String,
    required: true
  },

  // File size in bytes
  fileSize: {
    type: Number,
    required: true
  },

  // Cloudinary URL
  cloudinaryUrl: {
    type: String,
    required: true
  },

  // Cloudinary public ID (for deletion)
  cloudinaryPublicId: {
    type: String,
    required: true
  },

  // For resumes: extracted text
  extractedText: {
    type: String,
    default: null
  },

  // For profile pictures: dimensions
  dimensions: {
    width: Number,
    height: Number
  },

  // Upload status
  status: {
    type: String,
    enum: ['uploading', 'completed', 'failed'],
    default: 'uploading'
  },

  // Upload timestamp
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
fileSchema.index({ userId: 1, fileType: 1 });

module.exports = mongoose.model('File', fileSchema);
