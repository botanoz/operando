import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
  isCritical?: boolean;
  showBonus?: boolean;
  className?: string;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  timeRemaining,
  totalTime,
  isActive,
  isCritical = false,
  showBonus = false,
  className = ''
}) => {
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  const getBarColor = () => {
    if (isCritical) return 'from-red-500 to-red-600';
    if (percentage > 60) return 'from-green-500 to-green-600';
    if (percentage > 30) return 'from-yellow-500 to-yellow-600';
    return 'from-orange-500 to-red-500';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <Clock size={14} className={isCritical ? 'text-red-500 animate-pulse' : 'text-gray-500'} />
          <span className={`text-xs ${isCritical ? 'text-red-400' : 'text-gray-500'}`}>Kalan</span>
        </div>
        <div className="flex items-center gap-1">
          {showBonus && <Zap size={12} className="text-yellow-500" />}
          <span className={`text-sm font-bold tabular-nums ${isCritical ? 'text-red-400 animate-pulse' : 'text-gray-200'}`}>
            {timeRemaining}s
          </span>
        </div>
      </div>
      <div className={`w-full h-2.5 bg-gray-700 rounded-full overflow-hidden ${isCritical ? 'animate-pulse' : ''}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${getBarColor()} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: isActive ? 0.5 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export const CircularTimer: React.FC<TimerBarProps> = ({
  timeRemaining,
  totalTime,
  isCritical = false,
  className = ''
}) => {
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    if (isCritical) return '#ef4444';
    if (percentage > 60) return '#22c55e';
    if (percentage > 30) return '#eab308';
    return '#f97316';
  };

  return (
    <div className={`relative ${className}`}>
      <svg width="80" height="80" viewBox="0 0 100 100" className="transform -rotate-90">
        <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-700" />
        <motion.circle cx="50" cy="50" r={radius} stroke={getStrokeColor()} strokeWidth="6"
          fill="none" strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-bold tabular-nums ${isCritical ? 'text-red-400 animate-pulse' : 'text-gray-200'}`}>
          {timeRemaining}
        </span>
      </div>
    </div>
  );
};
