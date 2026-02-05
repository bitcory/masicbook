import React from 'react';

interface PageSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

const PageSurface: React.FC<PageSurfaceProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full h-full max-h-[92vh] sm:max-h-[88vh] md:max-h-[85vh] rounded-xl sm:rounded-2xl overflow-hidden
                    shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_0_1px_rgba(45,31,23,0.3)]
                    ring-1 ring-[#2d1f17]/20 ${className}`}>
      {/* Main Page Surface */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4c5ab] via-[#c9b59a] to-[#a89070]"
           style={{
             backgroundImage: `
               radial-gradient(circle at 8% 12%, rgba(139, 115, 85, 0.12) 0%, transparent 25%),
               radial-gradient(circle at 92% 18%, rgba(101, 67, 33, 0.09) 0%, transparent 20%),
               radial-gradient(circle at 15% 75%, rgba(139, 115, 85, 0.08) 0%, transparent 22%),
               radial-gradient(circle at 88% 82%, rgba(101, 67, 33, 0.1) 0%, transparent 25%),
               radial-gradient(circle at 45% 35%, rgba(101, 67, 33, 0.04) 0%, transparent 30%),
               radial-gradient(circle at 70% 55%, rgba(139, 115, 85, 0.05) 0%, transparent 25%),
               radial-gradient(ellipse at 0% 50%, rgba(60, 40, 25, 0.35) 0%, transparent 12%),
               radial-gradient(ellipse at 100% 50%, rgba(60, 40, 25, 0.35) 0%, transparent 12%),
               radial-gradient(ellipse at 50% 0%, rgba(70, 45, 30, 0.25) 0%, transparent 15%),
               radial-gradient(ellipse at 50% 100%, rgba(70, 45, 30, 0.25) 0%, transparent 15%),
               repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(101, 67, 33, 0.02) 2px, rgba(101, 67, 33, 0.02) 3px),
               repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(101, 67, 33, 0.02) 2px, rgba(101, 67, 33, 0.02) 3px)
             `,
             boxShadow: `
               inset 25px 0 60px rgba(60, 40, 25, 0.45),
               inset -25px 0 60px rgba(60, 40, 25, 0.45),
               inset 0 25px 60px rgba(60, 40, 25, 0.35),
               inset 0 -25px 60px rgba(60, 40, 25, 0.35)
             `
           }}></div>

      {/* Decorative Border */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             border: '1px solid rgba(101, 67, 33, 0.15)',
             boxShadow: 'inset 0 0 0 1px rgba(180, 140, 100, 0.1)'
           }}></div>

      {/* Page Content with custom scrollbar */}
      <div className="absolute inset-0 px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 md:py-4 lg:py-5 pb-4 sm:pb-6 flex flex-col overflow-y-auto overflow-x-hidden z-10 custom-scrollbar">
        {children}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(101, 67, 33, 0.1);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(101, 67, 33, 0.3);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(101, 67, 33, 0.5);
        }
      `}</style>
    </div>
  );
};

export default PageSurface;
