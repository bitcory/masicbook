import React from 'react';
import { STYLE_OPTIONS } from '../constants';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelect: (styleId: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8">
      {STYLE_OPTIONS.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`group relative p-2 sm:p-3 rounded-lg transition-all duration-300
                   text-xs sm:text-sm font-bold
                   border-2 ${selectedStyle === style.id
                     ? 'border-amber-500 bg-amber-900/60'
                     : 'border-amber-900/40 bg-amber-950/30 hover:border-amber-700/60 hover:bg-amber-900/40'
                   }
                   shadow-md hover:shadow-lg transform hover:scale-105`}
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <span className="text-amber-300 text-center leading-tight block"
                style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.3), 1px 1px 2px rgba(0,0,0,0.8)' }}>
            {style.label}
          </span>
          {selectedStyle === style.id && (
            <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 rounded-full border border-white shadow-lg"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
