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

// Zamanlayıcı çubuğu bileşeni - görsel süre göstergesi
export const TimerBar: React.FC<TimerBarProps> = ({
  timeRemaining,
  totalTime,
  isActive,
  isCritical = false,
  showBonus = false,
  className = ''
}) => {
  // Süre yüzdesi hesaplama
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  
  // Süreyi formatla (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Renk belirleme
  const getBarColor = () => {
    if (isCritical) return 'from-red-500 to-red-600';
    if (percentage > 60) return 'from-green-500 to-green-600';
    if (percentage > 30) return 'from-yellow-500 to-yellow-600';
    return 'from-orange-500 to-red-500';
  };

  // Glow efekti için renk
  const getGlowColor = () => {
    if (isCritical) return 'shadow-red-500/50';
    if (percentage > 60) return 'shadow-green-500/50';
    if (percentage > 30) return 'shadow-yellow-500/50';
    return 'shadow-orange-500/50';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Üst bilgi çubuğu */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock 
            size={20} 
            className={`
              ${isCritical ? 'text-red-500 animate-pulse' : 'text-gray-600 dark:text-gray-400'}
              transition-colors duration-200
            `}
          />
          <span className={`
            text-sm font-medium
            ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
          `}>
            Kalan Süre
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {showBonus && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1 text-yellow-500"
            >
              <Zap size={16} />
              <span className="text-xs font-bold">BONUS!</span>
            </motion.div>
          )}
          
          <span className={`
            text-lg font-bold tabular-nums
            ${isCritical 
              ? 'text-red-600 dark:text-red-400 animate-pulse' 
              : 'text-gray-800 dark:text-gray-200'
            }
          `}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Ana progress bar */}
      <div className="relative">
        {/* Arka plan çubuğu */}
        <div className={`
          w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
          ${isCritical ? 'animate-pulse' : ''}
        `}>
          {/* Progress çubuğu */}
          <motion.div
            className={`
              h-full bg-gradient-to-r ${getBarColor()} rounded-full
              relative overflow-hidden
              ${isActive ? `shadow-lg ${getGlowColor()}` : ''}
            `}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: isActive ? 0.5 : 0,
              ease: 'easeOut'
            }}
          >
            {/* Shine efekti */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Kritik süre uyarısı */}
        {isCritical && (
          <motion.div
            className="absolute transform -translate-x-1/2 -top-8 left-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
              ZAMAN DARALDI!
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress yüzdesi */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          %{Math.round(percentage)} kaldı
        </span>
      </div>
    </div>
  );
};

// Dairesel zamanlayıcı bileşeni
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
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Arka plan çemberi */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress çemberi */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`
            ${isCritical ? 'drop-shadow-lg filter' : ''}
          `}
        />
      </svg>
      
      {/* Merkez metni */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`
          text-2xl font-bold tabular-nums
          ${isCritical 
            ? 'text-red-600 animate-pulse' 
            : 'text-gray-800 dark:text-gray-200'
          }
        `}>
          {timeRemaining}
        </span>
      </div>
    </div>
  );
};