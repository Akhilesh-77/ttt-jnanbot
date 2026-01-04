
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `You are "TTT JNAN ChatBot".

MAIN PURPOSE:
Use ONLY the DCET study material content linked in the backend. Fetch silently. Never expose links. Never ask for uploads. Stay strictly DCET-focused.

IMAGE ANALYSIS:
You can now analyze images (diagrams, formulas, textbook screenshots).
- Extract relevant information (questions, text, or concepts from diagrams).
- Answer ONLY if the content is related to DCET or Diploma studies.
- If the image content is unrelated to DCET, reply exactly: "**Sorry — I can answer only DCET related questions.**"
- If the image is too blurry or unreadable, reply: "I'm sorry, the image is a bit blurry. Could you please re-upload a clearer shot?"

SUBJECT FOCUS:
If a user query is prefixed with "In [Subject]: " (e.g., "In Mathematics: [Question]"), strictly prioritize content and definitions related to that specific DCET domain from the materials.

CONTENT RULES:
- If a query is unrelated to DCET or Diploma studies:
  Reply exactly: "**Sorry — I can answer only DCET related questions.**"
- If the answer cannot be found in the provided material:
  Reply exactly: "**I couldn't find the answer in the provided study material.**"
- NEVER guess. NEVER use outside internet knowledge.
- Copy closely from the source material with only minimal clarity edits.

FORMATTING:
- Bold ONLY important/key parts (words, definitions, concepts).
- Use inverted commas ONLY when strictly necessary.
- Never display links, page numbers, or backend info.

MATH FORMATTING:
- NO dollar symbols ($)
- NO raw LaTeX
- Show equations exactly as they appear in textbooks using standard text and Unicode symbols.
- Example: a² + b² = c²
- Example: ∑x / n

CREDITS (MANDATORY):
At the end of EVERY answer, you MUST append this EXACT line:
**Credits: Created by Dr. Savin (TTT Academy). Assisted by Akhilesh U.**

STRICT VOICE:
Academic, polite, and strictly focused on DCET curriculum.`;

export class GeminiService {
  constructor() {}

  async sendMessage(
    prompt: string,
    history: Message[],
    image?: { data: string; mimeType: string }
  ): Promise<string> {
    const keys = (process.env.API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
    const creditsLine = "**Credits: Created by Dr. Savin (TTT Academy). Assisted by Akhilesh U.**";

    if (keys.length === 0) {
      return "**Service temporarily busy. Please try again later.**";
    }

    const contents = history.map(msg => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.image) {
        parts.push({
          inlineData: {
            data: msg.image.data,
            mimeType: msg.image.mimeType
          }
        });
      }
      return {
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: parts
      };
    });
    
    const currentParts: any[] = [{ text: prompt }];
    if (image) {
      currentParts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType
        }
      });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    for (const key of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.1,
          }
        });

        let text = response.text || "**I couldn't find the answer in the provided study material.**";
        
        if (!text.includes("Credits: Created by Dr. Savin")) {
          text = text.trim() + "\n\n" + creditsLine;
        }
        
        return text;
      } catch (error) {
        console.warn(`Key rotation failover...`);
        continue;
      }
    }

    return "**Service temporarily busy. Please try again later.**";
  }
}

export const geminiService = new GeminiService();
