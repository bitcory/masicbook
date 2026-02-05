import React from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';
import Dropdown from '../shared/Dropdown';
import MagicButton from '../shared/MagicButton';
import { RATIO_OPTIONS, GENRE_OPTIONS, MOOD_OPTIONS } from '../constants';

const Page2Left: React.FC = () => {
  const { showText, ratio, genre, mood, runtime, storyline, isGeneratingLogline, setRatio, setGenre, setMood, setRuntime, setStoryline, generateLogline } = useBook();
  const [tempRuntime, setTempRuntime] = React.useState(runtime);
  const [isSaved, setIsSaved] = React.useState(false);

  if (!showText) return null;

  const handleSaveRuntime = () => {
    setRuntime(tempRuntime);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const canGenerateScene = !!ratio && !!genre && !!mood && !!storyline.trim() && !!runtime.trim();

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="animate-fade-in">
        <DecorativeBorder />

        <SectionTitle>영상 설정</SectionTitle>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-center font-medium text-amber-300 mt-4 sm:mt-5 mb-4 sm:mb-6"
           style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
          영상의 설정과 스토리를 작성해주세요.
        </p>

        <div className="mb-4 sm:mb-5">
          <label className="block text-xs sm:text-sm md:text-base font-bold text-amber-300 mb-2"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
            스토리 개요
          </label>
          <textarea
            value={storyline}
            onChange={(e) => setStoryline(e.target.value)}
            placeholder="예: 마법학교에 입학한 주인공이 숨겨진 비밀을 발견하고..."
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

        <div className="mb-4 sm:mb-5">
          <label className="block text-xs sm:text-sm md:text-base font-bold text-amber-300 mb-2"
                 style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
            러닝타임 (초)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempRuntime}
              onChange={(e) => setTempRuntime(e.target.value)}
              placeholder="예: 30"
              className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base
                         bg-black/80
                         border-2 border-amber-600/40
                         rounded-lg
                         text-amber-200 font-semibold
                         focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                         shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                         hover:shadow-[0_4px_12px_rgba(251,191,36,0.3)]
                         transition-all duration-200
                         placeholder:text-amber-600/50"
            />
            <button
              onClick={handleSaveRuntime}
              className="px-3 sm:px-4 py-2 rounded-lg
                         text-amber-300 hover:text-amber-200 transition-all duration-300
                         text-xs sm:text-sm font-bold tracking-wider
                         border-2 border-amber-900/60 hover:border-amber-800/80
                         bg-gradient-to-r from-amber-950/70 to-amber-900/60 hover:from-amber-900/80 hover:to-amber-800/70
                         shadow-md hover:shadow-lg"
              style={{ backdropFilter: 'blur(4px)', textShadow: '0 0 10px rgba(251, 191, 36, 0.4), 1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {isSaved ? '✓' : '저장'}
            </button>
          </div>
        </div>

        <Dropdown
          label="비율 선택"
          value={ratio}
          options={RATIO_OPTIONS}
          onChange={setRatio}
          placeholder="비율을 선택하세요"
        />

        <Dropdown
          label="장르 선택"
          value={genre}
          options={GENRE_OPTIONS}
          onChange={setGenre}
          placeholder="장르를 선택하세요"
        />

        <Dropdown
          label="분위기/톤 선택"
          value={mood}
          options={MOOD_OPTIONS}
          onChange={setMood}
          placeholder="분위기를 선택하세요"
        />

        {/* 씬 생성 Button */}
        <div className="mt-4 flex justify-center">
          <MagicButton onClick={generateLogline} disabled={!canGenerateScene || isGeneratingLogline}>
            {isGeneratingLogline ? '생성중...' : '씬 생성'}
          </MagicButton>
        </div>
      </div>
    </div>
  );
};

export default Page2Left;
