import React, { useRef } from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';

const Page3Left: React.FC = () => {
  const {
    showText,
    referenceImage,
    characterPrompt,
    isGeneratingViews,
    setReferenceImage,
    clearReferenceImage,
    setCharacterPrompt,
    generateCharacterViews,
    splitGridToViews,
    characters,
    activeCharacterIndex,
    setActiveCharacterIndex,
    addCharacter,
    removeCharacter,
  } = useBook();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  if (!showText) return null;

  const canGenerate = !!referenceImage;

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setReferenceImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add('border-amber-400');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-amber-400');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-amber-400');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="animate-fade-in flex-1 flex flex-col min-h-0">
        <DecorativeBorder />

        <SectionTitle>캐릭터 뷰 생성</SectionTitle>

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
          참조 이미지와 프롬프트를 입력하세요.
        </p>

        {/* Image Upload Area */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-xs sm:text-sm md:text-base font-bold text-amber-300 mb-2"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
            참조 이미지
          </label>

          {referenceImage ? (
            <div className="relative">
              <img
                src={`data:${referenceImage.mimeType};base64,${referenceImage.base64Data}`}
                alt="참조 이미지"
                className="w-full max-h-48 object-contain rounded-lg border-2 border-amber-600/40 bg-black/80"
              />
              <button
                onClick={clearReferenceImage}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center
                           bg-black/70 hover:bg-red-900/70 text-amber-300 hover:text-red-300
                           rounded-full border border-amber-900/60 hover:border-red-700/60
                           transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-[10px] sm:text-xs text-amber-400/60 mt-1 text-center truncate">
                {referenceImage.fileName}
              </p>
            </div>
          ) : (
            <div
              ref={dropZoneRef}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="w-full h-40 sm:h-48 flex flex-col items-center justify-center cursor-pointer
                         bg-black/80 border-2 border-dashed border-amber-600/40
                         rounded-lg hover:border-amber-500/60
                         transition-all duration-200"
            >
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs sm:text-sm text-amber-400/60 font-medium">클릭 또는 드래그하여 업로드</p>
              <p className="text-[10px] text-amber-500/40 mt-1">PNG, JPG, WEBP</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = '';
            }}
          />
        </div>

        {/* Prompt Input */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-xs sm:text-sm md:text-base font-bold text-amber-300 mb-2"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
            캐릭터 설명 프롬프트
          </label>
          <textarea
            value={characterPrompt}
            onChange={(e) => setCharacterPrompt(e.target.value)}
            placeholder="예: 금발 머리의 여성 기사, 은색 갑옷을 입고 있음"
            rows={3}
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base
                       bg-black/80
                       border-2 border-amber-600/40
                       rounded-lg
                       text-amber-200 font-semibold
                       focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                       resize-none
                       shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                       hover:shadow-[0_4px_12px_rgba(251,191,36,0.3)]
                       transition-all duration-200
                       placeholder:text-amber-600/50"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateCharacterViews}
          disabled={!canGenerate || isGeneratingViews}
          className="w-full px-4 py-3 rounded-lg
                     text-amber-300 hover:text-amber-200 transition-all duration-300
                     text-xs sm:text-sm font-bold tracking-wider
                     border-2 border-amber-900/60 hover:border-amber-800/80
                     bg-gradient-to-r from-amber-950/70 to-amber-900/60 hover:from-amber-900/80 hover:to-amber-800/70
                     shadow-md hover:shadow-lg hover:shadow-amber-900/30
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backdropFilter: 'blur(4px)',
            textShadow: '0 0 10px rgba(251, 191, 36, 0.4), 1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          {isGeneratingViews ? '생성 중...' : '캐릭터 생성'}
        </button>

        {/* Grid Split Button */}
        <button
          onClick={splitGridToViews}
          disabled={!referenceImage || isGeneratingViews}
          className="w-full mt-2 px-4 py-3 rounded-lg
                     text-amber-300 hover:text-amber-200 transition-all duration-300
                     text-xs sm:text-sm font-bold tracking-wider
                     border-2 border-amber-900/60 hover:border-amber-800/80
                     bg-gradient-to-r from-amber-950/50 to-amber-900/40 hover:from-amber-900/60 hover:to-amber-800/50
                     shadow-md hover:shadow-lg hover:shadow-amber-900/30
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backdropFilter: 'blur(4px)',
            textShadow: '0 0 10px rgba(251, 191, 36, 0.4), 1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          그리드 분할
        </button>
      </div>

    </div>
  );
};

export default Page3Left;
