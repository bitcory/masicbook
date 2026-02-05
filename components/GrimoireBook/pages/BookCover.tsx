import React from 'react';
import { useBook } from '../context/BookContext';
import { COVER_IMAGE } from '../constants';

interface BookCoverProps {
  onOpen: () => void;
}

const BookCover: React.FC<BookCoverProps> = ({ onOpen }) => {
  const { isOpen } = useBook();

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        isOpen ? 'opacity-0 scale-150 pointer-events-none translate-z-[500px]' : 'opacity-100 scale-100'
      }`}
      style={{ perspective: '1000px' }}
    >
      <div className="relative group cursor-pointer select-none h-full flex items-center" onClick={onOpen}>
        {/* Subtle Glow behind the book */}
        <div className="absolute inset-0 bg-amber-500/10 blur-[80px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>

        <img
          src={COVER_IMAGE}
          alt="Magic Grimoire Cover"
          className="max-h-full w-auto shadow-[0_0_100px_rgba(0,0,0,0.9)] rounded-lg relative z-10 transition-transform duration-700 group-hover:scale-[1.01]"
        />

        {/* Invisible Trigger on the Star area */}
        <div className="absolute top-[49%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 z-20 flex items-center justify-center">
          {/* Visual indicator of the star being interactive */}
          <div className="w-24 h-24 rounded-full border border-amber-400/0 group-hover:border-amber-400/40 group-hover:scale-125 transition-all duration-1000 flex items-center justify-center bg-amber-500/0 group-hover:bg-amber-500/5 backdrop-blur-[1px]">
             <div className="w-4 h-4 bg-amber-400 rounded-full blur-[4px] animate-pulse shadow-[0_0_20px_#fbbf24]"></div>
          </div>
          <div className="absolute -bottom-[158px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-amber-500/70 text-xl sm:text-2xl font-light tracking-[0.3em] uppercase">
            Click the star to open
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
