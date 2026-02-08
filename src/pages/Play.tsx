import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  Pause,
  Play as PlayIcon,
  CheckCircle,
  XCircle,
  Zap,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { NumericPad } from '../components/NumericPad';
import { TimerBar } from '../components/TimerBar';
import { useGame } from '../context/GameContext';
import { useTimer } from '../hooks/useTimer';
import { generateQuestion, calculateScore, getBonusTime, getOperationSymbol, shouldLevelUp, getLevelName } from '../utils/questionBank';
import { Question, UserAnswer } from '../types';
import { GAME_MODES, GAME_CONSTANTS } from '../config/gameConfig';
import { getTipForLevel, MathTip } from '../data/mathTips';

export const Play: React.FC = () => {
  const navigate = useNavigate();
  const { modeId } = useParams<{ modeId: string }>();

  const {
    startGame,
    submitAnswer,
    nextRound,
    endGame,
    updateStats,
    levelUp,
    levelDown,
    getCurrentLevel,
    addBonusTime
  } = useGame();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevelReached, setMaxLevelReached] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [correctInLevel, setCorrectInLevel] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showLevelDown, setShowLevelDown] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [levelUpTip, setLevelUpTip] = useState<MathTip | null>(null);
  const [bonusTimeNotification, setBonusTimeNotification] = useState(0);
  const [gameStartTime] = useState(Date.now());

  const mode = modeId ? GAME_MODES[modeId] : null;
  const defaultTimePerQuestion = mode?.timePerQuestion || 15;

  const handleTimeUp = useCallback(() => {
    if (currentQuestion && showFeedback === null) {
      handleAnswerSubmit(true);
    }
  }, [currentQuestion, showFeedback]);

  const {
    timeRemaining,
    isActive: timerActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime
  } = useTimer(defaultTimePerQuestion, handleTimeUp);

  const generateNewQuestion = useCallback(() => {
    if (!mode) return;
    try {
      const question = generateQuestion(mode.id, currentLevel, currentRound);
      setCurrentQuestion(question);
      setUserAnswer('');
      resetTimer(mode.timePerQuestion);
      startTimer();
    } catch (error) {
      console.error('Soru uretilirken hata:', error);
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
      setUserAnswer('');
      resetTimer(mode.timePerQuestion);
      startTimer();
    }
  }, [mode, currentLevel, currentRound, resetTimer, startTimer]);

  const continueGame = useCallback(() => {
    setCurrentRound(prev => prev + 1);
    setQuestionsAsked(prev => prev + 1);
    nextRound();
    generateNewQuestion();
  }, [nextRound, generateNewQuestion]);

  const handleAnswerSubmit = useCallback((isTimeUp = false) => {
    if (!currentQuestion || showFeedback !== null || !mode) return;

    const userAnswerNum = parseInt(userAnswer) || 0;
    const isCorrect = !isTimeUp && userAnswerNum === currentQuestion.correctAnswer;
    const timeToAnswer = mode.timePerQuestion - timeRemaining;

    const questionScore = calculateScore({
      operation: currentQuestion.operation,
      isCorrect,
      timeToAnswer,
      maxTime: mode.timePerQuestion,
      level: currentLevel,
      mode: mode.id,
      difficulty: currentLevel
    });

    let bonusSeconds = 0;
    if (isCorrect) {
      bonusSeconds = getBonusTime(mode.id, timeToAnswer, mode.timePerQuestion);
      if (bonusSeconds > 0) {
        setBonusTimeNotification(bonusSeconds);
        addTime(bonusSeconds);
        addBonusTime(bonusSeconds);
        setTimeout(() => setBonusTimeNotification(0), 2000);
      }
    }

    setScore(prev => prev + questionScore);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setCorrectInLevel(prev => prev + 1);
    } else {
      setWrongAnswers(prev => prev + 1);
    }

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

    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    pauseTimer();

    if (!isCorrect) {
      // Yanlis cevap: seviye dusur, oyun devam eder
      setTimeout(() => {
        setShowFeedback(null);
        const newLevel = Math.max(1, currentLevel - 1);
        if (newLevel < currentLevel) {
          setCurrentLevel(newLevel);
          levelDown();
          setShowLevelDown(true);
          setCorrectInLevel(0);
          setTimeout(() => {
            setShowLevelDown(false);
            continueGame();
          }, 1500);
        } else {
          // Zaten seviye 1, sadece devam
          setCorrectInLevel(0);
          continueGame();
        }
      }, 1200);
      return;
    }

    // Dogru cevap
    setTimeout(() => {
      setShowFeedback(null);
      const newCorrectInLevel = correctInLevel + 1;
      if (shouldLevelUp(newCorrectInLevel)) {
        const newLevel = currentLevel + 1;
        setCurrentLevel(newLevel);
        setMaxLevelReached(prev => Math.max(prev, newLevel));
        setCorrectInLevel(0);
        levelUp(newLevel);
        // Seviye gecisi: ipucu goster + devam/bitir
        const tip = getTipForLevel(mode.id, newLevel);
        setLevelUpTip(tip);
        setShowLevelUp(true);
        pauseTimer();
      } else {
        continueGame();
      }
    }, 1000);
  }, [
    currentQuestion, showFeedback, userAnswer, mode, timeRemaining,
    currentLevel, currentRound, correctInLevel, submitAnswer,
    pauseTimer, addTime, addBonusTime, levelUp, levelDown, continueGame
  ]);

  const handleFinishGame = useCallback(() => {
    if (!mode) return;
    setShowLevelUp(false);
    setShowExitConfirm(false);
    endGame();
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
      maxLevel: maxLevelReached,
      bonusTimeEarned: 0
    };
    updateStats(sessionData);
    navigate(`/result/${mode.id}`, {
      state: {
        score, correctAnswers, wrongAnswers,
        totalRounds: currentRound,
        finalLevel: maxLevelReached,
        questionsAsked,
        mode: mode.name,
        wasGameOver: false
      }
    });
  }, [
    endGame, mode, currentRound, currentLevel, maxLevelReached,
    score, correctAnswers, wrongAnswers, gameStartTime,
    questionsAsked, updateStats, navigate
  ]);

  const handleContinueAfterLevelUp = useCallback(() => {
    setShowLevelUp(false);
    setLevelUpTip(null);
    continueGame();
  }, [continueGame]);

  const handleExitRequest = useCallback(() => {
    pauseTimer();
    setIsPaused(true);
    setShowExitConfirm(true);
  }, [pauseTimer]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
    setIsPaused(false);
    resumeTimer();
  }, [resumeTimer]);

  const togglePause = useCallback(() => {
    if (isPaused) { resumeTimer(); setIsPaused(false); }
    else { pauseTimer(); setIsPaused(true); }
  }, [isPaused, resumeTimer, pauseTimer]);

  useEffect(() => {
    if (mode) {
      const savedLevel = getCurrentLevel(mode.id);
      setCurrentLevel(savedLevel);
      setMaxLevelReached(savedLevel);
      startGame(mode.id, savedLevel);
      setTimeout(() => {
        generateNewQuestion();
        setQuestionsAsked(1);
      }, 100);
    }
  }, [mode, getCurrentLevel, startGame]);

  if (!mode) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-gray-900">
        <div className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Gecersiz Oyun Modu!</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 font-medium text-white bg-primary-500 rounded-xl">
            Ana Sayfaya Don
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-3 py-2 border-b border-gray-700 bg-gray-800/90">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleExitRequest}
            className="p-1.5 bg-gray-700 rounded-lg">
            <Home size={18} className="text-gray-300" />
          </motion.button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-gray-200">{mode.name}</h1>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <TrendingUp size={12} />
              <span>Lv.{currentLevel} - {getLevelName(currentLevel)}</span>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={togglePause}
            className="p-1.5 bg-gray-700 rounded-lg">
            {isPaused ? <PlayIcon size={18} className="text-primary-400" /> : <Pause size={18} className="text-gray-300" />}
          </motion.button>
        </div>
      </header>

      {/* Stats row */}
      <div className="flex-shrink-0 px-3 py-2">
        <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
          <div className="p-1.5 text-center bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-sm font-bold text-purple-400">Lv.{currentLevel}</div>
            <div className="w-full h-1 mt-1 bg-gray-700 rounded-full">
              <div className="h-1 bg-purple-500 rounded-full transition-all"
                style={{ width: `${(correctInLevel / GAME_CONSTANTS.LEVEL_UP_THRESHOLD) * 100}%` }} />
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">{correctInLevel}/{GAME_CONSTANTS.LEVEL_UP_THRESHOLD}</div>
          </div>
          <div className="p-1.5 text-center bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-sm font-bold text-primary-400">{score.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500">Puan</div>
          </div>
          <div className="p-1.5 text-center bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-sm font-bold text-blue-400">{questionsAsked}</div>
            <div className="text-[10px] text-gray-500">Soru</div>
          </div>
          <div className="p-1.5 text-center bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-center gap-2">
              <span className="text-sm font-bold text-green-400">{correctAnswers}</span>
              <span className="text-gray-600">/</span>
              <span className="text-sm font-bold text-red-400">{wrongAnswers}</span>
            </div>
            <div className="text-[10px] text-gray-500">D/Y</div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex-shrink-0 px-3 py-1">
        <div className="max-w-lg mx-auto">
          <TimerBar
            timeRemaining={timeRemaining}
            totalTime={mode.timePerQuestion}
            isActive={timerActive && !isPaused}
            isCritical={timeRemaining <= GAME_CONSTANTS.CRITICAL_TIME_THRESHOLD}
            showBonus={bonusTimeNotification > 0}
          />
          <AnimatePresence>
            {bonusTimeNotification > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-1 mt-1">
                <div className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-yellow-900 bg-yellow-500 rounded-full">
                  <Zap size={12} /> +{bonusTimeNotification}s
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col justify-center px-3 py-2 min-h-0">
        <div className="max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div key={currentQuestion.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                <div className={`
                  relative overflow-hidden rounded-2xl shadow-xl
                  bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo}
                  p-5 text-white text-center
                `}>
                  <div className="text-3xl sm:text-4xl font-bold tracking-wide mb-1">
                    {currentQuestion.operand1} {getOperationSymbol(currentQuestion.operation)} {currentQuestion.operand2} = ?
                  </div>
                  <AnimatePresence>
                    {userAnswer && !showFeedback && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-xl font-bold opacity-80">= {userAnswer}</motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        {showFeedback === 'correct' ? (
                          <div className="text-center">
                            <CheckCircle size={48} className="mx-auto mb-2 text-green-400" />
                            <div className="text-xl font-bold">Dogru!</div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <XCircle size={48} className="mx-auto mb-2 text-red-400" />
                            <div className="text-xl font-bold">Yanlis!</div>
                            <div className="text-sm opacity-80">Cevap: {currentQuestion.correctAnswer}</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Numeric pad */}
      <div className="flex-shrink-0 px-3 pb-3 pt-1">
        <div className="max-w-xs mx-auto">
          <NumericPad
            value={userAnswer}
            onChange={setUserAnswer}
            onSubmit={() => handleAnswerSubmit()}
            disabled={isPaused || showFeedback !== null || showLevelUp || showExitConfirm}
            maxLength={GAME_CONSTANTS.MAX_ANSWER_LENGTH}
          />
        </div>
      </div>

      {/* Level Up overlay with tip + continue/finish */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }}
              className="max-w-sm w-full bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Level up header */}
              <div className={`p-4 bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} text-white text-center`}>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: 2 }}>
                  <ChevronUp size={32} className="mx-auto mb-1" />
                </motion.div>
                <h3 className="text-lg font-bold">Seviye {currentLevel}!</h3>
                <p className="text-sm opacity-80">{getLevelName(currentLevel)}</p>
              </div>

              {/* Tip section */}
              {levelUpTip && (
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-2">Ipucu</div>
                  <div className="p-3 bg-gray-700/50 rounded-xl mb-3">
                    <h4 className="text-sm font-bold text-gray-200 mb-1">{levelUpTip.title}</h4>
                    <div className="text-xs text-gray-400 mb-2">{levelUpTip.description}</div>
                    <div className="p-2 bg-gray-800 rounded-lg text-center mb-2">
                      <span className="text-sm font-mono text-primary-400">{levelUpTip.example}</span>
                    </div>
                    <div className="space-y-1">
                      {levelUpTip.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <span className="text-gray-500 flex-shrink-0">{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs font-mono text-center text-green-400 bg-green-900/20 p-1.5 rounded">
                      {levelUpTip.visual}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 p-4 pt-0">
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleFinishGame}
                  className="flex-1 py-3 bg-gray-700 border border-gray-600 rounded-xl text-sm font-medium text-gray-300">
                  Bitir
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleContinueAfterLevelUp}
                  className={`flex-1 py-3 bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} rounded-xl text-sm font-bold text-white`}>
                  Devam Et
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Down notification */}
      <AnimatePresence>
        {showLevelDown && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}
              className="max-w-xs p-5 text-center bg-gray-800 shadow-2xl rounded-2xl mx-4">
              <ChevronDown size={36} className="mx-auto mb-2 text-red-400" />
              <h3 className="text-lg font-bold text-gray-200 mb-1">Seviye Dustu!</h3>
              <p className="text-sm text-gray-400">Seviye {currentLevel} - {getLevelName(currentLevel)}</p>
              <p className="text-xs text-gray-500 mt-2">Devam et, tekrar yukseleceksin!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit confirmation */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="max-w-sm w-full p-5 bg-gray-800 shadow-2xl rounded-2xl">
              <h3 className="text-lg font-bold text-gray-200 text-center mb-2">Oyundan Cikmak Istiyor Musun?</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Ilerlemeniz kaydedilecek.
              </p>
              <div className="p-3 bg-gray-700/50 rounded-xl mb-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold text-purple-400">Lv.{maxLevelReached}</div>
                  <div className="text-gray-500">Seviye</div>
                </div>
                <div>
                  <div className="font-bold text-primary-400">{score.toLocaleString()}</div>
                  <div className="text-gray-500">Puan</div>
                </div>
                <div>
                  <div className="font-bold text-green-400">{correctAnswers}</div>
                  <div className="text-gray-500">Dogru</div>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleCancelExit}
                  className="flex-1 py-3 bg-gray-700 border border-gray-600 rounded-xl text-sm font-medium text-gray-300">
                  Devam Et
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleFinishGame}
                  className="flex-1 py-3 bg-red-600 rounded-xl text-sm font-bold text-white">
                  Cik
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && !showExitConfirm && !showLevelUp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="max-w-sm w-full p-5 text-center bg-gray-800 shadow-2xl rounded-2xl">
              <Pause size={36} className="mx-auto mb-3 text-gray-400" />
              <h3 className="mb-4 text-lg font-bold text-gray-200">Duraklatildi</h3>
              <div className="flex justify-center gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={togglePause}
                  className={`flex items-center gap-2 px-5 py-2.5 font-medium text-white bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} rounded-xl`}>
                  <PlayIcon size={18} /> Devam
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleExitRequest}
                  className="flex items-center gap-2 px-5 py-2.5 font-medium text-gray-300 bg-gray-700 rounded-xl">
                  <Home size={18} /> Cik
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Play;
