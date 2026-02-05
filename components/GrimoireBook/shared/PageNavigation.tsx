import React from 'react';
import { useBook } from '../context/BookContext';
import MagicButton from './MagicButton';

interface PageNavigationProps {
  side: 'left' | 'right';
  canProceed?: boolean;
  rightSlot?: React.ReactNode;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ side, canProceed = true, rightSlot }) => {
  const { currentPage, handleGoHome, handlePrevPage, handleNextPage } = useBook();

  if (side === 'left') {
    return (
      <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 md:px-4 lg:px-5 pb-2 sm:pb-3 md:pb-4 lg:pb-5 z-20">
        {/* Decorative Divider */}
        <div className="w-full h-[1px] sm:h-[2px] bg-gradient-to-r from-amber-700/20 via-amber-700/40 to-amber-700/20 mb-2 sm:mb-3"></div>

        <div className="flex items-center justify-between relative">
          {/* Home Button (Page 1) or Previous Button (Page 2+) */}
          {currentPage === 1 ? (
            <MagicButton onClick={handleGoHome} icon="home">
              홈
            </MagicButton>
          ) : (
            <MagicButton onClick={handlePrevPage} icon="arrow-left">
              이전
            </MagicButton>
          )}

          {/* Page Number Indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest"
               style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.5), 1px 1px 2px rgba(0,0,0,0.6)' }}>
            {currentPage}
          </div>

          {/* Optional right slot */}
          {rightSlot}
        </div>
      </div>
    );
  }

  // Right side navigation
  return (
    <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 md:px-4 lg:px-5 pb-2 sm:pb-3 md:pb-4 lg:pb-5 z-20">
      {/* Decorative Divider */}
      <div className="w-full h-[1px] sm:h-[2px] bg-gradient-to-r from-amber-700/20 via-amber-700/40 to-amber-700/20 mb-2 sm:mb-3"></div>

      <div className="flex items-center justify-end">
        {/* Next Button */}
        <MagicButton onClick={handleNextPage} icon="arrow-right" disabled={!canProceed}>
          다음
        </MagicButton>
      </div>
    </div>
  );
};

export default PageNavigation;
