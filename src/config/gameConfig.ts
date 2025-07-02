import { GameModeConfig, DifficultySettings, GameConstants, GameMode } from '../types';

// Oyun sabitleri
export const GAME_CONSTANTS: GameConstants = {
  LEVEL_UP_THRESHOLD: 5, // Her 5 doğru cevap = 1 seviye
  MAX_ANSWER_LENGTH: 8,
  MIN_LEVEL: 1,
  MAX_LEVEL: 999,
  BONUS_TIME_AMOUNT: 5,
  CRITICAL_TIME_THRESHOLD: 5,
  WARNING_TIME_THRESHOLD: 10,
  POINTS_PER_CORRECT: 10,
  LEVEL_PROGRESSION_INTERVAL: 5, // Her 5 seviyede zorluk artar
  SONSUZ_MODE_ENABLED: true
};

// Mod bazlı zorluk ayarları - Her mod için ayrı zorluk eğrisi
export const MODE_DIFFICULTY_SETTINGS: Record<GameMode, Record<number, DifficultySettings>> = {
  easy: {
    1: { minDigits: 1, maxDigits: 1, operations: ['addition'], weights: [1] },
    2: { minDigits: 1, maxDigits: 2, operations: ['addition'], weights: [1] },
    3: { minDigits: 1, maxDigits: 2, operations: ['addition', 'subtraction'], weights: [0.7, 0.3] },
    5: { minDigits: 2, maxDigits: 2, operations: ['addition', 'subtraction'], weights: [0.6, 0.4] },
    8: { minDigits: 2, maxDigits: 3, operations: ['addition', 'subtraction'], weights: [0.5, 0.5] },
    10: { minDigits: 2, maxDigits: 3, operations: ['addition', 'subtraction'], weights: [0.4, 0.6] },
    15: { minDigits: 2, maxDigits: 3, operations: ['addition', 'subtraction'], weights: [0.3, 0.7] },
    20: { minDigits: 3, maxDigits: 3, operations: ['addition', 'subtraction'], weights: [0.2, 0.8] },
    30: { minDigits: 3, maxDigits: 4, operations: ['addition', 'subtraction'], weights: [0.1, 0.9] },
    50: { minDigits: 3, maxDigits: 4, operations: ['addition', 'subtraction'], weights: [0.1, 0.9] }
  },
  medium: {
    1: { minDigits: 2, maxDigits: 2, operations: ['addition', 'subtraction'], weights: [0.6, 0.4] },
    3: { minDigits: 2, maxDigits: 2, operations: ['addition', 'subtraction', 'multiplication'], weights: [0.4, 0.4, 0.2] },
    5: { minDigits: 2, maxDigits: 3, operations: ['addition', 'subtraction', 'multiplication'], weights: [0.3, 0.3, 0.4] },
    8: { minDigits: 2, maxDigits: 3, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.25, 0.25, 0.35, 0.15] },
    12: { minDigits: 3, maxDigits: 3, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.2, 0.2, 0.4, 0.2] },
    18: { minDigits: 3, maxDigits: 4, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.15, 0.15, 0.45, 0.25] },
    25: { minDigits: 3, maxDigits: 4, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.1, 0.1, 0.5, 0.3] },
    35: { minDigits: 3, maxDigits: 5, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.1, 0.1, 0.4, 0.4] },
    50: { minDigits: 4, maxDigits: 5, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.05, 0.05, 0.4, 0.5] }
  },
  hard: {
    1: { minDigits: 2, maxDigits: 3, operations: ['addition', 'subtraction', 'multiplication'], weights: [0.3, 0.3, 0.4] },
    3: { minDigits: 2, maxDigits: 3, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.2, 0.2, 0.4, 0.2] },
    6: { minDigits: 3, maxDigits: 3, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.15, 0.15, 0.45, 0.25] },
    10: { minDigits: 3, maxDigits: 4, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.1, 0.1, 0.5, 0.3] },
    15: { minDigits: 3, maxDigits: 4, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.1, 0.1, 0.4, 0.4] },
    22: { minDigits: 4, maxDigits: 4, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.05, 0.05, 0.45, 0.45] },
    30: { minDigits: 4, maxDigits: 5, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.05, 0.05, 0.4, 0.5] },
    40: { minDigits: 4, maxDigits: 6, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.05, 0.05, 0.35, 0.55] },
    60: { minDigits: 5, maxDigits: 6, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.05, 0.05, 0.3, 0.6] },
    100: { minDigits: 5, maxDigits: 7, operations: ['addition', 'subtraction', 'multiplication', 'division'], weights: [0.05, 0.05, 0.25, 0.65] }
  }
};

// Geriye uyumluluk için eski DIFFICULTY_SETTINGS (artık kullanılmayacak)
export const DIFFICULTY_SETTINGS: Record<number, DifficultySettings> = MODE_DIFFICULTY_SETTINGS.medium;

// Oyun modları konfigürasyonu - Merkezi
export const GAME_MODES: Record<string, GameModeConfig> = {
  easy: {
    id: 'easy',
    name: 'Sayı Bahçesi',
    description: 'Toplama ve çıkarma ile başla. Seviye ilerledikçe zorluk artar!',
    shortDescription: 'Başlangıç seviyesi',
    color: '#16a085',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-600',
    icon: '🌱',
    emoji: '🌱',
    totalRounds: 0, // Sonsuz
    timePerQuestion: 15,
    operations: ['addition', 'subtraction'],
    maxDigits: 4,
    isEndless: true,
    bonusThreshold: 10,
    difficultyMultiplier: 1.0, // Standart zorluk
    scoreMultiplier: 1.0,
    minLevel: 1,
    maxStartLevel: 10
  },
  medium: {
    id: 'medium',
    name: 'Zihin Adası',
    description: 'Dört işlemi de öğren! Her seviyede yeni işlemler açılır.',
    shortDescription: 'Orta seviye',
    color: '#f59e0b',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-600',
    icon: '🏝️',
    emoji: '🏝️',
    totalRounds: 0,
    timePerQuestion: 12,
    operations: ['addition', 'subtraction', 'multiplication', 'division'],
    maxDigits: 5,
    isEndless: true,
    bonusThreshold: 8,
    difficultyMultiplier: 1.3,
    scoreMultiplier: 1.5,
    minLevel: 1,
    maxStartLevel: 15
  },
  hard: {
    id: 'hard',
    name: 'Sonsuz Galaksi',
    description: 'Uzman seviyesi! Tüm işlemlerle sınırsız matematik macerasına çık.',
    shortDescription: 'Uzman seviyesi',
    color: '#8b5cf6',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-pink-600',
    icon: '🚀',
    emoji: '🚀',
    totalRounds: 0,
    timePerQuestion: 10,
    operations: ['addition', 'subtraction', 'multiplication', 'division'],
    maxDigits: 7,
    isEndless: true,
    bonusThreshold: 5,
    difficultyMultiplier: 1.6,
    scoreMultiplier: 2.0,
    minLevel: 1,
    maxStartLevel: 20
  }
};

// Operasyon katsayıları - skor hesabı için
export const OPERATION_MULTIPLIERS = {
  addition: 1.0,
  subtraction: 1.2,
  multiplication: 1.5,
  division: 1.8
} as const;

// Hız bonusu katsayıları
export const SPEED_BONUS_THRESHOLDS = {
  excellent: { threshold: 0.8, multiplier: 1.5 }, // %80 süre kaldı
  good: { threshold: 0.6, multiplier: 1.2 },      // %60 süre kaldı
  normal: { threshold: 0.4, multiplier: 1.0 },    // %40 süre kaldı
  slow: { threshold: 0.2, multiplier: 0.8 },      // %20 süre kaldı
  verySlow: { threshold: 0, multiplier: 0.6 }     // Süre bitti
} as const;

// Seviye isimleri
export const LEVEL_NAMES = {
  1: 'Başlangıç',
  5: 'Gelişen',
  10: 'İyi',
  15: 'İleri',
  20: 'Uzman',
  25: 'Usta',
  30: 'Efsane',
  50: 'Matematik Dehası',
  100: 'Büyük Usta'
} as const;

// Achievement sistemi
export const ACHIEVEMENTS = {
  FIRST_CORRECT: { id: 'first_correct', name: 'İlk Adım', description: 'İlk doğru cevabını verdin!' },
  LEVEL_5: { id: 'level_5', name: 'Gelişen', description: 'Seviye 5\'e ulaştın!' },
  LEVEL_10: { id: 'level_10', name: 'İyi', description: 'Seviye 10\'a ulaştın!' },
  LEVEL_20: { id: 'level_20', name: 'Uzman', description: 'Seviye 20\'ye ulaştın!' },
  PERFECT_LEVEL: { id: 'perfect_level', name: 'Mükemmel', description: 'Bir seviyeyi hiç yanlış yapmadan tamamladın!' },
  SPEED_MASTER: { id: 'speed_master', name: 'Hız Ustası', description: '10 soruyu üst üste hızlı çözdün!' },
  MARATHON: { id: 'marathon', name: 'Maraton', description: '100 soru çözdün!' }
} as const;

// LocalStorage anahtarları
export const STORAGE_KEYS = {
  GAME_STATS: 'operando-stats',
  GAME_SETTINGS: 'operando-settings',
  ACHIEVEMENTS: 'operando-achievements',
  THEME: 'operando-theme',
  SESSION_DATA: 'operando-session'
} as const;

// API endpoints (gelecek için)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001',
  SAVE_STATS: '/api/stats',
  GET_STATS: '/api/stats',
  SAVE_SESSION: '/api/session',
  LEADERBOARD: '/api/leaderboard'
} as const;