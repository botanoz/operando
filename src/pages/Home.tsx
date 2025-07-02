import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  BookOpen,
  Target,
  BarChart3,
  Star
} from 'lucide-react';
import { ModeCard } from '../components/ModeCard';
import { useGame } from '../context/GameContext';
import { GAME_MODES } from '../config/gameConfig';
import { isGameMode } from '../types';

// Ana sayfa bileşeni
export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    gameStats, 
    hasSeenWarmup, 
    getCurrentLevel, 
    getHighestLevel,
    getHighestQuestionCount,
    getTotalScore 
  } = useGame();

  // Mod seçimi
  const handleModeSelect = (modeId: string) => {
    // GameMode tipinin geçerli olup olmadığını kontrol et
    if (!isGameMode(modeId)) {
      console.error('Geçersiz mod ID:', modeId);
      return;
    }
    
    // İlk defa giriliyorsa ısınma ekranına git
    if (!hasSeenWarmup(modeId)) {
      navigate(`/warm-up/${modeId}`);
    } else {
      // Direkt oyuna başla
      navigate(`/play/${modeId}`);
    }
  };

  // Genel istatistikler
  const getOverallStats = () => {
    const totalGames = gameStats.totalGamesPlayed;
    const totalScore = Object.values(gameStats.bestScores).reduce((sum, score) => sum + score, 0);
    const totalQuestions = gameStats.totalQuestionsAnswered;
    const accuracy = totalQuestions > 0
      ? Math.round((gameStats.totalCorrectAnswers / totalQuestions) * 100)
      : 0;
    const highestLevel = Math.max(...Object.values(gameStats.highestLevels));
    const maxQuestions = Math.max(...Object.values(gameStats.highestQuestionCount));

    return { 
      totalGames, 
      totalScore, 
      totalQuestions, 
      accuracy, 
      highestLevel,
      maxQuestions
    };
  };

  const overallStats = getOverallStats();

  // Başarı rozetleri
  const getAchievementBadges = () => {
    const badges = [];
    
    if (overallStats.highestLevel >= 10) {
      badges.push({ icon: '🌟', text: 'Seviye Ustası', color: 'text-yellow-600' });
    }
    
    if (overallStats.accuracy >= 90) {
      badges.push({ icon: '🎯', text: 'Kesin Nişancı', color: 'text-green-600' });
    }
    
    if (overallStats.maxQuestions >= 50) {
      badges.push({ icon: '💪', text: 'Dayanıklı', color: 'text-blue-600' });
    }
    
    if (gameStats.longestStreak >= 20) {
      badges.push({ icon: '🔥', text: 'Seri Katili', color: 'text-red-600' });
    }

    return badges;
  };

  const achievementBadges = getAchievementBadges();

  return (
    <div className="min-h-screen transition-all duration-500 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo ve başlık */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl">
              <Calculator className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text">
                Operando
              </h1>
              <p className="text-sm text-gray-400">
                Sonsuz Matematik Macerası
              </p>
            </div>
          </motion.div>

          {/* Sağ menü */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* İpuçları butonu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/tips')}
              className="flex items-center gap-2 px-4 py-3 font-medium text-white transition-all duration-200 shadow-md rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg"
            >
              <BookOpen size={18} />
              <span className="hidden sm:inline">İpuçları</span>
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Ana içerik */}
      <main className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hoş geldin mesajı */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-200">
              Sonsuz Matematik Macerana Başla! 
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-400">
              Her modda seviye atlayarak matematik becerilerini geliştir. Yanlış cevap verirsen başa dönersin!
            </p>
          </motion.div>

          {/* Genel istatistikler */}
          {overallStats.totalGames > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <div className="p-6 mb-6 bg-gray-800 border border-gray-700 shadow-lg rounded-2xl">
                <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-200">
                  <BarChart3 size={24} className="text-primary-500" />
                  Genel İstatistikler
                </h3>
                
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{overallStats.totalGames}</div>
                    <div className="text-sm text-gray-500">Oyun</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{overallStats.totalScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Toplam Puan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{overallStats.highestLevel}</div>
                    <div className="text-sm text-gray-500">En Yüksek Seviye</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{overallStats.totalQuestions}</div>
                    <div className="text-sm text-gray-500">Toplam Soru</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">%{overallStats.accuracy}</div>
                    <div className="text-sm text-gray-500">Doğruluk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{overallStats.maxQuestions}</div>
                    <div className="text-sm text-gray-500">Maks Soru/Oyun</div>
                  </div>
                </div>
              </div>

              {/* Başarı rozetleri */}
              {achievementBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="p-4 bg-gray-800 border border-gray-700 shadow-lg rounded-2xl"
                >
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-200">
                    <Star size={20} className="text-yellow-500" />
                    Başarı Rozetlerin
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {achievementBadges.map((badge, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full"
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className={`text-sm font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Oyun modları */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3"
          >
            {Object.values(GAME_MODES).map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <ModeCard
                  mode={mode}
                  currentLevel={getCurrentLevel(mode.id)}
                  highestLevel={getHighestLevel(mode.id)}
                  totalScore={getTotalScore(mode.id)}
                  highestQuestionCount={getHighestQuestionCount(mode.id)}
                  onSelect={() => handleModeSelect(mode.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Oyun kuralları */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <div className="p-8 bg-gray-800 border border-gray-700 shadow-lg rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="text-primary-500" size={24} />
                <h3 className="text-xl font-bold text-gray-200">
                  Sonsuz Mod Nasıl Oynanır?
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-green-400 to-green-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Seviye Atla</h4>
                    <p className="text-sm text-gray-400">
                      Her 5 doğru cevap = 1 seviye atlama
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Zorluk Artar</h4>
                    <p className="text-sm text-gray-400">
                      Yüksek seviyede daha zor sorular ve daha fazla puan
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-red-400 to-red-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Yanlış = Başa Dön</h4>
                    <p className="text-sm text-gray-400">
                      Yanlış cevap verirsen seviye 1'e dönersin
                    </p>
                  </div>
                </div>
              </div>

              {/* Bonus sistem açıklaması */}
              <div className="p-4 mt-6 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl dark:border-yellow-800">
                <h5 className="mb-2 font-bold text-yellow-800 dark:text-yellow-400">
                  ⚡ Bonus Sistem
                </h5>
                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div className="text-yellow-700 dark:text-yellow-300">
                    <strong>Hızlı Cevap Bonusu:</strong> Belirlenen süre altında doğru cevap verirsen +5 saniye bonus kazanırsın!
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-300">
                    <strong>Seviye Puanı:</strong> Yüksek seviyede daha çok puan kazanırsın. Her seviye puanlarını artırır!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Home;