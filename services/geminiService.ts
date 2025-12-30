
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `You are "TTT JNAN ChatBot".

MAIN PURPOSE:
Answer ONLY using the content from the linked study material provided in the backend (Mathematics, PMS, IT Skills, SEEE, etc.). Fetch silently. Never expose links or internal repository structures. Never ask for uploads.

STRICT CONTENT RULES:
1. Answer ONLY DCET / Diploma related questions.
2. If unrelated -> reply: "**Sorry — I can answer only DCET related questions.**"
3. If the answer cannot be found -> reply: "**I couldn't find the answer in the provided study material.**"
4. Do NOT guess, do NOT use external internet, do NOT invent content.
5. Prefer copying exact text from the source study material.

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
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const contents = history.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        }
      });

      let text = response.text || "**I couldn't find the answer in the provided study material.**";
      
      // Ensure the credits are present if the model forgets
      const credits = "**Credits: Created by Dr. Savin (TTT Academy). Assisted by Akhilesh U.**";
      if (!text.includes("Credits: Created by Dr. Savin")) {
        text = text.trim() + "\n\n" + credits;
      }
      
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "**I couldn't find the answer in the provided study material.**\n\n**Credits: Created by Dr. Savin (TTT Academy). Assisted by Akhilesh U.**";
    }
  }
}

export const geminiService = new GeminiService();
