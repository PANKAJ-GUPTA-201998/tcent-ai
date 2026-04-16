import { Briefcase } from 'lucide-react';

const MAX_CHARS = 5000;

const JobDescriptionInput = ({ value, onChange }) => {
  const remaining = MAX_CHARS - value.length;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <Briefcase size={20} className="text-purple-500" />
        Job Description
      </h2>

      <div className="flex-1 flex flex-col">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Paste the full job description here...

Include:
• Required skills and technologies
• Qualifications and experience
• Responsibilities
• Preferred certifications"
          className="flex-1 min-h-[280px] w-full resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-4 text-sm leading-relaxed
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
            transition-colors duration-200"
        />
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Minimum 50 characters
          </span>
          <span className={`text-xs font-medium ${remaining < 200 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`}>
            {remaining.toLocaleString()} remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
