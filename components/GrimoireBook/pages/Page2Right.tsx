import React from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';

const Page2Right: React.FC = () => {
  const { showText, ratio, genre, mood, runtime, storyline, logline, setLogline } = useBook();

  if (!showText) return null;

  // Can proceed if all required fields are filled
  const canProceed = !!ratio && !!genre && !!mood && !!storyline.trim() && !!runtime.trim();

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="animate-fade-in flex-1 flex flex-col min-h-0">
        <DecorativeBorder />

        <SectionTitle>씬별 구성</SectionTitle>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-center font-medium text-amber-300 mt-4 sm:mt-5 mb-4 sm:mb-6"
           style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
          {logline ? '생성된 씬 구성을 확인하세요.' : '좌측에서 씬 생성을 눌러주세요.'}
        </p>

        {logline ? (
          <div className="mb-4">
            <div className="flex items-center justify-end mb-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(logline);
                  alert('복사되었습니다!');
                }}
                className="px-2 sm:px-3 py-1 rounded-md
                           text-amber-300 hover:text-amber-200 transition-all duration-300
                           text-[10px] sm:text-xs font-bold tracking-wider
                           border border-amber-900/60 hover:border-amber-800/80
                           bg-gradient-to-r from-amber-950/70 to-amber-900/60 hover:from-amber-900/80 hover:to-amber-800/70
                           shadow-md hover:shadow-lg"
                style={{ backdropFilter: 'blur(4px)', textShadow: '0 0 10px rgba(251, 191, 36, 0.4), 1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                복사
              </button>
            </div>
            <textarea
              value={logline}
              onChange={(e) => setLogline(e.target.value)}
              className="w-full overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base
                         bg-black/80
                         border-2 border-amber-600/40
                         rounded-lg
                         text-amber-200 font-semibold
                         shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                         resize-none
                         focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                         transition-all duration-200"
              style={{
                height: '550px',
                fontFamily: 'inherit'
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-amber-400/60 italic text-sm sm:text-base"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.2), 1px 1px 2px rgba(0,0,0,0.5)' }}>
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              씬 구성이 생성되면<br />여기에 표시됩니다
            </div>
          </div>
        )}

        <p className="text-[10px] sm:text-xs text-amber-300/70 text-center italic"
           style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.2), 1px 1px 2px rgba(0,0,0,0.5)' }}>
          {canProceed ? '✨ 모든 항목이 입력되었습니다!' : '⚠️ 좌측 설정(러닝타임 포함)과 스토리를 모두 작성해주세요.'}
        </p>
      </div>

    </div>
  );
};

export default Page2Right;
