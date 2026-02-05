import React from 'react';
import { ModalImage } from '../types';

interface ImageModalProps {
  image: ModalImage | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.base64Data}`;
    link.download = `${image.label}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
         onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a130a] via-[#0f0a05] to-black rounded-2xl shadow-[0_20px_60px_rgba(251,191,36,0.3)] p-5 sm:p-6 border-2 border-amber-900/40"
           onClick={(e) => e.stopPropagation()}
           style={{
             boxShadow: `
               0 0 40px rgba(251, 191, 36, 0.25),
               0 20px 60px rgba(0,0,0,0.9),
               inset 0 0 60px rgba(251, 191, 36, 0.08)
             `
           }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-all duration-200 rounded-full hover:bg-amber-900/30 border border-amber-900/40 hover:border-amber-800/60 z-10"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Label */}
        <h3 className="text-lg sm:text-xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"
            style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)', fontFamily: 'serif' }}>
          {image.label}
        </h3>

        {/* Image */}
        <div className="flex justify-center mb-4">
          <img
            src={`data:${image.mimeType};base64,${image.base64Data}`}
            alt={image.label}
            className="max-w-full rounded-lg border border-amber-900/30 shadow-lg"
            style={{ maxHeight: '60vh' }}
          />
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 text-sm font-bold tracking-wide
                       bg-gradient-to-r from-amber-900/70 to-amber-800/70
                       hover:from-amber-800/80 hover:to-amber-700/80
                       text-amber-200 hover:text-amber-100
                       border-2 border-amber-700/50 hover:border-amber-600/70
                       rounded-lg
                       shadow-lg hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]
                       transition-all duration-300 flex items-center gap-2"
            style={{
              backdropFilter: 'blur(4px)',
              textShadow: '0 0 10px rgba(251, 191, 36, 0.5), 1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            다운로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
