import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Zap,
  Calculator,
  CheckCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { OperationType } from '../types';
import { generateQuestion, getOperationSymbol, getOperationName } from '../utils/questionBank';
import { NumericPad } from '../components/NumericPad';
import { useGame } from '../context/GameContext';
import { GAME_MODES } from '../config/gameConfig';

// Isınma turu bileşeni - oyun öncesi hazırlık
export const WarmUp: React.FC = () => {
  const navigate = useNavigate();
  const { modeId } = useParams<{ modeId: string }>();
  const { markWarmupSeen, getCurrentLevel } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [exampleQuestion, setExampleQuestion] = useState<ReturnType<typeof generateQuestion> | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const mode = modeId ? GAME_MODES[modeId] : null;

  // Örnek soru üret
  useEffect(() => {
    if (mode && currentStep === 2) {
      const currentLevel = getCurrentLevel(mode.id);
      const question = generateQuestion(mode.id, currentLevel, 1);
      setExampleQuestion(question);
      setUserAnswer('');
      setShowFeedback(false);
    }
  }, [currentStep, mode, getCurrentLevel]);

  // Geçersiz mod kontrolü
  if (!mode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Geçersiz Mod!</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 font-medium text-white bg-primary-500 rounded-xl"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Cevap kontrolü
  const handleAnswerCheck = () => {
    if (!exampleQuestion || !userAnswer) return;
    
    const userAnswerNum = parseInt(userAnswer);
    const correct = userAnswerNum === exampleQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    setTimeout(() => {
      setCurrentStep(3);
    }, 2500);
  };

  // Adımlar konfigürasyonu
  const steps = [
    {
      title: 'Hoş Geldin! 👋',
      content: (
        <div className="space-y-6 text-center">
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo} flex items-center justify-center text-4xl shadow-lg`}>
            {mode.emoji}
          </div>
          <div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
              {mode.name}
            </h2>
            <p className="max-w-md mx-auto text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {mode.description}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Sonsuz Mod Kuralları 📋',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Sol taraf - Temel bilgiler */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-purple-500 rounded-full">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    Sonsuz Seviye Sistemi
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Her 5 doğru cevap = 1 seviye atlama. Yüksek seviyede daha zor sorular!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-orange-500 rounded-full">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    Her Soru İçin {mode.timePerQuestion} Saniye
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Süre dolmadan cevabını ver. Hızlı ol ama doğruluğu unutma!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-red-500 rounded-full">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    Yanlış Cevap = Başa Dön
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tek yanlış cevap seni seviye 1'e geri götürür!
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ taraf - İşlemler */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-green-500 rounded-full">
                  <Calculator size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">İşlem Türleri</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mode.operations.map((op: OperationType) => (
                      <span
                        key={op}
                        className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      >
                        {getOperationName(op)} ({getOperationSymbol(op)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-blue-500 rounded-full">
                  <Zap size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Bonus Süre</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode.bonusThreshold} saniye altında doğru cevap verirsen +5 saniye bonus kazanırsın!
                  </p>
                </div>
              </div>

              <div className="p-4 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl dark:border-yellow-800">
                <h5 className="mb-2 font-bold text-yellow-800 dark:text-yellow-400">
                  💡 Seviye Sistemi
                </h5>
                <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <li>• Seviye 1-5: Başlangıç</li>
                  <li>• Seviye 6-10: Gelişen</li>
                  <li>• Seviye 11-15: İleri</li>
                  <li>• Seviye 16+: Uzman</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Örnek Soru 💡',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
              Şimdi bir örnek soru çözelim!
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Aşağıdaki soruyu çöz ve dokunmatik klavyeyi dene
            </p>
          </div>

          {exampleQuestion && (
            <div className="max-w-md mx-auto">
              {/* Soru kartı */}
              <div className={`
                relative overflow-hidden rounded-2xl shadow-lg mb-6
                bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo}
                p-8 text-white text-center
              `}>
                <div className="mb-4 text-4xl font-bold">
                  {exampleQuestion.operand1} {getOperationSymbol(exampleQuestion.operation)} {exampleQuestion.operand2} = ?
                </div>
                
                {/* Feedback overlay */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                      {isCorrect ? (
                        <div className="text-center">
                          <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                          <div className="text-2xl font-bold">Doğru! Harika iş! 🎉</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="mb-4 text-4xl">❌</div>
                          <div className="mb-2 text-xl font-bold">
                            Doğru cevap: {exampleQuestion.correctAnswer}
                          </div>
                          <p className="text-sm">Sorun yok, asıl oyunda daha dikkatli ol! 💪</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sayısal klavye */}
              {!showFeedback && (
                <NumericPad
                  value={userAnswer}
                  onChange={setUserAnswer}
                  onSubmit={handleAnswerCheck}
                  disabled={showFeedback}
                  maxLength={6}
                />
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Hazır mısın? 🚀',
      content: (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center w-24 h-24 mx-auto text-4xl rounded-full shadow-lg bg-gradient-to-br from-yellow-400 to-orange-500 animate-bounce-slow">
            🎯
          </div>
          <div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
              Mükemmel! Artık Hazırsın
            </h2>
            <p className="max-w-md mx-auto mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {mode.name} modunda sonsuz matematik macerasına başla! Mevcut seviyenden devam edeceksin.
            </p>
            
            <div className="p-6 border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl dark:border-green-800">
              <h4 className="mb-2 font-bold text-gray-800 dark:text-gray-200">
                Unutma! 💡
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Her 5 doğru cevap = 1 seviye atlama</li>
                <li>• Yanlış cevap = Seviye 1'e dönüş</li>
                <li>• Hızlı ol, bonus süre kazan!</li>
                <li>• Eğlenmeyi unutma! 😊</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Sonraki adım
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Önceki adım
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Oyunu başlat
  const startGame = () => {
    // Isınma görüldü olarak işaretle
    markWarmupSeen(mode.id);
    navigate(`/play/${mode.id}`);
  };

  return (
    <div className="min-h-screen transition-all duration-500 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 transition-all duration-200 bg-white border border-gray-200 shadow-md rounded-xl dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Ana Sayfa</span>
          </motion.button>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? `bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo}` 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="p-8 bg-white border border-gray-200 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-700 md:p-12"
            >
              {/* Step title */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-200">
                  {steps[currentStep].title}
                </h1>
              </div>

              {/* Step content */}
              <div className="mb-12">
                {steps[currentStep].content}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-6 py-3 font-medium text-gray-600 transition-all duration-200 border-2 border-gray-300 rounded-xl dark:border-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 dark:hover:border-gray-500"
                >
                  Önceki
                </motion.button>

                {currentStep < steps.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    disabled={currentStep === 2 && !showFeedback}
                    className={`px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span>Devam</span>
                    <ArrowLeft size={18} className="rotate-180" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className={`px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} hover:shadow-lg transition-all duration-200 flex items-center gap-3`}
                  >
                    <Play size={24} />
                    <span>Oyunu Başlat!</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default WarmUp;