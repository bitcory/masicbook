import React from 'react';
import { useBook } from '../context/BookContext';
import DecorativeBorder from '../shared/DecorativeBorder';
import SectionTitle from '../shared/SectionTitle';
import Typewriter from '../../Typewriter';

const Page1Left: React.FC = () => {
  const { showText, currentPage, aiContent, isLoadingAi } = useBook();

  if (!showText) return null;

  return (
    <div className="w-full flex-1 flex flex-col">
      {currentPage === 1 ? (
        <>
          <DecorativeBorder />

          <div className="text-center">
            <Typewriter
              text="TB의 마법서에 오신걸 환영합니다."
              className="magic-font text-base sm:text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-black mt-2 sm:mt-3 mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight"
              style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3), 2px 2px 4px rgba(0,0,0,0.8)' }}
              speed={120}
            />
          </div>

          <SectionTitle>상상의 정원</SectionTitle>

          <div className="text-xs sm:text-sm md:text-base leading-loose text-center font-medium text-amber-300 mt-4 sm:mt-5 mb-3 sm:mb-4 space-y-2"
            style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
            <p>마법서가 당신을 위해 깨어났습니다.</p>
            <p>이 낡은 양피지 위에는 당신이 꿈꾸는 모든 조각들이</p>
            <p>문장이 되어 새겨질 것입니다.</p>
            <div className="h-2"></div>
            <p>망설이지 말고 마법의 지팡이를 사용하여</p>
            <p>다음 장에 펼쳐질 이야기를 소환해보세요.</p>
          </div>

          {/* Intro Image */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <img
              src="https://cdn.midjourney.com/90f63904-ed1d-434e-a929-c025c5008d51/0_3.png"
              alt="Magic Book Illustration"
              className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] h-auto rounded-lg shadow-lg"
            />
          </div>

          {aiContent && (
            <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-amber-600/30 animate-fade-in">
              <Typewriter
                text={aiContent}
                className="text-xs sm:text-sm md:text-base text-amber-300 italic leading-relaxed font-semibold font-serif"
                style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}
                speed={40}
                delay={500}
              />
            </div>
          )}

          {isLoadingAi && (
            <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
              <span className="text-amber-300 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>Invoking...</span>
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full animate-bounce shadow-lg"></div>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s] shadow-lg"></div>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s] shadow-lg"></div>
              </div>
            </div>
          )}

        </>
      ) : (
        <>
          <div className="animate-fade-in text-center">
            <DecorativeBorder />

            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-black mb-2 sm:mb-3 leading-tight tracking-tight"
              style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3), 2px 2px 4px rgba(0,0,0,0.8)' }}>
              페이지 {currentPage}
            </h2>

            <div className="w-8 sm:w-12 h-[2px] bg-gradient-to-r from-amber-600/60 to-transparent mb-1 sm:mb-2 mx-auto"></div>

            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="w-4 sm:w-6 h-[1px] sm:h-[2px] bg-gradient-to-r from-amber-600/50 to-transparent"></div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 flex-shrink-0"
                style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.4), 2px 2px 4px rgba(0,0,0,0.6)' }}>
                마법의 지식
              </h3>
              <div className="flex-1 h-[1px] sm:h-[2px] bg-gradient-to-r from-transparent to-amber-600/50"></div>
            </div>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed font-medium text-amber-300"
              style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)' }}>
              새로운 장이 펼쳐집니다...
              <br /><br />
              이곳은 {currentPage}번째 장입니다.
              <br /><br />
              앞으로 더 많은 마법과 신비로운 이야기들이 이 페이지들을 채워나갈 것입니다.
            </p>
          </div>

        </>
      )}
    </div>
  );
};

export default Page1Left;
