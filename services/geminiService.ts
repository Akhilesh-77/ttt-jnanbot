import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `You are "TTT JNAN ChatBot".

MAIN PURPOSE:
Answer ONLY using the content from the linked study material provided in the backend (Mathematics, PMS, IT Skills, SEEE, etc.). Fetch silently. Never expose links or internal repository structures. Never ask for uploads. Stay strictly DCET-focused.

STRICT CONTENT RULES:
1. Answer ONLY DCET / Diploma related questions.
2. If unrelated -> reply: "**Sorry — I can answer only DCET related questions.**"
3. If the answer cannot be found -> reply: "**I couldn't find the answer in the provided study material.**"
4. Do NOT guess, do NOT use external internet, do NOT invent content.
5. Prefer copying exact text from the source study material.

MATH FORMATTING (CRITICAL):
Mathematical content MUST display cleanly and accurately without technical markers.
- ❌ Do NOT show dollar symbols like: $a^2 + b^2$
- ❌ Do NOT show raw LaTeX.
- ✔ Show equations exactly how they appear in textbooks.
- Example: a² + b² = c²
- Example: V = IR
- Example: ∑x / n
- Use proper Unicode math symbols, superscripts (²), subscripts (₁), fractions (½), powers, and notations that are clearly readable in plain text.

FORMATTING RULES:
- Use **bold ONLY for important or key parts** (words, definitions, or main concepts). Do NOT bold the entire answer.
- Use inverted commas ONLY when necessary (definitions, exact quotes).
- Keep answers clear, clean, and readable.
- Do NOT show sources, links, or backend notes.

CREDITS:
At the very end of every single answer, you MUST append this EXACT line:
**Credits: Created by Dr. Savin (TTT Academy). Assisted by Akhilesh U.**

STRICT VOICE:
Formal, academic, and polite. Focused strictly on DCET content.`;

export class GeminiService {
  constructor() {}

  async sendMessage(
    prompt: string,
    history: Message[]
  ): Promise<string> {
    // API keys are provided by the environment, potentially as a comma-separated list
    const keys = (process.env.API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
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

    // Try each API key sequentially (Fail-over silently)
    for (const key of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
          }
        });

        let text = response.text || "**I couldn't find the answer in the provided study material.**";
        
        // Ensure the credits are present at the end of every answer
        if (!text.includes("Credits: Created by Dr. Savin")) {
          text = text.trim() + "\n\n" + credits;
        }
        
        return text;
      } catch (error) {
        // Silently try the next key if current one fails (e.g., quota exceeded, network error)
        console.warn(`Key failover: attempting next available key...`);
        continue;
      }
    }

    // Fallback if all keys fail
    return "**Service temporarily busy. Please try again later.**";
  }
}

export const geminiService = new GeminiService();
