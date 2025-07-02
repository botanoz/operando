import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  RotateCcw, 
  Home,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { getLevelName } from '../utils/questionBank';

// Sonuç sayfası bileşeni
export const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State'den gelen veriler
  const {
    score = 0,
    correctAnswers = 0,
    wrongAnswers = 0,
    totalRounds = 0,
    finalLevel = 1,
    mode = 'Bilinmeyen Mod',
    wasGameOver = false
  } = location.state || {};

  // Performans hesaplamaları
  const totalQuestions = correctAnswers + wrongAnswers;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const grade = getPerformanceGrade(accuracy);

  // Performans notunu hesapla
  function getPerformanceGrade(accuracy: number) {
    if (accuracy >= 90) return { letter: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (accuracy >= 80) return { letter: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (accuracy >= 70) return { letter: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (accuracy >= 60) return { letter: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (accuracy >= 50) return { letter: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { letter: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  }

  // Motivasyon mesajı
  function getMotivationMessage(accuracy: number, wasGameOver: boolean) {
    if (wasGameOver) {
      return 'Yanlış cevap verdin ama sorun yok! Tekrar dene! 💪';
    }
    
    if (accuracy >= 90) return 'Mükemmel! Matematik dehası! 🌟';
    if (accuracy >= 80) return 'Harika! Çok başarılısın! 🎉';
    if (accuracy >= 70) return 'İyi iş! Gelişmeye devam et! 👍';
    if (accuracy >= 60) return 'Fena değil! Biraz daha pratik yap! 💪';
    if (accuracy >= 50) return 'Başlangıç için iyi! Devam et! 🚀';
    return 'Sorun yok! Pratik yapmaya devam et! 📚';
  }

  // Yeniden oyna
  const playAgain = () => {
    navigate('/');
  };

  // Ana sayfaya dön
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              wasGameOver 
                ? 'bg-gradient-to-br from-red-400 to-red-600' 
                : 'bg-gradient-to-br from-yellow-400 to-orange-500'
            }`}>
              {wasGameOver ? (
                <AlertTriangle className="text-white" size={40} />
              ) : (
                <Trophy className="text-white" size={40} />
              )}
            </div>
            <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-200">
              {wasGameOver ? 'Oyun Bitti!' : 'Oyun Tamamlandı!'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {mode} modunda {totalRounds} tur oynadın
            </p>
          </motion.div>

          {/* Ana sonuç kartı */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 mb-8 bg-white border border-gray-200 shadow-2xl dark:bg-gray-800 rounded-3xl dark:border-gray-700"
          >
            {/* Skor ve not */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-8 mb-6">
                {/* Toplam skor */}
                <div className="text-center">
                  <div className="mb-2 text-5xl font-bold text-primary-600">{score}</div>
                  <div className="text-sm text-gray-500">Toplam Puan</div>
                </div>

                {/* Ulaşılan seviye */}
                <div className="text-center">
                  <div className="mb-2 text-5xl font-bold text-purple-600">{finalLevel}</div>
                  <div className="text-sm text-gray-500">Ulaşılan Seviye</div>
                  <div className="text-xs text-gray-400">{getLevelName(finalLevel)}</div>
                </div>

                {/* Performans notu */}
                <div className="text-center">
                  <div className={`
                    w-20 h-20 rounded-full ${grade.bg} flex items-center justify-center mb-2
                  `}>
                    <span className={`text-3xl font-bold ${grade.color}`}>
                      {grade.letter}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">Performans</div>
                </div>

                {/* Doğruluk oranı */}
                <div className="text-center">
                  <div className="mb-2 text-5xl font-bold text-green-600">%{accuracy}</div>
                  <div className="text-sm text-gray-500">Doğruluk</div>
                </div>
              </div>

              {/* Motivasyon mesajı */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`rounded-2xl p-6 border ${
                  wasGameOver 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800'
                    : 'bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800'
                }`}>
                <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                  {getMotivationMessage(accuracy, wasGameOver)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {wasGameOver 
                    ? 'Seviye 1\'e döndün ama endişelenme! Her yanlış bir öğrenme fırsatı.'
                    : 'Matematik becerilerini geliştirmeye devam et!'
                  }
                </p>
              </motion.div>
            </div>

            {/* Detaylı istatistikler */}
            <div className="grid grid-cols-2 gap-6 mb-8 md:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 text-center border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-2xl dark:border-green-800"
              >
                <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Doğru Cevap</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 text-center border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-2xl dark:border-red-800"
              >
                <XCircle className="mx-auto mb-2 text-red-600" size={32} />
                <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Yanlış Cevap</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-4 text-center border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-2xl dark:border-blue-800"
              >
                <Target className="mx-auto mb-2 text-blue-600" size={32} />
                <div className="text-2xl font-bold text-blue-600">{totalRounds}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Tur</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-4 text-center border border-purple-200 bg-purple-50 dark:bg-purple-900/20 rounded-2xl dark:border-purple-800"
              >
                <TrendingUp className="mx-auto mb-2 text-purple-600" size={32} />
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(score / totalRounds) || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ort. Puan/Tur</div>
              </motion.div>
            </div>

            {/* Başarı rozetleri */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {finalLevel >= 5 && (
                <div className="flex items-center gap-2 px-4 py-2 text-purple-800 bg-purple-100 border border-purple-300 rounded-full dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700">
                  <TrendingUp size={20} />
                  <span className="font-medium">Seviye Atlayıcı</span>
                </div>
              )}
              
              {accuracy >= 90 && (
                <div className="flex items-center gap-2 px-4 py-2 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-full dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700">
                  <Award size={20} />
                  <span className="font-medium">Mükemmellik</span>
                </div>
              )}
              
              {correctAnswers >= 10 && (
                <div className="flex items-center gap-2 px-4 py-2 text-green-800 bg-green-100 border border-green-300 rounded-full dark:bg-green-900/20 dark:text-green-400 dark:border-green-700">
                  <Star size={20} />
                  <span className="font-medium">Dayanıklı</span>
                </div>
              )}
              
              {wrongAnswers === 0 && totalQuestions > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 text-blue-800 bg-blue-100 border border-blue-300 rounded-full dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
                  <Star size={20} />
                  <span className="font-medium">Hatasız</span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Aksiyon butonları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playAgain}
              className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl hover:from-primary-600 hover:to-primary-700"
            >
              <RotateCcw size={24} />
              Tekrar Oyna
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goHome}
              className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-500 shadow-lg rounded-2xl hover:bg-gray-600"
            >
              <Home size={24} />
              Ana Sayfa
            </motion.button>
          </motion.div>

          {/* İpucu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400">
              💡 İpucu: Hızlı hesap tekniklerini öğrenmek için "İpuçları" bölümünü ziyaret et!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};