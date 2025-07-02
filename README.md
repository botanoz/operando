# Operando - Sonsuz Matematik Macerası 🧮

Çocuklar için geliştirilmiş eğlenceli ve eğitici matematik oyunu. React, TypeScript ve Tailwind CSS ile modern web teknolojileri kullanılarak geliştirilmiştir.

**🔗 GitHub Repository:** [https://github.com/botanoz/operando](https://github.com/botanoz/operando)

## 🎯 Özellikler

### 🎮 Sonsuz Oyun Modları
- **🌱 Sayı Bahçesi (Kolay)**: 1 basamakla başlar, giderek 2-4 basamağa çıkar. Sadece toplama ve çıkarma işlemleri
- **🏝️ Zihin Adası (Orta)**: 2 basamakla başlar (1 basamak yok), giderek 3-5 basamağa çıkar. Tüm dört işlem
- **🚀 Sonsuz Galaksi (Zor)**: 2-3 basamakla başlar, giderek 4-8 basamağa çıkar. Uzman seviyesi zorluk

### 🔄 Sonsuz Seviye Sistemi
- **Her 5 doğru cevap = 1 seviye atlama**
- **Yanlış cevap = Seviye 1'e geri dönüş**
- **Giderek artan zorluk**: Her seviyede daha büyük sayılar ve zor işlemler
- **Mod bazlı ilerleme**: Her mod kendi zorluk eğrisine sahip

### 📱 Teknik Özellikler
- **PWA Desteği**: Android'de tam ekran uygulama deneyimi
- **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- **Koyu Tema**: Optimized dark theme
- **Offline Çalışma**: İnternet bağlantısı olmadan da kullanılabilir
- **localStorage**: Skor ve ilerleme takibi
- **Lazy Loading**: Sayfa bileşenleri ihtiyaç halinde yüklenir

### 🎨 Tasarım
- Modern, çocuk dostu arayüz
- Smooth animasyonlar (Framer Motion)
- Erişilebilirlik özellikleri
- Dokunmatik klavye optimizasyonu
- Gradient temelli görsel tasarım

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Adımlar
1. Projeyi klonlayın:
```bash
git clone https://github.com/botanoz/operando.git
cd operando
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresini açın

## 📱 Android'e PWA Kurulumu

### Chrome Tarayıcısı ile:
1. Android cihazınızda Chrome tarayıcısını açın
2. Operando oyununu ziyaret edin
3. Sağ üst köşedeki menü (⋮) butonuna tıklayın
4. "Ana ekrana ekle" seçeneğini seçin
5. Uygulama adını onaylayın ve "Ekle" butonuna tıklayın

### Otomatik PWA Kurulumu:
- Modern tarayıcılar otomatik olarak "Uygulamayı Yükle" bildirimi gösterebilir
- Bu bildirimi kabul ederek uygulamayı direkt yükleyebilirsiniz

## 🛠️ Geliştirme

### Proje Yapısı
```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── NumericPad.tsx   # Dokunmatik sayı klavyesi
│   ├── TimerBar.tsx     # Zamanlayıcı göstergesi
│   ├── ProgressRing.tsx # Dairesel ilerleme göstergesi
│   ├── ModeCard.tsx     # Oyun modu kartları
│   └── QuestionCard.tsx # Soru gösterim kartı
├── context/             # React Context API
│   └── GameContext.tsx  # Oyun durumu yönetimi
├── hooks/               # Custom React hooks
│   └── useTimer.ts      # Zamanlayıcı hook'u
├── pages/               # Sayfa bileşenleri (Lazy loaded)
│   ├── Home.tsx         # Ana sayfa
│   ├── WarmUp.tsx       # Isınma turu
│   ├── Play.tsx         # Oyun ekranı
│   ├── Tips.tsx         # İpuçları sayfası
│   └── Result.tsx       # Sonuç ekranı
├── types/               # TypeScript tip tanımları
│   └── index.ts
├── utils/               # Yardımcı fonksiyonlar
│   ├── questionBank.ts  # Gerçek zamanlı soru üretici
│   └── difficultyManager.ts # Zorluk yönetim sistemi
├── services/            # Veri servisleri
│   └── storageService.ts # LocalStorage yönetimi
├── config/              # Konfigürasyon dosyaları
│   └── gameConfig.ts    # Oyun sabitleri ve mod ayarları
└── App.tsx              # Ana uygulama bileşeni (Router + Suspense)
```

### Komutlar
```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Üretim için build
npm run preview  # Build önizlemesi
npm run lint     # Kod kontrolü
```

## 🎯 Oyun Mekanikleri

### Güncellenmiş Sonsuz Mod Kuralları

| Mod | Başlangıç | Maksimum | İşlemler | Süre/Soru | Bonus Koşulu | Zorluk Artışı |
|-----|-----------|----------|----------|-----------|--------------|---------------|
| **🌱 Sayı Bahçesi** | 1 basamak | 4-5 basamak | +, - | 15 sn | <10 sn → +5 sn | Yavaş ve kararlı |
| **🏝️ Zihin Adası** | 2 basamak | 5-6 basamak | 4 işlem | 12 sn | <8 sn → +5 sn | Orta hızda artış |
| **🚀 Sonsuz Galaksi** | 2-3 basamak | 7-8 basamak | 4 işlem | 10 sn | <5 sn → +5 sn | Hızlı ve zorlaşan |

### Puanlama Sistemi
- **Toplama**: 1.0x katsayı
- **Çıkarma**: 1.2x katsayı  
- **Çarpma**: 1.5x katsayı
- **Bölme**: 1.8x katsayı
- **Seviye çarpanı**: Her seviye %5 bonus
- **Mod çarpanı**: Kolay 1.0x, Orta 1.5x, Zor 2.0x
- **Hız bonusu**: Kalan süreye göre %50'ye kadar bonus

### Soru Üretim Sistemi
- **Gerçek zamanlı üretim**: Tüm sorular dinamik olarak oluşturulur
- **Mod bazlı zorluk**: Her mod kendi zorluk eğrisine sahip
- **Adaptif sistem**: Seviye ilerledikçe zorluk otomatik artar
- **Bölme optimizasyonu**: Tam bölünebilir sonuçlar garanti edilir
- **Özel sayılar**: %30 şansla kolay hesaplama için özel sayılar

### Seviye Sistemi
- **Seviye Atlama**: Her 5 doğru cevap = 1 seviye atlama
- **Ceza Sistemi**: Yanlış cevap = Seviye 1'e dönüş
- **Sonsuz İlerleme**: Teorik olarak sınırsız seviye
- **Zorluk Artışı**: Her 10 seviyede basamak sayısı artışı

## 🎨 Tema Sistemi

Uygulama karanlık tema optimizasyonu sunar:
- **Varsayılan Karanlık Tema**: Göz dostu tasarım
- **Gradient Arka Planlar**: Her mod için özel renk paleti
- **Animasyonlu Geçişler**: Smooth tema değişimi
- **Tercih Saklama**: localStorage'da tema tercihi

## 📊 Veri Yönetimi

Tüm kullanıcı verileri localStorage'da saklanır:
- **Oyun İstatistikleri**: Toplam oyun, puan, doğruluk oranı
- **Seviye Kayıtları**: Her mod için mevcut ve en yüksek seviye
- **Başarı Rozetleri**: Kazanılan achievement'ler
- **Isınma Durumu**: Hangi modlarda ısınma turu görüldü

## 🏆 Başarı Sistemi

- **🌟 Seviye Ustası**: Seviye 10'a ulaş
- **🎯 Kesin Nişancı**: %90 doğruluk oranı
- **💪 Dayanıklı**: 50+ soru çöz
- **🔥 Seri Katili**: 20+ doğru cevap serisi

## 🔧 Teknoloji Stack

- **React 18**: UI framework
- **TypeScript**: Tip güvenliği
- **Vite**: Build tool ve dev server
- **Tailwind CSS**: Styling framework
- **Framer Motion**: Animasyonlar
- **React Router**: Sayfa yönlendirme (Lazy loading ile)
- **Lucide React**: İkon seti
- **PWA**: Progressive Web App özellikleri

## 🐛 Hata Giderme

### Genel Sorunlar
- **Beyaz Ekran**: Tüm route'lar lazy loading ile yüklenir
- **Sonsuz Soru Üretimi**: Play.tsx'te dependency loop sorunu çözüldü
- **Tip Hataları**: Tüm any kullanımları kaldırıldı

### Performans Optimizasyonları
- Lazy loading ile kod bölünmesi
- Memoization ile gereksiz render'ları önleme
- Efficient state management
- Mod bazlı zorluk optimizasyonu

### Debug İpuçları
```bash
# Geliştirme modunda detaylı hata mesajları
npm run dev

# Build hatalarını kontrol et
npm run build

# Lint hatalarını düzelt
npm run lint --fix
```

## 🎓 Eğitici İçerik

### İpuçları Sistemi
Oyun içi interaktif matematik ipuçları:
- **Toplama Hileleri**: 10'a tamamlama, çift sayılar
- **Çıkarma Taktikleri**: Ekleyerek fark bulma, yuvarla ve düzelt
- **Çarpma Sırları**: 9'lar kuralı, 11'ler kuralı, parmak tekniği
- **Bölme Teknikleri**: Çarpma kontrolü, faktörlere ayırma

### Yaş Grupları
- **6-8 yaş**: 🌱 Sayı Bahçesi modu önerilir
- **9-11 yaş**: 🏝️ Zihin Adası modu önerilir  
- **12+ yaş**: 🚀 Sonsuz Galaksi modu önerilir

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🔄 Güncellemeler

### v2.0.0 - Sonsuz Sistem Güncellemesi
- ✅ Sonsuz seviye sistemi implementasyonu
- ✅ Mod bazlı zorluk eğrileri
- ✅ Gelişmiş soru üretim algoritması
- ✅ PWA optimizasyonları
- ✅ Tip güvenliği geliştirmeleri
- ✅ Performans optimizasyonları
- ✅ Kullanıcı deneyimi iyileştirmeleri

### v1.1.0 - Kritik Düzeltmeler
- ✅ Beyaz ekran sorunu çözüldü (Lazy loading + Suspense)
- ✅ QuestionBank tamamen yeniden yazıldı (gerçek zamanlı üretim)
- ✅ Route yapısı optimize edildi
- ✅ Tips sayfası eklendi
- ✅ Result sayfası eklendi
- ✅ Play sayfası tamamlandı

---

## 🌟 Demo

**Canlı Demo:** [Operando Matematik Oyunu](https://operando-math.vercel.app)

**Operando** ile matematik öğrenmeyi eğlenceli hale getirin! Sonsuz seviye sisteminde ne kadar ileri gidebilirsin? 🚀

---

**Made with ❤️ by [botanoz](https://github.com/botanoz)**