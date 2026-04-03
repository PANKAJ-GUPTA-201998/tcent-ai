import { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
  // Form state
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState([]);
  const [careerGoals, setCareerGoals] = useState('');
  const [industry, setIndustry] = useState([]);
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch existing profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      const profile = response.data.profile;

      // Populate form with existing data
      setSkills(profile.skills || []);
      setExperience(profile.experience || []);
      setCareerGoals(profile.careerGoals || '');
      setIndustry(profile.preferences?.industry || []);
      setLocation(profile.preferences?.location || '');
      setWorkMode(profile.preferences?.workMode || '');

      setLoading(false);
    } catch (error) {
      if (error.response?.status === 404) {
        // Profile doesn't exist yet, that's okay
        setLoading(false);
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile' });
        setLoading(false);
      }
    }
  };

  // Add skill to array
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  // Remove skill from array
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Add experience
  const handleAddExperience = () => {
    setExperience([
      ...experience,
      { company: '', role: '', years: 0 }
    ]);
  };

  // Update experience
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...experience];
    updatedExperience[index][field] = value;
    setExperience(updatedExperience);
  };

  // Remove experience
  const handleRemoveExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Add industry
  const handleAddIndustry = (industryName) => {
    if (!industry.includes(industryName)) {
      setIndustry([...industry, industryName]);
    }
  };

  // Remove industry
  const handleRemoveIndustry = (industryToRemove) => {
    setIndustry(industry.filter(ind => ind !== industryToRemove));
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const profileData = {
        skills,
        experience: experience.filter(exp => exp.company && exp.role), // Only valid entries
        careerGoals,
        preferences: {
          industry,
          location,
          workMode,
        },
      };

      await api.post('/api/profile', profileData);

      setMessage({ type: 'success', text: 'Profile saved successfully! 🎉' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save profile' });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600">
            Build your Career DNA to get personalized recommendations
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a skill (e.g., JavaScript, React)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-900 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
              <button
                type="button"
                onClick={handleAddExperience}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                + Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Years"
                        value={exp.years}
                        onChange={(e) => handleExperienceChange(index, 'years', parseInt(e.target.value) || 0)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Goals Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Goals</h2>
            <textarea
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="What are your career aspirations? (e.g., Become a Product Manager, Transition to AI/ML)"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Work Preferences</h2>

            {/* Industry */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Industries
              </label>
              <div className="flex gap-2 mb-2">
                {['Tech', 'Finance', 'Healthcare', 'Education', 'E-commerce'].map(ind => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => handleAddIndustry(ind)}
                    className={`px-4 py-2 rounded-lg transition ${
                      industry.includes(ind)
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {industry.map((ind, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    {ind}
                    <button
                      type="button"
                      onClick={() => handleRemoveIndustry(ind)}
                      className="text-green-900 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bengaluru, Remote, Mumbai"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Work Mode
              </label>
              <div className="flex gap-4">
                {['remote', 'hybrid', 'office'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setWorkMode(mode)}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      workMode === mode
                        ? 'bg-secondary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
