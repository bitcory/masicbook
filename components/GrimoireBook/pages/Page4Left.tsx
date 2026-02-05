import React from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';
import MagicButton from '../shared/MagicButton';

const Page4Left: React.FC = () => {
  const {
    showText,
    scenes,
    activeSceneIndex,
    setActiveSceneIndex,
    setSceneImagePrompt,
    generateScenePrompt,
    generateSceneImage,
  } = useBook();

  if (!showText) return null;

  const scene = scenes[activeSceneIndex];
  const totalScenes = scenes.length;

  if (!scene) {
    return (
      <div className="w-full flex-1 flex flex-col">
        <div className="animate-fade-in flex-1 flex items-center justify-center">
          <p className="text-amber-400/60 italic text-sm">
            씬 데이터가 없습니다. 2페이지에서 씬을 먼저 생성해주세요.
          </p>
        </div>
      </div>
    );
  }

  const handleCopyPrompt = () => {
    if (scene.imagePrompt) {
      navigator.clipboard.writeText(scene.imagePrompt);
      alert('프롬프트가 복사되었습니다!');
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="animate-fade-in flex-1 flex flex-col min-h-0">
        <DecorativeBorder />

        <SectionTitle>씬 이미지 생성</SectionTitle>

        {/* Scene Navigation */}
        <div className="flex items-center justify-between mt-3 mb-3 px-1">
          <button
            onClick={() => setActiveSceneIndex(Math.max(0, activeSceneIndex - 1))}
            disabled={activeSceneIndex === 0}
            className="px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg border
                       bg-black/40 text-amber-500/60 border-amber-900/30
                       hover:text-amber-400 hover:bg-amber-950/40
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            &lt; 이전
          </button>

          <select
            value={activeSceneIndex}
            onChange={(e) => setActiveSceneIndex(Number(e.target.value))}
            className="px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border
                       bg-black/60 text-amber-300 border-amber-600/40
                       focus:outline-none cursor-pointer"
          >
            {scenes.map((s, idx) => (
              <option key={idx} value={idx}>
                씬 {s.sceneNumber}: {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveSceneIndex(Math.min(totalScenes - 1, activeSceneIndex + 1))}
            disabled={activeSceneIndex === totalScenes - 1}
            className="px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg border
                       bg-black/40 text-amber-500/60 border-amber-900/30
                       hover:text-amber-400 hover:bg-amber-950/40
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            다음 &gt;
          </button>
        </div>
        <div className="h-px bg-amber-900/40 mb-3" />

        {/* Scene Info */}
        <div className="mb-3 p-2 sm:p-3 rounded-lg border border-amber-900/40 bg-black/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded">
              씬 {scene.sceneNumber}
            </span>
            <span className="text-[10px] text-amber-500/60">{scene.timeRange}</span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-amber-300 mb-1"
              style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.3)' }}>
            {scene.title}
          </h4>
          <p className="text-[10px] sm:text-xs text-amber-200/70 leading-relaxed whitespace-pre-wrap">
            {scene.content}
          </p>
        </div>

        {/* Image Prompt */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs sm:text-sm font-bold text-amber-300"
                   style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.3)' }}>
              이미지 프롬프트
            </label>
            <div className="flex gap-1">
              {scene.imagePrompt && (
                <button
                  onClick={handleCopyPrompt}
                  className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold
                             text-amber-300 border border-amber-900/60
                             bg-gradient-to-r from-amber-950/70 to-amber-900/60
                             hover:from-amber-900/80 hover:to-amber-800/70
                             transition-all duration-200"
                >
                  복사
                </button>
              )}
              <button
                onClick={() => generateScenePrompt(activeSceneIndex)}
                disabled={scene.isGeneratingPrompt}
                className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold
                           text-amber-300 border border-amber-900/60
                           bg-gradient-to-r from-amber-950/70 to-amber-900/60
                           hover:from-amber-900/80 hover:to-amber-800/70
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all duration-200"
              >
                {scene.isGeneratingPrompt ? '생성중...' : 'AI 프롬프트 생성'}
              </button>
            </div>
          </div>
          <textarea
            value={scene.imagePrompt}
            onChange={(e) => setSceneImagePrompt(activeSceneIndex, e.target.value)}
            placeholder="AI 프롬프트 생성 버튼을 누르거나 직접 입력하세요..."
            rows={25}
            className="w-full px-3 py-2 text-[10px] sm:text-xs flex-1 min-h-0
                       bg-black/80 border-2 border-amber-600/40 rounded-lg
                       text-amber-200 font-semibold
                       focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                       resize-none
                       shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                       transition-all duration-200
                       placeholder:text-amber-600/50"
          />
        </div>

        {/* Error */}
        {scene.error && (
          <p className="text-[10px] text-red-400/80 text-center mb-2">{scene.error}</p>
        )}

        {/* Generate Image Button */}
        <MagicButton
          onClick={() => generateSceneImage(activeSceneIndex)}
          disabled={!scene.imagePrompt.trim() || scene.isGeneratingImage}
        >
          {scene.isGeneratingImage ? '이미지 생성중...' : '이미지 생성'}
        </MagicButton>

        {/* Scene Progress */}
        <div className="mt-3 flex justify-center gap-1">
          {scenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSceneIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                idx === activeSceneIndex
                  ? 'bg-amber-400 scale-125'
                  : scenes[idx].generatedImage
                    ? 'bg-amber-600/60'
                    : 'bg-amber-900/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page4Left;
