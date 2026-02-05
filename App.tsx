
import React, { useState, useRef } from 'react';
import { BookProvider, useBook } from './components/GrimoireBook/context/BookContext';
import GrimoireBook from './components/GrimoireBook';
import ApiModal from './components/GrimoireBook/shared/ApiModal';
import { SaveData } from './components/GrimoireBook/types';

const HeaderButtons: React.FC<{ onApiOpen: () => void }> = ({ onApiOpen }) => {
  const { exportData, importData } = useBook();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data: SaveData = JSON.parse(reader.result as string);
        importData(data);
      } catch {
        alert('유효하지 않은 파일입니다.');
      }
    };
    reader.readAsText(file);
    // reset so same file can be re-uploaded
    e.target.value = '';
  };

  const btnClass =
    'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-amber-900/30 hover:bg-amber-800/50 text-amber-400 hover:text-amber-300 transition-all duration-200 shadow-lg hover:shadow-amber-500/20';

  return (
    <div className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
      {/* Upload */}
      <button onClick={() => fileInputRef.current?.click()} className={btnClass} title="프로젝트 불러오기">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
        </svg>
      </button>
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleUpload} />

      {/* Download */}
      <button onClick={exportData} className={btnClass} title="프로젝트 저장하기">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
        </svg>
      </button>

      {/* API Connection */}
      <button onClick={onApiOpen} className={btnClass} title="API 연결 설정">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  const handleOpenBook = () => {
    setIsBookOpen(true);
  };

  const handleCloseBook = () => {
    setIsBookOpen(false);
  };

  return (
    <BookProvider isOpen={isBookOpen} onOpen={handleOpenBook} onClose={handleCloseBook}>
      <div className="relative w-screen h-screen flex flex-col overflow-hidden bg-[#050505]">
        {/* Header */}
        <header className="relative z-50 w-full pt-3 sm:pt-4 md:pt-5 pb-1 sm:pb-1.5 md:pb-2">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
            <h1
              onClick={handleCloseBook}
              className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 cursor-pointer hover:scale-105 transition-transform duration-200"
              style={{
                textShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3), 2px 2px 4px rgba(0,0,0,0.8)',
                fontFamily: 'serif'
              }}>
              TB MAGICBOOK
            </h1>

            <HeaderButtons onApiOpen={() => setIsApiModalOpen(true)} />
          </div>
        </header>

        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a130a] via-black to-black opacity-60"></div>

        {/* Main Content */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Floating Particles/Dust effect (Simple CSS) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-yellow-600 opacity-20"
                style={{
                  width: Math.random() * 4 + 'px',
                  height: Math.random() * 4 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  filter: 'blur(1px)',
                  animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`
                }}
              />
            ))}
          </div>

          {/* Main Interactive Book */}
          <GrimoireBook onOpen={handleOpenBook} />

          {/* API Modal */}
          <ApiModal
            isOpen={isApiModalOpen}
            onClose={() => setIsApiModalOpen(false)}
          />

          <style>{`
            @keyframes float {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(20px, -20px); }
            }
          `}</style>
        </div>
      </div>
    </BookProvider>
  );
};

export default App;
