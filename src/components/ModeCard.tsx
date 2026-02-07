import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, TrendingUp } from 'lucide-react';
import { GameMode } from '../types';
import { getLevelName } from '../utils/questionBank';

interface ModeCardProps {
  mode: {
    id: GameMode;
    name: string;
    emoji: string;
    description: string;
    gradientFrom: string;
    gradientTo: string;
    operations: string[];
    timePerQuestion: number;
    bonusThreshold: number;
  };
  currentLevel: number;
  highestLevel: number;
  bestScore: number;
  onClick: () => void;
  index: number;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  currentLevel,
  highestLevel,
  bestScore,
  onClick,
  index
}) => {
  const displayLevel = Math.max(currentLevel, highestLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl shadow-lg cursor-pointer
        bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo}
        p-4 text-white
      `}
    >
      <div className="flex items-center gap-3">
        {/* Emoji */}
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 text-2xl bg-white/20 rounded-xl">
          {mode.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold truncate">{mode.name}</h3>
          <p className="text-xs opacity-80 truncate">{mode.description}</p>
        </div>

        {/* Level badge */}
        <div className="flex-shrink-0 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div className="text-xs font-bold mt-0.5">Lv.{displayLevel}</div>
        </div>

        {/* Play button */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-xl">
            <Play size={20} fill="white" />
          </div>
        </div>
      </div>

      {/* Bottom stats row */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/20">
        <div className="flex items-center gap-1 text-xs">
          <Trophy size={12} />
          <span>En iyi: {bestScore > 0 ? bestScore.toLocaleString() : '-'}</span>
        </div>
        <div className="text-xs opacity-70">
          {getLevelName(displayLevel)}
        </div>
        <div className="ml-auto text-xs opacity-70">
          {mode.timePerQuestion}s/soru
        </div>
      </div>
    </motion.div>
  );
};
