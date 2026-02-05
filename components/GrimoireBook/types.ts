export interface GrimoireBookProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  aiContent?: string;
  isLoadingAi?: boolean;
}

export type StyleId =
  | 'realistic'
  | 'pixar'
  | 'anime'
  | 'watercolor'
  | 'cartoon'
  | 'fantasy'
  | 'oil'
  | 'minimal'
  | 'vintage'
  | 'chibi';

export interface StyleOption {
  id: StyleId;
  label: string;
  imageUrl: string;
}

export interface DropdownOption {
  id: string;
  label: string;
}

export type ViewAngle = 'front' | 'back' | 'left' | 'right';

export interface GeneratedViewImage {
  angle: ViewAngle;
  base64Data: string;
  mimeType: string;
  isLoading: boolean;
  error: string | null;
}

export interface ReferenceImage {
  base64Data: string;
  mimeType: string;
  fileName: string;
}

export interface ModalImage {
  base64Data: string;
  mimeType: string;
  label: string;
}

export interface SceneData {
  sceneNumber: number;
  title: string;
  timeRange: string;
  content: string;
  imagePrompt: string;
  generatedImage: { base64Data: string; mimeType: string } | null;
  isGeneratingPrompt: boolean;
  isGeneratingImage: boolean;
  error: string | null;
}

export interface CharacterData {
  id: string;
  label: string;
  referenceImage: ReferenceImage | null;
  characterPrompt: string;
  generatedViews: GeneratedViewImage[];
  isGeneratingViews: boolean;
}

export interface SaveData {
  selectedStyle: string;
  ratio: string;
  genre: string;
  mood: string;
  storyline: string;
  runtime: string;
  logline: string;
  characters: {
    id: string;
    label: string;
    characterPrompt: string;
    referenceImage: ReferenceImage | null;
    generatedViews: { angle: ViewAngle; base64Data: string; mimeType: string }[];
  }[];
  scenes?: {
    sceneNumber: number;
    title: string;
    timeRange: string;
    content: string;
    imagePrompt: string;
    generatedImage: { base64Data: string; mimeType: string } | null;
  }[];
  currentPage: number;
  isStarted: boolean;
}

export interface BookContextValue {
  showText: boolean;
  currentPage: number;
  selectedStyle: string;
  isStarted: boolean;
  isOpen: boolean;
  aiContent?: string;
  isLoadingAi?: boolean;
  isFlipping: boolean;
  flipDirection: 'next' | 'prev' | null;
  ratio: string;
  genre: string;
  mood: string;
  storyline: string;
  runtime: string;
  logline: string;
  isGeneratingLogline: boolean;
  apiKey: string;
  setSelectedStyle: (style: string) => void;
  setIsStarted: (started: boolean) => void;
  setRatio: (ratio: string) => void;
  setGenre: (genre: string) => void;
  setMood: (mood: string) => void;
  setStoryline: (storyline: string) => void;
  setRuntime: (runtime: string) => void;
  setLogline: (logline: string) => void;
  setApiKey: (key: string) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleGoHome: () => void;
  generateLogline: () => Promise<void>;
  // Page 3 - multi character
  characters: CharacterData[];
  activeCharacterIndex: number;
  setActiveCharacterIndex: (index: number) => void;
  addCharacter: () => void;
  removeCharacter: (index: number) => void;
  // Active character shortcuts
  referenceImage: ReferenceImage | null;
  characterPrompt: string;
  generatedViews: GeneratedViewImage[];
  isGeneratingViews: boolean;
  modalImage: ModalImage | null;
  setReferenceImage: (file: File) => void;
  clearReferenceImage: () => void;
  setCharacterPrompt: (prompt: string) => void;
  generateCharacterViews: () => Promise<void>;
  splitGridToViews: () => Promise<void>;
  openImageModal: (image: ModalImage) => void;
  closeImageModal: () => void;
  // Page 4 - scenes
  scenes: SceneData[];
  activeSceneIndex: number;
  setActiveSceneIndex: (index: number) => void;
  setSceneImagePrompt: (index: number, prompt: string) => void;
  uploadSceneImage: (index: number, file: File) => void;
  generateScenePrompt: (index: number) => Promise<void>;
  generateSceneImage: (index: number) => Promise<void>;
  exportData: () => void;
  importData: (data: SaveData) => void;
}
