const UserProfile = require('../models/UserProfile');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Protected (requires JWT)
const getProfile = async (req, res) => {
  try {
    // req.user.id comes from authMiddleware
    const profile = await UserProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ 
        message: 'Profile not found. Please create one first.' 
      });
    }
    
    res.status(200).json({
      success: true,
      profile,
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// @desc    Create or Update user profile
// @route   POST /api/profile
// @access  Protected (requires JWT)
const createOrUpdateProfile = async (req, res) => {
  try {
    const { skills, experience, careerGoals, preferences } = req.body;
    
    // Validation: Check if required fields are present
    if (!skills && !experience && !careerGoals && !preferences) {
      return res.status(400).json({ 
        message: 'Please provide at least one field to update' 
      });
    }
    
    // Build profile object
    const profileData = {
      userId: req.user.id, // From authMiddleware
    };
    
    // Only add fields that were sent in request
    if (skills) profileData.skills = skills;
    if (experience) profileData.experience = experience;
    if (careerGoals) profileData.careerGoals = careerGoals;
    if (preferences) profileData.preferences = preferences;
    
    // Find profile and update, or create new one if doesn't exist
    // { new: true } returns the updated document
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: profileData },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

// @desc    Delete user profile
// @route   DELETE /api/profile
// @access  Protected (requires JWT)
const deleteProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndDelete({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ 
        message: 'Profile not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting profile', 
      error: error.message 
    });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  deleteProfile,
};
