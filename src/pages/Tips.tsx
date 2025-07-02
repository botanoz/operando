import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calculator, 
  Plus, 
  Minus, 
  X, 
  Divide,
  Lightbulb,
  BookOpen,
  Target,
  Zap,
  ChevronRight,
  ChevronLeft,
  Eye,
  Brain,
  CheckCircle,
  Hand,
  Repeat,
  XCircle
} from 'lucide-react';

// Geliştirilmiş ipucu kategorileri
const tipCategories = [
  {
    id: 'addition',
    name: 'Toplama Hileleri',
    icon: <Plus size={24} />,
    color: 'from-green-400 to-emerald-600',
    description: 'Hızlı toplama teknikleri ve zihinsel kısa yollar',
    tips: [
      {
        title: '10\'a Tamamlama Tekniği',
        difficulty: 'Kolay',
        description: 'Sayıları 10\'a tamamlayarak zihinsel hesaplamayı hızlandır',
        example: '8 + 6 = ?',
        steps: [
          '8\'i 10\'a tamamlamak için 2 lazım',
          '6\'dan 2\'yi ayır: 6 = 2 + 4',
          '8 + 2 = 10',
          '10 + 4 = 14'
        ],
        visual: '8 + 6 → 8 + (2+4) → (8+2) + 4 → 10 + 4 = 14',
        practice: [
          { question: '7 + 5', answer: 12 },
          { question: '9 + 4', answer: 13 },
          { question: '6 + 8', answer: 14 }
        ],
        tip: '💡 Bu teknik özellikle 10\'a yakın sayılarla çok etkili!'
      },
      {
        title: 'Çift Sayıları Hızlı Toplama',
        difficulty: 'Kolay',
        description: 'Aynı sayıları toplarken çarpma kullan',
        example: '7 + 7 = ?',
        steps: [
          '7 + 7 = 7 × 2',
          '7 × 2 = 14'
        ],
        visual: '7 + 7 = 7 × 2 = 14',
        practice: [
          { question: '8 + 8', answer: 16 },
          { question: '9 + 9', answer: 18 },
          { question: '6 + 6', answer: 12 }
        ],
        tip: '🎯 Çift sayıları gördüğünde hemen çarpma düşün!'
      },
      {
        title: 'Büyük Sayıları Parçalama',
        difficulty: 'Orta',
        description: 'Büyük sayıları onluk ve birlik olarak ayırarak topla',
        example: '47 + 35 = ?',
        steps: [
          '47 = 40 + 7',
          '35 = 30 + 5',
          'Onlukları topla: 40 + 30 = 70',
          'Birlikleri topla: 7 + 5 = 12',
          'Sonuçları topla: 70 + 12 = 82'
        ],
        visual: '47 + 35 → (40+7) + (30+5) → (40+30) + (7+5) → 70 + 12 = 82',
        practice: [
          { question: '23 + 45', answer: 68 },
          { question: '56 + 28', answer: 84 },
          { question: '34 + 39', answer: 73 }
        ],
        tip: '🧠 Büyük sayıları küçük parçalara böl, sonra birleştir!'
      },
      {
        title: '9\'a Tamamlama Sihri',
        difficulty: 'Orta',
        description: 'Bir sayıyı 9\'a tamamlayarak toplama işlemini kolaylaştır',
        example: '7 + 8 = ?',
        steps: [
          '8\'i 9\'a tamamlamak için 1 lazım',
          '7\'den 1 çıkar: 7 - 1 = 6',
          '8 + 1 = 9',
          '6 + 9 = 15'
        ],
        visual: '7 + 8 → (7-1) + (8+1) → 6 + 9 = 15',
        practice: [
          { question: '6 + 7', answer: 13 },
          { question: '5 + 8', answer: 13 },
          { question: '4 + 9', answer: 13 }
        ],
        tip: '✨ 9 sayısı toplama işlemlerinde sihirli bir sayıdır!'
      }
    ]
  },
  {
    id: 'subtraction',
    name: 'Çıkarma Taktikleri',
    icon: <Minus size={24} />,
    color: 'from-blue-400 to-indigo-600',
    description: 'Çıkarma işlemlerini kolaylaştıran akıllı yöntemler',
    tips: [
      {
        title: 'Ekleyerek Fark Bulma',
        difficulty: 'Kolay',
        description: 'Çıkarma yerine "ne eklemeliyim?" sorusunu sor',
        example: '63 - 28 = ?',
        steps: [
          '28 + ? = 63 sorusunu çöz',
          '28 + 30 = 58 (30 ekledik)',
          '58 + 5 = 63 (5 daha ekledik)',
          'Toplam: 30 + 5 = 35'
        ],
        visual: '63 - 28 → 28 + ? = 63 → 28 + 35 = 63',
        practice: [
          { question: '45 - 17', answer: 28 },
          { question: '72 - 35', answer: 37 },
          { question: '84 - 29', answer: 55 }
        ],
        tip: '🔄 Çıkarma işlemini toplama işlemine çevir!'
      },
      {
        title: 'Yuvarla ve Düzelt',
        difficulty: 'Kolay',
        description: 'Çıkarılacak sayıyı yuvarla, sonra düzelt',
        example: '84 - 29 = ?',
        steps: [
          '29\'u 30\'a yuvarla',
          '84 - 30 = 54',
          '1 fazla çıkardık, geri ekle',
          '54 + 1 = 55'
        ],
        visual: '84 - 29 → 84 - 30 + 1 → 54 + 1 = 55',
        practice: [
          { question: '67 - 19', answer: 48 },
          { question: '93 - 28', answer: 65 },
          { question: '75 - 39', answer: 36 }
        ],
        tip: '🎯 Yuvarlak sayılarla çalışmak her zaman daha kolay!'
      },
      {
        title: 'Basamak Basamak Çıkarma',
        difficulty: 'Orta',
        description: 'Büyük sayılarda basamakları ayrı ayrı çıkar',
        example: '156 - 78 = ?',
        steps: [
          'Önce onlukları çıkar: 156 - 70 = 86',
          'Sonra birlikleri çıkar: 86 - 8 = 78'
        ],
        visual: '156 - 78 → 156 - 70 - 8 → 86 - 8 = 78',
        practice: [
          { question: '134 - 56', answer: 78 },
          { question: '187 - 69', answer: 118 },
          { question: '245 - 87', answer: 158 }
        ],
        tip: '📊 Büyük sayıları küçük parçalara böl!'
      },
      {
        title: '100\'den Çıkarma Hilesi',
        difficulty: 'Orta',
        description: '100\'den çıkarma işlemlerinde pratik yöntem',
        example: '100 - 37 = ?',
        steps: [
          'Onluk basamağı: 10 - 3 = 7, ama 1 eksik → 6',
          'Birlik basamağı: 10 - 7 = 3',
          'Sonuç: 63'
        ],
        visual: '100 - 37 → (10-3-1)(10-7) → 6|3 = 63',
        practice: [
          { question: '100 - 24', answer: 76 },
          { question: '100 - 58', answer: 42 },
          { question: '100 - 43', answer: 57 }
        ],
        tip: '💯 100\'den çıkarma için özel kural var!'
      }
    ]
  },
  {
    id: 'multiplication',
    name: 'Çarpma Sırları',
    icon: <X size={24} />,
    color: 'from-purple-400 to-pink-600',
    description: 'Çarpma işlemlerini hızlandıran gizli teknikler',
    tips: [
      {
        title: '9\'lar Kuralı - Parmak Tekniği',
        difficulty: 'Kolay',
        description: '9 ile çarpımda parmak tekniği kullan',
        example: '9 × 7 = ?',
        steps: [
          'Ellerini aç, 10 parmağını gör',
          '7. parmağını büküp gizle',
          'Solda kalan parmaklar: 6 (onluk)',
          'Sağda kalan parmaklar: 3 (birlik)',
          'Sonuç: 63'
        ],
        visual: '9 × 7 → Parmak: 6|3 → 63',
        practice: [
          { question: '9 × 4', answer: 36 },
          { question: '9 × 6', answer: 54 },
          { question: '9 × 8', answer: 72 }
        ],
        tip: '✋ Parmaklarınız en iyi çarpım tablosu!'
      },
      {
        title: '11\'ler Kuralı',
        difficulty: 'Orta',
        description: 'İki basamaklı sayıyı 11 ile çarpmak için rakamları topla',
        example: '23 × 11 = ?',
        steps: [
          'İlk rakam: 2',
          'Rakamları topla: 2 + 3 = 5',
          'Son rakam: 3',
          'Sonuç: 253'
        ],
        visual: '23 × 11 → 2_(2+3)_3 → 2_5_3 = 253',
        practice: [
          { question: '34 × 11', answer: 374 },
          { question: '52 × 11', answer: 572 },
          { question: '41 × 11', answer: 451 }
        ],
        tip: '🔢 11 ile çarpma çok kolay, sadece ortaya toplamı yaz!'
      },
      {
        title: '5 ile Çarpma Hilesi',
        difficulty: 'Kolay',
        description: '5 ile çarpımı 10 ile çarpıp yarıya indirme',
        example: '24 × 5 = ?',
        steps: [
          '24 × 10 = 240',
          '240 ÷ 2 = 120'
        ],
        visual: '24 × 5 → 24 × 10 ÷ 2 → 240 ÷ 2 = 120',
        practice: [
          { question: '18 × 5', answer: 90 },
          { question: '36 × 5', answer: 180 },
          { question: '42 × 5', answer: 210 }
        ],
        tip: '⚡ 5 ile çarpma = 10 ile çarp, sonra yarıya indir!'
      },
      {
        title: 'Kare Sayıları Hızlı Hesaplama',
        difficulty: 'Zor',
        description: '5 ile biten sayıların karesini hızlı hesapla',
        example: '25² = ?',
        steps: [
          'İlk rakam: 2',
          '2 × (2+1) = 2 × 3 = 6',
          'Sona 25 ekle',
          'Sonuç: 625'
        ],
        visual: '25² → 2×(2+1)|25 → 6|25 = 625',
        practice: [
          { question: '15²', answer: 225 },
          { question: '35²', answer: 1225 },
          { question: '45²', answer: 2025 }
        ],
        tip: '🎯 5 ile biten sayıların karesi için özel formül!'
      }
    ]
  },
  {
    id: 'division',
    name: 'Bölme Teknikleri',
    icon: <Divide size={24} />,
    color: 'from-orange-400 to-red-600',
    description: 'Bölme işlemlerini basitleştiren pratik yöntemler',
    tips: [
      {
        title: 'Çarpma ile Kontrol',
        difficulty: 'Kolay',
        description: 'Bölme sonucunu çarpma ile kontrol et',
        example: '84 ÷ 7 = ?',
        steps: [
          'Tahmin: 84 ÷ 7 ≈ 12',
          'Kontrol: 12 × 7 = 84 ✓',
          'Sonuç doğru: 12'
        ],
        visual: '84 ÷ 7 = 12 → Kontrol: 12 × 7 = 84 ✓',
        practice: [
          { question: '96 ÷ 8', answer: 12 },
          { question: '72 ÷ 9', answer: 8 },
          { question: '63 ÷ 7', answer: 9 }
        ],
        tip: '✅ Her bölme işlemini çarpma ile kontrol et!'
      },
      {
        title: '10 ile Bölme',
        difficulty: 'Kolay',
        description: '10, 100, 1000 ile bölme kuralları',
        example: '350 ÷ 10 = ?',
        steps: [
          '10 ile bölerken sağdan bir sıfır sil',
          '350 → 35',
          'Sonuç: 35'
        ],
        visual: '350 ÷ 10 → 35.0 → 35',
        practice: [
          { question: '480 ÷ 10', answer: 48 },
          { question: '1200 ÷ 100', answer: 12 },
          { question: '5000 ÷ 1000', answer: 5 }
        ],
        tip: '🔟 10\'un katları ile bölerken sıfır sil!'
      },
      {
        title: 'Yarıya İndirme Tekniği',
        difficulty: 'Orta',
        description: 'Çift sayıları 2 ile bölerken hızlı yöntem',
        example: '48 ÷ 2 = ?',
        steps: [
          'Çift sayıyı yarıya indir',
          '48 ÷ 2 = 24'
        ],
        visual: '48 ÷ 2 → 48/2 = 24',
        practice: [
          { question: '86 ÷ 2', answer: 43 },
          { question: '124 ÷ 2', answer: 62 },
          { question: '168 ÷ 2', answer: 84 }
        ],
        tip: '➗ Çift sayıları yarıya indirmek çok kolay!'
      },
      {
        title: 'Faktörlere Ayırma',
        difficulty: 'Zor',
        description: 'Büyük sayıları faktörlerine ayırarak böl',
        example: '144 ÷ 12 = ?',
        steps: [
          '12 = 4 × 3',
          '144 ÷ 12 = 144 ÷ (4 × 3)',
          '144 ÷ 4 = 36',
          '36 ÷ 3 = 12'
        ],
        visual: '144 ÷ 12 → 144 ÷ 4 ÷ 3 → 36 ÷ 3 = 12',
        practice: [
          { question: '180 ÷ 15', answer: 12 },
          { question: '168 ÷ 14', answer: 12 },
          { question: '132 ÷ 11', answer: 12 }
        ],
        tip: '🧩 Büyük sayıları küçük parçalara böl!'
      }
    ]
  }
];

// İpuçları sayfası bileşeni
export const Tips: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedTip, setSelectedTip] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState(false);

  const currentCategory = tipCategories[selectedCategory];
  const currentTip = currentCategory.tips[selectedTip];

  // Sonraki kategori
  const nextCategory = () => {
    setSelectedCategory((prev) => (prev + 1) % tipCategories.length);
    setSelectedTip(0);
    setShowPractice(false);
    setShowResults(false);
  };

  // Önceki kategori
  const prevCategory = () => {
    setSelectedCategory((prev) => (prev - 1 + tipCategories.length) % tipCategories.length);
    setSelectedTip(0);
    setShowPractice(false);
    setShowResults(false);
  };

  // Sonraki ipucu
  const nextTip = () => {
    setSelectedTip((prev) => (prev + 1) % currentCategory.tips.length);
    setShowPractice(false);
    setShowResults(false);
    setPracticeAnswers(['', '', '']);
  };

  // Önceki ipucu
  const prevTip = () => {
    setSelectedTip((prev) => (prev - 1 + currentCategory.tips.length) % currentCategory.tips.length);
    setShowPractice(false);
    setShowResults(false);
    setPracticeAnswers(['', '', '']);
  };

  // Pratik cevaplarını kontrol et
  const checkPractice = () => {
    setShowResults(true);
  };

  // Zorluk seviyesi rengi
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Orta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Zor': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-4 border-b border-gray-200 sm:px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 transition-colors bg-gray-100 sm:px-4 rounded-xl dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowLeft size={20} />
            <span className="hidden font-medium sm:inline">Ana Sayfa</span>
          </motion.button>

          <div className="flex items-center gap-2 sm:gap-3">
            <BookOpen className="text-primary-500" size={20} />
            <h1 className="text-lg font-bold text-gray-800 sm:text-2xl dark:text-gray-200">
              Matematik İpuçları
            </h1>
          </div>

          <div className="w-16 sm:w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Ana içerik */}
      <main className="px-4 py-4 sm:px-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Giriş */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center sm:mb-12"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-500">
              <Lightbulb className="text-white" size={24} />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-gray-200">
              Matematik Hileleri ve Taktikleri
            </h2>
            <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg dark:text-gray-400">
              Zihinsel hesaplama becerilerini geliştirmek için pratik yöntemler ve kısa yollar öğren!
            </p>
          </motion.div>

          {/* Kategori seçici - Mobil uyumlu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            {/* Mobil kategori seçici */}
            <div className="mb-4 sm:hidden">
              <div className="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-800 rounded-xl">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevCategory}
                  className="p-2 transition-colors bg-gray-100 rounded-full dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ChevronLeft size={20} />
                </motion.button>

                <div className="flex-1 mx-4 text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${currentCategory.color} text-white shadow-lg`}>
                    {currentCategory.icon}
                    <span className="font-medium">{currentCategory.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {currentCategory.description}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextCategory}
                  className="p-2 transition-colors bg-gray-100 rounded-full dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>

            {/* Desktop kategori seçici */}
            <div className="items-center justify-center hidden gap-4 mb-6 sm:flex">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevCategory}
                className="p-2 transition-all bg-white border border-gray-200 rounded-full shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
              >
                <ChevronLeft size={20} />
              </motion.button>

              <div className="flex gap-2">
                {tipCategories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory(index);
                      setSelectedTip(0);
                      setShowPractice(false);
                      setShowResults(false);
                    }}
                    className={`
                      px-4 py-2 rounded-xl font-medium transition-all duration-200
                      ${index === selectedCategory
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span className="hidden lg:inline">{category.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextCategory}
                className="p-2 transition-all bg-white border border-gray-200 rounded-full shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>

          {/* İpucu kartı */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${selectedTip}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className={`
                relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl
                bg-gradient-to-br ${currentCategory.color}
                p-6 sm:p-8 md:p-12 text-white
              `}>
                {/* İpucu başlığı */}
                <div className="mb-6 text-center sm:mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4 sm:gap-3">
                    {currentCategory.icon}
                    <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">
                      {currentTip.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentTip.difficulty)}`}>
                      {currentTip.difficulty}
                    </span>
                    <span className="text-sm opacity-90">
                      {selectedTip + 1}/{currentCategory.tips.length}
                    </span>
                  </div>
                  
                  <p className="max-w-2xl mx-auto text-base sm:text-lg opacity-90">
                    {currentTip.description}
                  </p>
                </div>

                {/* Ana içerik */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Örnek */}
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:p-6">
                    <div className="text-center">
                      <h4 className="flex items-center justify-center gap-2 mb-4 text-lg font-bold sm:text-xl">
                        <Target size={20} />
                        Örnek Problem
                      </h4>
                      <div className="p-3 mb-4 text-2xl font-bold sm:text-3xl bg-black/20 rounded-xl sm:p-4">
                        {currentTip.example}
                      </div>
                    </div>
                  </div>

                  {/* Adımlar */}
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:p-6">
                    <h4 className="flex items-center gap-2 mb-4 text-lg font-bold sm:text-xl">
                      <Brain size={20} />
                      Çözüm Adımları
                    </h4>
                    <div className="space-y-3">
                      {currentTip.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-sm sm:text-base">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Görsel açıklama */}
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:p-6">
                    <h4 className="flex items-center gap-2 mb-4 text-lg font-bold sm:text-xl">
                      <Eye size={20} />
                      Görsel Açıklama
                    </h4>
                    <div className="p-3 font-mono text-base text-center sm:text-lg bg-black/20 rounded-xl sm:p-4">
                      {currentTip.visual}
                    </div>
                  </div>

                  {/* İpucu */}
                  <div className="p-4 border bg-yellow-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:p-6 border-yellow-300/30">
                    <div className="flex items-start gap-3">
                      <Lightbulb size={20} className="text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">{currentTip.tip}</span>
                    </div>
                  </div>
                </div>

                {/* Pratik butonu */}
                <div className="mt-6 text-center sm:mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPractice(!showPractice)}
                    className="flex items-center gap-2 px-6 py-3 mx-auto text-base font-bold transition-all duration-200 border sm:px-8 sm:py-4 bg-white/20 backdrop-blur-sm rounded-xl sm:text-lg border-white/30 hover:bg-white/30"
                  >
                    <Repeat size={20} />
                    <span>{showPractice ? 'Pratik Gizle' : 'Pratik Yap'}</span>
                  </motion.button>
                </div>

                {/* Pratik bölümü */}
                <AnimatePresence>
                  {showPractice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 mt-6 sm:mt-8 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl sm:p-6"
                    >
                      <h4 className="flex items-center gap-2 mb-4 text-lg font-bold sm:text-xl">
                        <Hand size={20} />
                        Pratik Sorular
                      </h4>
                      <div className="space-y-4">
                        {currentTip.practice.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <span className="text-base sm:text-lg font-mono bg-black/20 rounded-lg px-3 py-2 min-w-[100px] text-center">
                              {item.question}
                            </span>
                            <span className="text-lg">=</span>
                            <input
                              type="number"
                              value={practiceAnswers[index]}
                              onChange={(e) => {
                                const newAnswers = [...practiceAnswers];
                                newAnswers[index] = e.target.value;
                                setPracticeAnswers(newAnswers);
                              }}
                              className="w-20 px-3 py-2 font-mono text-center text-white border rounded-lg sm:w-24 bg-white/20 border-white/30 placeholder-white/50"
                              placeholder="?"
                            />
                            {showResults && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-2"
                              >
                                {parseInt(practiceAnswers[index]) === item.answer ? (
                                  <CheckCircle size={20} className="text-green-300" />
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <XCircle size={20} className="text-red-300" />
                                    <span className="text-sm">({item.answer})</span>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {!showResults && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={checkPractice}
                          className="px-6 py-2 mt-4 font-medium transition-colors rounded-lg bg-white/20 hover:bg-white/30"
                        >
                          Kontrol Et
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigasyon */}
                <div className="flex items-center justify-between mt-6 sm:mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevTip}
                    disabled={currentCategory.tips.length === 1}
                    className="flex items-center gap-2 px-3 py-2 font-medium transition-colors sm:px-4 bg-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30"
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Önceki</span>
                  </motion.button>

                  <div className="flex gap-2">
                    {currentCategory.tips.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedTip(index);
                          setShowPractice(false);
                          setShowResults(false);
                          setPracticeAnswers(['', '', '']);
                        }}
                        className={`
                          w-3 h-3 rounded-full transition-all duration-200
                          ${index === selectedTip ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}
                        `}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextTip}
                    disabled={currentCategory.tips.length === 1}
                    className="flex items-center gap-2 px-3 py-2 font-medium transition-colors sm:px-4 bg-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30"
                  >
                    <span className="hidden sm:inline">Sonraki</span>
                    <ChevronRight size={20} />
                  </motion.button>
                </div>

                {/* Dekoratif elementler */}
                <div className="absolute w-20 h-20 rounded-full -top-10 -right-10 bg-white/10 blur-xl" />
                <div className="absolute rounded-full -bottom-5 -left-5 w-15 h-15 bg-white/5 blur-lg" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Alt bilgi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center sm:mt-12"
          >
            <div className="max-w-2xl p-6 mx-auto bg-white border border-gray-200 shadow-lg dark:bg-gray-800 rounded-2xl sm:p-8 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="text-yellow-500" size={24} />
                <h4 className="text-lg font-bold text-gray-800 sm:text-xl dark:text-gray-200">
                  Pratik Yapmayı Unutma!
                </h4>
              </div>
              <p className="mb-6 text-sm text-gray-600 sm:text-base dark:text-gray-400">
                Bu teknikleri öğrendikten sonra oyunlarda uygulayarak becerilerini geliştir. 
                Düzenli pratik yaparak zihinsel hesaplama hızını artırabilirsin!
              </p>
              
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-all duration-200 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700"
                >
                  <Calculator size={20} />
                  Oyuna Başla
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(0);
                    setSelectedTip(0);
                    setShowPractice(false);
                    setShowResults(false);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-all duration-200 bg-gray-500 rounded-xl hover:bg-gray-600"
                >
                  <Repeat size={20} />
                  Baştan Başla
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};