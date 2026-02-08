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

  useEffect(() => {
    if (mode && currentStep === 2) {
      const currentLevel = getCurrentLevel(mode.id);
      const question = generateQuestion(mode.id, currentLevel, 1);
      setExampleQuestion(question);
      setUserAnswer('');
      setShowFeedback(false);
    }
  }, [currentStep, mode, getCurrentLevel]);

  if (!mode) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-gray-900">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Gecersiz Mod!</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 font-medium text-white bg-primary-500 rounded-xl">
            Ana Sayfaya Don
          </button>
        </div>
      </div>
    );
  }

  const handleAnswerCheck = () => {
    if (!exampleQuestion || !userAnswer) return;
    const correct = parseInt(userAnswer) === exampleQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTimeout(() => setCurrentStep(3), 2000);
  };

  const steps = [
    {
      title: 'Hos Geldin!',
      content: (
        <div className="space-y-4 text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo} flex items-center justify-center text-3xl`}>
            {mode.emoji}
          </div>
          <h2 className="text-xl font-bold text-gray-200">{mode.name}</h2>
          <p className="text-sm text-gray-400">{mode.description}</p>
        </div>
      )
    },
    {
      title: 'Kurallar',
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-xl">
            <TrendingUp size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Sonsuz Seviye</h4>
              <p className="text-xs text-gray-400">Her 5 dogru cevap = 1 seviye atlama</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-xl">
            <Clock size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">{mode.timePerQuestion}s / Soru</h4>
              <p className="text-xs text-gray-400">Sure dolmadan cevabini ver</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-xl">
            <Zap size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Bonus Sure</h4>
              <p className="text-xs text-gray-400">{mode.bonusThreshold}s altinda dogru cevap = +5s bonus</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-xl">
            <Calculator size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Islemler</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {mode.operations.map((op: OperationType) => (
                  <span key={op} className="px-2 py-0.5 text-xs bg-primary-900 text-primary-300 rounded-full">
                    {getOperationName(op)} ({getOperationSymbol(op)})
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-900/30 border border-red-800/50 rounded-xl">
            <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-red-400">Yanlis Cevap</h4>
              <p className="text-xs text-red-300/70">Seviyen 1 duser ama oyun devam eder!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Ornek Soru',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-center text-gray-400">Soruyu coz ve klavyeyi dene</p>
          {exampleQuestion && (
            <div className="max-w-xs mx-auto">
              <div className={`relative overflow-hidden rounded-2xl shadow-lg mb-4 bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo} p-5 text-white text-center`}>
                <div className="text-2xl font-bold">
                  {exampleQuestion.operand1} {getOperationSymbol(exampleQuestion.operation)} {exampleQuestion.operand2} = ?
                </div>
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      {isCorrect ? (
                        <div className="text-center">
                          <CheckCircle size={36} className="mx-auto mb-2 text-green-400" />
                          <div className="text-lg font-bold">Dogru!</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="mb-2 text-2xl">X</div>
                          <div className="text-sm">Dogru cevap: {exampleQuestion.correctAnswer}</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!showFeedback && (
                <NumericPad value={userAnswer} onChange={setUserAnswer}
                  onSubmit={handleAnswerCheck} disabled={showFeedback} maxLength={6} />
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Hazir misin?',
      content: (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto text-3xl rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500">
            🎯
          </div>
          <h2 className="text-xl font-bold text-gray-200">Harika! Hazirsın</h2>
          <p className="text-sm text-gray-400">{mode.name} modunda macerana basla!</p>
          <div className="p-3 bg-gray-700/50 rounded-xl text-xs text-gray-400 space-y-1">
            <p>5 dogru = 1 seviye yukarı</p>
            <p>1 yanlis = 1 seviye asagi</p>
            <p>Hizli ol, bonus sure kazan!</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const startGame = () => { markWarmupSeen(mode.id); navigate(`/play/${mode.id}`); };

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
            <ArrowLeft size={16} /> Geri
          </motion.button>
          <div className="flex items-center gap-1.5">
            {steps.map((_, index) => (
              <div key={index} className={`w-2.5 h-2.5 rounded-full transition-all ${
                index <= currentStep
                  ? `bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo}`
                  : 'bg-gray-700'
              }`} />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 min-h-0 overflow-y-auto">
        <div className="max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
              className="p-5 bg-gray-800 border border-gray-700 rounded-2xl">
              <div className="mb-4 text-center">
                <h1 className="text-lg font-bold text-gray-200">{steps[currentStep].title}</h1>
              </div>
              <div className="mb-5">{steps[currentStep].content}</div>
              <div className="flex items-center justify-between">
                <motion.button whileTap={{ scale: 0.95 }} onClick={prevStep} disabled={currentStep === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-400 border border-gray-600 rounded-xl disabled:opacity-30">
                  Onceki
                </motion.button>
                {currentStep < steps.length - 1 ? (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={nextStep}
                    disabled={currentStep === 2 && !showFeedback}
                    className={`px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} disabled:opacity-30`}>
                    Devam
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={startGame}
                    className={`px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} flex items-center gap-2`}>
                    <Play size={18} /> Basla!
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WarmUp;
