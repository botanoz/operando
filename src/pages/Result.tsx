import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  RotateCcw,
  Trophy,
  Target,
  TrendingUp,
  Zap,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { useGame } from '../context/GameContext';

interface ResultState {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalRounds: number;
  finalLevel: number;
  questionsAsked: number;
  mode: string;
  wasGameOver: boolean;
}

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameStats } = useGame();

  const state = (location.state as ResultState) || {
    score: 0, correctAnswers: 0, wrongAnswers: 0,
    totalRounds: 0, finalLevel: 1, questionsAsked: 0,
    mode: 'Bilinmeyen', wasGameOver: false
  };

  const totalAnswered = state.correctAnswers + state.wrongAnswers;
  const accuracy = totalAnswered > 0 ? Math.round((state.correctAnswers / totalAnswered) * 100) : 0;

  const getPerformanceLabel = () => {
    if (accuracy >= 90) return { text: 'Muhtesem!', color: 'text-yellow-400' };
    if (accuracy >= 70) return { text: 'Cok Iyi!', color: 'text-green-400' };
    if (accuracy >= 50) return { text: 'Iyi!', color: 'text-blue-400' };
    return { text: 'Devam Et!', color: 'text-gray-400' };
  };

  const perf = getPerformanceLabel();

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 pt-4 pb-2 text-center">
        <h1 className="text-xl font-bold text-gray-200">Sonuclar</h1>
        <p className="text-sm text-gray-500">{state.mode}</p>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 min-h-0 overflow-y-auto">
        <div className="max-w-md mx-auto w-full space-y-4">
          {/* Performance badge */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
              <Trophy className="text-white" size={32} />
            </div>
            <h2 className={`text-2xl font-bold ${perf.color}`}>{perf.text}</h2>
          </motion.div>

          {/* Score card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-800 border border-gray-700 rounded-2xl">
            <div className="text-center mb-3">
              <div className="text-3xl font-bold text-primary-400">{state.score.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Toplam Puan</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-gray-700/50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp size={14} className="text-purple-400" />
                  <span className="text-sm font-bold text-purple-400">Lv.{state.finalLevel}</span>
                </div>
                <div className="text-xs text-gray-500">Seviye</div>
              </div>
              <div className="p-2.5 bg-gray-700/50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target size={14} className="text-blue-400" />
                  <span className="text-sm font-bold text-blue-400">%{accuracy}</span>
                </div>
                <div className="text-xs text-gray-500">Isabet</div>
              </div>
              <div className="p-2.5 bg-gray-700/50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle size={14} className="text-green-400" />
                  <span className="text-sm font-bold text-green-400">{state.correctAnswers}</span>
                </div>
                <div className="text-xs text-gray-500">Dogru</div>
              </div>
              <div className="p-2.5 bg-gray-700/50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle size={14} className="text-red-400" />
                  <span className="text-sm font-bold text-red-400">{state.wrongAnswers}</span>
                </div>
                <div className="text-xs text-gray-500">Yanlis</div>
              </div>
            </div>
          </motion.div>

          {/* Overall stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Genel Istatistikler</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-gray-300">{gameStats.totalGamesPlayed}</div>
                <div className="text-gray-500">Oyun</div>
              </div>
              <div>
                <div className="font-bold text-gray-300">{gameStats.totalScore.toLocaleString()}</div>
                <div className="text-gray-500">T.Puan</div>
              </div>
              <div>
                <div className="font-bold text-gray-300">{gameStats.longestStreak}</div>
                <div className="text-gray-500">Seri</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="flex gap-3 max-w-md mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-medium"
          >
            <Home size={18} />
            Ana Sayfa
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-medium"
          >
            <RotateCcw size={18} />
            Tekrar Oyna
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Result;
