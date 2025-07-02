import { GameMode, OperationType, DifficultySettings } from '../types';
import { MODE_DIFFICULTY_SETTINGS, GAME_MODES, OPERATION_MULTIPLIERS } from '../config/gameConfig';

/**
 * Zorluk Yöneticisi - Mod bazlı sonsuz zorluk artışı
 * Her mod için özel zorluk eğrisi sistemi
 */
export class DifficultyManager {
  private static instance: DifficultyManager;

  private constructor() {}

  public static getInstance(): DifficultyManager {
    if (!DifficultyManager.instance) {
      DifficultyManager.instance = new DifficultyManager();
    }
    return DifficultyManager.instance;
  }

  /**
   * Seviye için mod bazlı zorluk ayarlarını getir
   */
  public getDifficultyForLevel(mode: GameMode, level: number): DifficultySettings {
    const modeDifficultySettings = MODE_DIFFICULTY_SETTINGS[mode];
    
    // En yakın zorluk seviyesini bul (mode bazlı)
    const difficultyLevels = Object.keys(modeDifficultySettings)
      .map(Number)
      .sort((a, b) => b - a); // Büyükten küçüğe sıra

    let baseDifficulty: DifficultySettings | null = null;
    
    for (const diffLevel of difficultyLevels) {
      if (level >= diffLevel) {
        baseDifficulty = modeDifficultySettings[diffLevel];
        break;
      }
    }
    
    // Eğer hiç uygun seviye bulunamazsa, en düşük seviyeyi kullan
    if (!baseDifficulty) {
      const lowestLevel = Math.min(...difficultyLevels);
      baseDifficulty = modeDifficultySettings[lowestLevel];
    }
    
    // Yüksek seviyelerde sonsuz artış
    const maxDefinedLevel = Math.max(...difficultyLevels);
    if (level > maxDefinedLevel) {
      return this.generateAdvancedDifficulty(level, baseDifficulty, mode, maxDefinedLevel);
    }
    
    return baseDifficulty;
  }

  /**
   * Yüksek seviyeler için gelişmiş zorluk üretimi
   */
  private generateAdvancedDifficulty(
    level: number, 
    baseDifficulty: DifficultySettings, 
    mode: GameMode,
    maxDefinedLevel: number
  ): DifficultySettings {
    const excessLevel = level - maxDefinedLevel;
    const progressionFactor = Math.floor(excessLevel / 10); // Her 10 seviyede artış
    
    let minDigits = baseDifficulty.minDigits;
    let maxDigits = baseDifficulty.maxDigits;
    
    // Mode bazlı ilerleme stratejileri
    switch (mode) {
      case 'easy':
        // Kolay mod: Sadece toplama/çıkarma, yavaş artış
        maxDigits = Math.min(5, baseDifficulty.maxDigits + Math.floor(progressionFactor / 2));
        minDigits = Math.min(4, baseDifficulty.minDigits + Math.floor(progressionFactor / 3));
        break;
        
      case 'medium':
        // Orta mod: Tüm işlemler, orta hızda artış
        minDigits = Math.min(5, baseDifficulty.minDigits + Math.floor(progressionFactor / 2));
        maxDigits = Math.min(6, baseDifficulty.maxDigits + Math.floor(progressionFactor / 1.5));
        break;
        
      case 'hard':
        // Zor mod: Çok hızlı artış, çok büyük sayılar
        minDigits = Math.min(6, baseDifficulty.minDigits + Math.floor(progressionFactor / 1.5));
        maxDigits = Math.min(8, baseDifficulty.maxDigits + progressionFactor);
        break;
    }
    
    // Mod limitlerine uygun ağırlık ayarları
    const operations = baseDifficulty.operations;
    let weights = baseDifficulty.weights;
    
    // Yüksek seviyelerde daha zor işlemlere ağırlık ver
    if (level > maxDefinedLevel + 20) {
      if (operations.includes('division')) {
        const divisionIndex = operations.indexOf('division');
        weights = [...weights];
        weights[divisionIndex] = Math.min(0.7, weights[divisionIndex] + 0.1);
        
        // Diğer ağırlıkları normalize et
        const sum = weights.reduce((a, b) => a + b, 0);
        weights = weights.map(w => w / sum);
      }
    }
    
    return {
      minDigits,
      maxDigits,
      operations,
      weights
    };
  }

  /**
   * Ağırlıklı rastgele işlem seçimi
   */
  public selectWeightedOperation(operations: OperationType[], weights: number[]): OperationType {
    if (operations.length === 0) return 'addition';
    if (operations.length === 1) return operations[0];

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < operations.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return operations[i];
      }
    }
    
    return operations[operations.length - 1];
  }

  /**
   * Mod ve zorluk bazlı sayı aralığı üretici
   */
  public generateNumberInRange(minDigits: number, maxDigits: number, excludeZero = false): number {
    const digits = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;
    const min = digits === 1 ? (excludeZero ? 1 : 0) : Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    
    let number = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Özel sayılar için %30 şans (kolay hesaplama için)
    if (Math.random() < 0.3) {
      const specialNumbers = this.getSpecialNumbers(min, max);
      if (specialNumbers.length > 0) {
        number = specialNumbers[Math.floor(Math.random() * specialNumbers.length)];
      }
    }
    
    return number;
  }

  /**
   * Özel sayılar (kolay çarpma/bölme için)
   */
  private getSpecialNumbers(min: number, max: number): number[] {
    const specials = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200, 250, 500, 1000];
    return specials.filter(n => n >= min && n <= max);
  }

  /**
   * Bölme için uygun sayı çifti üret
   */
  public generateDivisionPair(difficulty: DifficultySettings): { dividend: number; divisor: number; quotient: number } {
    const quotient = this.generateNumberInRange(1, Math.max(1, difficulty.maxDigits - 1));
    const divisor = this.generateNumberInRange(1, Math.max(1, difficulty.maxDigits - 1), true);
    const dividend = quotient * divisor;
    
    return { dividend, divisor, quotient };
  }

  /**
   * Çarpma için optimize edilmiş sayı çifti
   */
  public generateMultiplicationPair(difficulty: DifficultySettings): { a: number; b: number } {
    const avgDigits = (difficulty.minDigits + difficulty.maxDigits) / 2;
    
    if (avgDigits <= 2) {
      // Basit çarpma tablosu
      return {
        a: Math.floor(Math.random() * 12) + 1,
        b: Math.floor(Math.random() * 12) + 1
      };
    } else if (avgDigits <= 3) {
      // Bir sayı küçük, diğeri orta
      return {
        a: Math.floor(Math.random() * 15) + 1,
        b: this.generateNumberInRange(difficulty.minDigits, Math.min(2, difficulty.maxDigits))
      };
    } else {
      // Her ikisi de büyük sayılar
      return {
        a: this.generateNumberInRange(difficulty.minDigits, Math.min(3, difficulty.maxDigits)),
        b: this.generateNumberInRange(difficulty.minDigits, Math.min(3, difficulty.maxDigits))
      };
    }
  }

  /**
   * Skor çarpanı hesapla
   */
  public getScoreMultiplier(operation: OperationType, level: number, mode: GameMode): number {
    const baseMultiplier = OPERATION_MULTIPLIERS[operation];
    const levelMultiplier = 1 + (level - 1) * 0.05; // Her seviye %5 artış
    const modeMultiplier = GAME_MODES[mode].scoreMultiplier;
    
    return baseMultiplier * levelMultiplier * modeMultiplier;
  }

  /**
   * Hız bonusu hesapla
   */
  public getSpeedBonus(timeToAnswer: number, maxTime: number): number {
    const timeRatio = (maxTime - timeToAnswer) / maxTime;
    
    if (timeRatio > 0.8) return 1.5; // Çok hızlı
    if (timeRatio > 0.6) return 1.2; // Hızlı
    if (timeRatio > 0.4) return 1.0; // Normal
    if (timeRatio > 0.2) return 0.8; // Yavaş
    return 0.6; // Çok yavaş
  }

  /**
   * Zorluk analizi
   */
  public analyzeDifficulty(operand1: number, operand2: number, operation: OperationType): {
    complexity: number;
    estimatedTime: number;
    difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  } {
    const digitComplexity = Math.max(
      operand1.toString().length,
      operand2.toString().length
    );
    
    const operationComplexity = {
      addition: 1,
      subtraction: 2,
      multiplication: 3,
      division: 4
    }[operation];
    
    const complexity = digitComplexity * operationComplexity;
    const estimatedTime = Math.min(25, 2 + complexity * 1.5);
    
    let difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
    if (complexity <= 4) difficultyLevel = 'easy';
    else if (complexity <= 8) difficultyLevel = 'medium';
    else if (complexity <= 16) difficultyLevel = 'hard';
    else difficultyLevel = 'expert';
    
    return { complexity, estimatedTime, difficultyLevel };
  }
}

// Singleton instance export
export const difficultyManager = DifficultyManager.getInstance();