import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target } from 'lucide-react';

interface ProgressRingProps {
  current: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

// Dairesel ilerleme göstergesi bileşeni
export const ProgressRing: React.FC<ProgressRingProps> = ({
  current,
  total,
  size = 'md',
  showLabel = true,
  showIcon = false,
  color = 'primary',
  className = ''
}) => {
  // Boyut ayarları
  const sizeConfig = {
    sm: { width: 80, height: 80, radius: 30, strokeWidth: 4, textSize: 'text-sm' },
    md: { width: 120, height: 120, radius: 45, strokeWidth: 6, textSize: 'text-lg' },
    lg: { width: 160, height: 160, radius: 60, strokeWidth: 8, textSize: 'text-2xl' }
  };

  const config = sizeConfig[size];
  const percentage = Math.max(0, Math.min(100, (current / total) * 100));
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Renk ayarları
  const colorConfig = {
    primary: {
      stroke: '#16a085',
      bg: '#e0f2f1',
      text: 'text-primary-600',
      glow: 'drop-shadow-lg filter'
    },
    success: {
      stroke: '#22c55e',
      bg: '#dcfce7',
      text: 'text-green-600',
      glow: 'drop-shadow-lg filter'
    },
    warning: {
      stroke: '#f59e0b',
      bg: '#fef3c7',
      text: 'text-yellow-600',
      glow: 'drop-shadow-lg filter'
    },
    danger: {
      stroke: '#ef4444',
      bg: '#fecaca',
      text: 'text-red-600',
      glow: 'drop-shadow-lg filter'
    }
  };

  const colors = colorConfig[color];

  // İkon seçimi
  const getIcon = () => {
    if (percentage === 100) return <Trophy size={config.strokeWidth * 3} />;
    if (percentage >= 75) return <Star size={config.strokeWidth * 3} />;
    return <Target size={config.strokeWidth * 3} />;
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        width={config.width}
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="transform -rotate-90"
      >
        {/* Arka plan çemberi */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress çemberi */}
        <motion.circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke={colors.stroke}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: 1.5, 
            ease: 'easeOut',
            delay: 0.2 
          }}
          className={colors.glow}
        />

        {/* Başlangıç noktası işareti */}
        <circle
          cx={config.width / 2}
          cy={config.strokeWidth / 2 + config.strokeWidth}
          r={config.strokeWidth / 2}
          fill={colors.stroke}
          className="opacity-60"
        />
      </svg>
      
      {/* Merkez içeriği */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showIcon && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`${colors.text} mb-1`}
          >
            {getIcon()}
          </motion.div>
        )}
        
        {showLabel && (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`font-bold ${config.textSize} ${colors.text}`}
            >
              {current}/{total}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-xs text-gray-500 dark:text-gray-400 mt-1"
            >
              %{Math.round(percentage)}
            </motion.div>
          </div>
        )}
      </div>

      {/* Başarı efekti */}
      {percentage === 100 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute -inset-4"
        >
          <div className={`
            w-full h-full rounded-full 
            bg-gradient-to-br ${colors.bg} 
            animate-pulse opacity-30
          `} />
        </motion.div>
      )}
    </div>
  );
};

// Mini progress indicator - kompakt gösterim için
export const MiniProgressRing: React.FC<{
  percentage: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({
  percentage = 0,
  size = 40,
  color = '#16a085',
  strokeWidth = 3
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};