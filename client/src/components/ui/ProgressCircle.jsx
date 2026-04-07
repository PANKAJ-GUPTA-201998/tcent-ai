import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const ProgressCircle = ({
  value = 0,
  size = 120,
  strokeWidth = 10,
  color,
  showLabel = true,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const resolvedColor =
    color ??
    (value >= 70 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#ef4444');

  // Animate the stroke offset with a spring
  const spring = useSpring(circumference, { stiffness: 60, damping: 18 });
  const offset = useTransform(spring, (v) => v);

  // Animate displayed number
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = circumference - (value / 100) * circumference;
    spring.set(target);

    let start = null;
    const duration = 700;
    const from = displayValue;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(from + (value - from) * progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800 leading-none">
            {displayValue}%
          </span>
          {label && (
            <span className="text-xs text-gray-400 mt-0.5">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;
