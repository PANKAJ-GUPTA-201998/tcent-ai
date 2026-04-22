import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';

const CareerTimeline = ({ careerPath }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const total = careerPath.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: '300px', height: '200px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="relative z-10">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white">Career Growth Timeline</h3>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Your 12-month salary roadmap</p>
        </div>

        {/* Timeline track */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 hidden sm:block" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <motion.div
            className="absolute top-6 left-6 h-0.5 hidden sm:block"
            style={{ background: 'linear-gradient(90deg, #059669, #34D399, #F59E0B)', boxShadow: '0 0 8px rgba(5,150,105,0.5)' }}
            initial={{ width: 0 }}
            animate={{ width: 'calc(100% - 3rem)' }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          />

          {/* Points */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
            {careerPath.map((point, i) => {
              const isLast = i === total - 1;
              const isFirst = i === 0;
              const hovered = hoveredIdx === i;
              const pointColor = isLast ? '#F59E0B' : isFirst ? '#94A3B8' : '#059669';

              return (
                <div key={point.time}
                  className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 flex-1 sm:relative cursor-default"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}>

                  {/* Dot */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      animate={{ scale: hovered ? 1.3 : 1 }}
                      transition={{ duration: 0.2 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center z-10 relative"
                      style={{
                        background: isLast ? 'rgba(245,158,11,0.15)' : isFirst ? 'rgba(148,163,184,0.1)' : 'rgba(5,150,105,0.15)',
                        border: `2px solid ${pointColor}`,
                        boxShadow: hovered ? `0 0 20px ${pointColor}66` : 'none',
                      }}>
                      {isLast
                        ? <Star size={18} style={{ color: '#F59E0B' }} fill="#F59E0B" />
                        : isFirst
                          ? <MapPin size={18} style={{ color: '#94A3B8' }} />
                          : <div className="w-3 h-3 rounded-full" style={{ background: '#059669', boxShadow: '0 0 8px #059669' }} />
                      }
                    </motion.div>

                    {/* Tooltip */}
                    {hovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-xl px-3 py-2 text-xs"
                        style={{ background: '#0F172A', border: `1px solid ${pointColor}44`, boxShadow: `0 0 16px ${pointColor}22` }}>
                        <p className="font-bold text-white">{point.role}</p>
                        <p style={{ color: pointColor }}>₹{point.salary} LPA</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${pointColor}44` }} />
                      </motion.div>
                    )}
                  </div>

                  {/* Labels */}
                  <div className="sm:mt-4 sm:text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#475569' }}>{point.time}</p>
                    <p className="text-base font-black mt-0.5" style={{ color: pointColor }}>₹{point.salary} LPA</p>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{point.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
          <Star size={13} style={{ color: '#F59E0B' }} fill="#F59E0B" />
          <p className="text-xs" style={{ color: '#78716C' }}>
            Hover each milestone for details · Gold star = target salary achieved
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerTimeline;
