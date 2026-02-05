import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookContextValue, GrimoireBookProps, CharacterData, GeneratedViewImage, ModalImage, ViewAngle, SaveData, SceneData } from '../types';
import { generateLogline as generateLoglineService, generateCharacterGridSheet, generateSceneImagePrompt, generateSceneImage as generateSceneImageService, CharacterViewRef } from '../../../services/geminiService';

const BookContext = createContext<BookContextValue | undefined>(undefined);

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within BookProvider');
  }
  return context;
};

const DEFAULT_CHARACTERS: CharacterData[] = [
  { id: 'protagonist', label: '주인공', referenceImage: null, characterPrompt: '', generatedViews: [], isGeneratingViews: false },
  { id: 'supporting-1', label: '조연 1', referenceImage: null, characterPrompt: '', generatedViews: [], isGeneratingViews: false },
];

interface BookProviderProps extends GrimoireBookProps {
  children: React.ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({
  children,
  isOpen,
  onClose,
  aiContent,
  isLoadingAi
}) => {
  const [showText, setShowText] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [ratio, setRatio] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [storyline, setStoryline] = useState<string>('');
  const [runtime, setRuntime] = useState<string>('');
  const [logline, setLogline] = useState<string>('');
  const [isGeneratingLogline, setIsGeneratingLogline] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });

  // Page 3 - multi character states
  const [characters, setCharacters] = useState<CharacterData[]>(DEFAULT_CHARACTERS.map(c => ({ ...c })));
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [modalImage, setModalImage] = useState<ModalImage | null>(null);

  // Page 4 - scene states
  const [scenes, setScenes] = useState<SceneData[]>([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Active character derived values
  const activeChar = characters[activeCharacterIndex] || characters[0];

  // Show text after 1.1s when book opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowText(true), 1100);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isOpen]);

  // Helper to update a specific character
  const updateCharacter = (index: number, updates: Partial<CharacterData>) => {
    setCharacters(prev => prev.map((c, i) => i === index ? { ...c, ...updates } : c));
  };

  const handleNextPage = () => {
    if (isFlipping) return;

    if (currentPage === 1 && selectedStyle) {
      localStorage.setItem('storyStyle', selectedStyle);
    }

    if (currentPage === 2) {
      localStorage.setItem('storyRatio', ratio);
      localStorage.setItem('storyGenre', genre);
      localStorage.setItem('storyMood', mood);
      localStorage.setItem('storyStoryline', storyline);
      localStorage.setItem('storyRuntime', runtime);
      localStorage.setItem('storyLogline', logline);
    }

    // Parse logline into scenes when moving to page 4
    if (currentPage === 3 && logline && scenes.length === 0) {
      const parsed = parseLoglineToScenes(logline);
      if (parsed.length > 0) {
        setScenes(parsed);
        setActiveSceneIndex(0);
      }
    }

    setIsFlipping(true);
    setFlipDirection('next');

    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 800);
  };

  const handlePrevPage = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setFlipDirection('prev');

    setTimeout(() => {
      setCurrentPage(prev => Math.max(1, prev - 1));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 800);
  };

  const handleGoHome = () => {
    setCurrentPage(1);
    setIsStarted(false);
    setSelectedStyle('');
    setRatio('');
    setGenre('');
    setMood('');
    setStoryline('');
    setRuntime('');
    setLogline('');
    setCharacters(DEFAULT_CHARACTERS.map(c => ({ ...c })));
    setActiveCharacterIndex(0);
    setModalImage(null);
    setScenes([]);
    setActiveSceneIndex(0);
    setShowText(false);
    onClose();
  };

  const generateLogline = async () => {
    if (!storyline.trim() || !genre || !mood || !runtime.trim()) {
      alert('모든 항목을 입력해주세요. (러닝타임 포함)');
      return;
    }

    setIsGeneratingLogline(true);
    try {
      const result = await generateLoglineService(storyline, genre, mood, runtime);
      setLogline(result);
    } catch (error) {
      console.error('Failed to generate logline:', error);
      setLogline('씬 구성 생성에 실패했습니다.');
    } finally {
      setIsGeneratingLogline(false);
    }
  };

  // Page 3 actions - operate on active character
  const setReferenceImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      updateCharacter(activeCharacterIndex, {
        referenceImage: {
          base64Data,
          mimeType: file.type,
          fileName: file.name,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const clearReferenceImage = () => {
    updateCharacter(activeCharacterIndex, { referenceImage: null });
  };

  const setCharacterPrompt = (prompt: string) => {
    updateCharacter(activeCharacterIndex, { characterPrompt: prompt });
  };

  const generateCharacterViews = async () => {
    const char = characters[activeCharacterIndex];
    if (!char.referenceImage) {
      alert('참조 이미지를 먼저 업로드해주세요.');
      return;
    }

    const angles: ViewAngle[] = ['front', 'back', 'left', 'right'];
    const idx = activeCharacterIndex;

    updateCharacter(idx, {
      isGeneratingViews: true,
      generatedViews: angles.map(angle => ({
        angle,
        base64Data: '',
        mimeType: '',
        isLoading: true,
        error: null,
      })),
    });

    try {
      // 1. 2x2 그리드 캐릭터 시트 생성
      const gridResult = await generateCharacterGridSheet(
        char.referenceImage.base64Data,
        char.referenceImage.mimeType,
        char.characterPrompt
      );

      // 2. 그리드 이미지를 4개로 분할
      const img = new Image();
      img.src = `data:${gridResult.mimeType};base64,${gridResult.base64Data}`;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('이미지 로드 실패'));
      });

      const halfW = Math.floor(img.width / 2);
      const halfH = Math.floor(img.height / 2);

      // 그리드 배치: top-left=front, top-right=back, bottom-left=left, bottom-right=right
      const quadrants: { angle: ViewAngle; sx: number; sy: number }[] = [
        { angle: 'front', sx: 0, sy: 0 },
        { angle: 'back', sx: halfW, sy: 0 },
        { angle: 'left', sx: 0, sy: halfH },
        { angle: 'right', sx: halfW, sy: halfH },
      ];

      const views: GeneratedViewImage[] = [];

      for (const q of quadrants) {
        const canvas = document.createElement('canvas');
        canvas.width = halfW;
        canvas.height = halfH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 생성 실패');

        ctx.drawImage(img, q.sx, q.sy, halfW, halfH, 0, 0, halfW, halfH);
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.split(',')[1];

        views.push({
          angle: q.angle,
          base64Data,
          mimeType: 'image/png',
          isLoading: false,
          error: null,
        });
      }

      updateCharacter(idx, {
        generatedViews: views,
        isGeneratingViews: false,
      });
    } catch (error: any) {
      updateCharacter(idx, {
        generatedViews: angles.map(angle => ({
          angle,
          base64Data: '',
          mimeType: '',
          isLoading: false,
          error: error.message || '생성 실패',
        })),
        isGeneratingViews: false,
      });
    }
  };

  // Grid split: 참조 이미지를 2x2로 분할하여 4방향 뷰에 할당
  const splitGridToViews = async () => {
    const char = characters[activeCharacterIndex];
    if (!char.referenceImage) {
      alert('참조 이미지를 먼저 업로드해주세요.');
      return;
    }

    const idx = activeCharacterIndex;
    const angles: ViewAngle[] = ['front', 'back', 'left', 'right'];

    updateCharacter(idx, {
      isGeneratingViews: true,
      generatedViews: angles.map(angle => ({
        angle,
        base64Data: '',
        mimeType: '',
        isLoading: true,
        error: null,
      })),
    });

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('이미지 로드 실패'));
        img.src = `data:${char.referenceImage!.mimeType};base64,${char.referenceImage!.base64Data}`;
      });

      const halfW = Math.floor(img.width / 2);
      const halfH = Math.floor(img.height / 2);

      // 2x2 grid: top-left=front, top-right=back, bottom-left=left, bottom-right=right
      const quadrants: { angle: ViewAngle; sx: number; sy: number }[] = [
        { angle: 'front', sx: 0, sy: 0 },
        { angle: 'back', sx: halfW, sy: 0 },
        { angle: 'left', sx: 0, sy: halfH },
        { angle: 'right', sx: halfW, sy: halfH },
      ];

      const views: GeneratedViewImage[] = quadrants.map(({ angle, sx, sy }) => {
        const canvas = document.createElement('canvas');
        canvas.width = halfW;
        canvas.height = halfH;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, sx, sy, halfW, halfH, 0, 0, halfW, halfH);
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.split(',')[1];
        return {
          angle,
          base64Data,
          mimeType: 'image/png',
          isLoading: false,
          error: null,
        };
      });

      updateCharacter(idx, {
        generatedViews: views,
        isGeneratingViews: false,
      });
    } catch (error: any) {
      updateCharacter(idx, {
        generatedViews: angles.map(angle => ({
          angle,
          base64Data: '',
          mimeType: '',
          isLoading: false,
          error: error.message || '그리드 분할 실패',
        })),
        isGeneratingViews: false,
      });
    }
  };

  // Page 4 - scene functions
  const parseLoglineToScenes = (text: string): SceneData[] => {
    const sceneBlocks = text.split(/[═]{3,}/).filter(b => b.trim());
    const parsed: SceneData[] = [];
    for (const block of sceneBlocks) {
      const titleMatch = block.match(/씬\s*(\d+)\s*[:：]\s*(.+)/);
      const timeMatch = block.match(/시간\s*[:：]\s*(.+)/);
      if (!titleMatch) continue;
      const sceneNumber = parseInt(titleMatch[1]);
      const title = titleMatch[2].trim();
      const timeRange = timeMatch ? timeMatch[1].trim() : '';
      // Content: everything after the ──── line
      const contentParts = block.split(/[─]{3,}/);
      const content = contentParts.length > 1 ? contentParts[1].trim() : block.trim();
      parsed.push({
        sceneNumber,
        title,
        timeRange,
        content,
        imagePrompt: '',
        generatedImage: null,
        isGeneratingPrompt: false,
        isGeneratingImage: false,
        error: null,
      });
    }
    return parsed;
  };

  const updateScene = (index: number, updates: Partial<SceneData>) => {
    setScenes(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  const handleGenerateScenePrompt = async (index: number) => {
    const scene = scenes[index];
    if (!scene) return;
    updateScene(index, { isGeneratingPrompt: true, error: null });
    try {
      // 씬1의 프롬프트를 스타일 레퍼런스로 전달 (씬1 자신은 제외)
      const scene1Prompt = index > 0 ? scenes[0]?.imagePrompt || undefined : undefined;
      // 모든 캐릭터의 생성된 뷰 이미지를 수집 (프롬프트 생성에도 이미지 레퍼런스 전달)
      const charViews: CharacterViewRef[] = [];
      for (const char of characters) {
        for (const view of char.generatedViews) {
          if (view.base64Data && !view.error) {
            charViews.push({
              angle: `${char.label}-${view.angle}`,
              base64Data: view.base64Data,
              mimeType: view.mimeType,
            });
          }
        }
      }
      const prompt = await generateSceneImagePrompt(
        `Scene ${scene.sceneNumber}: ${scene.title}\n${scene.content}`,
        selectedStyle,
        ratio,
        genre,
        mood,
        scene1Prompt,
        charViews.length > 0 ? charViews : undefined
      );
      updateScene(index, { imagePrompt: prompt, isGeneratingPrompt: false });
    } catch (error: any) {
      updateScene(index, { isGeneratingPrompt: false, error: error.message || '프롬프트 생성 실패' });
    }
  };

  const handleGenerateSceneImage = async (index: number) => {
    const scene = scenes[index];
    if (!scene || !scene.imagePrompt.trim()) return;
    updateScene(index, { isGeneratingImage: true, error: null });
    try {
      // 모든 캐릭터의 생성된 뷰 이미지를 수집하여 레퍼런스로 전달
      const charViews: CharacterViewRef[] = [];
      for (const char of characters) {
        for (const view of char.generatedViews) {
          if (view.base64Data && !view.error) {
            charViews.push({
              angle: `${char.label}-${view.angle}`,
              base64Data: view.base64Data,
              mimeType: view.mimeType,
            });
          }
        }
      }

      // 씬1의 생성 이미지를 스타일 레퍼런스로 전달 (씬1 자신은 제외)
      const scene1Image = index > 0 ? scenes[0]?.generatedImage || null : null;
      const result = await generateSceneImageService(scene.imagePrompt, ratio, charViews, scene1Image);
      updateScene(index, { generatedImage: result, isGeneratingImage: false });
      // 생성 완료 후 모달로 이미지 표시
      setModalImage({
        base64Data: result.base64Data,
        mimeType: result.mimeType,
        label: `씬 ${scene.sceneNumber}: ${scene.title}`,
      });
    } catch (error: any) {
      updateScene(index, { isGeneratingImage: false, error: error.message || '이미지 생성 실패' });
    }
  };

  const setSceneImagePrompt = (index: number, prompt: string) => {
    updateScene(index, { imagePrompt: prompt });
  };

  const uploadSceneImage = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      updateScene(index, {
        generatedImage: { base64Data, mimeType: file.type },
        error: null,
      });
    };
    reader.readAsDataURL(file);
  };

  // Multi-character management
  const addCharacter = () => {
    if (characters.length >= 4) return;
    const nextNum = characters.length;
    setCharacters(prev => [
      ...prev,
      {
        id: `supporting-${nextNum}`,
        label: `조연 ${nextNum}`,
        referenceImage: null,
        characterPrompt: '',
        generatedViews: [],
        isGeneratingViews: false,
      },
    ]);
  };

  const removeCharacter = (index: number) => {
    if (index === 0) return; // 주인공은 삭제 불가
    setCharacters(prev => {
      const next = prev.filter((_, i) => i !== index);
      // Re-label supporting characters
      return next.map((c, i) => {
        if (i === 0) return c;
        return { ...c, id: `supporting-${i}`, label: `조연 ${i}` };
      });
    });
    if (activeCharacterIndex >= characters.length - 1) {
      setActiveCharacterIndex(Math.max(0, characters.length - 2));
    }
  };

  const openImageModal = (image: ModalImage) => {
    setModalImage(image);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const exportData = () => {
    const data: SaveData = {
      selectedStyle,
      ratio,
      genre,
      mood,
      storyline,
      runtime,
      logline,
      characters: characters.map(c => ({
        id: c.id,
        label: c.label,
        characterPrompt: c.characterPrompt,
        referenceImage: c.referenceImage,
        generatedViews: c.generatedViews
          .filter(v => v.base64Data)
          .map(v => ({ angle: v.angle, base64Data: v.base64Data, mimeType: v.mimeType })),
      })),
      scenes: scenes.map(s => ({
        sceneNumber: s.sceneNumber,
        title: s.title,
        timeRange: s.timeRange,
        content: s.content,
        imagePrompt: s.imagePrompt,
        generatedImage: s.generatedImage,
      })),
      currentPage,
      isStarted,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grimoire-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (data: SaveData) => {
    setSelectedStyle(data.selectedStyle ?? '');
    setRatio(data.ratio ?? '');
    setGenre(data.genre ?? '');
    setMood(data.mood ?? '');
    setStoryline(data.storyline ?? '');
    setRuntime(data.runtime ?? '');
    setLogline(data.logline ?? '');
    setCurrentPage(data.currentPage ?? 1);
    setIsStarted(data.isStarted ?? false);

    // Import characters
    if (data.characters && data.characters.length > 0) {
      setCharacters(data.characters.map(c => ({
        id: c.id,
        label: c.label,
        referenceImage: c.referenceImage ?? null,
        characterPrompt: c.characterPrompt ?? '',
        generatedViews: (c.generatedViews ?? []).map(v => ({
          angle: v.angle,
          base64Data: v.base64Data,
          mimeType: v.mimeType,
          isLoading: false,
          error: null,
        })),
        isGeneratingViews: false,
      })));
      setActiveCharacterIndex(0);
    }

    // Import scenes
    if (data.scenes && data.scenes.length > 0) {
      setScenes(data.scenes.map(s => ({
        ...s,
        isGeneratingPrompt: false,
        isGeneratingImage: false,
        error: null,
      })));
      setActiveSceneIndex(0);
    }

    if (data.selectedStyle) localStorage.setItem('storyStyle', data.selectedStyle);
    if (data.ratio) localStorage.setItem('storyRatio', data.ratio);
    if (data.genre) localStorage.setItem('storyGenre', data.genre);
    if (data.mood) localStorage.setItem('storyMood', data.mood);
    if (data.storyline) localStorage.setItem('storyStoryline', data.storyline);
    if (data.runtime) localStorage.setItem('storyRuntime', data.runtime);
    if (data.logline) localStorage.setItem('storyLogline', data.logline);
  };

  const value: BookContextValue = {
    showText,
    currentPage,
    selectedStyle,
    isStarted,
    isOpen,
    aiContent,
    isLoadingAi,
    isFlipping,
    flipDirection,
    ratio,
    genre,
    mood,
    storyline,
    runtime,
    logline,
    isGeneratingLogline,
    apiKey,
    setSelectedStyle,
    setIsStarted,
    setRatio,
    setGenre,
    setMood,
    setStoryline,
    setRuntime,
    setLogline,
    setApiKey,
    handleNextPage,
    handlePrevPage,
    handleGoHome,
    generateLogline,
    // Page 3 - multi character
    characters,
    activeCharacterIndex,
    setActiveCharacterIndex,
    addCharacter,
    removeCharacter,
    // Active character shortcuts
    referenceImage: activeChar.referenceImage,
    characterPrompt: activeChar.characterPrompt,
    generatedViews: activeChar.generatedViews,
    isGeneratingViews: activeChar.isGeneratingViews,
    modalImage,
    setReferenceImage,
    clearReferenceImage,
    setCharacterPrompt,
    generateCharacterViews,
    splitGridToViews,
    openImageModal,
    closeImageModal,
    // Page 4 - scenes
    scenes,
    activeSceneIndex,
    setActiveSceneIndex,
    setSceneImagePrompt,
    uploadSceneImage,
    generateScenePrompt: handleGenerateScenePrompt,
    generateSceneImage: handleGenerateSceneImage,
    exportData,
    importData,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
