import React from 'react';

interface MagicButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: 'arrow-right' | 'arrow-left' | 'home';
  disabled?: boolean;
}

const MagicButton: React.FC<MagicButtonProps> = ({ onClick, children, icon, disabled = false }) => {
  const renderIcon = () => {
    if (!icon) return null;

    const iconClass = "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4";

    switch (icon) {
      case 'arrow-right':
        return (
          <svg className={`${iconClass} transform group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        );
      case 'arrow-left':
        return (
          <svg className={`${iconClass} transform group-hover:-translate-x-1 transition-transform`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        );
      case 'home':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg
                 text-amber-300 hover:text-amber-200 transition-all duration-300
                 text-xs sm:text-sm font-bold tracking-wider uppercase
                 border sm:border-2 border-amber-900/60 hover:border-amber-800/80
                 bg-gradient-to-r from-amber-950/70 to-amber-900/60 hover:from-amber-900/80 hover:to-amber-800/70
                 shadow-md sm:shadow-lg hover:shadow-xl
                 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      style={{ backdropFilter: 'blur(4px)', textShadow: '0 0 10px rgba(251, 191, 36, 0.4), 1px 1px 2px rgba(0,0,0,0.8)' }}
    >
      {icon === 'arrow-left' || icon === 'home' ? renderIcon() : null}
      {children}
      {icon === 'arrow-right' ? renderIcon() : null}
    </button>
  );
};

export default MagicButton;
