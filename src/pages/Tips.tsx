import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';

const tipCategories = [
  {
    id: 'addition',
    name: 'Toplama',
    symbol: '+',
    color: 'from-green-500 to-emerald-600',
    tips: [
      {
        title: "10'a Tamamlama",
        example: '8 + 6 = ?',
        steps: ["8'i 10'a tamamla: +2", "6'dan 2 ayir: 4 kalir", '10 + 4 = 14'],
        visual: '8 + 6 → (8+2) + 4 → 10 + 4 = 14'
      },
      {
        title: 'Sayilari Parcalama',
        example: '47 + 35 = ?',
        steps: ['40 + 30 = 70', '7 + 5 = 12', '70 + 12 = 82'],
        visual: '47 + 35 → (40+30) + (7+5) = 82'
      },
      {
        title: 'Cift Sayilari Toplama',
        example: '7 + 7 = ?',
        steps: ['Ayni sayilari carpma ile coz', '7 × 2 = 14'],
        visual: '7 + 7 = 7 × 2 = 14'
      }
    ]
  },
  {
    id: 'subtraction',
    name: 'Cikarma',
    symbol: '−',
    color: 'from-blue-500 to-indigo-600',
    tips: [
      {
        title: 'Yuvarla ve Duzelt',
        example: '84 - 29 = ?',
        steps: ["29'u 30'a yuvarla", '84 - 30 = 54', 'Fazla cikardik: 54 + 1 = 55'],
        visual: '84 - 29 → 84 - 30 + 1 = 55'
      },
      {
        title: 'Ekleyerek Fark Bulma',
        example: '63 - 28 = ?',
        steps: ['28 + ? = 63', '28 + 30 = 58, 58 + 5 = 63', 'Fark: 30 + 5 = 35'],
        visual: '63 - 28 → 28 + 35 = 63 → Cevap: 35'
      },
      {
        title: 'Basamak Basamak',
        example: '156 - 78 = ?',
        steps: ['156 - 70 = 86', '86 - 8 = 78'],
        visual: '156 - 78 → 156 - 70 - 8 = 78'
      }
    ]
  },
  {
    id: 'multiplication',
    name: 'Carpma',
    symbol: '×',
    color: 'from-purple-500 to-pink-600',
    tips: [
      {
        title: "9'lar Kurali",
        example: '9 × 7 = ?',
        steps: ['Ellerini ac, 7. parmagi buk', 'Sol: 6 parmak (onluk)', 'Sag: 3 parmak (birlik)', 'Sonuc: 63'],
        visual: '9 × 7 → 6|3 = 63'
      },
      {
        title: '5 ile Carpma',
        example: '24 × 5 = ?',
        steps: ['10 ile carp: 24 × 10 = 240', 'Yariya bol: 240 ÷ 2 = 120'],
        visual: '24 × 5 → 240 ÷ 2 = 120'
      },
      {
        title: "11'ler Kurali",
        example: '23 × 11 = ?',
        steps: ['Ilk rakam: 2', 'Rakamlari topla: 2+3 = 5', 'Son rakam: 3', 'Sonuc: 253'],
        visual: '23 × 11 → 2_(2+3)_3 = 253'
      }
    ]
  },
  {
    id: 'division',
    name: 'Bolme',
    symbol: '÷',
    color: 'from-orange-500 to-red-600',
    tips: [
      {
        title: 'Carpma ile Kontrol',
        example: '84 ÷ 7 = ?',
        steps: ['Tahmin: 12', 'Kontrol: 12 × 7 = 84', 'Dogru!'],
        visual: '84 ÷ 7 = 12 → 12 × 7 = 84'
      },
      {
        title: 'Faktorlere Ayirma',
        example: '144 ÷ 12 = ?',
        steps: ['12 = 4 × 3', '144 ÷ 4 = 36', '36 ÷ 3 = 12'],
        visual: '144 ÷ 12 → 144 ÷ 4 ÷ 3 = 12'
      },
      {
        title: 'Yariya Indirme',
        example: '86 ÷ 2 = ?',
        steps: ['80 ÷ 2 = 40', '6 ÷ 2 = 3', '40 + 3 = 43'],
        visual: '86 ÷ 2 → (80+6) ÷ 2 = 43'
      }
    ]
  }
];

export const Tips: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedTip, setSelectedTip] = useState(0);

  const currentCategory = tipCategories[selectedCategory];
  const currentTip = currentCategory.tips[selectedTip];

  const nextTip = () => {
    if (selectedTip < currentCategory.tips.length - 1) {
      setSelectedTip(selectedTip + 1);
    } else if (selectedCategory < tipCategories.length - 1) {
      setSelectedCategory(selectedCategory + 1);
      setSelectedTip(0);
    }
  };

  const prevTip = () => {
    if (selectedTip > 0) {
      setSelectedTip(selectedTip - 1);
    } else if (selectedCategory > 0) {
      setSelectedCategory(selectedCategory - 1);
      setSelectedTip(tipCategories[selectedCategory - 1].tips.length - 1);
    }
  };

  const isFirst = selectedCategory === 0 && selectedTip === 0;
  const isLast = selectedCategory === tipCategories.length - 1 && selectedTip === currentCategory.tips.length - 1;

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
          <span className="text-sm text-gray-400">Ipuclari</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Category tabs */}
      <div className="flex-shrink-0 px-4 pb-2">
        <div className="flex gap-2 max-w-lg mx-auto">
          {tipCategories.map((cat, index) => (
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
              {/* Title + counter */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-200">{currentTip.title}</h2>
                <span className="text-xs text-gray-500">
                  {selectedTip + 1}/{currentCategory.tips.length}
                </span>
              </div>

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

              {/* Visual */}
              <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="text-xs text-gray-500 mb-1">Formul</div>
                <div className="text-sm font-mono text-primary-400 text-center">
                  {currentTip.visual}
                </div>
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
