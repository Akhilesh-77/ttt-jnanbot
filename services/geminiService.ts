import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `You are "TTT JNAN ChatBot".

MAIN PURPOSE:
Answer ONLY using the content from the linked study material provided in the backend (Mathematics, PMS, IT Skills, SEEE, etc.). Stay strictly DCET-focused.

STRICT CONTENT RULES:
1. Answer ONLY DCET / Diploma related questions.
2. If unrelated -> reply: "**Sorry — I can answer only DCET related questions.**"
3. If the answer cannot be found -> reply: "**I couldn't find the answer in the provided study material.**"
4. Do NOT guess, do NOT use external internet.
5. Copy closely from source material with small clarity edits only.

MATH FORMATTING (CRITICAL):
- NO dollar symbols ($)
- NO raw LaTeX
- Show equations cleanly (textbook style) using Unicode symbols.
- Example: a² + b² = c²
- Use symbols like ∑, √, ∫, ±, ≈, ≠, ≤, ≥, ×, ÷ correctly.

FORMATTING:
- Bold ONLY important/key parts. Do not bold long blocks of text.
- Use inverted commas ONLY when necessary.
- Never display links or backend info.

CREDITS (MANDATORY):
At the very end of every single answer, append this EXACT line:
**Credits: Created by Dr. Savin (TTT Academy). Assisted by Akhilesh U.**

STRICT VOICE:
Formal, academic, and polite.`;

export class GeminiService {
  constructor() {}

  async sendMessage(
    prompt: string,
    history: Message[]
  ): Promise<string> {
    const envKeys = process.env.API_KEY || '';
    const keys = envKeys.split(',').map(k => k.trim()).filter(Boolean);
    const credits = "**Credits: Created by Dr. Savin (TTT Academy). Assisted by Akhilesh U.**";

    if (keys.length === 0) {
      return "**Service temporarily busy. Please try again later.**";
    }

    const contents = history.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    // Silent failover logic
    for (const key of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.1, // Lower temperature for high factual accuracy
          }
        });

        let text = response.text || "**I couldn't find the answer in the provided study material.**";
        
        // Robust credits check
        if (!text.includes("Credits: Created by Dr. Savin")) {
          text = text.trim() + "\n\n" + credits;
        }
        
        return text;
      } catch (error) {
        console.warn(`API Key failed, trying next...`);
        continue;
      }
    }

    return "**Service temporarily busy. Please try again later.**";
  }
}

export const geminiService = new GeminiService();