import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import { getOperationSymbol, getOperationName, getLevelName } from '../utils/questionBank';
import { CheckCircle, XCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface QuestionCardProps {
  question: Question | null;
  userAnswer: string;
  showFeedback?: 'correct' | 'wrong' | null;
  timeRemaining?: number;
  currentRound?: number;
  mode: {
    gradientFrom: string;
    gradientTo: string;
    name: string;
  };
}

// Soru kartı bileşeni - oyun ekranında soruları gösterir
export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  showFeedback,
  timeRemaining,
  currentRound = 1,
  mode
}) => {
  // Soru yükleme durumu
  if (!question) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gray-200 dark:bg-gray-700 p-8 md:p-12 text-center min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-gray-400 rounded-full border-t-gray-600"
            />
            <div className="text-xl text-gray-500 dark:text-gray-400">Soru hazırlanıyor...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={`
        relative overflow-hidden rounded-3xl shadow-2xl
        bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo}
        p-8 md:p-12 text-white text-center min-h-[200px]
        flex flex-col justify-center
      `}>
        {/* Üst bilgi çubuğu - Soru detayları */}
        <div className="absolute flex items-center justify-between top-4 left-4 right-4">
          {/* Sol taraf - Seviye ve işlem bilgisi */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <TrendingUp size={14} />
              <span className="text-sm font-medium">
                Seviye {question.level}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/50" />
            <div className="flex items-center gap-1">
              <Target size={14} />
              <span className="text-sm font-medium">
                {getOperationName(question.operation)}
              </span>
            </div>
          </div>

          {/* Sağ taraf - Tur bilgisi */}
          <div className="px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm">
            <span className="text-sm font-medium">
              Tur {currentRound}
            </span>
          </div>
        </div>

        {/* Zaman uyarısı - Kritik süre */}
        {timeRemaining !== undefined && timeRemaining <= 5 && timeRemaining > 0 && !showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: [0.5, 1.1, 1],
              backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(220, 38, 38, 0.9)', 'rgba(239, 68, 68, 0.8)']
            }}
            transition={{ 
              scale: { duration: 0.3 },
              backgroundColor: { duration: 1, repeat: Infinity }
            }}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          >
            <div className="flex items-center gap-2 px-6 py-3 text-lg font-bold text-white bg-red-600 rounded-full shadow-lg">
              <Clock size={20} className="animate-pulse" />
              <span>{timeRemaining} saniye!</span>
            </div>
          </motion.div>
        )}

        {/* Ana soru */}
        <div className="mt-8 mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-4xl font-bold tracking-wide md:text-6xl"
          >
            {question.operand1} {getOperationSymbol(question.operation)} {question.operand2} = ?
          </motion.div>
          
          {/* Kullanıcı cevabı göstergesi */}
          <AnimatePresence>
            {userAnswer && !showFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="text-2xl font-bold md:text-3xl opacity-80"
              >
                = {userAnswer}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Alt bilgi çubuğu - Zorluk göstergesi */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm">
            <span className="text-xs font-medium opacity-75">
              {getLevelName(question.level)} Seviyesi
            </span>
            <div className="w-1 h-1 rounded-full bg-white/50" />
            <span className="text-xs font-medium opacity-75">
              {question.operand1.toString().length + question.operand2.toString().length > 4 ? 'Zor' : 
               question.operand1.toString().length + question.operand2.toString().length > 2 ? 'Orta' : 'Kolay'} Sayılar
            </span>
          </div>
        </div>

        {/* Feedback overlay - Cevap sonucu */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              {showFeedback === 'correct' ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle size={80} className="mx-auto mb-4 text-green-400" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-2 text-3xl font-bold"
                  >
                    Doğru! 🎉
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg opacity-90"
                  >
                    {userAnswer} = {question.correctAnswer}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2 text-sm opacity-75"
                  >
                    Harika iş çıkardın!
                  </motion.div>
                </div>
              ) : (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <XCircle size={80} className="mx-auto mb-4 text-red-400" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-2 text-3xl font-bold"
                  >
                    Yanlış! 😔
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg opacity-90"
                  >
                    Doğru cevap: {question.correctAnswer}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2 text-sm opacity-75"
                  >
                    {userAnswer ? `Sen yazdın: ${userAnswer}` : 'Süre doldu!'}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dekoratif elementler ve animasyonlar */}
        <div className="absolute w-20 h-20 rounded-full -top-10 -right-10 bg-white/10 blur-xl animate-pulse" />
        <div className="absolute rounded-full -bottom-5 -left-5 w-15 h-15 bg-white/5 blur-lg animate-pulse" />
        
        {/* Başarı parçacıkları - sadece doğru cevap için */}
        {showFeedback === 'correct' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200]
                }}
                transition={{ 
                  duration: 2, 
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full top-1/2 left-1/2"
              />
            ))}
          </>
        )}

        {/* Soru geçmişi noktaları */}
        <div className="absolute transform -translate-x-1/2 bottom-16 left-1/2">
          <div className="flex items-center gap-1">
            {[...Array(Math.min(currentRound, 5))].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentRound - 1 
                    ? 'bg-white animate-pulse' 
                    : 'bg-white/30'
                }`}
              />
            ))}
            {currentRound > 5 && (
              <span className="ml-2 text-xs opacity-50">+{currentRound - 5}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};