import React from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';
import MagicButton from '../shared/MagicButton';
import StyleSelector from '../features/StyleSelector';
import StylePreview from '../features/StylePreview';

const Page1Right: React.FC = () => {
  const { showText, currentPage, isStarted, selectedStyle, setIsStarted, setSelectedStyle } = useBook();

  if (!showText) return null;

  return (
    <div className="w-full flex-1 flex flex-col">
      {currentPage === 1 ? (
        <>
          {isStarted ? (
            <>
              <DecorativeBorder />

              <SectionTitle>스타일 선택</SectionTitle>

              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-justify font-medium text-amber-300 mt-4 sm:mt-5 mb-4 sm:mb-6"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
                당신의 스토리북 스타일을 선택해주세요.
              </p>

              <StyleSelector
                selectedStyle={selectedStyle}
                onSelect={setSelectedStyle}
              />

              {selectedStyle && <StylePreview selectedStyle={selectedStyle} />}

            </>
          ) : (
            <>
              <DecorativeBorder />

              {/* Spacer to match left section title position */}
              <div className="mt-2 sm:mt-3 mb-4 sm:mb-6 md:mb-8"></div>

              <SectionTitle>창작의 시작</SectionTitle>

              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-center font-medium text-amber-300 mt-4 sm:mt-6 mb-4 sm:mb-6"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
                '시작하기' 버튼을 눌러주세요.
              </p>

              <div className="flex-1 flex items-center justify-center -mt-12 sm:-mt-16 md:-mt-20">
                <button
                  onClick={() => setIsStarted(true)}
                  className="group relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full
                           flex items-center justify-center
                           text-amber-300 hover:text-amber-200 transition-all duration-300
                           border-2 sm:border-3 border-amber-900/60 hover:border-amber-800/80
                           bg-gradient-to-br from-amber-950/70 via-amber-900/60 to-amber-950/70
                           hover:from-amber-900/80 hover:via-amber-800/70 hover:to-amber-900/80
                           shadow-lg hover:shadow-2xl hover:shadow-amber-600/30
                           hover:scale-110 transform"
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="animate-fade-in text-center">
            <DecorativeBorder />

            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-black mb-2 sm:mb-3 leading-tight tracking-tight"
                style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3), 2px 2px 4px rgba(0,0,0,0.8)' }}>
              페이지 {currentPage}
            </h2>

            <div className="w-8 sm:w-12 h-[2px] bg-gradient-to-r from-amber-600/60 to-transparent mb-1 sm:mb-2 mx-auto"></div>

            <SectionTitle>마법의 기록</SectionTitle>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium text-amber-300"
               style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
              이 페이지는 당신의 창작물들로 채워질 것입니다...
              <br/><br/>
              {currentPage}번째 장의 마법이 기다리고 있습니다.
            </p>
          </div>

        </>
      )}
    </div>
  );
};

export default Page1Right;
