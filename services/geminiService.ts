
import { GoogleGenAI } from "@google/genai";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const callWithRetry = async <T>(fn: (ai: GoogleGenAI) => Promise<T>, retries = 5, initialDelay = 5000): Promise<T> => {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return await fn(ai);
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
      if (isRateLimit && i < retries - 1) {
        await sleep(delay);
        delay *= 2; 
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
};

export const fileToGenerativePart = async (file: File | Blob): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({ inlineData: { data: base64Data, mimeType: file.type.includes('wav') ? 'audio/wav' : file.type } });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const transcribeChunk = async (audioData: any, partIndex: number, totalParts: number, previousContext: string = ''): Promise<string> => {
  const contextPrompt = previousContext ? `\nالسياق السابق: "...${previousContext}"` : '';
  
  return await callWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          audioData,
          {
            text: `System Prompt – Absolute Verbatim Transcription (Arabic & English)
TASK: Transcribe the audio content exactly as it is spoken.
1. STRICT VERBATIM: Transcribe every single word. No additions, no omissions, no changes, and no corrections. 
2. NO SUMMARIZATION: Do not summarize, condense, or reorganize the content. Capture every word, even if repetitive.
3. DIALECT & LANGUAGE: Keep the original dialect and language exactly as spoken. If spoken in Arabic, transcribe in Arabic. If spoken in English, transcribe in English. DO NOT TRANSLATE.
4. NO FORMATTING: Do not add titles or structure, just plain verbatim text.
5. NO COMMENTARY: Provide ONLY the transcription text.
Note: This is segment ${partIndex + 1} of ${totalParts}.
${contextPrompt}`
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });
    return response.text || "";
  });
};

const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0); // Fallback
    };
  });
};

export const transcribeAudio = async (file: File, onProgress?: (current: number, total: number, phase: 'PREPROCESSING' | 'TRANSCRIBING') => void): Promise<{ fullText: string; chunks: string[] }> => {
  if (onProgress) onProgress(0, 1, 'PREPROCESSING');
  
  const duration = await getAudioDuration(file);
  const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;
  
  let totalChunks = 1;
  if (duration > 0) {
    totalChunks = Math.ceil(duration / FIFTEEN_MINUTES_IN_SECONDS);
  } else {
    totalChunks = Math.ceil(file.size / (15 * 1024 * 1024));
  }
  
  totalChunks = Math.max(1, totalChunks);
  const bytesPerChunk = Math.ceil(file.size / totalChunks);
  
  let fullText = '';
  const textChunks: string[] = [];
  let previousContext = '';
  
  await sleep(1000); 

  for (let i = 0; i < totalChunks; i++) {
    if (onProgress) onProgress(i + 1, totalChunks, 'TRANSCRIBING');
    const start = i * bytesPerChunk;
    const end = Math.min(start + bytesPerChunk, file.size);
    const chunkBlob = file.slice(start, end, file.type);
    const chunkPart = await fileToGenerativePart(chunkBlob);
    
    if (i > 0) await sleep(1500);
    const chunkText = await transcribeChunk(chunkPart, i, totalChunks, previousContext);
    textChunks.push(chunkText);
    fullText += chunkText + " ";
    previousContext = chunkText.slice(-200);
  }
  return { fullText: fullText.trim(), chunks: textChunks };
};

const formatTextChunkToHtml = async (textChunk: string, chunkIndex: number, totalChunks: number): Promise<string> => {
  return await callWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [{
          text: `You will produce a smart, conceptual summary of the lecturer’s explanation.
This summary must support understanding and exam answering, not memorization only.

The lecturer’s transcription may be long, fragmented, or repetitive.
Your task is to extract the essential meaning, reorganize it clearly, and reduce wording without reducing ideas.

**تنبيه هام جداً: ركز على المضمون والجوهر (الزبدة) وتجنب الحشو الإنشائي أو الإطالة الزائدة التي لا تضيف قيمة علمية (الدش)، مع الالتزام الصارم بعدم إغفال أي معلومة أو فكرة أو شرح ذكره المحاضر.**

--------------------------------------------------
0) Language Style (Mandatory)
--------------------------------------------------
- Write the final output in Modern Standard Arabic only.
- Linguistically convert the lecturer’s words into MSA.
- Do NOT change the meaning.
- Do NOT add ideas.
- Do NOT remove any core concept.
- No colloquial language.

--------------------------------------------------
1) Nature of the Output
--------------------------------------------------
- The output MUST be a summary.
- It must be shorter than the lecture, but not superficial.
- It must preserve: The core idea, The reason behind it (why), and the legal effect.

--------------------------------------------------
2) How to Summarize (Core Rule)
--------------------------------------------------
No Omission of Lecturer’s Content (Critical)
- You must NOT omit any idea mentioned by the lecturer unless it is a clear repetition.
- Summarization means reducing wording (No filler/Dush), NOT reducing ideas.
- Focus on the essence (الخلاصة الجوهرية) بأسلوب بليغ ومختصر.

--------------------------------------------------
3) Organization & Structure (Mandatory)
--------------------------------------------------
- Main ideas → MAIN HEADINGS (use <h2>).
- Sub-ideas → SUBHEADINGS (use <h3>).
- Use <p> for paragraphs.

--------------------------------------------------
4) Numbering and Divisions
--------------------------------------------------
- Number logically divisible content. Each point on a new line as a complete sentence.

--------------------------------------------------
5) Definitions
--------------------------------------------------
- Use <div class="mansa-gold-box"><span class="gold-label">تعريف:</span>...</div> for definitions.

--------------------------------------------------
8) Lecturer’s Questions, Warnings & Exam Notes
--------------------------------------------------
- Use <div class="mansa-gold-box"><span class="gold-label">تنبيه امتحاني:</span>...</div>.

--------------------------------------------------
10) Post-Processing Rule (Critical)
--------------------------------------------------
This is part ${chunkIndex + 1} of ${totalChunks}.
CRITICAL: Output ONLY the HTML content. Do NOT truncate. Ensure all ideas are captured concisely without filler text.

Input: "${textChunk}"`
        }]
      },
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    // Clean response from markdown markers
    return response.text ? response.text.replace(/```html/g, '').replace(/```/g, '').trim() : "";
  });
};

export const formatTranscription = async (fullText: string, onProgress?: (status: string) => void): Promise<string> => {
  const words = fullText.split(/\s+/);
  const semanticChunks = [];
  // Adjusted chunk size to ensure high quality and no truncation
  const CHUNK_WORD_COUNT = 1000; 
  for (let i = 0; i < words.length; i += CHUNK_WORD_COUNT) {
    semanticChunks.push(words.slice(i, i + CHUNK_WORD_COUNT).join(" "));
  }
  
  let fullHtml = "";
  for (let i = 0; i < semanticChunks.length; i++) {
    if (onProgress) onProgress(`جاري صياغة الجزء ${i + 1} من ${semanticChunks.length}...`);
    const htmlPart = await formatTextChunkToHtml(semanticChunks[i], i, semanticChunks.length);
    fullHtml += htmlPart + "\n"; 
    // Small delay to avoid rate limits
    if (i < semanticChunks.length - 1) await sleep(2000); 
  }

  // Combine high-quality parts and maintain NO CONTENT LOSS.
  return `<div class="study-note-container">${fullHtml}</div>`;
};
