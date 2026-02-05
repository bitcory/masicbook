import { StyleOption } from './types';

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'realistic', label: '사실적인', imageUrl: 'https://cdn.midjourney.com/6aaee8b8-0f6f-4070-b7d9-9567f5a3e28b/0_2.png' },
  { id: 'pixar', label: '픽사', imageUrl: 'https://cdn.midjourney.com/b973e4c3-0177-4a80-836f-0d45b25df515/0_0.png' },
  { id: 'anime', label: '애니메이션', imageUrl: 'https://cdn.midjourney.com/f54d65c1-6147-493b-9b35-2853689d0864/0_2.png' },
  { id: 'cartoon', label: '만화', imageUrl: 'https://cdn.midjourney.com/6369275a-899f-4f0a-bdb7-8396d3b2c1f7/0_1.png' },
  { id: 'fantasy', label: '판타지', imageUrl: 'https://cdn.midjourney.com/fc06876b-8829-45e4-8bba-8260660f7ee6/0_3.png' },
  { id: 'chibi', label: '치비', imageUrl: 'https://cdn.midjourney.com/de098f54-2ab3-466b-9702-c2fe13d8f897/0_3.png' }
];

export const COVER_IMAGE = '/grimoire-cover.png';

export const TIMING = {
  TEXT_DELAY: 1100,
  TYPEWRITER_TITLE: 120,
  TYPEWRITER_AI: 40,
  AI_DELAY: 500,
} as const;

export const TEXT_STYLES = {
  title: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200',
  titleShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3), 2px 2px 4px rgba(0,0,0,0.8)',
  body: 'text-amber-300',
  bodyShadow: '0 0 10px rgba(251, 191, 36, 0.3), 1px 1px 3px rgba(0,0,0,0.6)',
} as const;

export const RATIO_OPTIONS = [
  { id: '9:16', label: '9:16 (세로 - 쇼츠/릴스용)' },
  { id: '16:9', label: '16:9 (가로 - 유튜브용)' },
  { id: '1:1', label: '1:1 (정사각 - 인스타 피드)' },
  { id: '4:5', label: '4:5 (인스타 세로)' }
];

export const GENRE_OPTIONS = [
  { id: 'fantasy', label: '판타지' },
  { id: 'sf', label: 'SF' },
  { id: 'romance', label: '로맨스' },
  { id: 'thriller', label: '스릴러' },
  { id: 'comedy', label: '코미디' },
  { id: 'daily', label: '일상' },
  { id: 'adventure', label: '모험' }
];

export const MOOD_OPTIONS = [
  { id: 'bright', label: '밝고 경쾌한' },
  { id: 'dark', label: '어둡고 신비로운' },
  { id: 'warm', label: '따뜻하고 감성적인' },
  { id: 'tense', label: '긴장감 있는' },
  { id: 'dreamy', label: '몽환적인' }
];
