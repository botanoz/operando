// Operasyon türleri
export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

// Oyun modları
export type GameMode = 'easy' | 'medium' | 'hard';

// Tema türleri
export type ThemeType = 'light' | 'dark' | 'auto';

// Dil türleri
export type LanguageType = 'tr' | 'en';

// Oyun sabitleri
export interface GameConstants {
  LEVEL_UP_THRESHOLD: number;
  MAX_ANSWER_LENGTH: number;
  MIN_LEVEL: number;
  MAX_LEVEL: number;
  BONUS_TIME_AMOUNT: number;
  CRITICAL_TIME_THRESHOLD: number;
  WARNING_TIME_THRESHOLD: number;
  POINTS_PER_CORRECT: number;
  LEVEL_PROGRESSION_INTERVAL: number;
  SONSUZ_MODE_ENABLED: boolean;
}

// Zorluk ayarları
export interface DifficultySettings {
  minDigits: number;
  maxDigits: number;
  operations: OperationType[];
  weights: number[];
}

// Oyun modu konfigürasyonu
export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  shortDescription: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  emoji: string;
  totalRounds: number; // 0 = sonsuz
  timePerQuestion: number;
  operations: OperationType[];
  maxDigits: number;
  isEndless: boolean;
  bonusThreshold: number; // Bonus süre için eşik
  difficultyMultiplier: number; // Zorluk çarpanı
  scoreMultiplier: number; // Skor çarpanı
  minLevel: number;
  maxStartLevel: number;
}

// Soru yapısı
export interface Question {
  id: string;
  operation: OperationType;
  operand1: number;
  operand2: number;
  correctAnswer: number;
  difficulty: number;
  level: number;
  createdAt?: number;
  timeToAnswer?: number;
  isCorrect?: boolean;
}

// Oyun oturumu
export interface GameSession {
  mode: GameMode;
  currentRound: number;
  currentLevel: number;
  totalRounds: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeRemaining: number;
  currentQuestion: Question | null;
  isActive: boolean;
  startTime: number;
  endTime?: number;
  hasSeenWarmup?: boolean;
  questionsAsked: number;
  correctInLevel: number;
  maxLevel: number;
  bonusTimeEarned: number;
}

// Güncellenmiş oyun istatistikleri
export interface GameStats {
  totalGamesPlayed: number;
  totalScore: number;
  bestScores: Record<GameMode, number>;
  currentLevels: Record<GameMode, number>;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  totalQuestionsAnswered: number;
  averageTime: number;
  longestStreak: number;
  hasSeenWarmup: Record<GameMode, boolean>;
  highestLevels: Record<GameMode, number>; // En yüksek ulaşılan seviye
  highestQuestionCount: Record<GameMode, number>; // En fazla soru sayısı
  sessionCount: number;
  achievements: Achievement[];
  lastPlayedMode: GameMode;
  lastPlayedDate: number;
}

// Kullanıcı cevabı
export interface UserAnswer {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  timeToAnswer: number;
  isCorrect: boolean;
  scoreEarned: number;
  bonusTimeEarned: number;
  level: number;
  round: number;
}

// Kullanıcı ayarları
export interface UserSettings {
  theme: ThemeType;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoSubmit: boolean;
  showHints: boolean;
  language: LanguageType;
}

// Başarım sistemi
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  icon?: string;
  category?: 'level' | 'score' | 'speed' | 'streak' | 'special';
}

// Performans analizi
export interface PerformanceAnalysis {
  accuracy: number;
  averageTime: number;
  strongOperations: OperationType[];
  weakOperations: OperationType[];
  recommendedLevel: number;
  improvements: string[];
}

// Leaderboard entry
export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  level: number;
  mode: GameMode;
  date: number;
  questionsAnswered: number;
}

// Oyun eventi
export interface GameEvent {
  type: 'question_answered' | 'level_up' | 'game_over' | 'achievement_unlocked' | 'bonus_earned';
  timestamp: number;
  data: Record<string, unknown>;
}

// Soru geçmişi
export interface QuestionHistory {
  questions: Question[];
  maxSize: number;
  addQuestion: (question: Question) => void;
  getRecentOperations: () => OperationType[];
  getAccuracy: () => number;
  clear: () => void;
}

// Zamanlayıcı durumu
export interface TimerState {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
  isPaused: boolean;
  isCritical: boolean;
  percentage: number;
}

// Skor hesaplama parametreleri
export interface ScoreCalculationParams {
  operation: OperationType;
  isCorrect: boolean;
  timeToAnswer: number;
  maxTime: number;
  level: number;
  mode: GameMode;
  difficulty: number;
}

// API Response types (gelecek için)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SaveStatsRequest {
  stats: GameStats;
  session: GameSession;
  timestamp: number;
}

export interface LeaderboardResponse {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event handlers
export type QuestionAnswerHandler = (answer: UserAnswer) => void;
export type LevelUpHandler = (newLevel: number) => void;
export type GameOverHandler = (finalStats: GameStats) => void;
export type AchievementHandler = (achievement: Achievement) => void;

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Storage types
export interface StorageData {
  stats: GameStats;
  settings: UserSettings;
  achievements: Achievement[];
  version: number;
}

// Export utility constants
export const OPERATION_SYMBOLS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
} as const;

export const OPERATION_NAMES = {
  addition: 'Toplama',
  subtraction: 'Çıkarma',
  multiplication: 'Çarpma',
  division: 'Bölme'
} as const;

export const MODE_COLORS = {
  easy: '#16a085',
  medium: '#f59e0b', 
  hard: '#8b5cf6'
} as const;

// Game Mode Values - enum gibi kullanım için
export const GAME_MODE_VALUES = {
  EASY: 'easy' as const,
  MEDIUM: 'medium' as const,
  HARD: 'hard' as const
} as const;

// Type guards
export function isGameMode(value: string): value is GameMode {
  return ['easy', 'medium', 'hard'].includes(value);
}

export function isOperationType(value: string): value is OperationType {
  return ['addition', 'subtraction', 'multiplication', 'division'].includes(value);
}

export function isThemeType(value: string): value is ThemeType {
  return ['light', 'dark', 'auto'].includes(value);
}

// Validation helpers
export function validateGameStats(stats: unknown): stats is GameStats {
  if (!stats || typeof stats !== 'object') return false;
  
  const s = stats as Record<string, unknown>;
  
  return (
    typeof s.totalGamesPlayed === 'number' &&
    typeof s.totalScore === 'number' &&
    typeof s.bestScores === 'object' &&
    typeof s.currentLevels === 'object' &&
    typeof s.totalCorrectAnswers === 'number' &&
    typeof s.totalWrongAnswers === 'number'
  );
}

export function validateQuestion(question: unknown): question is Question {
  if (!question || typeof question !== 'object') return false;
  
  const q = question as Record<string, unknown>;
  
  return (
    typeof q.id === 'string' &&
    isOperationType(q.operation as string) &&
    typeof q.operand1 === 'number' &&
    typeof q.operand2 === 'number' &&
    typeof q.correctAnswer === 'number' &&
    typeof q.difficulty === 'number' &&
    typeof q.level === 'number'
  );
}