import { useState, useEffect, useRef, useCallback } from 'react';

// Güncellenmiş geri sayaç hook'u - bonus süre desteği ile
export const useTimer = (initialTime: number, onTimeUp?: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // onTimeUp referansını güncel tut
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Zamanlayıcıyı başlat
  const startTimer = useCallback(() => {
    console.log('⏰ Timer başlatılıyor:', { initialTime, timeRemaining });
    setIsActive(true);
    setIsPaused(false);
  }, [initialTime, timeRemaining]);

  // Zamanlayıcıyı duraklat
  const pauseTimer = useCallback(() => {
    console.log('⏸️ Timer duraklatılıyor');
    setIsPaused(true);
  }, []);

  // Zamanlayıcıyı devam ettir
  const resumeTimer = useCallback(() => {
    console.log('▶️ Timer devam ettiriliyor');
    setIsPaused(false);
  }, []);

  // Zamanlayıcıyı durdur
  const stopTimer = useCallback(() => {
    console.log('⏹️ Timer durduruluyor');
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Zamanlayıcıyı sıfırla
  const resetTimer = useCallback((newTime?: number) => {
    const resetTime = newTime || initialTime;
    console.log('🔄 Timer sıfırlanıyor:', { newTime: resetTime });
    setTimeRemaining(resetTime);
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);

  // Süre ekleme fonksiyonu (bonus süreler için) - DÜZELTME
  const addTime = useCallback((seconds: number) => {
    console.log('➕ Bonus süre ekleniyor:', seconds);
    setTimeRemaining(prev => {
      const newTime = Math.max(0, prev + seconds);
      console.log('⏰ Yeni süre:', { prev, seconds, newTime });
      return newTime;
    });
  }, []);

  // Süre ayarlama (doğrudan)
  const setTime = useCallback((seconds: number) => {
    console.log('🎯 Süre ayarlanıyor:', seconds);
    setTimeRemaining(Math.max(0, seconds));
  }, []);

  // Ana zamanlayıcı mantığı
  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          if (newTime <= 0) {
            // Süre doldu
            setIsActive(false);
            if (onTimeUpRef.current) {
              console.log('⏰ Süre doldu, onTimeUp çağrılıyor');
              onTimeUpRef.current();
            }
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  // Component unmount'ta temizlik
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Yüzde hesaplama (progress bar için)
  const getTimePercentage = useCallback(() => {
    return Math.max(0, Math.min(100, (timeRemaining / initialTime) * 100));
  }, [timeRemaining, initialTime]);

  // Kritik süre kontrolü (son 5 saniye)
  const isCriticalTime = timeRemaining <= 5 && timeRemaining > 0;

  // Uyarı süre kontrolü (son 10 saniye)
  const isWarningTime = timeRemaining <= 10 && timeRemaining > 5;

  // Formatted time string (MM:SS formatında)
  const getFormattedTime = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  // Süre durumu
  const getTimeStatus = useCallback(() => {
    if (timeRemaining <= 0) return 'expired';
    if (timeRemaining <= 5) return 'critical';
    if (timeRemaining <= 10) return 'warning';
    return 'normal';
  }, [timeRemaining]);

  // Kalan süre kategorisi
  const getTimeCategory = useCallback(() => {
    const percentage = getTimePercentage();
    if (percentage > 75) return 'excellent';
    if (percentage > 50) return 'good';
    if (percentage > 25) return 'warning';
    return 'critical';
  }, [getTimePercentage]);

  // Bonus süre kontrolü
  const canEarnBonus = useCallback((threshold: number) => {
    return timeRemaining >= threshold;
  }, [timeRemaining]);

  return {
    // Temel timer değerleri
    timeRemaining,
    isActive,
    isPaused,
    isCriticalTime,
    isWarningTime,
    
    // Timer kontrol fonksiyonları
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    addTime,
    setTime,
    
    // Yardımcı fonksiyonlar
    getTimePercentage,
    getFormattedTime,
    getTimeStatus,
    getTimeCategory,
    canEarnBonus
  };
};

// Soru zamanlayıcısı hook'u - her soru için ayrı süre (optimize edilmiş)
export const useQuestionTimer = (timePerQuestion: number, onQuestionTimeUp?: () => void) => {
  const [questionTime, setQuestionTime] = useState(timePerQuestion);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [bonusTimeEarned, setBonusTimeEarned] = useState(0);
  const questionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onQuestionTimeUpRef = useRef(onQuestionTimeUp);

  // Callback referansını güncel tut
  useEffect(() => {
    onQuestionTimeUpRef.current = onQuestionTimeUp;
  }, [onQuestionTimeUp]);

  // Soru zamanlayıcısını başlat
  const startQuestionTimer = useCallback(() => {
    console.log('⏰ Soru timer başlatılıyor:', timePerQuestion);
    setQuestionTime(timePerQuestion);
    setIsQuestionActive(true);
    setBonusTimeEarned(0);
  }, [timePerQuestion]);

  // Soru zamanlayıcısını durdur
  const stopQuestionTimer = useCallback(() => {
    console.log('⏹️ Soru timer durduruluyor');
    setIsQuestionActive(false);
    if (questionIntervalRef.current) {
      clearInterval(questionIntervalRef.current);
      questionIntervalRef.current = null;
    }
  }, []);

  // Bonus süre ekle
  const addQuestionTime = useCallback((seconds: number) => {
    console.log("➕ Soru timer'a bonus süre ekleniyor:", seconds);
    setQuestionTime(prev => Math.max(0, prev + seconds));
    setBonusTimeEarned(prev => prev + seconds);
  }, []);

  // Soru zamanlayıcısı mantığı
  useEffect(() => {
    if (isQuestionActive && questionTime > 0) {
      questionIntervalRef.current = setInterval(() => {
        setQuestionTime(prev => {
          const newTime = prev - 1;
          
          if (newTime <= 0) {
            setIsQuestionActive(false);
            if (onQuestionTimeUpRef.current) {
              console.log('⏰ Soru süresi doldu, callback çağrılıyor');
              onQuestionTimeUpRef.current();
            }
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (questionIntervalRef.current) {
        clearInterval(questionIntervalRef.current);
        questionIntervalRef.current = null;
      }
    }

    return () => {
      if (questionIntervalRef.current) {
        clearInterval(questionIntervalRef.current);
        questionIntervalRef.current = null;
      }
    };
  }, [isQuestionActive, questionTime]);

  // Component unmount'ta temizlik
  useEffect(() => {
    return () => {
      if (questionIntervalRef.current) {
        clearInterval(questionIntervalRef.current);
        questionIntervalRef.current = null;
      }
    };
  }, []);

  // Soru süresinin yüzdesi
  const getQuestionTimePercentage = useCallback(() => {
    return Math.max(0, Math.min(100, (questionTime / timePerQuestion) * 100));
  }, [questionTime, timePerQuestion]);

  // Soru için hız analizi
  const getSpeedAnalysis = useCallback(() => {
    const timeUsed = timePerQuestion - questionTime;
    const percentage = (timeUsed / timePerQuestion) * 100;
    
    if (percentage < 20) return 'lightning'; // Çok hızlı
    if (percentage < 40) return 'fast';     // Hızlı
    if (percentage < 60) return 'normal';   // Normal
    if (percentage < 80) return 'slow';     // Yavaş
    return 'very-slow';                     // Çok yavaş
  }, [questionTime, timePerQuestion]);

  return {
    questionTime,
    isQuestionActive,
    bonusTimeEarned,
    startQuestionTimer,
    stopQuestionTimer,
    addQuestionTime,
    getQuestionTimePercentage,
    getSpeedAnalysis
  };
};