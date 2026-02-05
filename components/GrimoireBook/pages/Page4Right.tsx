import React, { useRef } from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';
import ImageModal from '../shared/ImageModal';

const Page4Right: React.FC = () => {
  const {
    showText,
    scenes,
    activeSceneIndex,
    setActiveSceneIndex,
    uploadSceneImage,
    modalImage,
    openImageModal,
    closeImageModal,
  } = useBook();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!showText) return null;

  const scene = scenes[activeSceneIndex];

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      uploadSceneImage(activeSceneIndex, file);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="animate-fade-in flex-1 flex flex-col min-h-0">
        <DecorativeBorder />

        <SectionTitle>씬 이미지</SectionTitle>

        {scene && (
          <div className="flex items-center justify-center gap-2 mt-2 mb-3">
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded">
              씬 {scene.sceneNumber}
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-300"
                  style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.3)' }}>
              {scene.title}
            </span>
          </div>
        )}

        {scene?.isGeneratingImage ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 border-3 border-amber-500/40 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-xs sm:text-sm text-amber-300/70 italic"
               style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.2)' }}>
              이미지를 생성하고 있습니다...
            </p>
          </div>
        ) : scene?.generatedImage ? (
          <div className="flex-1 flex flex-col items-center justify-center p-2">
            <img
              src={`data:${scene.generatedImage.mimeType};base64,${scene.generatedImage.base64Data}`}
              alt={`씬 ${scene.sceneNumber}: ${scene.title}`}
              className="max-w-full max-h-full object-contain rounded-lg border-2 border-amber-600/40
                         cursor-pointer hover:opacity-90 transition-opacity
                         shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              onClick={() =>
                openImageModal({
                  base64Data: scene.generatedImage!.base64Data,
                  mimeType: scene.generatedImage!.mimeType,
                  label: `씬 ${scene.sceneNumber}: ${scene.title}`,
                })
              }
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-4 py-1.5 rounded-lg
                         text-[10px] sm:text-xs font-bold
                         text-amber-300 bg-black/60 border border-amber-600/50
                         hover:bg-amber-900/70 hover:border-amber-500/60
                         transition-all duration-200"
            >
              이미지 변경
            </button>
          </div>
        ) : scene?.error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <svg className="w-10 h-10 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-red-400/70 text-center">{scene.error}</p>
          </div>
        ) : (
          <div
            className="flex-1 flex items-center justify-center cursor-pointer
                       hover:bg-amber-900/10 rounded-lg transition-colors duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center text-amber-400/60 italic text-sm sm:text-base"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.2), 1px 1px 2px rgba(0,0,0,0.5)' }}>
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {scene ? '이미지를 생성하거나\n클릭하여 업로드하세요.' : '씬 데이터가 없습니다.'}
            </div>
          </div>
        )}

        {/* Hidden file input */}
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

        {/* Thumbnail Gallery */}
        {scenes.length > 0 && scenes.some(s => s.generatedImage) && (
          <div className="mt-auto pt-2">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {scenes.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded border cursor-pointer
                             transition-all duration-200 overflow-hidden
                             ${idx === activeSceneIndex ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-amber-900/40 opacity-60 hover:opacity-100'}`}
                  onClick={() => setActiveSceneIndex(idx)}
                >
                  {s.generatedImage ? (
                    <img
                      src={`data:${s.generatedImage.mimeType};base64,${s.generatedImage.base64Data}`}
                      alt={`씬 ${s.sceneNumber}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/60 flex items-center justify-center">
                      <span className="text-[8px] text-amber-500/40">{s.sceneNumber}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageModal image={modalImage} onClose={closeImageModal} />
    </div>
  );
};

export default Page4Right;
