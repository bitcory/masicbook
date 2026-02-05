import React from 'react';
import { STYLE_OPTIONS } from '../constants';

interface StylePreviewProps {
  selectedStyle: string;
}

const StylePreview: React.FC<StylePreviewProps> = ({ selectedStyle }) => {
  const style = STYLE_OPTIONS.find(s => s.id === selectedStyle);

  if (!style) return null;

  return (
    <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
      <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] aspect-square rounded-lg overflow-hidden
                    shadow-[0_0_20px_rgba(251,191,36,0.3),0_8px_16px_rgba(0,0,0,0.5)]
                    border-2 border-amber-600/40 animate-fade-in">
        <img
          src={style.imageUrl}
          alt={`${style.label} style preview`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default StylePreview;
