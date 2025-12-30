
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const RESOURCE_LINKS = `
Official Subject Resources:
- FEEE: https://jumpshare.com/s/qGOpx46uQdG5pswO0DY5
- IT SKILLS: https://jumpshare.com/share/6J1rRbyUfGN3ZXfis0nQ
- MATHS: https://jumpshare.com/share/DZApe66DKJzOWtjwclhN
- STATISTICS: https://jumpshare.com/share/Qp7UWMZwfjpjXAvikK02
- PMS: https://jumpshare.com/share/GW05ZQGSeo5FxbT6CyCa
`;

const SYSTEM_INSTRUCTION = `You are "TTT JNAN ChatBot".

MAIN PURPOSE:
Answer ONLY using the text that exists inside the JNAN DCET Repository (your internal knowledge source) and the provided Official Subject Resources. Do NOT mention other sources, links, or backend details. Do NOT ask users to upload files.

RESOURCE KNOWLEDGE:
You are aware of these official resource links:
${RESOURCE_LINKS}
If a user asks for study material or resources for these subjects, provide the corresponding link from the list above.

CONTENT RULES:
1. Only DCET / Diploma related answers.
2. If the question is unrelated -> reply exactly in bold: "**Sorry — I can answer only DCET related questions.**"
3. If the answer does not exist in the Repository or resources -> reply exactly in bold: "**I couldn't find the answer in the uploaded material.**"
4. NO guessing. NO outside knowledge. NO internet search. 
5. Copy-paste text as close to original as possible.
6. ALL your answers MUST be fully bold. Use double asterisks for the entire message.
7. Use inverted commas ONLY when needed for exact definitions.
8. Never show source, page number, link, or backend details unless specifically asked for the resource link of a subject.
9. No emojis. No small talk. Stay formal and focused on DCET only.

STRICT VOICE:
You are TTT JNAN ChatBot. You are a formal, high-performance DCET assistant. Everything you say must be bold.`;

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
          temperature: 0.0,
        }
      });

      let text = response.text || "**I couldn't find the answer in the uploaded material.**";
      
      // Strict bold enforcement
      const trimmed = text.trim();
      if (!trimmed.startsWith('**')) text = '**' + trimmed;
      if (!trimmed.endsWith('**')) text = text + '**';
      
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "**I couldn't find the answer in the uploaded material.**";
    }
  }
}

export const geminiService = new GeminiService();
