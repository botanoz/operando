import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { TIP_CATEGORIES } from '../data/mathTips';

export const Tips: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedTip, setSelectedTip] = useState(0);

  const currentCategory = TIP_CATEGORIES[selectedCategory];
  const currentTip = currentCategory.tips[selectedTip];

  const nextTip = () => {
    if (selectedTip < currentCategory.tips.length - 1) {
      setSelectedTip(selectedTip + 1);
    } else if (selectedCategory < TIP_CATEGORIES.length - 1) {
      setSelectedCategory(selectedCategory + 1);
      setSelectedTip(0);
    }
  };

  const prevTip = () => {
    if (selectedTip > 0) {
      setSelectedTip(selectedTip - 1);
    } else if (selectedCategory > 0) {
      setSelectedCategory(selectedCategory - 1);
      setSelectedTip(TIP_CATEGORIES[selectedCategory - 1].tips.length - 1);
    }
  };

  const isFirst = selectedCategory === 0 && selectedTip === 0;
  const isLast = selectedCategory === TIP_CATEGORIES.length - 1 && selectedTip === currentCategory.tips.length - 1;

  const difficultyColor = {
    easy: 'text-green-400 bg-green-900/30',
    medium: 'text-yellow-400 bg-yellow-900/30',
    hard: 'text-red-400 bg-red-900/30'
  };
  const difficultyLabel = { easy: 'Kolay', medium: 'Orta', hard: 'Zor' };

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300"
          >
            <ArrowLeft size={16} />
            Geri
          </motion.button>
          <span className="text-sm font-medium text-gray-300">Ipuclari</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Category tabs */}
      <div className="flex-shrink-0 px-4 pb-2">
        <div className="flex gap-2 max-w-lg mx-auto">
          {TIP_CATEGORIES.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(index); setSelectedTip(0); }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                index === selectedCategory
                  ? `bg-gradient-to-r ${cat.color} text-white`
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              <div className="text-lg leading-none mb-0.5">{cat.symbol}</div>
              <div className="text-xs">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tip content */}
      <div className="flex-1 flex flex-col px-4 py-2 min-h-0 overflow-y-auto">
        <div className="max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${selectedTip}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Title + counter + difficulty */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-200">{currentTip.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${difficultyColor[currentTip.difficulty]}`}>
                    {difficultyLabel[currentTip.difficulty]}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {selectedTip + 1}/{currentCategory.tips.length}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400">{currentTip.description}</p>

              {/* Example */}
              <div className={`p-4 rounded-xl bg-gradient-to-br ${currentCategory.color} text-white`}>
                <div className="text-xs opacity-80 mb-1">Ornek</div>
                <div className="text-2xl font-bold text-center">{currentTip.example}</div>
              </div>

              {/* Steps */}
              <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl">
                <div className="text-xs text-gray-500 mb-2">Cozum Adimlari</div>
                <div className="space-y-2">
                  {currentTip.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual formula */}
              <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="text-xs text-gray-500 mb-1">Formul</div>
                <div className="text-sm font-mono text-primary-400 text-center">
                  {currentTip.visual}
                </div>
              </div>

              {/* Level range info */}
              <div className="text-center text-[10px] text-gray-600">
                Seviye {currentTip.levelRange[0]} - {currentTip.levelRange[1]} arasi icin uygun
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={prevTip}
            disabled={isFirst}
            className="flex items-center gap-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
            Onceki
          </motion.button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {currentCategory.tips.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedTip(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === selectedTip ? 'bg-white w-4' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={nextTip}
            disabled={isLast}
            className="flex items-center gap-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 disabled:opacity-30"
          >
            Sonraki
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Tips;
