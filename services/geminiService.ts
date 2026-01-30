
import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { AutoDesignPlan, BlogState, MBTI_PERSONAS, GeneratedBlogContent, AnalyzedStyle } from "../types";

// Safe access to process.env
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY || '' : '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean JSON string if it comes with markdown blocks
const cleanJson = (text: string) => {
  if (!text) return '{}';
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  // Sometimes models output "Here is the JSON:" prefix
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

// Helper: Retry Operation with Exponential Backoff
async function retryOperation<T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isRateLimit = error.status === 429 || 
                        error.code === 429 || 
                        error?.error?.code === 429 || 
                        error?.response?.status === 429 ||
                        (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')));

    if (retries > 0 && isRateLimit) {
      console.warn(`Quota/Rate limit hit. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

// 1. Analyze Blog URL (Simulated/Inferred)
export const analyzeBlogStyle = async (url: string): Promise<AnalyzedStyle> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Analyze the likely writing style and persona of a blog based on this URL: "${url}".
      
      Since you cannot browse the live web, infer the style based on:
      1. The platform (e.g., Naver Blog implies friendly, emoticon-heavy, info-sharing. Tistory/Velog implies technical or review-heavy).
      2. Any keywords in the URL ID or structure.
      3. General trends for Korean blogs.

      Return a JSON object with:
      - tone: The likely tone (e.g., "Friendly & Emoji-heavy" or "Professional & Analytical")
      - writingStyle: Description of sentence structure (e.g., "Short sentences with lots of line breaks")
      - impression: The overall vibe (e.g., "A helpful neighbor sharing tips")

      Language: Korean.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        tone: { type: Type.STRING },
        writingStyle: { type: Type.STRING },
        impression: { type: Type.STRING },
      }
    };

    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    }));
    return JSON.parse(cleanJson(response.text || '{}'));
  } catch (e) {
    console.error("Blog analysis failed", e);
    return {
      tone: "분석 불가(기본값)",
      writingStyle: "일반적인 블로그 스타일",
      impression: "정보 공유"
    };
  }
};

// 2. Suggest Topics based on Category
export const suggestTopics = async (category: string): Promise<string[]> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Suggest 5 specific, engaging blog topics for the category: "${category}". 
      Target audience: General public looking for helpful info. 
      Language: Korean.
      Return strictly a JSON array of strings.`;

    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    }));
    return JSON.parse(cleanJson(response.text || '[]'));
  } catch (e) {
    console.error("Topic suggestion failed", e);
    return [`${category} 관련 꿀팁`, `${category} 초보자 가이드`, `${category} 솔직 후기`, `${category} 주의사항`, `${category} 추천 베스트`];
  }
};

// 3. Generate Auto Design Plan (Step 3)
export const generateAutoDesign = async (state: BlogState): Promise<AutoDesignPlan> => {
  try {
    const model = 'gemini-3-flash-preview';
    const mbtiDesc = MBTI_PERSONAS[state.profile.mbti] || '';
    // If enabled, use nickname. If not, use empty string (do not default to Choi Suyeon)
    const writerName = state.profile.useNickname && state.profile.nickname ? state.profile.nickname : '';
    
    // Construct profile context with Analyzed Style
    let profileContext = `
      Writer Profile:
      ${writerName ? `- Name: ${writerName}` : ''}
      - MBTI: ${state.profile.mbti || '자유 형식(성향 없음)'} ${mbtiDesc ? `(${mbtiDesc})` : ''}
      - Role: ${state.profile.job}
      - Base Tone: ${state.profile.tone}
      ${state.toneOverride ? `- Tone Override for this post: ${state.toneOverride}` : ''}
    `;

    if (state.profile.analyzedStyle) {
      profileContext += `
      - [IMPORTANT] Analyzed Blog Style to Mimic:
        * Tone: ${state.profile.analyzedStyle.tone}
        * Style: ${state.profile.analyzedStyle.writingStyle}
        * Vibe: ${state.profile.analyzedStyle.impression}
      `;
    }

    let seriesContext = "";
    if (state.seriesLinks && state.seriesLinks.length > 0) {
      seriesContext = `
      [SERIES CONTEXT]
      This post is part of a series (e.g., Part 2, Part 3).
      Previous parts:
      ${state.seriesLinks.map((l, i) => `${i+1}. ${l.title} (${l.url})`).join('\n')}
      
      Strategy Adjustment:
      - Target Situation: Should imply readers might be following along or need to check previous parts.
      - Format: Should mention "Series" or "Sequel" nature.
      `;
    }

    const prompt = `
      Act as an expert content strategist. Design a blog post structure.
      
      ${profileContext}
      ${seriesContext}

      Input Details:
      - Topic: ${state.topic}
      - Category: ${state.category} > ${state.subCategory}
      - Type: ${state.postType}
      - Headline Style (Hook): Level ${state.hookLevel}/3
      ${state.targetAudienceHint ? `- Target Audience Hint: ${state.targetAudienceHint}` : ''}
      ${state.imageAnalysis ? `- Image Context: Mood(${state.imageAnalysis.mood}), Keywords(${state.imageAnalysis.detectedKeywords.join(', ')}), Captions(${state.imageAnalysis.imageCaptions.join(' / ')})` : ''}
      
      Output a JSON object for the design plan.
      Language: Korean.
      
      Constraints:
      - 'tone': Describe the specific voice suitable for this profile (e.g., 'ISTJ의 분석적이고 신뢰감 있는 톤').
      - 'targetSituation': Specific situation of the reader.
      - 'keywords': SEO friendly Korean keywords.
      - 'hashtagStrategy': Brief strategy.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        targetSituation: { type: Type.STRING },
        format: { type: Type.STRING },
        tone: { type: Type.STRING },
        keywords: {
          type: Type.OBJECT,
          properties: {
            main: { type: Type.STRING },
            sub: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        length: { type: Type.STRING },
        hashtagStrategy: { type: Type.STRING },
      }
    };

    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    }));

    return JSON.parse(cleanJson(response.text || '{}'));
  } catch (e) {
    console.error("Auto design failed", e);
    return {
      category: state.category,
      targetSituation: '정보를 찾고 있는 2030',
      format: '정보 전달 + 개인 경험',
      tone: '차분하고 꼼꼼한',
      keywords: { main: state.topic, sub: [] },
      length: '1500자 내외',
      hashtagStrategy: '롱테일 키워드 공략'
    };
  }
};

// 4. Analyze Image for Hashtags (Step 4 Options)
export const analyzeImageForHashtags = async (base64Image: string, style: 'blog' | 'sns'): Promise<string[]> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = style === 'blog' 
      ? "Analyze this image and provide 10 SEO-optimized hashtags for a Korean Naver Blog. Focus on search volume." 
      : "Analyze this image and provide 10 emotional, aesthetic hashtags for Instagram/SNS in Korean.";

    // Correct Mime Type Detection
    const mimeMatch = base64Image.match(/^data:(.*?);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model,
      contents: [{ 
        role: 'user', 
        parts: [
          { inlineData: { mimeType, data } },
          { text: prompt }
        ] 
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    }));
    return JSON.parse(cleanJson(response.text || '[]'));
  } catch (e) {
    console.error("Image analysis failed", e);
    return ["#사진분석실패", "#이미지", "#일상"];
  }
};

// 5. Analyze Images AND Topic together (Step 2 Transition)
export const analyzeImagesAndTopic = async (topic: string, base64Images: string[], userIntent?: string): Promise<{ mood: string, keywords: string[], hashtags: string[], imageCaptions: string[], suggestedTopic?: string }> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // LIMIT IMAGES: Take only last 15 (Requested by user, using compressed images)
    const imagesToProcess = base64Images.slice(-15); 

    // Prepare parts with multiple images, handling mime types correctly
    const parts: any[] = [];
    imagesToProcess.forEach((img) => {
      const mimeMatch = img.match(/^data:(.*?);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const data = img.includes(',') ? img.split(',')[1] : img;
      
      if (data) {
        parts.push({ inlineData: { mimeType, data } });
      }
    });

    if (parts.length === 0) throw new Error("No valid image data found");

    // Enhanced Prompt with User Intent and Korean Language Enforcement
    const prompt = `
      Analyze these images deeply.
      
      [Context]
      ${topic ? `- The blog topic is "${topic}".` : '- Goal: Suggest a suitable blog topic based on these images.'}
      ${userIntent ? `- **User's Special Intent/Goal**: "${userIntent}" (IMPORTANT: Must reflect this intent in the analysis)` : ''}
      
      [Tasks]
      1. Describe the overall Mood (reflecting user intent if provided).
      2. List 5 key keywords.
      3. Suggest 10 relevant hashtags for a Korean Naver Blog.
      4. **Provide a descriptive caption for each image** to be used in the blog writing process.
      5. Suggest a one-line blog topic title (e.g., "A Review of X", "How to X").
      
      [Constraints]
      - **OUTPUT LANGUAGE: KOREAN (한국어)** for all fields.
      - JSON format only.
    `;
    parts.push({ text: prompt });

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        mood: { type: Type.STRING },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        imageCaptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedTopic: { type: Type.STRING },
      }
    };

    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    }));
    
    const parsed = JSON.parse(cleanJson(response.text || '{}'));

    // VALIDATION: Ensure arrays exist to prevent UI crashes
    if (!parsed || typeof parsed !== 'object') throw new Error("Invalid response");
    if (!Array.isArray(parsed.keywords)) parsed.keywords = [];
    if (!Array.isArray(parsed.hashtags)) parsed.hashtags = [];
    if (!Array.isArray(parsed.imageCaptions)) parsed.imageCaptions = [];
    if (!parsed.mood) parsed.mood = "분석된 분위기 없음";

    return parsed;
  } catch(e) {
    console.error("Image planning failed", e);
    // Return safe fallback to prevent app crash
    return {
      mood: "차분함 (자동 분석 실패 - 재시도 해주세요)",
      keywords: ["일상", "기록", "사진"],
      hashtags: ["#일상", "#사진", "#기록"],
      imageCaptions: base64Images.map((_, i) => `이미지 ${i+1}`),
      suggestedTopic: topic || "일상 기록"
    };
  }
};

// 6. Generate Full Blog Post (Step 5)
export const generateBlogPost = async (state: BlogState): Promise<GeneratedBlogContent> => {
  const model = 'gemini-3-pro-preview'; 
  
  const mbtiDesc = MBTI_PERSONAS[state.profile.mbti] || '';
  const toneToUse = state.toneOverride || state.profile.tone;
  const writerName = state.profile.useNickname && state.profile.nickname ? state.profile.nickname : '';
  
  // Prepare image info string
  let imageInfo = '제공된 이미지 없음';
  const totalImages = state.sourceImages.length;

  if (totalImages > 0 && state.imageAnalysis?.imageCaptions) {
    imageInfo = `
      [제공된 이미지 ${totalImages}장]
      (Index 0 to ${totalImages - 1})
      이미지 분석 및 설명:
      ${state.imageAnalysis.imageCaptions.map((cap, i) => `Index ${i}: ${cap}`).join('\n')}
      
      분위기: ${state.imageAnalysis.mood}
      관련 태그: ${state.imageAnalysis.hashtags.join(', ')}
      ${state.userImageIntent ? `사용자의 이미지 의도: ${state.userImageIntent}` : ''}
    `;
  }

  // Construct Explicit Style Guide from Analysis
  let analyzedStyleGuide = '';
  if (state.profile.analyzedStyle) {
    analyzedStyleGuide = `
    [★중요★ 분석된 블로그 스타일 모방 가이드]
    URL 분석 결과를 바탕으로 아래 스타일을 철저히 따라하세요:
    - 문체 스타일: ${state.profile.analyzedStyle.writingStyle} (이 문체로 작성할 것)
    - 분위기/인상: ${state.profile.analyzedStyle.impression}
    - 톤(Tone): ${state.profile.analyzedStyle.tone}
    `;
  }

  let seriesInstruction = "";
  if (state.seriesLinks && state.seriesLinks.length > 0) {
    seriesInstruction = `
    [★중요★ 시리즈 연결 가이드]
    이 글은 연재물의 일부입니다. 독자가 이전 글을 참고할 수 있도록 **Intro(서론)** 부분에 아래 링크들을 자연스럽게 언급하며 포함시키세요.
    형식 예시: "지난 1탄(링크)에서는 ~했는데, 오늘은 ~입니다." 또는 "아직 1탄을 못 보셨다면? [1탄 보러가기](URL)"
    
    [이전 시리즈 목록]
    ${state.seriesLinks.map((l, i) => `- ${l.title}: ${l.url}`).join('\n')}
    `;
  }

  const systemInstruction = `
    당신은 '${state.profile.job}'이자 블로거${writerName ? `인 '${writerName}'` : ''}입니다.
    사용자의 실제 말투와 성향(${state.profile.mbti || '자유'}, ${toneToUse})을 완벽하게 모방하여 글을 씁니다.
    
    [작성자 페르소나 정의]
    ${writerName ? `- 이름(닉네임): ${writerName}` : ''}
    - MBTI: ${state.profile.mbti || '설정 안함'}
    - 특징: ${mbtiDesc}
    - 직업/역할: ${state.profile.job}
    - 말투: ${toneToUse}
    - AI 티 내지 않기: "소개합니다", "알아보았습니다" 같은 딱딱한 어미 지양.
    
    ${analyzedStyleGuide}

    [이미지 배치 전략]
    - 제공된 이미지(${totalImages}장) 중에서 가장 적합한 것을 골라 배치하세요.
    - **Intro (대문)**: 독자의 시선을 끌 수 있는 가장 매력적인 사진 1장을 선택 (introImageIndex).
    - **Body (본문)**: 각 소제목(문단)의 내용과 가장 잘 어울리는 사진을 배치 (imageIndex). 억지로 모든 문단에 넣을 필요 없음.
    - **Outro (마무리)**: 여운을 주거나 결론에 어울리는 사진 1장을 선택 (outroImageIndex).
    - 사용하기 애매하거나 중복되는 사진은 과감히 제외하세요 (null로 처리).
    - 각 이미지에 대해 블로그용 **Alt Text**를 작성해주세요.

    [핵심 집필 가이드]
    1. **절대 금지**: "완벽한", "최고의", "결론적으로" 등 상투적 표현.
    2. **피하고 싶은 키워드**: ${state.profile.avoidKeywords || '없음'}
    3. **추가 요청 사항**: ${state.additionalRequests || '없음'}
    ${seriesInstruction}
    
    [입력 정보]
    - 주제: ${state.topic}
    - 타겟 독자: ${state.autoDesign.targetSituation}
    - 메인 키워드: ${state.autoDesign.keywords.main}
    
    ${imageInfo}
  `;

  const prompt = `
    위 설정을 바탕으로 블로그 글을 작성해주세요.
    반드시 아래 JSON 형식으로 출력해야 합니다.
    
    Output Schema:
    {
      "title": "매력적인 제목",
      "intro": "서론",
      "introImageIndex": 0, // integer index of the cover image, or null
      "body": [
        {
          "subtitle": "소제목", 
          "content": "내용",
          "imageIndex": 1 // integer index of image for this section, or null
        }
      ],
      "conclusion": "결론",
      "outroImageIndex": 2, // integer index of the closing image, or null
      "cta": "마무리 멘트",
      "hashtags": ["태그"],
      "imageAltTexts": ["Alt text for Index 0", "Alt text for Index 1", ...], // Array of strings matching sourceImages length
      "imageGuide": "이미지 배치 가이드"
    }
  `;

  const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    }
  }));

  const text = cleanJson(response.text || '{}');
  return JSON.parse(text);
};

// 7. Regenerate specific section
export const regenerateBlogSection = async (
  state: BlogState, 
  section: 'title' | 'intro' | 'body' | 'conclusion',
  currentContent: GeneratedBlogContent
): Promise<any> => {
  const model = 'gemini-3-flash-preview'; 
  const toneToUse = state.toneOverride || state.profile.tone;
  const writerName = state.profile.useNickname && state.profile.nickname ? state.profile.nickname : '';

  // Construct Explicit Style Guide from Analysis
  let analyzedStyleGuide = '';
  if (state.profile.analyzedStyle) {
    analyzedStyleGuide = `
    [분석된 블로그 스타일 모방]
    - 문체: ${state.profile.analyzedStyle.writingStyle}
    - 분위기: ${state.profile.analyzedStyle.impression}
    `;
  }
  
  const systemInstruction = `
    당신은 '${state.profile.job}'이자 블로거${writerName ? `인 '${writerName}'` : ''}입니다.
    사용자의 말투(${toneToUse})를 유지하며 블로그 글의 **일부분만** 창의적으로 다시 씁니다.
    
    ${analyzedStyleGuide}

    [금지사항]
    - "완벽한", "최고의", "결론적으로" 사용 금지.
    - 피하고 싶은 키워드: ${state.profile.avoidKeywords || '없음'}
  `;

  let prompt = '';
  let responseSchema: Schema | undefined = undefined;

  if (section === 'title') {
    prompt = `주제 '${state.topic}'에 어울리는 새로운 매력적인 블로그 제목 1개를 추천해줘. JSON string으로 반환해.`;
    responseSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING } } };
  } else if (section === 'intro') {
    prompt = `주제 '${state.topic}'에 대한 블로그 서론을 다시 작성해줘. 독자의 공감을 이끌어내는 훅(Hook)이 필요해. JSON string으로 반환해.`;
    responseSchema = { type: Type.OBJECT, properties: { intro: { type: Type.STRING } } };
  } else if (section === 'body') {
    prompt = `주제 '${state.topic}'에 대한 본문 내용을 다시 구성해줘. 소제목과 내용으로 이루어진 배열이어야 해. 이미지 배치는 신경쓰지 말고 텍스트만 리라이팅해. JSON으로 반환해.`;
    responseSchema = { 
      type: Type.OBJECT, 
      properties: { 
        body: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { subtitle: { type: Type.STRING }, content: { type: Type.STRING } } // Removed imageIndex for regeneration simplicity
          } 
        } 
      } 
    };
  } else if (section === 'conclusion') {
    prompt = `주제 '${state.topic}'에 대한 결론과 CTA(행동 유도) 멘트를 다시 작성해줘. JSON으로 반환해.`;
    responseSchema = { 
      type: Type.OBJECT, 
      properties: { 
        conclusion: { type: Type.STRING }, 
        cta: { type: Type.STRING } 
      } 
    };
  }

  const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
    }
  }));

  const text = cleanJson(response.text || '{}');
  const json = JSON.parse(text);

  if (section === 'title') return json.title;
  if (section === 'intro') return json.intro;
  if (section === 'body') {
     // Preserve image indices from current content if possible, mapping by index
     // This is a naive merge but keeps the regeneration logic simple without complex mapping
     return json.body.map((b: any, i: number) => ({
       ...b,
       imageIndex: currentContent.body[i]?.imageIndex ?? null
     }));
  }
  if (section === 'conclusion') return { conclusion: json.conclusion, cta: json.cta };
  
  return null;
};
