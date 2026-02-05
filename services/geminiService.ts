
import { GoogleGenAI } from "@google/genai";
import { ViewAngle } from '../components/GrimoireBook/types';

const getApiKey = (): string => {
  return localStorage.getItem('geminiApiKey') || '';
};

export const generateStoryIdea = async (prompt: string): Promise<string> => {
  const API_KEY = getApiKey();
  if (!API_KEY) return "마법의 기운이 부족합니다. (API Key가 설정되지 않았습니다)";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `당신은 판타지 소설 작가를 돕는 마법의 조수입니다. 다음 테마에 맞춰 짧고 신비로운 이야기의 서두를 한 문단으로 작성해주세요: ${prompt}`,
      config: {
        systemInstruction: "한국어로 대답하세요. 문체는 고풍스럽고 신비로워야 합니다.",
        temperature: 0.8,
      }
    });
    return response.text || "침묵이 흐릅니다...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "마법서의 회로에 혼선이 생겼습니다.";
  }
};

export const generateLogline = async (storyline: string, genre: string, mood: string, runtime: string): Promise<string> => {
  const API_KEY = getApiKey();
  if (!API_KEY) return "마법의 기운이 부족합니다. (API Key가 설정되지 않았습니다)";

  const runtimeSeconds = parseInt(runtime) || 60;
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `다음 정보를 바탕으로 영상의 씬별 구성을 작성해주세요.

장르: ${genre}
분위기: ${mood}
러닝타임: ${runtimeSeconds}초
스토리 개요: ${storyline}

요구사항:
1. 각 씬은 정확히 5초입니다. 모든 씬의 길이는 반드시 5초여야 합니다.
2. 총 씬 개수 = 러닝타임 ÷ 5 (예: 30초 → 6개 씬, 60초 → 12개 씬)
3. 각 씬마다 다음 정보를 포함해주세요:
   - 씬 번호와 제목
   - 시간 구간 (예: 0-5초, 5-10초, 10-15초 ...)
   - 씬의 내용 (2-3문장)
   - 주요 장면/액션

출력 형식:
═══════════════════════════════
씬 1: [제목]
시간: 0초-5초 (5초)
───────────────────────────────
[내용 설명]

주요 장면:
• [장면1]
• [장면2]

═══════════════════════════════
씬 2: [제목]
시간: 5초-10초 (5초)
───────────────────────────────
...

이런 식으로 모든 씬을 작성해주세요. 모든 씬은 반드시 정확히 5초입니다.`,
      config: {
        systemInstruction: "한국어로 대답하세요. 위에 제시된 형식대로 정확히 작성해주세요. 중요: 모든 씬은 반드시 정확히 5초입니다. 10초나 15초 씬은 허용되지 않습니다. 각 씬 = 5초.",
        temperature: 0.7,
      }
    });
    return response.text || "씬 구성 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "씬 구성 생성 중 오류가 발생했습니다.";
  }
};

const VIEW_ANGLE_PROMPTS: Record<ViewAngle, string> = {
  front: 'front view, facing directly toward the camera',
  back: 'back view, facing directly away from the camera',
  left: 'left side profile view, facing to the left',
  right: 'right side profile view, facing to the right',
};

export const generateCharacterView = async (
  referenceImageBase64: string,
  referenceImageMimeType: string,
  angle: ViewAngle,
  userPrompt: string
): Promise<{ base64Data: string; mimeType: string }> => {
  const API_KEY = getApiKey();
  if (!API_KEY) throw new Error('API Key가 설정되지 않았습니다.');

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const anglePrompt = VIEW_ANGLE_PROMPTS[angle];
  const hasUserPrompt = userPrompt && userPrompt.trim().length > 0;

  const fullPrompt = `Look at the provided reference image. Generate ONLY this ONE single character in a different angle. If the reference image contains multiple characters, focus ONLY on the main/central character.

Generate a full-body ${anglePrompt} of this character.

CRITICAL - You MUST preserve from the reference image:
- The EXACT same face shape, facial features, and expression style
- The EXACT same hairstyle, hair color, and hair length
- The EXACT same outfit, clothing style, and colors
- The EXACT same body proportions and art style
- Show ONLY this ONE character, nothing else

${hasUserPrompt
    ? `The user has requested specific modifications below. ONLY change what the user explicitly mentions. Keep everything else EXACTLY as shown in the reference image.

User's modifications: ${userPrompt}`
    : `No modifications requested. Reproduce the character EXACTLY as shown in the reference image, only changing the viewing angle.`}

Output: Single character standing on a clean white background. Image aspect ratio must be 3:4 (portrait).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: referenceImageBase64, mimeType: referenceImageMimeType } },
          { text: fullPrompt },
        ],
      },
    ],
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
      aspectRatio: '3:4',
    } as any,
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('응답이 없습니다.');

  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        base64Data: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'image/png',
      };
    }
  }

  throw new Error('이미지가 생성되지 않았습니다.');
};

// 2x2 그리드 캐릭터 시트 생성 (4방향 뷰를 하나의 이미지로)
export const generateCharacterGridSheet = async (
  referenceImageBase64: string,
  referenceImageMimeType: string,
  userPrompt: string
): Promise<{ base64Data: string; mimeType: string }> => {
  const API_KEY = getApiKey();
  if (!API_KEY) throw new Error('API Key가 설정되지 않았습니다.');

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const hasUserPrompt = userPrompt && userPrompt.trim().length > 0;

  const fullPrompt = `Look at the provided reference image. Generate a CHARACTER SHEET with 4 views of this character arranged in a 2x2 grid layout.

GRID LAYOUT (IMPORTANT - must be exactly this arrangement):
┌─────────────┬─────────────┐
│  TOP-LEFT   │  TOP-RIGHT  │
│   FRONT     │    BACK     │
│   VIEW      │    VIEW     │
├─────────────┼─────────────┤
│ BOTTOM-LEFT │BOTTOM-RIGHT │
│    LEFT     │    RIGHT    │
│   PROFILE   │   PROFILE   │
└─────────────┴─────────────┘

Each quadrant must show the SAME character from different angles:
- TOP-LEFT: Front view (facing camera)
- TOP-RIGHT: Back view (facing away)
- BOTTOM-LEFT: Left side profile
- BOTTOM-RIGHT: Right side profile

CRITICAL - You MUST preserve from the reference image:
- The EXACT same face shape, facial features, and expression style
- The EXACT same hairstyle, hair color, and hair length
- The EXACT same outfit, clothing style, and colors
- The EXACT same body proportions and art style
- All 4 views must show the IDENTICAL character with CONSISTENT style

${hasUserPrompt
    ? `The user has requested specific modifications below. Apply these changes consistently to ALL 4 views.

User's modifications: ${userPrompt}`
    : `No modifications requested. Reproduce the character EXACTLY as shown in the reference image for all 4 views.`}

Output: 2x2 grid character sheet on a clean white background. Each quadrant should be clearly separated. Image aspect ratio must be 1:1 (square).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: referenceImageBase64, mimeType: referenceImageMimeType } },
          { text: fullPrompt },
        ],
      },
    ],
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
      aspectRatio: '1:1',
    } as any,
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('응답이 없습니다.');

  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        base64Data: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'image/png',
      };
    }
  }

  throw new Error('이미지가 생성되지 않았습니다.');
};

export const generateSceneImagePrompt = async (
  sceneContent: string,
  style: string,
  ratio: string,
  genre: string,
  mood: string,
  referencePrompt?: string,
  characterImages?: CharacterViewRef[]
): Promise<string> => {
  const API_KEY = getApiKey();
  if (!API_KEY) throw new Error('API Key가 설정되지 않았습니다.');

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const arRatio = ratio || '3:4';

  const hasCharImages = characterImages && characterImages.length > 0;

  // 씬1 프롬프트 스타일 레퍼런스 블록
  const styleReferenceBlock = referencePrompt
    ? `\n\nSTYLE REFERENCE (Scene 1 prompt - maintain the IDENTICAL rendering style, Camera brick, and Lighting brick):\n${referencePrompt}`
    : '';

  const charImageNote = hasCharImages
    ? `\n\nCHARACTER REFERENCE IMAGES: The images above show the character from multiple angles (${characterImages!.map(v => v.angle).join(', ')}). You MUST describe THIS EXACT character in the Archetype and Skin/Surface bricks - same face, hair color/style, body proportions, outfit, and art style. Copy what you SEE in the images, do NOT invent new appearances.`
    : '';

  const textPrompt = `You are a professional AI Art Director and Prompt Architect (Block & Bricks Prompt Architect).
Analyze the following scene description and generate an image prompt using the 11 Bricks structure.

Scene Content:
${sceneContent}

Art Style: ${style}
Aspect Ratio: ${arRatio}
Genre: ${genre}
Mood: ${mood}${charImageNote}${styleReferenceBlock}

Generate a structured prompt using these 11 Bricks. Each brick MUST be output as a separate line in parentheses with its label, like this exact format:

(Archetype: [MUST describe the EXACT character from the reference images - same art style, same face, same hair color/style, same body type. Only adapt the action/context to this scene])
(Skin/Surface: [MUST keep the SAME clothing, outfit, and texture visible in the reference images. Only add scene-specific damage/dirt/effects if the scene requires it])
(Target/Object: [key object the subject holds or interacts with in THIS scene])
(Contrast Subject: [scale contrast elements, background vs subject interaction for THIS scene])
(Expression: [emotion and facial expression appropriate for THIS scene's action])
(Pose: [body positioning appropriate for THIS scene's action])
(Signature: [unique visual symbols and distinctive elements for THIS scene])
(Environment: [spatial properties, background setting for THIS scene's location])
(Lighting: [lighting technique appropriate for THIS scene's setting${referencePrompt ? ' - KEEP SIMILAR to Style Reference' : ''}])
(Composition: [camera angle, visual hierarchy, frame boundaries for THIS scene])
(Camera: [render style${referencePrompt ? ' - MUST BE IDENTICAL to Style Reference Camera brick' : ', focal properties, color palette, post-processing'}])
--ar ${arRatio}

CRITICAL RULES:
- The Archetype and Skin/Surface bricks MUST describe the EXACT SAME character visible in the reference images across ALL scenes. Never change the character's appearance.
- Only Expression, Pose, Target/Object, and Environment should change between scenes.
- Output ALL 11 bricks, each on its own line, each wrapped in parentheses with its label
- Each brick description should be detailed (10-30 words) using professional art/cinematography terminology
- End with --ar ${arRatio} on the last line
- Output ONLY the bricks and --ar line. No other text, no explanations, no markdown.
- ALL text must be in English`;

  const contents: any = hasCharImages
    ? [
        {
          role: 'user' as const,
          parts: [
            ...characterImages!.filter(v => v.base64Data).map(v => ({
              inlineData: { data: v.base64Data, mimeType: v.mimeType },
            })),
            { text: textPrompt },
          ],
        },
      ]
    : textPrompt;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents,
    config: {
      systemInstruction: 'You are an expert 11 Bricks Prompt Architect. The MOST IMPORTANT rule: look at the provided character reference images carefully and describe that EXACT character in Archetype and Skin/Surface bricks. Output ONLY the 11 parenthesized brick lines followed by the --ar line. Nothing else. No intro, no explanation, no markdown formatting. English only.',
      temperature: 0.3,
    }
  });

  return response.text || '';
};

export interface CharacterViewRef {
  angle: string;
  base64Data: string;
  mimeType: string;
}

export const generateSceneImage = async (
  prompt: string,
  ratio: string,
  characterViews?: CharacterViewRef[],
  referenceImage?: { base64Data: string; mimeType: string } | null
): Promise<{ base64Data: string; mimeType: string }> => {
  const API_KEY = getApiKey();
  if (!API_KEY) throw new Error('API Key가 설정되지 않았습니다.');

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Build parts array with character views + style reference + prompt
  const hasCharViews = characterViews && characterViews.length > 0;
  const hasStyleRef = referenceImage?.base64Data;

  let contents: any;

  if (hasCharViews || hasStyleRef) {
    const parts: any[] = [];

    // Add character view images
    if (hasCharViews) {
      for (const view of characterViews!) {
        if (view.base64Data) {
          parts.push({ inlineData: { data: view.base64Data, mimeType: view.mimeType } });
        }
      }
    }

    // Add style reference image (scene 1)
    if (hasStyleRef) {
      parts.push({ inlineData: { data: referenceImage!.base64Data, mimeType: referenceImage!.mimeType } });
    }

    // Build instruction text
    const angleLabels = hasCharViews
      ? characterViews!.map(v => v.angle).join(', ')
      : '';

    let instruction = '';
    if (hasCharViews && hasStyleRef) {
      instruction = `Character Reference Images (${angleLabels} views) and Style Reference Image (last image) are provided above.

CRITICAL INSTRUCTIONS:
1. The character in the generated scene MUST look EXACTLY like the character in the reference views (same face, hair, body proportions, art style).
2. Use the appropriate character view angle that best matches the scene's camera direction.
3. Match the EXACT SAME visual style, color palette, and rendering technique as the Style Reference Image.
4. Do NOT copy the composition of any reference - create a NEW scene based on the prompt below.`;
    } else if (hasCharViews) {
      instruction = `Character Reference Images (${angleLabels} views) are provided above.

CRITICAL INSTRUCTIONS:
1. The character in the generated scene MUST look EXACTLY like the character in the reference views (same face, hair, body proportions, art style).
2. Use the appropriate character view angle that best matches the scene's camera direction.
3. Do NOT copy the composition of any reference - create a NEW scene based on the prompt below.`;
    } else {
      instruction = `Style Reference Image is provided above.

CRITICAL INSTRUCTIONS:
1. Match the EXACT SAME visual style, art direction, color palette, and rendering technique as the reference.
2. Do NOT copy the composition - only match the style. Create a NEW scene based on the prompt below.`;
    }

    // --ar 태그를 프롬프트에서 제거 (API aspectRatio 파라미터로 제어)
    const cleanPrompt = prompt.replace(/--ar\s+\S+/gi, '').trim();
    parts.push({ text: `${instruction}\n\nScene prompt:\n${cleanPrompt}\n\nIMPORTANT: The output image MUST have aspect ratio ${ratio || '3:4'}. Do not follow the aspect ratio of any reference image.` });

    contents = [{ role: 'user' as const, parts }];
  } else {
    // --ar 태그를 프롬프트에서 제거
    contents = prompt.replace(/--ar\s+\S+/gi, '').trim();
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents,
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
      aspectRatio: ratio || '3:4',
    } as any,
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('응답이 없습니다.');

  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        base64Data: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'image/png',
      };
    }
  }

  throw new Error('이미지가 생성되지 않았습니다.');
};
