import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';

// Lazy loading ile sayfa bileşenlerini yükle
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const WarmUp = lazy(() => import('./pages/WarmUp').then(module => ({ default: module.WarmUp })));
const Play = lazy(() => import('./pages/Play').then(module => ({ default: module.Play })));
const Tips = lazy(() => import('./pages/Tips').then(module => ({ default: module.Tips })));
const Result = lazy(() => import('./pages/Result').then(module => ({ default: module.Result })));

// Loading bileşeni
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium text-gray-400">Yükleniyor...</p>
    </div>
  </div>
);

// Ana uygulama bileşeni
function App() {
  // Karanlık tema zorla
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('operando-theme', 'dark');
  }, []);

  return (
    <GameProvider>
      <Router>
        <div className="App dark">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/warmup/:modeId" element={<WarmUp />} />
              <Route path="/play/:modeId" element={<Play />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/result/:modeId" element={<Result />} />
              {/* 404 sayfası */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-200 mb-4">404</h1>
                    <p className="text-lg text-gray-400 mb-6">Sayfa bulunamadı</p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                    >
                      Ana Sayfaya Dön
                    </button>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;