import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Plus, Briefcase, Trash2, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const inputCls =
  'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

const INDUSTRIES = ['Tech', 'Finance', 'Healthcare', 'Education', 'E-commerce'];
const WORK_MODES = ['remote', 'hybrid', 'office'];

const Profile = () => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState([]);
  const [careerGoals, setCareerGoals] = useState('');
  const [industry, setIndustry] = useState([]);
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [avatar, setAvatar] = useState(null); // data URL preview

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const avatarInputRef = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/profile');
      const p = data.profile;
      setSkills(p.skills || []);
      setExperience(p.experience || []);
      setCareerGoals(p.careerGoals || '');
      setIndustry(p.preferences?.industry || []);
      setLocation(p.preferences?.location || '');
      setWorkMode(p.preferences?.workMode || '');
    } catch (err) {
      if (err.response?.status !== 404) {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleAddExperience = () =>
    setExperience([...experience, { company: '', role: '', years: 0 }]);

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const toggleIndustry = (ind) =>
    setIndustry(prev =>
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/api/profile', {
        skills,
        experience: experience.filter(exp => exp.company && exp.role),
        careerGoals,
        preferences: { industry, location, workMode },
      });
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton variant="card" height="h-28" />
        <Skeleton variant="card" height="h-48" />
        <Skeleton variant="card" height="h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Header card — avatar + title */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Card>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-md">
                  {avatar
                    ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    : <span className="text-4xl text-slate-400 select-none">👤</span>
                  }
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-700 transition"
                  aria-label="Upload photo"
                >
                  <Camera size={13} />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Build your Career DNA to get personalised recommendations.
                </p>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar(null)}
                    className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <X size={12} /> Remove photo
                  </button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Status message */}
        {message.text && (
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {message.text}
          </motion.div>
        )}

        {/* Skills */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Card title="Skills">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g. JavaScript, React, Python"
                className={inputCls}
              />
              <Button type="button" variant="primary" onClick={handleAddSkill} icon={<Plus size={15} />} className="shrink-0">
                Add
              </Button>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => setSkills(skills.filter(s => s !== skill))}
                      className="text-blue-400 hover:text-red-500 transition"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No skills added yet.</p>
            )}
          </Card>
        </motion.div>

        {/* Experience */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-800">Experience</h2>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddExperience} icon={<Briefcase size={13} />}>
                Add Role
              </Button>
            </div>

            {experience.length === 0 ? (
              <p className="text-sm text-gray-400">No experience added yet.</p>
            ) : (
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Company</label>
                        <input
                          type="text"
                          placeholder="e.g. Google"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Role</label>
                        <input
                          type="text"
                          placeholder="e.g. Software Engineer"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Years</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="50"
                            value={exp.years}
                            onChange={(e) => handleExperienceChange(index, 'years', parseInt(e.target.value) || 0)}
                            className={inputCls}
                          />
                          <button
                            type="button"
                            onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                            className="px-3 py-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            aria-label="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Career Goals */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <Card title="Career Goals">
            <label className={labelCls}>
              What are your career aspirations?
            </label>
            <textarea
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. Become a Product Manager, transition into AI/ML, lead an engineering team..."
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </Card>
        </motion.div>

        {/* Work Preferences */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Card title="Work Preferences">

            {/* Industries */}
            <div className="mb-6">
              <label className={labelCls}>Preferred Industries</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => toggleIndustry(ind)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      industry.includes(ind)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className={labelCls} htmlFor="location">Preferred Location</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Remote, Mumbai"
                className={inputCls}
              />
            </div>

            {/* Work Mode */}
            <div>
              <label className={labelCls}>Work Mode</label>
              <div className="flex gap-2 flex-wrap">
                {WORK_MODES.map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setWorkMode(mode)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium border transition capitalize ${
                      workMode === mode
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-slate-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <Button type="submit" variant="primary" size="lg" loading={saving} className="w-full">
            {saving ? 'Saving…' : 'Save Profile'}
          </Button>
        </motion.div>

      </form>
    </div>
  );
};

export default Profile;
