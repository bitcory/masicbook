import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
      <div className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gradient-to-r from-transparent to-amber-600/50"></div>
      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 flex-shrink-0"
          style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.4), 2px 2px 4px rgba(0,0,0,0.6)' }}>
        {children}
      </h3>
      <div className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gradient-to-r from-amber-600/50 to-transparent"></div>
    </div>
  );
};

export default SectionTitle;
