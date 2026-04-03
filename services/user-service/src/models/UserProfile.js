const mongoose = require('mongoose');

// Define the schema for user profile
const userProfileSchema = new mongoose.Schema({
  // Reference to auth-service user (the _id from auth database)
  userId: {
    type: String,
    required: true,
    unique: true, // One profile per user
  },
  
  // User's skills (array of strings)
  skills: {
    type: [String],
    default: [],
  },
  
  // Work experience array
  experience: [{
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    years: {
      type: Number,
      required: true,
    },
  }],
  
  // Career goals (what user wants to achieve)
  careerGoals: {
    type: String,
    default: '',
  },
  
  // Work preferences
  preferences: {
    industry: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: '',
    },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'office', ''], // Only these values allowed
      default: '',
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Create model from schema
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
