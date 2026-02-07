import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameSession, GameStats, GameMode, UserAnswer, Question } from '../types';
import { storageService } from '../services/storageService';

// Başlangıç değerleri
const initialGameSession: GameSession = {
  mode: 'easy',
  currentRound: 0,
  currentLevel: 1,
  totalRounds: 0,
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  timeRemaining: 0,
  currentQuestion: null,
  isActive: false,
  startTime: 0,
  hasSeenWarmup: false,
  questionsAsked: 0,
  correctInLevel: 0,
  maxLevel: 1,
  bonusTimeEarned: 0
};

// Action türleri
type GameAction =
  | { type: 'START_GAME'; payload: { mode: GameMode; level: number } }
  | { type: 'SET_CURRENT_QUESTION'; payload: Question | null }
  | { type: 'SUBMIT_ANSWER'; payload: UserAnswer }
  | { type: 'LEVEL_UP'; payload: { newLevel: number } }
  | { type: 'GAME_OVER'; payload: { finalScore: number; finalLevel: number } }
  | { type: 'RESET_TO_LEVEL_ONE'; payload: { mode: GameMode } }
  | { type: 'NEXT_ROUND' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'ADD_BONUS_TIME'; payload: number }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'INCREMENT_QUESTIONS_ASKED' }
  | { type: 'RESET_CORRECT_IN_LEVEL' };

// Game reducer - Hatasız versiyon
const gameReducer = (state: GameSession, action: GameAction): GameSession => {
  switch (action.type) {
    case 'START_GAME':
      console.log('🎮 GameContext: Oyun başlatılıyor', action.payload);
      return {
        ...initialGameSession,
        mode: action.payload.mode,
        currentLevel: action.payload.level,
        maxLevel: action.payload.level,
        totalRounds: 0,
        isActive: true,
        startTime: Date.now(),
        currentRound: 1,
        questionsAsked: 0,
        correctInLevel: 0
      };

    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload
      };

    case 'SUBMIT_ANSWER': {
      const { isCorrect, scoreEarned, bonusTimeEarned } = action.payload;
      return {
        ...state,
        correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: state.wrongAnswers + (isCorrect ? 0 : 1),
        score: state.score + (scoreEarned || 0),
        correctInLevel: state.correctInLevel + (isCorrect ? 1 : 0),
        bonusTimeEarned: state.bonusTimeEarned + (bonusTimeEarned || 0),
        questionsAsked: state.questionsAsked + 1
      };
    }

    case 'UPDATE_SCORE':
      return {
        ...state,
        score: state.score + action.payload
      };

    case 'LEVEL_UP': {
      const newLevel = action.payload.newLevel;
      return {
        ...state,
        currentLevel: newLevel,
        maxLevel: Math.max(state.maxLevel, newLevel),
        correctInLevel: 0 // Seviye atladığında sıfırla
      };
    }

    case 'GAME_OVER':
      console.log('🎮 GameContext: Oyun bitti', action.payload);
      return {
        ...state,
        isActive: false,
        endTime: Date.now()
      };

    case 'RESET_TO_LEVEL_ONE':
      console.log('🎮 GameContext: Seviye 1\'e sıfırlama', action.payload);
      return {
        ...state,
        currentLevel: 1,
        correctInLevel: 0,
        isActive: false
      };

    case 'NEXT_ROUND':
      return {
        ...state,
        currentRound: state.currentRound + 1
      };

    case 'END_GAME':
      return {
        ...state,
        isActive: false,
        endTime: Date.now()
      };

    case 'RESET_GAME':
      return initialGameSession;

    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload
      };

    case 'ADD_BONUS_TIME':
      return {
        ...state,
        timeRemaining: state.timeRemaining + action.payload
      };

    case 'INCREMENT_QUESTIONS_ASKED':
      return {
        ...state,
        questionsAsked: state.questionsAsked + 1
      };

    case 'RESET_CORRECT_IN_LEVEL':
      return {
        ...state,
        correctInLevel: 0
      };

    default:
      return state;
  }
};

// Context interface
interface GameContextType {
  gameSession: GameSession;
  gameStats: GameStats;
  startGame: (mode: GameMode, level: number) => void;
  setCurrentQuestion: (question: Question | null) => void;
  submitAnswer: (answer: UserAnswer) => void;
  updateScore: (points: number) => void;
  levelUp: (newLevel: number) => void;
  gameOver: (finalScore: number, finalLevel: number) => void;
  resetToLevelOne: (mode: GameMode) => void;
  nextRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateTime: (time: number) => void;
  addBonusTime: (seconds: number) => void;
  updateStats: (sessionData: GameSession) => void;
  markWarmupSeen: (mode: GameMode) => void;
  hasSeenWarmup: (mode: GameMode) => boolean;
  getCurrentLevel: (mode: GameMode) => number;
  getHighestLevel: (mode: GameMode) => number;
  getHighestQuestionCount: (mode: GameMode) => number;
  getTotalScore: (mode: GameMode) => number;
  getBestScore: (mode: GameMode) => number;
  getGameStats: () => GameStats;
  incrementQuestionsAsked: () => void;
  resetCorrectInLevel: () => void;
  resetStats: () => void;
}

// Context oluşturma
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameSession, dispatch] = useReducer(gameReducer, initialGameSession);
  const [gameStats, setGameStats] = React.useState<GameStats>(storageService.getGameStats());

  // İstatistikleri otomatik kaydet
  useEffect(() => {
    storageService.saveGameStats(gameStats);
  }, [gameStats]);

  // Oyun başlatma
  const startGame = useCallback((mode: GameMode, level: number) => {
    console.log('🎮 startGame çağrıldı:', { mode, level });
    dispatch({ type: 'START_GAME', payload: { mode, level } });
  }, []);

  // Mevcut soruyu ayarla
  const setCurrentQuestion = useCallback((question: Question | null) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
    if (question) {
      dispatch({ type: 'INCREMENT_QUESTIONS_ASKED' });
    }
  }, []);

  // Cevap gönder
  const submitAnswer = useCallback((answer: UserAnswer) => {
    console.log('🎮 submitAnswer çağrıldı:', answer);
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
  }, []);

  // Skor güncelle
  const updateScore = useCallback((points: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: points });
  }, []);

  // Seviye atlama
  const levelUp = useCallback((newLevel: number) => {
    console.log('🎮 levelUp çağrıldı, yeni seviye:', newLevel);
    dispatch({ type: 'LEVEL_UP', payload: { newLevel } });
    
    // Storage'da en yüksek seviyeyi güncelle
    storageService.updateHighestLevel(gameSession.mode, newLevel);
    
    // Stats'ı güncelle
    const newStats: GameStats = {
      ...gameStats,
      currentLevels: {
        ...gameStats.currentLevels,
        [gameSession.mode]: newLevel
      },
      highestLevels: {
        ...gameStats.highestLevels,
        [gameSession.mode]: Math.max(gameStats.highestLevels[gameSession.mode] || 1, newLevel)
      }
    };
    setGameStats(newStats);
  }, [gameSession.mode, gameStats]);

  // Oyun bitti (yanlış cevap)
  const gameOver = useCallback((finalScore: number, finalLevel: number) => {
    console.log('🎮 gameOver çağrıldı:', { finalScore, finalLevel });
    dispatch({ type: 'GAME_OVER', payload: { finalScore, finalLevel } });
  }, []);

  // Oyun bitti - seviye sıfırlanmaz, en yüksek seviye korunur
  const resetToLevelOne = useCallback((mode: GameMode) => {
    console.log('🎮 resetToLevelOne çağrıldı:', mode);
    dispatch({ type: 'RESET_TO_LEVEL_ONE', payload: { mode } });
    // currentLevels'ı sıfırlamıyoruz - oyuncu kaldığı seviyeden devam edecek
  }, []);

  // Sonraki tura geç
  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  // Oyunu bitir
  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
  }, []);

  // Oyunu sıfırla
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Süreyi güncelle
  const updateTime = useCallback((time: number) => {
    dispatch({ type: 'UPDATE_TIME', payload: time });
  }, []);

  // Bonus süre ekle
  const addBonusTime = useCallback((seconds: number) => {
    console.log('⏰ Bonus süre ekleniyor:', seconds);
    dispatch({ type: 'ADD_BONUS_TIME', payload: seconds });
  }, []);

  // Soru sayısını artır
  const incrementQuestionsAsked = useCallback(() => {
    dispatch({ type: 'INCREMENT_QUESTIONS_ASKED' });
  }, []);

  // Seviyedeki doğru sayısını sıfırla
  const resetCorrectInLevel = useCallback(() => {
    dispatch({ type: 'RESET_CORRECT_IN_LEVEL' });
  }, []);

  // İstatistikleri güncelle
  const updateStats = useCallback((sessionData: GameSession) => {
    console.log('🎮 updateStats çağrıldı:', sessionData);
    
    const sessionDuration = sessionData.endTime && sessionData.startTime 
      ? sessionData.endTime - sessionData.startTime 
      : 0;

    const newStats: GameStats = {
      ...gameStats,
      totalGamesPlayed: gameStats.totalGamesPlayed + 1,
      totalScore: gameStats.totalScore + sessionData.score,
      bestScores: {
        ...gameStats.bestScores,
        [sessionData.mode]: Math.max(gameStats.bestScores[sessionData.mode] || 0, sessionData.score)
      },
      currentLevels: {
        ...gameStats.currentLevels,
        [sessionData.mode]: Math.max(gameStats.currentLevels[sessionData.mode] || 1, sessionData.maxLevel)
      },
      highestLevels: {
        ...gameStats.highestLevels,
        [sessionData.mode]: Math.max(gameStats.highestLevels[sessionData.mode] || 1, sessionData.maxLevel)
      },
      highestQuestionCount: {
        ...gameStats.highestQuestionCount,
        [sessionData.mode]: Math.max(gameStats.highestQuestionCount[sessionData.mode] || 0, sessionData.questionsAsked)
      },
      totalCorrectAnswers: gameStats.totalCorrectAnswers + sessionData.correctAnswers,
      totalWrongAnswers: gameStats.totalWrongAnswers + sessionData.wrongAnswers,
      totalQuestionsAnswered: gameStats.totalQuestionsAnswered + sessionData.questionsAsked,
      averageTime: sessionDuration > 0 
        ? Math.round((gameStats.averageTime * gameStats.sessionCount + sessionDuration) / (gameStats.sessionCount + 1))
        : gameStats.averageTime,
      longestStreak: Math.max(gameStats.longestStreak, sessionData.correctAnswers),
      sessionCount: gameStats.sessionCount + 1,
      lastPlayedMode: sessionData.mode,
      lastPlayedDate: Date.now()
    };

    setGameStats(newStats);
    
    // Storage'da en yüksek değerleri güncelle
    storageService.updateHighestLevel(sessionData.mode, sessionData.maxLevel);
    storageService.updateHighestQuestionCount(sessionData.mode, sessionData.questionsAsked);
  }, [gameStats]);

  // Isınma görüldü olarak işaretle
  const markWarmupSeen = useCallback((mode: GameMode) => {
    console.log('🎮 markWarmupSeen çağrıldı:', mode);
    const newStats: GameStats = {
      ...gameStats,
      hasSeenWarmup: {
        ...gameStats.hasSeenWarmup,
        [mode]: true
      }
    };
    setGameStats(newStats);
  }, [gameStats]);

  // Isınma görüldü mü kontrol et
  const hasSeenWarmup = useCallback((mode: GameMode): boolean => {
    return gameStats.hasSeenWarmup[mode] || false;
  }, [gameStats.hasSeenWarmup]);

  // Mevcut seviyeyi al
  const getCurrentLevel = useCallback((mode: GameMode): number => {
    const level = gameStats.currentLevels[mode] || 1;
    return level;
  }, [gameStats.currentLevels]);

  // En yüksek seviyeyi al
  const getHighestLevel = useCallback((mode: GameMode): number => {
    return gameStats.highestLevels[mode] || 1;
  }, [gameStats.highestLevels]);

  // En yüksek soru sayısını al
  const getHighestQuestionCount = useCallback((mode: GameMode): number => {
    return gameStats.highestQuestionCount[mode] || 0;
  }, [gameStats.highestQuestionCount]);

  // Toplam skoru al
  const getTotalScore = useCallback((mode: GameMode): number => {
    return gameStats.bestScores[mode] || 0;
  }, [gameStats.bestScores]);

  // En iyi skoru al
  const getBestScore = useCallback((mode: GameMode): number => {
    return gameStats.bestScores[mode] || 0;
  }, [gameStats.bestScores]);

  // Oyun istatistikleri al
  const getGameStats = useCallback((): GameStats => {
    return gameStats;
  }, [gameStats]);

  // Tum istatistikleri sifirla
  const resetStats = useCallback(() => {
    const defaultStats = storageService.getDefaultGameStats();
    setGameStats(defaultStats);
    storageService.saveGameStats(defaultStats);
  }, []);

  const contextValue: GameContextType = React.useMemo(() => ({
    gameSession,
    gameStats,
    startGame,
    setCurrentQuestion,
    submitAnswer,
    updateScore,
    levelUp,
    gameOver,
    resetToLevelOne,
    nextRound,
    endGame,
    resetGame,
    updateTime,
    addBonusTime,
    updateStats,
    markWarmupSeen,
    hasSeenWarmup,
    getCurrentLevel,
    getHighestLevel,
    getHighestQuestionCount,
    getTotalScore,
    getBestScore,
    getGameStats,
    incrementQuestionsAsked,
    resetCorrectInLevel,
    resetStats
  }), [
    gameSession,
    gameStats,
    startGame,
    setCurrentQuestion,
    submitAnswer,
    updateScore,
    levelUp,
    gameOver,
    resetToLevelOne,
    nextRound,
    endGame,
    resetGame,
    updateTime,
    addBonusTime,
    updateStats,
    markWarmupSeen,
    hasSeenWarmup,
    getCurrentLevel,
    getHighestLevel,
    getHighestQuestionCount,
    getTotalScore,
    getBestScore,
    getGameStats,
    incrementQuestionsAsked,
    resetCorrectInLevel,
    resetStats
  ]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame hook sadece GameProvider içinde kullanılabilir');
  }
  return context;
};