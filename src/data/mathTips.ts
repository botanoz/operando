import { OperationType, GameMode } from '../types';

export interface MathTip {
  id: string;
  operation: OperationType;
  title: string;
  description: string;
  example: string;
  steps: string[];
  visual: string;
  difficulty: 'easy' | 'medium' | 'hard';
  levelRange: [number, number]; // min-max level range where this tip is relevant
}

// ========================================
// TOPLAMA IPUCLARI
// ========================================
const additionTips: MathTip[] = [
  {
    id: 'add-01',
    operation: 'addition',
    title: "10'a Tamamlama",
    description: "Sayiyi 10'a tamamlayarak topla",
    example: '8 + 6 = ?',
    steps: [
      "8'i 10'a tamamla → 2 lazim",
      "6'dan 2'yi ayir → 4 kalir",
      '10 + 4 = 14'
    ],
    visual: '8 + 6 → (8+2) + 4 → 10 + 4 = 14',
    difficulty: 'easy',
    levelRange: [1, 5]
  },
  {
    id: 'add-02',
    operation: 'addition',
    title: 'Cift Sayilari Toplama',
    description: 'Ayni sayilari carpma ile topla',
    example: '7 + 7 = ?',
    steps: [
      'Iki sayi ayni ise carpma kullan',
      '7 + 7 = 7 × 2 = 14'
    ],
    visual: '7 + 7 = 7 × 2 = 14',
    difficulty: 'easy',
    levelRange: [1, 5]
  },
  {
    id: 'add-03',
    operation: 'addition',
    title: 'Yakin Sayilari Toplama',
    description: 'Birbirine yakin iki sayiyi hizli topla',
    example: '6 + 7 = ?',
    steps: [
      '6 ve 7 birbirine yakin',
      'Ortalamayi bul: 6.5',
      '6.5 × 2 = 13'
    ],
    visual: '6 + 7 → 6.5 × 2 = 13',
    difficulty: 'easy',
    levelRange: [1, 8]
  },
  {
    id: 'add-04',
    operation: 'addition',
    title: 'Onluklari Ayirma',
    description: 'Buyuk sayilari onluk ve birlik olarak ayir',
    example: '47 + 35 = ?',
    steps: [
      'Onluklari topla: 40 + 30 = 70',
      'Birlikleri topla: 7 + 5 = 12',
      'Birlestir: 70 + 12 = 82'
    ],
    visual: '47 + 35 → (40+30) + (7+5) → 70 + 12 = 82',
    difficulty: 'medium',
    levelRange: [3, 15]
  },
  {
    id: 'add-05',
    operation: 'addition',
    title: 'Yuvarla ve Duzelt',
    description: 'Yuvarlak sayiya tamamla, sonra duzelt',
    example: '38 + 27 = ?',
    steps: [
      "38'i 40'a yuvarla → 2 ekledin",
      '40 + 27 = 67',
      'Fazla ekledin, cikar: 67 - 2 = 65'
    ],
    visual: '38 + 27 → 40 + 27 - 2 → 67 - 2 = 65',
    difficulty: 'medium',
    levelRange: [3, 15]
  },
  {
    id: 'add-06',
    operation: 'addition',
    title: 'Soldan Saga Toplama',
    description: 'Buyuk basamaktan baslayarak topla',
    example: '256 + 378 = ?',
    steps: [
      'Yuzlukleri topla: 200 + 300 = 500',
      'Onluklari topla: 50 + 70 = 120',
      'Birlikleri topla: 6 + 8 = 14',
      'Birlestir: 500 + 120 + 14 = 634'
    ],
    visual: '256 + 378 → 500 + 120 + 14 = 634',
    difficulty: 'hard',
    levelRange: [8, 50]
  },
  {
    id: 'add-07',
    operation: 'addition',
    title: 'Telafi Toplama',
    description: 'Bir sayidan al, digerine ekle',
    example: '97 + 46 = ?',
    steps: [
      "97'ye 3 ekle → 100",
      "46'dan 3 cikar → 43",
      '100 + 43 = 143'
    ],
    visual: '97 + 46 → 100 + 43 = 143',
    difficulty: 'medium',
    levelRange: [5, 20]
  },
  {
    id: 'add-08',
    operation: 'addition',
    title: 'Uc Basamakli Hizli Toplama',
    description: 'Uc basamakli sayilari parcalayarak topla',
    example: '345 + 267 = ?',
    steps: [
      '300 + 200 = 500',
      '45 + 67 = 112',
      '500 + 112 = 612'
    ],
    visual: '345 + 267 → 500 + 112 = 612',
    difficulty: 'hard',
    levelRange: [10, 50]
  }
];

// ========================================
// CIKARMA IPUCLARI
// ========================================
const subtractionTips: MathTip[] = [
  {
    id: 'sub-01',
    operation: 'subtraction',
    title: 'Yuvarla ve Duzelt',
    description: 'Cikarilacak sayiyi yuvarla, sonra duzelt',
    example: '84 - 29 = ?',
    steps: [
      "29'u 30'a yuvarla",
      '84 - 30 = 54',
      '1 fazla cikardin: 54 + 1 = 55'
    ],
    visual: '84 - 29 → 84 - 30 + 1 = 55',
    difficulty: 'easy',
    levelRange: [1, 10]
  },
  {
    id: 'sub-02',
    operation: 'subtraction',
    title: 'Ekleyerek Fark Bulma',
    description: '"Ne eklemeliyim?" diye dusun',
    example: '63 - 28 = ?',
    steps: [
      '28 + ? = 63',
      '28 + 2 = 30',
      '30 + 33 = 63',
      'Toplam: 2 + 33 = 35'
    ],
    visual: '63 - 28 → 28 + 35 = 63 → Fark: 35',
    difficulty: 'easy',
    levelRange: [1, 10]
  },
  {
    id: 'sub-03',
    operation: 'subtraction',
    title: 'Basamak Basamak Cikarma',
    description: 'Onluklari ve birlikleri ayri cikar',
    example: '156 - 78 = ?',
    steps: [
      'Once onlugu cikar: 156 - 70 = 86',
      'Sonra birligi cikar: 86 - 8 = 78'
    ],
    visual: '156 - 78 → 156 - 70 - 8 = 78',
    difficulty: 'medium',
    levelRange: [3, 15]
  },
  {
    id: 'sub-04',
    operation: 'subtraction',
    title: "100'den Cikarma",
    description: "100'den cikarma icin ozel yontem",
    example: '100 - 37 = ?',
    steps: [
      "Birlik: 10 - 7 = 3",
      "Onluk: 9 - 3 = 6",
      'Sonuc: 63'
    ],
    visual: "100 - 37 → (9-3)(10-7) → 63",
    difficulty: 'medium',
    levelRange: [3, 15]
  },
  {
    id: 'sub-05',
    operation: 'subtraction',
    title: 'Geriye Sayma Teknigi',
    description: 'Kucuk sayilari geriye sayarak cikar',
    example: '52 - 8 = ?',
    steps: [
      "52'den 2 cikar → 50",
      "50'den 6 cikar → 44",
      'Sonuc: 44'
    ],
    visual: '52 - 8 → 52 - 2 - 6 → 50 - 6 = 44',
    difficulty: 'easy',
    levelRange: [1, 8]
  },
  {
    id: 'sub-06',
    operation: 'subtraction',
    title: 'Buyuk Sayilarda Cikarma',
    description: 'Yuzlukleri ve onluklari ayri islemle cikar',
    example: '423 - 187 = ?',
    steps: [
      '423 - 200 = 223 (13 fazla cikardin)',
      '223 + 13 = 236'
    ],
    visual: '423 - 187 → 423 - 200 + 13 = 236',
    difficulty: 'hard',
    levelRange: [8, 50]
  },
  {
    id: 'sub-07',
    operation: 'subtraction',
    title: 'Dengeleme Teknigi',
    description: 'Her iki sayiya da ayni degeri ekle',
    example: '73 - 48 = ?',
    steps: [
      'Her ikisine 2 ekle',
      '75 - 50 = 25'
    ],
    visual: '73 - 48 → 75 - 50 = 25',
    difficulty: 'medium',
    levelRange: [5, 20]
  }
];

// ========================================
// CARPMA IPUCLARI
// ========================================
const multiplicationTips: MathTip[] = [
  {
    id: 'mul-01',
    operation: 'multiplication',
    title: "9'lar Kurali",
    description: "9 ile carpimda parmak teknigi kullan",
    example: '9 × 7 = ?',
    steps: [
      '10 parmak ac, 7. parmagi buk',
      'Sol: 6 parmak (onluk)',
      'Sag: 3 parmak (birlik)',
      'Sonuc: 63'
    ],
    visual: '9 × 7 → 6 | 3 = 63',
    difficulty: 'easy',
    levelRange: [1, 10]
  },
  {
    id: 'mul-02',
    operation: 'multiplication',
    title: '5 ile Carpma',
    description: '10 ile carp, yariya bol',
    example: '24 × 5 = ?',
    steps: [
      '24 × 10 = 240',
      '240 ÷ 2 = 120'
    ],
    visual: '24 × 5 → 24 × 10 ÷ 2 = 120',
    difficulty: 'easy',
    levelRange: [1, 10]
  },
  {
    id: 'mul-03',
    operation: 'multiplication',
    title: "11'ler Kurali",
    description: 'Iki basamakli sayi × 11 kolayligi',
    example: '23 × 11 = ?',
    steps: [
      'Ilk rakam: 2',
      'Rakamlari topla: 2 + 3 = 5',
      'Son rakam: 3',
      'Sonuc: 253'
    ],
    visual: '23 × 11 → 2_(2+3)_3 = 253',
    difficulty: 'medium',
    levelRange: [3, 15]
  },
  {
    id: 'mul-04',
    operation: 'multiplication',
    title: '2 ile Carpma Zinciri',
    description: 'Bir sayiyi iki katina cikarmak cok kolay',
    example: '37 × 2 = ?',
    steps: [
      '30 × 2 = 60',
      '7 × 2 = 14',
      '60 + 14 = 74'
    ],
    visual: '37 × 2 → (30×2) + (7×2) = 74',
    difficulty: 'easy',
    levelRange: [1, 8]
  },
  {
    id: 'mul-05',
    operation: 'multiplication',
    title: '4 ile Carpma',
    description: 'Iki kez iki katina al',
    example: '16 × 4 = ?',
    steps: [
      'Once × 2: 16 × 2 = 32',
      'Tekrar × 2: 32 × 2 = 64'
    ],
    visual: '16 × 4 → 16 × 2 × 2 → 32 × 2 = 64',
    difficulty: 'easy',
    levelRange: [1, 10]
  },
  {
    id: 'mul-06',
    operation: 'multiplication',
    title: 'Parcalama Teknigi',
    description: 'Buyuk sayiyi parcalayarak carp',
    example: '12 × 15 = ?',
    steps: [
      '12 × 15 = 12 × 10 + 12 × 5',
      '12 × 10 = 120',
      '12 × 5 = 60',
      '120 + 60 = 180'
    ],
    visual: '12 × 15 → 120 + 60 = 180',
    difficulty: 'medium',
    levelRange: [5, 20]
  },
  {
    id: 'mul-07',
    operation: 'multiplication',
    title: 'Yakin Sayilarla Carpma',
    description: 'Yuvarlak sayiya yakin carpma',
    example: '19 × 6 = ?',
    steps: [
      '20 × 6 = 120',
      '1 × 6 = 6 (fazla carptin)',
      '120 - 6 = 114'
    ],
    visual: '19 × 6 → (20×6) - 6 = 114',
    difficulty: 'medium',
    levelRange: [5, 20]
  },
  {
    id: 'mul-08',
    operation: 'multiplication',
    title: '25 ile Carpma',
    description: '100 ile carp, 4e bol',
    example: '16 × 25 = ?',
    steps: [
      '16 × 100 = 1600',
      '1600 ÷ 4 = 400'
    ],
    visual: '16 × 25 → 16 × 100 ÷ 4 = 400',
    difficulty: 'hard',
    levelRange: [10, 50]
  },
  {
    id: 'mul-09',
    operation: 'multiplication',
    title: 'Karesi Alinabilen Sayilar',
    description: '5 ile biten sayilarin karesi',
    example: '35 × 35 = ?',
    steps: [
      'Onluk rakam: 3',
      '3 × (3+1) = 3 × 4 = 12',
      'Sona 25 ekle',
      'Sonuc: 1225'
    ],
    visual: '35² → 3×4 | 25 = 1225',
    difficulty: 'hard',
    levelRange: [10, 50]
  },
  {
    id: 'mul-10',
    operation: 'multiplication',
    title: 'Carpma Tablosu Hizi',
    description: 'Temel carpma tablosunu hizli hatirla',
    example: '8 × 7 = ?',
    steps: [
      '8 × 7 = 56',
      'Hatirla: 5-6-7-8 → 56 = 7 × 8'
    ],
    visual: '5, 6, 7, 8 → 56 = 7 × 8',
    difficulty: 'easy',
    levelRange: [1, 8]
  }
];

// ========================================
// BOLME IPUCLARI
// ========================================
const divisionTips: MathTip[] = [
  {
    id: 'div-01',
    operation: 'division',
    title: 'Carpma ile Kontrol',
    description: 'Bolme sonucunu carparak dogrula',
    example: '84 ÷ 7 = ?',
    steps: [
      'Tahmin et: 12',
      'Kontrol: 12 × 7 = 84',
      'Dogru!'
    ],
    visual: '84 ÷ 7 = 12 → kontrol: 12 × 7 = 84',
    difficulty: 'easy',
    levelRange: [1, 10]
  },
  {
    id: 'div-02',
    operation: 'division',
    title: 'Yariya Bolme',
    description: 'Cift sayilari 2 ile bolmek cok kolay',
    example: '86 ÷ 2 = ?',
    steps: [
      '80 ÷ 2 = 40',
      '6 ÷ 2 = 3',
      '40 + 3 = 43'
    ],
    visual: '86 ÷ 2 → 40 + 3 = 43',
    difficulty: 'easy',
    levelRange: [1, 8]
  },
  {
    id: 'div-03',
    operation: 'division',
    title: '10 ile Bolme',
    description: 'Sifir silerek bol',
    example: '350 ÷ 10 = ?',
    steps: [
      'Sondaki sifiri sil',
      '350 → 35'
    ],
    visual: '350 ÷ 10 → 35',
    difficulty: 'easy',
    levelRange: [1, 8]
  },
  {
    id: 'div-04',
    operation: 'division',
    title: 'Faktorlere Ayirma',
    description: 'Boleni kucuk faktorlere ayir',
    example: '144 ÷ 12 = ?',
    steps: [
      '12 = 4 × 3',
      '144 ÷ 4 = 36',
      '36 ÷ 3 = 12'
    ],
    visual: '144 ÷ 12 → 144 ÷ 4 ÷ 3 = 12',
    difficulty: 'medium',
    levelRange: [5, 20]
  },
  {
    id: 'div-05',
    operation: 'division',
    title: 'Tersine Carpma',
    description: 'Carpma tablosunu tersine kullan',
    example: '72 ÷ 8 = ?',
    steps: [
      '8 × ? = 72 diye dusun',
      '8 × 9 = 72',
      'Cevap: 9'
    ],
    visual: '72 ÷ 8 → 8 × 9 = 72 → Cevap: 9',
    difficulty: 'easy',
    levelRange: [1, 10]
  },
  {
    id: 'div-06',
    operation: 'division',
    title: 'Yarim Yarim Bolme',
    description: 'Arka arkaya 2ye bolerek sonuca ulas',
    example: '96 ÷ 8 = ?',
    steps: [
      '96 ÷ 2 = 48',
      '48 ÷ 2 = 24',
      '24 ÷ 2 = 12',
      '(3 kez yariya bolduk = ÷8)'
    ],
    visual: '96 ÷ 8 → 96 ÷ 2 ÷ 2 ÷ 2 = 12',
    difficulty: 'medium',
    levelRange: [5, 20]
  },
  {
    id: 'div-07',
    operation: 'division',
    title: 'Bolunebilirlik Kurallari',
    description: 'Hangi sayiya bolunur hizla anla',
    example: '135 ÷ 5 = ?',
    steps: [
      'Sonu 0 veya 5 ise 5e bolunur',
      '135 → sonu 5, bolunur',
      '135 ÷ 5 = 27'
    ],
    visual: 'Sonu 0/5 → ÷5 bolunur, 135 ÷ 5 = 27',
    difficulty: 'medium',
    levelRange: [3, 15]
  },
  {
    id: 'div-08',
    operation: 'division',
    title: 'Buyuk Bolumlerde Tahmin',
    description: 'Yakin carpimlardan tahmin yap',
    example: '378 ÷ 14 = ?',
    steps: [
      '14 × 20 = 280 (az)',
      '14 × 30 = 420 (cok)',
      '14 × 25 = 350 (yakin)',
      '14 × 27 = 378 → Cevap: 27'
    ],
    visual: '378 ÷ 14 → tahmin 25-30 arasi → 27',
    difficulty: 'hard',
    levelRange: [10, 50]
  }
];

// ========================================
// TUM IPUCLARI BIRLESTIR
// ========================================
export const ALL_TIPS: MathTip[] = [
  ...additionTips,
  ...subtractionTips,
  ...multiplicationTips,
  ...divisionTips
];

// Operasyona gore ipuclarini getir
export const getTipsByOperation = (operation: OperationType): MathTip[] => {
  return ALL_TIPS.filter(tip => tip.operation === operation);
};

// Zorluğa gore ipuclarini getir
export const getTipsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): MathTip[] => {
  return ALL_TIPS.filter(tip => tip.difficulty === difficulty);
};

// Seviyeye uygun ipucu getir (level transition sirasinda kullanilir)
export const getTipForLevel = (mode: GameMode, level: number): MathTip => {
  // Moda gore hangi operasyonlar mevcut
  const modeOperations: Record<GameMode, OperationType[]> = {
    easy: ['addition', 'subtraction'],
    medium: ['addition', 'subtraction', 'multiplication', 'division'],
    hard: ['addition', 'subtraction', 'multiplication', 'division']
  };

  const availableOps = modeOperations[mode];

  // Seviyeye uygun tipleri filtrele
  let relevantTips = ALL_TIPS.filter(tip =>
    availableOps.includes(tip.operation) &&
    level >= tip.levelRange[0] &&
    level <= tip.levelRange[1]
  );

  // Eger uygun tip yoksa, o modun tum tiplerini kullan
  if (relevantTips.length === 0) {
    relevantTips = ALL_TIPS.filter(tip => availableOps.includes(tip.operation));
  }

  // Rastgele birini sec
  const randomIndex = Math.floor(Math.random() * relevantTips.length);
  return relevantTips[randomIndex];
};

// Kategorilere gore gruplanmis ipuclari (Tips sayfasi icin)
export const TIP_CATEGORIES = [
  {
    id: 'addition' as OperationType,
    name: 'Toplama',
    symbol: '+',
    color: 'from-green-500 to-emerald-600',
    tips: additionTips
  },
  {
    id: 'subtraction' as OperationType,
    name: 'Cikarma',
    symbol: '−',
    color: 'from-blue-500 to-indigo-600',
    tips: subtractionTips
  },
  {
    id: 'multiplication' as OperationType,
    name: 'Carpma',
    symbol: '×',
    color: 'from-purple-500 to-pink-600',
    tips: multiplicationTips
  },
  {
    id: 'division' as OperationType,
    name: 'Bolme',
    symbol: '÷',
    color: 'from-orange-500 to-red-600',
    tips: divisionTips
  }
];
