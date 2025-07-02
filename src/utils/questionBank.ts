import { Question, OperationType, GameMode, ScoreCalculationParams, DifficultySettings } from '../types';
import { difficultyManager } from './difficultyManager';
import { GAME_CONSTANTS, LEVEL_NAMES } from '../config/gameConfig';

/**
 * Güncellenmiş Soru Bankası - Difficulty Manager ile entegre
 * Tüm any tipleri kaldırıldı ve type safety sağlandı
 */

// Soru geçmişi yönetimi
class QuestionHistory {
  private history: Question[] = [];
  private readonly maxHistory = 10;

  addQuestion(question: Question): void {
    this.history.push(question);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getRecentOperations(): OperationType[] {
    return this.history.slice(-5).map(q => q.operation);
  }

  getAccuracy(): number {
    if (this.history.length === 0) return 0;
    const correct = this.history.filter(q => q.isCorrect).length;
    return correct / this.history.length;
  }

  clear(): void {
    this.history = [];
  }
}

// Soru veri yapısı
interface QuestionData {
  a: number;
  b: number;
  answer: number;
}

// Global soru geçmişi
export const questionHistory = new QuestionHistory();

/**
 * Ana soru üretici fonksiyonu - Geliştirilmiş ve type-safe
 */
export const generateQuestion = (mode: GameMode, level: number, round: number): Question => {
  console.log('🎯 Soru üretiliyor:', { mode, level, round });
  
  try {
    const difficulty = difficultyManager.getDifficultyForLevel(mode, level);
    const operation = difficultyManager.selectWeightedOperation(difficulty.operations, difficulty.weights);
    
    console.log('📊 Zorluk ayarları:', { difficulty, operation });
    
    let questionData: QuestionData;
    
    switch (operation) {
      case 'addition':
        questionData = generateAddition(difficulty);
        break;
      case 'subtraction':
        questionData = generateSubtraction(difficulty);
        break;
      case 'multiplication':
        questionData = generateMultiplication(difficulty);
        break;
      case 'division':
        questionData = generateDivision(difficulty);
        break;
      default:
        questionData = generateAddition(difficulty);
    }
    
    const question: Question = {
      id: `${operation}_${level}_${round}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      operation,
      operand1: questionData.a,
      operand2: questionData.b,
      correctAnswer: questionData.answer,
      difficulty: round,
      level,
      createdAt: Date.now()
    };
    
    // Soru geçmişine ekle
    questionHistory.addQuestion(question);
    
    console.log('✅ Soru oluşturuldu:', question);
    return question;
    
  } catch (error) {
    console.error('❌ Soru üretilirken hata:', error);
    
    // Fallback basit soru
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
    return fallbackQuestion;
  }
};

/**
 * Toplama sorusu üretici - Type-safe
 */
const generateAddition = (difficulty: DifficultySettings): QuestionData => {
  const a = difficultyManager.generateNumberInRange(difficulty.minDigits, difficulty.maxDigits);
  let b = difficultyManager.generateNumberInRange(difficulty.minDigits, difficulty.maxDigits);
  
  // Özel durumlar
  if (Math.random() < 0.3) {
    // 10'a tamamlama
    if (a < 10 && b < 10) {
      const complement = 10 - a;
      if (complement > 0 && complement <= 9) {
        b = complement + Math.floor(Math.random() * 5);
      }
    }
  }
  
  return { a, b, answer: a + b };
};

/**
 * Çıkarma sorusu üretici - Type-safe
 */
const generateSubtraction = (difficulty: DifficultySettings): QuestionData => {
  let a = difficultyManager.generateNumberInRange(difficulty.minDigits, difficulty.maxDigits);
  let b = difficultyManager.generateNumberInRange(difficulty.minDigits, Math.min(difficulty.maxDigits, a.toString().length));
  
  // a'nın b'den büyük olmasını garanti et
  if (a < b) [a, b] = [b, a];
  
  // Negatif sonuç varsa düzelt
  if (a - b < 0) {
    b = Math.floor(a / 2);
  }
  
  return { a, b, answer: a - b };
};

/**
 * Çarpma sorusu üretici - Type-safe
 */
const generateMultiplication = (difficulty: DifficultySettings): QuestionData => {
  const { a, b } = difficultyManager.generateMultiplicationPair(difficulty);
  return { a, b, answer: a * b };
};

/**
 * Bölme sorusu üretici - Type-safe
 */
const generateDivision = (difficulty: DifficultySettings): QuestionData => {
  const { dividend, divisor, quotient } = difficultyManager.generateDivisionPair(difficulty);
  return { a: dividend, b: divisor, answer: quotient };
};

/**
 * Gelişmiş skor hesaplama - Type-safe
 */
export const calculateScore = (params: ScoreCalculationParams): number => {
  if (!params.isCorrect) return 0; // Yanlış cevap = 0 puan (eksi puan yok)
  
  const baseScore = GAME_CONSTANTS.POINTS_PER_CORRECT;
  
  // Operasyon çarpanı
  const operationMultiplier = difficultyManager.getScoreMultiplier(
    params.operation, 
    params.level, 
    params.mode
  );
  
  // Hız bonusu
  const speedBonus = difficultyManager.getSpeedBonus(params.timeToAnswer, params.maxTime);
  
  // Zorluk bonusu
  const difficultyBonus = 1 + (params.difficulty * 0.1);
  
  const finalScore = baseScore * operationMultiplier * speedBonus * difficultyBonus;
  
  return Math.round(Math.max(1, finalScore)); // En az 1 puan
};

/**
 * Overload için geriye uyumluluk - Type-safe
 */
export const calculateScoreOld = (
  operation: OperationType,
  isCorrect: boolean,
  timeToAnswer: number,
  maxTime: number,
  level: number
): number => {
  return calculateScore({
    operation,
    isCorrect,
    timeToAnswer,
    maxTime,
    level,
    mode: 'medium', // varsayılan
    difficulty: level
  });
};

/**
 * Bonus süre hesaplama - Geliştirilmiş ve type-safe
 */
export const getBonusTime = (mode: GameMode, timeToAnswer: number, maxTime: number): number => {
  const timeRatio = (maxTime - timeToAnswer) / maxTime;
  
  // Mod bazlı eşik değerleri
  const thresholds: Record<GameMode, number> = {
    easy: 0.6,
    medium: 0.7,
    hard: 0.8
  };
  
  const threshold = thresholds[mode];
  
  if (timeRatio >= threshold) {
    return GAME_CONSTANTS.BONUS_TIME_AMOUNT;
  }
  
  return 0;
};

/**
 * Seviye atlama kontrolü
 */
export const shouldLevelUp = (correctAnswersInLevel: number): boolean => {
  return correctAnswersInLevel >= GAME_CONSTANTS.LEVEL_UP_THRESHOLD;
};

/**
 * İşlem sembolü - Type-safe
 */
export const getOperationSymbol = (operation: OperationType): string => {
  const symbols: Record<OperationType, string> = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷'
  };
  return symbols[operation];
};

/**
 * İşlem adı (Türkçe) - Type-safe
 */
export const getOperationName = (operation: OperationType): string => {
  const names: Record<OperationType, string> = {
    addition: 'Toplama',
    subtraction: 'Çıkarma',
    multiplication: 'Çarpma',
    division: 'Bölme'
  };
  return names[operation];
};

/**
 * Seviye adı - Geliştirilmiş ve type-safe
 */
export const getLevelName = (level: number): string => {
  // En yakın seviye adını bul
  const levelThresholds = Object.keys(LEVEL_NAMES)
    .map(Number)
    .sort((a, b) => b - a); // Büyükten küçüğe

  for (const threshold of levelThresholds) {
    if (level >= threshold) {
      return LEVEL_NAMES[threshold as keyof typeof LEVEL_NAMES];
    }
  }

  return 'Başlangıç';
};

/**
 * Zorluk analizi - Type-safe
 */
export const getDifficultyAnalysis = (question: Question): {
  complexity: number;
  estimatedTime: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
} => {
  return difficultyManager.analyzeDifficulty(
    question.operand1,
    question.operand2,
    question.operation
  );
};

/**
 * Performans analizi - Type-safe
 */
export const analyzePerformance = (questions: Question[]): {
  accuracy: number;
  averageTime: number;
  strongOperations: OperationType[];
  weakOperations: OperationType[];
  recommendedLevel: number;
} => {
  if (questions.length === 0) {
    return {
      accuracy: 0,
      averageTime: 0,
      strongOperations: [],
      weakOperations: [],
      recommendedLevel: 1
    };
  }

  const correct = questions.filter(q => q.isCorrect).length;
  const accuracy = correct / questions.length;
  
  const totalTime = questions.reduce((sum, q) => sum + (q.timeToAnswer || 0), 0);
  const averageTime = totalTime / questions.length;
  
  // Operasyon bazlı analiz
  const operationStats: Record<OperationType, { correct: number; total: number }> = {
    addition: { correct: 0, total: 0 },
    subtraction: { correct: 0, total: 0 },
    multiplication: { correct: 0, total: 0 },
    division: { correct: 0, total: 0 }
  };
  
  questions.forEach(q => {
    operationStats[q.operation].total++;
    if (q.isCorrect) {
      operationStats[q.operation].correct++;
    }
  });
  
  const operations: OperationType[] = ['addition', 'subtraction', 'multiplication', 'division'];
  
  const strongOperations = operations.filter(op => {
    const stats = operationStats[op];
    return stats.total > 0 && (stats.correct / stats.total) >= 0.8;
  });
  
  const weakOperations = operations.filter(op => {
    const stats = operationStats[op];
    return stats.total > 0 && (stats.correct / stats.total) < 0.6;
  });
  
  // Önerilen seviye
  const currentLevel = Math.max(...questions.map(q => q.level));
  let recommendedLevel = currentLevel;
  
  if (accuracy >= 0.9) {
    recommendedLevel = Math.min(currentLevel + 2, GAME_CONSTANTS.MAX_LEVEL);
  } else if (accuracy >= 0.7) {
    recommendedLevel = Math.min(currentLevel + 1, GAME_CONSTANTS.MAX_LEVEL);
  } else if (accuracy < 0.5) {
    recommendedLevel = Math.max(currentLevel - 1, GAME_CONSTANTS.MIN_LEVEL);
  }
  
  return {
    accuracy,
    averageTime,
    strongOperations,
    weakOperations,
    recommendedLevel
  };
};

/**
 * Adaptif zorluk ayarlama - Type-safe
 */
export const getAdaptiveDifficulty = (recentPerformance: boolean[], currentLevel: number): number => {
  if (recentPerformance.length < 3) return currentLevel;
  
  const recentCorrect = recentPerformance.slice(-5).filter(Boolean).length;
  const recentTotal = Math.min(5, recentPerformance.length);
  const accuracy = recentCorrect / recentTotal;
  
  // Performansa göre zorluk ayarlama
  if (accuracy >= 0.9) return Math.min(currentLevel + 1, GAME_CONSTANTS.MAX_LEVEL);
  if (accuracy <= 0.3) return Math.max(currentLevel - 1, GAME_CONSTANTS.MIN_LEVEL);
  
  return currentLevel;
};

/**
 * Soru doğrulama - Type-safe
 */
export const validateQuestion = (question: Question): boolean => {
  if (!question || typeof question !== 'object') return false;
  if (!question.id || typeof question.id !== 'string') return false;
  if (!['addition', 'subtraction', 'multiplication', 'division'].includes(question.operation)) return false;
  if (typeof question.operand1 !== 'number' || question.operand1 < 0) return false;
  if (typeof question.operand2 !== 'number' || question.operand2 < 0) return false;
  if (typeof question.correctAnswer !== 'number') return false;
  if (typeof question.level !== 'number' || question.level < 1) return false;
  
  // Cevabı doğrula
  let expectedAnswer: number;
  switch (question.operation) {
    case 'addition':
      expectedAnswer = question.operand1 + question.operand2;
      break;
    case 'subtraction':
      expectedAnswer = question.operand1 - question.operand2;
      break;
    case 'multiplication':
      expectedAnswer = question.operand1 * question.operand2;
      break;
    case 'division':
      expectedAnswer = question.operand1 / question.operand2;
      break;
    default:
      return false;
  }
  
  return Math.abs(expectedAnswer - question.correctAnswer) < 0.001; // Float karşılaştırması
};

/**
 * Rastgele soru ID üretici - Helper function
 */
export const generateQuestionId = (operation: OperationType, level: number, round: number): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${operation}_${level}_${round}_${timestamp}_${random}`;
};

/**
 * Soru zorluk seviyesi hesaplama
 */
export const calculateQuestionDifficulty = (question: Question): number => {
  const digitComplexity = Math.max(
    question.operand1.toString().length,
    question.operand2.toString().length
  );
  
  const operationComplexity: Record<OperationType, number> = {
    addition: 1,
    subtraction: 2,
    multiplication: 3,
    division: 4
  };
  
  return digitComplexity + operationComplexity[question.operation] + question.level;
};

/**
 * Bonus süre için minimum performans eşik değerleri
 */
export const getBonusTimeThresholds = (): Record<GameMode, { timeThreshold: number; bonusAmount: number }> => {
  return {
    easy: { timeThreshold: 0.6, bonusAmount: GAME_CONSTANTS.BONUS_TIME_AMOUNT },
    medium: { timeThreshold: 0.7, bonusAmount: GAME_CONSTANTS.BONUS_TIME_AMOUNT },
    hard: { timeThreshold: 0.8, bonusAmount: GAME_CONSTANTS.BONUS_TIME_AMOUNT }
  };
};