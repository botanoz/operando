import { GameStats, GameMode, GameSession, UserSettings, Achievement } from '../types';
import { STORAGE_KEYS, API_ENDPOINTS } from '../config/gameConfig';

/**
 * Storage Service - LocalStorage ve gelecekteki API entegrasyonu için
 * Tüm veri işlemlerini merkezi olarak yönetir
 */
export class StorageService {
  private static instance: StorageService;
  private isOnlineMode = false; // İleride API kullanımı için

  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Storage'ı başlat ve migration kontrolü yap
   */
  private initializeStorage(): void {
    try {
      // Versiyon kontrolü ve migration
      const version = this.getStorageVersion();
      if (version < 2) {
        this.migrateToV2();
      }
    } catch (error) {
      console.error('Storage initialization error:', error);
      this.clearAllData();
    }
  }

  /**
   * Veri versiyon kontrolü
   */
  private getStorageVersion(): number {
    return parseInt(localStorage.getItem('operando-version') || '1');
  }

  /**
   * V2 migration - yeni alan ekleme
   */
  private migrateToV2(): void {
    console.log('Migrating storage to v2...');
    
    // Mevcut stats'ı al
    const existingStats = this.getGameStats();
    
    // Yeni alanları ekle
    const updatedStats: GameStats = {
      ...existingStats,
      totalQuestionsAnswered: existingStats.totalCorrectAnswers + existingStats.totalWrongAnswers,
      highestQuestionCount: {
        easy: Math.max(Math.floor((existingStats.bestScores?.easy || 0) / 10), 0),
        medium: Math.max(Math.floor((existingStats.bestScores?.medium || 0) / 10), 0),
        hard: Math.max(Math.floor((existingStats.bestScores?.hard || 0) / 10), 0)
      },
      sessionCount: existingStats.totalGamesPlayed,
      achievements: existingStats.achievements || [],
      lastPlayedMode: (existingStats.lastPlayedMode as GameMode) || 'easy',
      lastPlayedDate: existingStats.lastPlayedDate || Date.now()
    };

    this.saveGameStats(updatedStats);
    localStorage.setItem('operando-version', '2');
  }

  /**
   * Oyun istatistiklerini getir
   */
  public getGameStats(): GameStats {
    try {
      const stats = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
      if (stats) {
        const parsed = JSON.parse(stats) as Partial<GameStats>;
        // Eksik alanları varsayılan değerlerle doldur
        return this.normalizeGameStats(parsed);
      }
    } catch (error) {
      console.error('Error getting game stats:', error);
    }

    return this.getDefaultGameStats();
  }

  /**
   * Varsayılan oyun istatistikleri
   */
  private getDefaultGameStats(): GameStats {
    return {
      totalGamesPlayed: 0,
      totalScore: 0,
      bestScores: { easy: 0, medium: 0, hard: 0 },
      currentLevels: { easy: 1, medium: 1, hard: 1 },
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalQuestionsAnswered: 0,
      averageTime: 0,
      longestStreak: 0,
      hasSeenWarmup: { easy: false, medium: false, hard: false },
      highestLevels: { easy: 1, medium: 1, hard: 1 },
      highestQuestionCount: { easy: 0, medium: 0, hard: 0 },
      sessionCount: 0,
      achievements: [],
      lastPlayedMode: 'easy',
      lastPlayedDate: Date.now()
    };
  }

  /**
   * Game stats normalizer - eksik alanları ekle
   */
  private normalizeGameStats(stats: Partial<GameStats>): GameStats {
    const defaultStats = this.getDefaultGameStats();
    return {
      ...defaultStats,
      ...stats,
      bestScores: { ...defaultStats.bestScores, ...stats.bestScores },
      currentLevels: { ...defaultStats.currentLevels, ...stats.currentLevels },
      hasSeenWarmup: { ...defaultStats.hasSeenWarmup, ...stats.hasSeenWarmup },
      highestLevels: { ...defaultStats.highestLevels, ...stats.highestLevels },
      highestQuestionCount: { ...defaultStats.highestQuestionCount, ...stats.highestQuestionCount }
    };
  }

  /**
   * Oyun istatistiklerini kaydet
   */
  public async saveGameStats(stats: GameStats): Promise<void> {
    try {
      // LocalStorage'a kaydet
      localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
      
      // Online mode'da API'ye de gönder
      if (this.isOnlineMode) {
        await this.saveToAPI(API_ENDPOINTS.SAVE_STATS, stats);
      }
    } catch (error) {
      console.error('Error saving game stats:', error);
      throw error;
    }
  }

  /**
   * Mod bazlı en yüksek seviyeyi güncelle
   */
  public updateHighestLevel(mode: GameMode, level: number): void {
    const stats = this.getGameStats();
    stats.highestLevels[mode] = Math.max(stats.highestLevels[mode] || 1, level);
    this.saveGameStats(stats);
  }

  /**
   * Mod bazlı en yüksek soru sayısını güncelle
   */
  public updateHighestQuestionCount(mode: GameMode, count: number): void {
    const stats = this.getGameStats();
    stats.highestQuestionCount[mode] = Math.max(stats.highestQuestionCount[mode] || 0, count);
    this.saveGameStats(stats);
  }

  /**
   * Session verilerini kaydet
   */
  public saveSessionData(session: GameSession): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  /**
   * Session verilerini getir
   */
  public getSessionData(): GameSession | null {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      return session ? JSON.parse(session) as GameSession : null;
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }

  /**
   * Kullanıcı ayarlarını getir
   */
  public getUserSettings(): UserSettings {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
      if (settings) {
        return JSON.parse(settings) as UserSettings;
      }
    } catch (error) {
      console.error('Error getting user settings:', error);
    }

    return {
      theme: 'dark',
      soundEnabled: true,
      vibrationEnabled: true,
      autoSubmit: true,
      showHints: true,
      language: 'tr'
    };
  }

  /**
   * Kullanıcı ayarlarını kaydet
   */
  public saveUserSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  }

  /**
   * Achievement'leri getir
   */
  public getAchievements(): Achievement[] {
    try {
      const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return achievements ? JSON.parse(achievements) as Achievement[] : [];
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  /**
   * Achievement ekle
   */
  public addAchievement(achievement: Achievement): void {
    try {
      const achievements = this.getAchievements();
      const exists = achievements.find(a => a.id === achievement.id);
      
      if (!exists) {
        achievements.push(achievement);
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        
        // Achievement unlock event
        this.onAchievementUnlocked(achievement);
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  }

  /**
   * Achievement unlock handler
   */
  private onAchievementUnlocked(achievement: Achievement): void {
    console.log('🏆 Achievement unlocked:', achievement.name);
    // Burada bildirim gösterilebilir
  }

  /**
   * Tüm verileri temizle
   */
  public clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      localStorage.removeItem('operando-version');
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  /**
   * Veri export - backup için
   */
  public exportData(): string {
    const data = {
      stats: this.getGameStats(),
      settings: this.getUserSettings(),
      achievements: this.getAchievements(),
      version: this.getStorageVersion(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Veri import - restore için
   */
  public importData(dataString: string): boolean {
    try {
      const data = JSON.parse(dataString) as {
        stats?: GameStats;
        settings?: UserSettings;
        achievements?: Achievement[];
      };
      
      if (data.stats) {
        this.saveGameStats(data.stats);
      }
      if (data.settings) {
        this.saveUserSettings(data.settings);
      }
      if (data.achievements) {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      }
      
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * API'ye veri gönder (gelecek için)
   */
  private async saveToAPI(endpoint: string, data: GameStats | GameSession): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('API save error:', error);
      // API hatası olduğunda localStorage'a devam et
    }
  }

  /**
   * Online mode'u aktifleştir
   */
  public enableOnlineMode(): void {
    this.isOnlineMode = true;
  }

  /**
   * Online mode'u devre dışı bırak
   */
  public disableOnlineMode(): void {
    this.isOnlineMode = false;
  }

  /**
   * Storage boyutunu kontrol et
   */
  public getStorageSize(): { used: number; available: number } {
    let used = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // LocalStorage genellikle 5-10MB
    const available = 5 * 1024 * 1024; // 5MB
    
    return { used, available };
  }
}

// Singleton instance export
export const storageService = StorageService.getInstance();