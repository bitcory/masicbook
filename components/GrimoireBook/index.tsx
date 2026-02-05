import React from 'react';
import { useBook } from './context/BookContext';
import BookCover from './pages/BookCover';
import Page1Left from './pages/Page1Left';
import Page1Right from './pages/Page1Right';
import Page2Left from './pages/Page2Left';
import Page2Right from './pages/Page2Right';
import Page3Left from './pages/Page3Left';
import Page3Right from './pages/Page3Right';
import Page4Left from './pages/Page4Left';
import Page4Right from './pages/Page4Right';
import PageSurface from './shared/PageSurface';

const GrimoireBook: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const {
    isOpen, isFlipping, flipDirection, currentPage,
    handlePrevPage, handleNextPage,
    selectedStyle, isStarted,
    ratio, genre, mood, storyline, runtime
  } = useBook();

  const canProceedToNext = (() => {
    if (currentPage === 1) return isStarted && !!selectedStyle;
    if (currentPage === 2) return !!ratio && !!genre && !!mood && !!storyline.trim() && !!runtime.trim();
    if (currentPage === 3) return true;
    return false;
  })();

  const showPrev = currentPage > 1 && !isFlipping;
  const showNext = canProceedToNext && !isFlipping;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* 1. Intro Page: Closed Book */}
      <BookCover onOpen={onOpen} />

      {/* 2. Open Page: Inner Grimoire */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform origin-center ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
        }`}
        style={{ perspective: '2500px' }}
      >
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6 gap-1 mx-auto" style={{ maxWidth: '1536px' }}>
          {/* Prev Arrow - absolute positioned outside pages */}
          {showPrev && (
            <button
              onClick={handlePrevPage}
              className="absolute -left-6 sm:-left-8 md:-left-10 top-1/2 -translate-y-1/2 z-20
                         flex items-center justify-center
                         text-amber-600 hover:text-amber-400
                         transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 6px rgba(217, 119, 6, 0.4))' }}
            >
              <svg className="w-10 h-16 sm:w-12 sm:h-20 md:w-14 md:h-24" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Left Page - flips right when going back */}
          <div
            className={`page-container ${isFlipping && flipDirection === 'prev' ? 'flipping-right' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <PageSurface>
              {currentPage === 1 ? <Page1Left /> : currentPage === 2 ? <Page2Left /> : currentPage === 3 ? <Page3Left /> : <Page4Left />}
              {/* Page Number */}
              <div className="mt-auto pt-3 text-center
                              text-amber-500/50 text-base sm:text-lg md:text-xl font-bold tracking-widest"
                   style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.3)' }}>
                - {currentPage} -
              </div>
            </PageSurface>
          </div>

          {/* Right Page - flips left when going forward */}
          <div
            className={`page-container ${isFlipping && flipDirection === 'next' ? 'flipping-left' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <PageSurface>
              {currentPage === 1 ? <Page1Right /> : currentPage === 2 ? <Page2Right /> : currentPage === 3 ? <Page3Right /> : <Page4Right />}
            </PageSurface>
          </div>

          {/* Next Arrow - absolute positioned outside pages */}
          {showNext && (
            <button
              onClick={handleNextPage}
              className="absolute -right-6 sm:-right-8 md:-right-10 top-1/2 -translate-y-1/2 z-20
                         flex items-center justify-center
                         text-amber-600 hover:text-amber-400
                         transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 6px rgba(217, 119, 6, 0.4))' }}
            >
              <svg className="w-10 h-16 sm:w-12 sm:h-20 md:w-14 md:h-24" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .animate-fade-in {
          animation: fade-in 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .delay-1500 {
          animation-delay: 1.5s;
        }

        .fill-mode-forwards {
          animation-fill-mode: forwards;
        }

        /* Subtle page texture animation */
        @keyframes texture-drift {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 1% 1%; }
        }

        /* Page container for 3D flip */
        .page-container {
          position: relative;
          flex: 1;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s ease-in-out;
        }

        /* Right page flips left (next button) */
        .flipping-left {
          animation: flipLeft 800ms ease-in-out forwards;
          transform-origin: left center;
        }

        /* Left page flips right (prev button) */
        .flipping-right {
          animation: flipRight 800ms ease-in-out forwards;
          transform-origin: right center;
        }

        @keyframes flipLeft {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-180deg);
          }
        }

        @keyframes flipRight {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GrimoireBook;
