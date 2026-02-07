import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, BarChart3, Trash2 } from 'lucide-react';
import { ModeCard } from '../components/ModeCard';
import { useGame } from '../context/GameContext';
import { GAME_MODES } from '../config/gameConfig';
import { GameMode } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { gameStats, getCurrentLevel, hasSeenWarmup, resetStats } = useGame();

  const handleModeSelect = (modeId: string) => {
    if (!hasSeenWarmup(modeId as GameMode)) {
      navigate(`/warmup/${modeId}`);
    } else {
      navigate(`/play/${modeId}`);
    }
  };

  const modeOrder = ['easy', 'medium', 'hard'];

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Header - compact */}
      <header className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-green-400">
            Operando
          </h1>
          <p className="text-xs text-gray-500">Matematik Macerasi</p>
        </div>
      </header>

      {/* Quick stats bar */}
      {gameStats.totalGamesPlayed > 0 && (
        <div className="flex-shrink-0 px-4 py-2">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>{gameStats.totalGamesPlayed} oyun</span>
            <span className="text-gray-600">|</span>
            <span>{gameStats.totalCorrectAnswers} dogru</span>
            <span className="text-gray-600">|</span>
            <span>{gameStats.totalScore.toLocaleString()} puan</span>
          </div>
        </div>
      )}

      {/* Mode cards - main content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 min-h-0 overflow-y-auto">
        <div className="max-w-lg mx-auto w-full space-y-3">
          {modeOrder.map((modeId, index) => {
            const mode = GAME_MODES[modeId];
            if (!mode) return null;
            const currentLevel = getCurrentLevel(mode.id);
            const highestLevel = gameStats.highestLevels?.[mode.id] || 1;
            const bestScore = gameStats.bestScores?.[mode.id] || 0;

            return (
              <ModeCard
                key={modeId}
                mode={mode}
                currentLevel={currentLevel}
                highestLevel={highestLevel}
                bestScore={bestScore}
                onClick={() => handleModeSelect(modeId)}
                index={index}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/tips')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300"
          >
            <Lightbulb size={16} className="text-yellow-500" />
            Ipuclari
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (window.confirm('Tum istatistikler sifirlanacak. Emin misiniz?')) {
                resetStats();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300"
          >
            <Trash2 size={16} className="text-red-500" />
            Sifirla
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Home;
