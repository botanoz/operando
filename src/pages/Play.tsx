import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Pause, 
  Play as PlayIcon, 
  Home,
  CheckCircle,
  XCircle,
  Zap,
  Trophy,
  TrendingUp,
  AlertTriangle,
  Timer,
  RotateCcw
} from 'lucide-react';
import { NumericPad } from '../components/NumericPad';
import { TimerBar } from '../components/TimerBar';
import { useGame } from '../context/GameContext';
import { useTimer } from '../hooks/useTimer';
import { generateQuestion, calculateScore, getBonusTime, getOperationSymbol, shouldLevelUp, getLevelName } from '../utils/questionBank';
import { Question, UserAnswer } from '../types';
import { GAME_MODES, GAME_CONSTANTS } from '../config/gameConfig';

export const Play: React.FC = () => {
  const navigate = useNavigate();
  const { modeId } = useParams<{ modeId: string }>();
  
  // Context hooks
  const { 
    startGame, 
    submitAnswer, 
    nextRound, 
    endGame, 
    updateStats, 
    levelUp,
    resetToLevelOne,
    getCurrentLevel,
    addBonusTime
  } = useGame();
  
  // Local state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [correctInLevel, setCorrectInLevel] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [bonusTimeNotification, setBonusTimeNotification] = useState(0);
  const [gameStartTime] = useState(Date.now());

  // Mod configuration
  const mode = modeId ? GAME_MODES[modeId] : null;
  const defaultTimePerQuestion = mode?.timePerQuestion || 15;

  // Süre dolma handler - hook'lardan önce tanımlanmalı
  const handleTimeUp = useCallback(() => {
    if (currentQuestion && showFeedback === null) {
      handleAnswerSubmit(true);
    }
  }, [currentQuestion, showFeedback]);

  // Timer hook - her zaman çağrılmalı
  const {
    timeRemaining,
    isActive: timerActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime
  } = useTimer(defaultTimePerQuestion, handleTimeUp);

  // Yeni soru üretme
  const generateNewQuestion = useCallback(() => {
  if (!mode) return;
  
  try {
    const question = generateQuestion(mode.id, currentLevel, currentRound);
    setCurrentQuestion(question);
    setUserAnswer('');
    setQuestionsAsked(prev => prev + 1); // Bunu buradan çıkarıp başka yere taşıyacağız
    
    // Timer'ı yeniden başlat
    resetTimer(mode.timePerQuestion);
    startTimer();
    
    console.log('🎯 Yeni soru oluşturuldu:', {
      question: question.id,
      level: currentLevel,
      round: currentRound
    });
  } catch (error) {
    console.error('❌ Soru üretilirken hata:', error);
    
    // Fallback soru
    const fallbackQuestion: Question = {
      id: `fallback_${Date.now()}`,
      operation: 'addition',
      operand1: Math.floor(Math.random() * 10) + 1,
      operand2: Math.floor(Math.random() * 10) + 1,
      correctAnswer: 0,
      difficulty: 1,
      level: 1,
      createdAt: Date.now()
    };
    fallbackQuestion.correctAnswer = fallbackQuestion.operand1 + fallbackQuestion.operand2;
    setCurrentQuestion(fallbackQuestion);
  }
}, [mode, currentLevel, currentRound, resetTimer, startTimer]); // questionsAsked'ı çıkardık

  // Cevap gönderme handler'ı
  const handleAnswerSubmit = useCallback((isTimeUp = false) => {
    if (!currentQuestion || showFeedback !== null || !mode) return;

    const userAnswerNum = parseInt(userAnswer) || 0;
    const isCorrect = !isTimeUp && userAnswerNum === currentQuestion.correctAnswer;
    const timeToAnswer = mode.timePerQuestion - timeRemaining;
    
    // Skor hesaplama
    const scoreParams = {
      operation: currentQuestion.operation,
      isCorrect,
      timeToAnswer,
      maxTime: mode.timePerQuestion,
      level: currentLevel,
      mode: mode.id,
      difficulty: currentLevel
    };
    
    const questionScore = calculateScore(scoreParams);

    // Bonus süre kontrolü
    let bonusSeconds = 0;
    if (isCorrect) {
      bonusSeconds = getBonusTime(mode.id, timeToAnswer, mode.timePerQuestion);
      if (bonusSeconds > 0) {
        setBonusTimeNotification(bonusSeconds);
        addTime(bonusSeconds);
        addBonusTime(bonusSeconds);
        
        // Bildirim temizle
        setTimeout(() => setBonusTimeNotification(0), 2000);
      }
    }

    // Local state güncellemeleri
    setScore(prev => prev + questionScore);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setCorrectInLevel(prev => prev + 1);
    } else {
      setWrongAnswers(prev => prev + 1);
    }

    // Context'e cevabı gönder
    const userAnswerData: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: userAnswerNum,
      correctAnswer: currentQuestion.correctAnswer,
      timeToAnswer,
      isCorrect,
      scoreEarned: questionScore,
      bonusTimeEarned: bonusSeconds,
      level: currentLevel,
      round: currentRound
    };
    
    submitAnswer(userAnswerData);

    // Feedback göster
    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    pauseTimer();

    console.log('📝 Cevap gönderildi:', {
      isCorrect,
      score: questionScore,
      bonusTime: bonusSeconds,
      correctInLevel: correctInLevel + (isCorrect ? 1 : 0)
    });

    // Yanlış cevap = Oyun bitti
    if (!isCorrect) {
      setTimeout(() => {
        setShowFeedback(null);
        setShowGameOver(true);
        resetToLevelOne(mode.id);
        
        setTimeout(() => {
          handleGameEnd();
        }, 3000);
      }, 1500);
      return;
    }

    // Doğru cevap - seviye atlama kontrolü
    setTimeout(() => {
      setShowFeedback(null);
      
      const newCorrectInLevel = correctInLevel + 1;
      if (shouldLevelUp(newCorrectInLevel)) {
        // Seviye atlama
        const newLevel = currentLevel + 1;
        setShowLevelUp(true);
        setCurrentLevel(newLevel);
        setCorrectInLevel(0);
        levelUp(newLevel);
        
        console.log('🎉 Seviye atlandı:', { oldLevel: currentLevel, newLevel });
        
        setTimeout(() => {
          setShowLevelUp(false);
          continueGame();
        }, 2500);
      } else {
        continueGame();
      }
    }, 1500);
  }, [
    currentQuestion, 
    showFeedback, 
    userAnswer, 
    mode, 
    timeRemaining, 
    currentLevel, 
    currentRound, 
    correctInLevel,
    submitAnswer,
    pauseTimer,
    addTime,
    addBonusTime,
    resetToLevelOne,
    levelUp
  ]);

  // Oyuna devam etme
  // (Bu fonksiyonun güncel hali aşağıda tekrar tanımlanmıştır, bu eski tanımı kaldırıldı)
  
  // Oyunu bitirme
    const handleGameEnd = useCallback(() => {
    if (!mode) return;
    
    endGame();
    
    // Final istatistikler
    const sessionData = {
      mode: mode.id,
      currentRound,
      currentLevel,
      totalRounds: 0,
      score,
      correctAnswers,
      wrongAnswers,
      timeRemaining: 0,
      currentQuestion: null,
      isActive: false,
      startTime: gameStartTime,
      endTime: Date.now(),
      questionsAsked,
      correctInLevel: 0,
      maxLevel: currentLevel,
      bonusTimeEarned: 0
    };
    
    updateStats(sessionData);
    
    // Sonuç sayfasına yönlendir
    navigate(`/result/${mode.id}`, { 
      state: { 
        score, 
        correctAnswers, 
        wrongAnswers, 
        totalRounds: currentRound,
        finalLevel: currentLevel,
        questionsAsked,
        mode: mode.name,
        wasGameOver: true
      } 
    });
  }, [
    endGame,
    mode,
    currentRound,
    currentLevel,
    score,
    correctAnswers,
    wrongAnswers,
    gameStartTime,
    questionsAsked,
    updateStats,
    navigate
  ]);

  // Duraklama toggle
  const togglePause = useCallback(() => {
    if (isPaused) {
      resumeTimer();
      setIsPaused(false);
    } else {
      pauseTimer();
      setIsPaused(true);
    }
  }, [isPaused, resumeTimer, pauseTimer]);

  // Ana sayfaya dönüş
  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Oyunu yeniden başlatma
  const restartGame = useCallback(() => {
    if (!mode) return;
    
    setCurrentQuestion(null);
    setUserAnswer('');
    setCurrentRound(1);
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCorrectInLevel(0);
    setQuestionsAsked(0);
    setShowFeedback(null);
    setShowLevelUp(false);
    setShowGameOver(false);
    
    const savedLevel = getCurrentLevel(mode.id);
    setCurrentLevel(savedLevel);
    startGame(mode.id, savedLevel);
    
    setTimeout(() => {
      generateNewQuestion();
    }, 100);
  }, [mode, getCurrentLevel, startGame, generateNewQuestion]);

  // Oyunu başlatma
useEffect(() => {
  if (mode) {
    const savedLevel = getCurrentLevel(mode.id);
    setCurrentLevel(savedLevel);
    startGame(mode.id, savedLevel);
    
    // İlk soruyu üret
    setTimeout(() => {
      generateNewQuestion();
      setQuestionsAsked(1); // İlk soru için manuel olarak set et
    }, 100);
  }
}, [mode, getCurrentLevel, startGame]); // generateNewQuestion'ı çıkardık

// Oyuna devam etme - Düzeltilmiş versiyon
const continueGame = useCallback(() => {
  setCurrentRound(prev => prev + 1);
  setQuestionsAsked(prev => prev + 1); // Burada artır
  nextRound();
  generateNewQuestion();
}, [nextRound, generateNewQuestion]);

  // Geçersiz mod kontrolü - hook'lardan sonra
  if (!mode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Geçersiz Oyun Modu!</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 font-medium text-white transition-colors bg-primary-500 rounded-xl hover:bg-primary-600"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Sol taraf - Navigasyon */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Geri"
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goHome}
              className="p-2 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Ana Sayfa"
            >
              <Home size={20} />
            </motion.button>
          </div>

          {/* Orta - Mod bilgisi */}
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {mode.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp size={14} />
              <span>Seviye {currentLevel} • {getLevelName(currentLevel)}</span>
            </div>
          </div>

          {/* Sağ taraf - Kontroller */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="p-2 text-blue-600 transition-colors bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
              aria-label="Yeniden Başla"
            >
              <RotateCcw size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className="p-2 transition-colors rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800"
              aria-label={isPaused ? "Devam Et" : "Duraklat"}
            >
              {isPaused ? <PlayIcon size={20} /> : <Pause size={20} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <main className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Üst bilgi paneli */}
          <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
            {/* Seviye Progress */}
            <div className="p-4 text-center bg-white border border-gray-200 shadow-md dark:bg-gray-800 rounded-xl dark:border-gray-700">
              <div className="text-lg font-bold text-purple-600">Seviye {currentLevel}</div>
              <div className="text-sm text-gray-500">{getLevelName(currentLevel)}</div>
              <div className="w-full h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div 
                  className="h-2 transition-all duration-300 bg-purple-500 rounded-full"
                  style={{ width: `${(correctInLevel / GAME_CONSTANTS.LEVEL_UP_THRESHOLD) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {correctInLevel}/{GAME_CONSTANTS.LEVEL_UP_THRESHOLD}
              </div>
            </div>

            {/* Skor */}
            <div className="p-4 text-center bg-white border border-gray-200 shadow-md dark:bg-gray-800 rounded-xl dark:border-gray-700">
              <div className="text-lg font-bold text-primary-600">{score.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Puan</div>
            </div>

            {/* Tur ve Soru Sayısı */}
            <div className="p-4 text-center bg-white border border-gray-200 shadow-md dark:bg-gray-800 rounded-xl dark:border-gray-700">
              <div className="text-lg font-bold text-blue-600">{currentRound}</div>
              <div className="text-sm text-gray-500">Tur</div>
              <div className="mt-1 text-xs text-gray-400">{questionsAsked} soru</div>
            </div>

            {/* Doğru/Yanlış */}
            <div className="p-4 text-center bg-white border border-gray-200 shadow-md dark:bg-gray-800 rounded-xl dark:border-gray-700">
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-xs text-gray-500">Doğru</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-red-600">{wrongAnswers}</div>
                  <div className="text-xs text-gray-500">Yanlış</div>
                </div>
              </div>
              {(correctAnswers + wrongAnswers) > 0 && (
                <div className="mt-1 text-xs text-gray-400">
                  %{Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)} doğru
                </div>
              )}
            </div>
          </div>

          {/* Zamanlayıcı */}
          <div className="mb-6">
            <TimerBar
              timeRemaining={timeRemaining}
              totalTime={mode.timePerQuestion}
              isActive={timerActive && !isPaused}
              isCritical={timeRemaining <= GAME_CONSTANTS.CRITICAL_TIME_THRESHOLD}
              showBonus={bonusTimeNotification > 0}
            />
            
            {/* Bonus bildirim */}
            <AnimatePresence>
              {bonusTimeNotification > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  className="flex items-center justify-center gap-2 mt-2"
                >
                  <div className="flex items-center gap-1 px-3 py-1 text-sm font-bold text-yellow-900 bg-yellow-500 rounded-full">
                    <Zap size={16} />
                    <Timer size={16} />
                    +{bonusTimeNotification}s BONUS!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Soru kartı */}
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className={`
                  relative overflow-hidden rounded-3xl shadow-2xl
                  bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo}
                  p-8 text-white text-center min-h-[200px] flex flex-col justify-center
                `}>
                  {/* Soru */}
                  <div className="mb-4 text-4xl font-bold tracking-wide md:text-6xl">
                    {currentQuestion.operand1} {getOperationSymbol(currentQuestion.operation)} {currentQuestion.operand2} = ?
                  </div>

                  {/* Kullanıcı input göstergesi */}
                  <AnimatePresence>
                    {userAnswer && !showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-2xl font-bold md:text-3xl opacity-80"
                      >
                        = {userAnswer}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Feedback overlay */}
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
                            <CheckCircle size={64} className="mx-auto mb-4 text-green-400" />
                            <div className="text-2xl font-bold">Doğru! 🎉</div>
                            <div className="text-lg">
                              +{calculateScore({
                                operation: currentQuestion.operation,
                                isCorrect: true,
                                timeToAnswer: mode.timePerQuestion - timeRemaining,
                                maxTime: mode.timePerQuestion,
                                level: currentLevel,
                                mode: mode.id,
                                difficulty: currentLevel
                              })} puan
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <XCircle size={64} className="mx-auto mb-4 text-red-400" />
                            <div className="text-2xl font-bold">Yanlış! 😔</div>
                            <div className="text-lg">Doğru cevap: {currentQuestion.correctAnswer}</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Dekoratif elementler */}
                  <div className="absolute w-20 h-20 rounded-full -top-10 -right-10 bg-white/10 blur-xl" />
                  <div className="absolute rounded-full -bottom-5 -left-5 w-15 h-15 bg-white/5 blur-lg" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sayısal klavye */}
          <div className="max-w-sm mx-auto">
            <NumericPad
              value={userAnswer}
              onChange={setUserAnswer}
              onSubmit={() => handleAnswerSubmit()}
              disabled={isPaused || showFeedback !== null}
              maxLength={GAME_CONSTANTS.MAX_ANSWER_LENGTH}
            />
          </div>

          {/* Seviye atlama overlay */}
          <AnimatePresence>
            {showLevelUp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="max-w-md p-8 mx-4 text-center bg-white shadow-2xl dark:bg-gray-800 rounded-2xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"
                  >
                    <Trophy className="text-white" size={32} />
                  </motion.div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Seviye Atladın! 🎉
                  </h3>
                  <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                    Seviye {currentLevel} • {getLevelName(currentLevel)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sorular artık daha zor olacak!
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Oyun bitti overlay */}
          <AnimatePresence>
            {showGameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="max-w-md p-8 mx-4 text-center bg-white shadow-2xl dark:bg-gray-800 rounded-2xl"
                >
                  <AlertTriangle className="mx-auto mb-4 text-red-500" size={64} />
                  <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Oyun Bitti! 😔
                  </h3>
                  <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                    Yanlış cevap verdin ve seviye 1'e döndün
                  </p>
                  <div className="p-4 mb-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-bold text-purple-600">{questionsAsked}</div>
                        <div className="text-gray-500">Soru</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600">{score.toLocaleString()}</div>
                        <div className="text-gray-500">Puan</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Sonuç ekranına yönlendiriliyorsun...
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Duraklama overlay */}
          <AnimatePresence>
            {isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="p-8 text-center bg-white shadow-2xl dark:bg-gray-800 rounded-2xl"
                >
                  <Pause size={48} className="mx-auto mb-4 text-primary-500" />
                  <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Oyun Duraklatıldı
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Devam etmek için butona tıkla
                  </p>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePause}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-primary-500 rounded-xl hover:bg-primary-600"
                    >
                      <PlayIcon size={20} />
                      Devam Et
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goHome}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-500 rounded-xl hover:bg-gray-600"
                    >
                      <Home size={20} />
                      Ana Sayfa
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Play;