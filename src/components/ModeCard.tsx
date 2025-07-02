import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Clock, Zap, Target, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { GameModeConfig } from '../types';
import { getLevelName } from '../utils/questionBank';
import { GAME_MODES } from '../config/gameConfig';

interface ModeCardProps {
  mode: GameModeConfig;
  currentLevel: number;
  highestLevel: number;
  totalScore: number;
  highestQuestionCount: number;
  onSelect: () => void;
  disabled?: boolean;
}

// Güncellenmiş oyun modu kartı bileşeni - yeni istatistiklerle
export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  currentLevel,
  highestLevel,
  totalScore,
  highestQuestionCount,
  onSelect,
  disabled = false
}) => {
  // Seviye progress hesaplama (her 5 seviye bir aşama)
  const getProgressInfo = () => {
    const stage = Math.floor((currentLevel - 1) / 5) + 1;
    const progressInStage = ((currentLevel - 1) % 5) + 1;
    return { stage, progressInStage, percentage: (progressInStage / 5) * 100 };
  };

  const progressInfo = getProgressInfo();

  // Mod config'den veri al
  const modeConfig = GAME_MODES[mode.id];

  // Mod özelliklerini döndür
  const getModeFeatures = () => {
    const features = [];
    
    features.push({
      icon: <Zap size={16} />,
      text: 'Sonsuz',
      color: 'text-purple-600'
    });
    
    features.push({
      icon: <Clock size={16} />,
      text: `${modeConfig.timePerQuestion}sn`,
      color: 'text-green-600'
    });

    features.push({
      icon: <Target size={16} />,
      text: `<${modeConfig.bonusThreshold}sn → +5sn`,
      color: 'text-blue-600'
    });

    return features;
  };

  // İstatistik kartları
  const getStatCards = () => {
    const stats = [];

    // En yüksek seviye
    if (highestLevel > 1) {
      stats.push({
        icon: <TrendingUp size={16} />,
        label: 'En Yüksek Seviye',
        value: `${highestLevel}`,
        subtitle: getLevelName(highestLevel),
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20'
      });
    }

    // En yüksek puan
    if (totalScore > 0) {
      stats.push({
        icon: <Trophy size={16} />,
        label: 'En Yüksek Puan',
        value: totalScore.toLocaleString(),
        subtitle: 'puan',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
      });
    }

    // En fazla soru
    if (highestQuestionCount > 0) {
      stats.push({
        icon: <BarChart3 size={16} />,
        label: 'En Fazla Soru',
        value: `${highestQuestionCount}`,
        subtitle: 'soru',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20'
      });
    }

    return stats;
  };

  const statCards = getStatCards();

  // İşlem türlerini göster
  const getOperationNames = () => {
    const names = {
      addition: 'Toplama',
      subtraction: 'Çıkarma',
      multiplication: 'Çarpma',
      division: 'Bölme'
    };
    
    return modeConfig.operations.map(op => names[op]).join(' • ');
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={!disabled ? onSelect : undefined}
      className={`
        relative overflow-hidden rounded-3xl shadow-xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        group transition-all duration-300 hover:shadow-2xl
      `}
    >
      {/* Gradient arka plan */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${modeConfig.gradientFrom} ${modeConfig.gradientTo}
        transition-all duration-300 group-hover:scale-110
      `} />
      
      {/* İçerik katmanı */}
      <div className="relative z-10 p-6 text-white">
        {/* Başlık bölümü */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{modeConfig.emoji}</span>
              <h3 className="text-2xl font-bold">{modeConfig.name}</h3>
            </div>
            
            {/* Mevcut seviye bilgisi */}
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">
                Seviye {currentLevel} • {getLevelName(currentLevel)}
              </span>
            </div>
          </div>
          
          {/* Rekort rozeti */}
          {(highestLevel > currentLevel || totalScore > 0) && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"
            >
              <Award size={16} />
              <span className="text-sm font-bold">Rekor</span>
            </motion.div>
          )}
        </div>

        {/* Seviye progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span>Aşama {progressInfo.stage} İlerlemesi</span>
            <span>{progressInfo.progressInStage}/5</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20">
            <motion.div
              className="h-2 bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressInfo.percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Açıklama */}
        <p className="mb-4 text-sm leading-relaxed opacity-90">
          {modeConfig.description}
        </p>

        {/* İstatistik kartları */}
        {statCards.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="p-2 text-center rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center mb-1">
                  <span className="text-white">{stat.icon}</span>
                </div>
                <div className="text-xs font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white opacity-75">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* İşlem türleri */}
        <div className="mb-4">
          <div className="mb-1 text-xs opacity-75">İşlemler:</div>
          <div className="text-sm font-medium">
            {getOperationNames()}
          </div>
        </div>

        {/* Özellikler */}
        <div className="flex items-center gap-4 mb-6">
          {getModeFeatures().map((feature, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="text-white">{feature.icon}</span>
              <span className="text-xs">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Başla butonu */}
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          disabled={disabled}
          className={`
            w-full py-4 px-6 rounded-xl font-bold text-lg
            bg-white/20 backdrop-blur-sm border border-white/30
            hover:bg-white/30 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-3
          `}
        >
          <Play size={20} />
          <span>Oyuna Başla</span>
        </motion.button>

        {/* Alt bilgi - Zorluk çarpanı */}
        {modeConfig.difficultyMultiplier !== 1.0 && (
          <div className="mt-2 text-center">
            <span className="text-xs opacity-75">
              Zorluk: {modeConfig.difficultyMultiplier}x • Puan: {modeConfig.scoreMultiplier}x
            </span>
          </div>
        )}
      </div>

      {/* Hover efekti */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-white/10 group-hover:opacity-100"
          initial={false}
        />
      )}

      {/* Dekoratif elementler */}
      <div className="absolute w-20 h-20 rounded-full -top-10 -right-10 bg-white/10 blur-xl" />
      <div className="absolute rounded-full -bottom-5 -left-5 w-15 h-15 bg-white/5 blur-lg" />
      
      {/* Başarı parçacıkları - eğer rekor varsa */}
      {(highestLevel > currentLevel || totalScore > 0) && (
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-2 h-2 bg-yellow-400 rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
};

// Kompakt mod kartı - liste görünümü için (güncellenmiş)
export const CompactModeCard: React.FC<ModeCardProps> = ({
  mode,
  currentLevel,
  highestLevel,
  totalScore,
  highestQuestionCount,
  onSelect,
  disabled = false
}) => {
  const modeConfig = GAME_MODES[mode.id];

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onSelect : undefined}
      className={`
        flex items-center justify-between p-4 rounded-xl
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        shadow-md hover:shadow-lg transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Sol taraf - mod bilgileri */}
      <div className="flex items-center gap-4">
        <div className={`
          w-12 h-12 rounded-lg bg-gradient-to-br ${modeConfig.gradientFrom} ${modeConfig.gradientTo}
          flex items-center justify-center text-white font-bold text-xl
        `}>
          {modeConfig.emoji}
        </div>
        
        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-200">{modeConfig.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Seviye {currentLevel} • En yüksek: {highestLevel}
          </p>
        </div>
      </div>

      {/* Sağ taraf - istatistikler ve başla butonu */}
      <div className="flex items-center gap-4">
        {/* İstatistikler */}
        <div className="text-right">
          {totalScore > 0 && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Trophy size={14} />
              <span className="text-sm font-bold">{totalScore.toLocaleString()}</span>
            </div>
          )}
          {highestQuestionCount > 0 && (
            <div className="flex items-center gap-1 text-green-600">
              <BarChart3 size={14} />
              <span className="text-xs">{highestQuestionCount} soru</span>
            </div>
          )}
        </div>
        
        {/* Başla butonu */}
        <motion.button
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          disabled={disabled}
          className={`
            w-10 h-10 rounded-full bg-primary-500 text-white
            flex items-center justify-center
            hover:bg-primary-600 transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Play size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};