import React from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';
import ImageModal from '../shared/ImageModal';
import { ViewAngle } from '../types';

const VIEW_LABELS: Record<ViewAngle, string> = {
  front: '정면 풀샷',
  back: '뒷면',
  left: '좌측면',
  right: '우측면',
};

const Page3Right: React.FC = () => {
  const {
    showText,
    generatedViews,
    isGeneratingViews,
    modalImage,
    openImageModal,
    closeImageModal,
    characters,
    activeCharacterIndex,
    setActiveCharacterIndex,
    addCharacter,
    removeCharacter,
  } = useBook();

  if (!showText) return null;

  const hasAnyImage = generatedViews.some(v => v.base64Data);

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="animate-fade-in flex-1 flex flex-col min-h-0">
        <DecorativeBorder />

        <SectionTitle>4방향 뷰</SectionTitle>

        {/* Character Tabs */}
        <div className="flex items-center gap-1 mt-3 mb-3 px-1 overflow-x-auto">
          {characters.map((char, idx) => (
            <div key={char.id} className="relative flex-shrink-0">
              <button
                onClick={() => setActiveCharacterIndex(idx)}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-t-lg border border-b-0 transition-all duration-200 ${
                  activeCharacterIndex === idx
                    ? 'bg-amber-900/60 text-amber-300 border-amber-600/60'
                    : 'bg-black/40 text-amber-500/60 border-amber-900/30 hover:text-amber-400 hover:bg-amber-950/40'
                }`}
                style={{ textShadow: activeCharacterIndex === idx ? '0 0 8px rgba(251, 191, 36, 0.3)' : 'none' }}
              >
                {char.label}
              </button>
              {idx > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeCharacter(idx); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-black/80 text-amber-500/60 hover:text-red-400 border border-amber-900/40 hover:border-red-500/40 text-[8px] leading-none transition-colors"
                >
                  x
                </button>
              )}
            </div>
          ))}
          {characters.length < 4 && (
            <button
              onClick={addCharacter}
              className="flex-shrink-0 px-2.5 py-1.5 text-[10px] sm:text-xs font-bold rounded-t-lg border border-b-0 bg-black/40 text-amber-500/50 border-amber-900/30 hover:text-amber-400 hover:bg-amber-950/40 transition-all duration-200"
            >
              + 추가
            </button>
          )}
        </div>
        <div className="h-px bg-amber-900/40 -mt-[1px] mb-3" />

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-center font-medium text-amber-300 mb-4"
           style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
          {hasAnyImage ? '생성된 캐릭터 뷰를 확인하세요.' : '좌측에서 이미지와 프롬프트를 입력해주세요.'}
        </p>

        {generatedViews.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 min-h-0">
            {generatedViews.map((view) => (
              <div
                key={view.angle}
                className="relative flex flex-col items-center rounded-lg border border-amber-900/40 bg-black/60 overflow-hidden"
              >
                {/* Label */}
                <div className="w-full px-2 py-1 text-center text-[10px] sm:text-xs font-bold text-amber-300 bg-amber-950/60"
                     style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.3)' }}>
                  {VIEW_LABELS[view.angle]}
                </div>

                {/* Content Area */}
                <div className="w-full flex items-center justify-center p-1 sm:p-2">
                  {view.isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-amber-500/40 border-t-amber-400 rounded-full animate-spin" />
                      <span className="text-[10px] text-amber-400/60">생성 중...</span>
                    </div>
                  ) : view.error ? (
                    <div className="text-center px-2">
                      <svg className="w-6 h-6 mx-auto mb-1 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-[10px] text-red-400/70">{view.error}</p>
                    </div>
                  ) : view.base64Data ? (
                    <img
                      src={`data:${view.mimeType};base64,${view.base64Data}`}
                      alt={VIEW_LABELS[view.angle]}
                      className="max-w-full max-h-full object-contain rounded cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() =>
                        openImageModal({
                          base64Data: view.base64Data,
                          mimeType: view.mimeType,
                          label: VIEW_LABELS[view.angle],
                        })
                      }
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-amber-400/60 italic text-sm sm:text-base"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.2), 1px 1px 2px rgba(0,0,0,0.5)' }}>
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              캐릭터 뷰가 생성되면<br />여기에 표시됩니다
            </div>
          </div>
        )}

        {isGeneratingViews && (
          <p className="text-[10px] sm:text-xs text-amber-300/70 text-center italic mt-2"
             style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.2), 1px 1px 2px rgba(0,0,0,0.5)' }}>
            4방향 뷰를 생성하고 있습니다. 잠시만 기다려주세요...
          </p>
        )}
      </div>


      {/* Image Modal */}
      <ImageModal image={modalImage} onClose={closeImageModal} />
    </div>
  );
};

export default Page3Right;
