
import { GoogleGenAI, Type } from "@google/genai";
import { BloxObject, GameExperience } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Ahora solo generamos la portada basada en lo que el usuario quiere crear
export async function generateGameThumbnail(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A 3D isometric cartoon game thumbnail for a blocky building game called Blox. The game title is: "${prompt}". Bright colors, high quality 2011 aesthetic.` }]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "https://picsum.photos/400/300";
}

export async function getBotResponse(userMessage: string, botName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `You are a player in a 2011-era blocky building game called Blox. Your username is ${botName}. 
      The user just said: "${userMessage}". 
      Respond as a typical friendly or slightly silly player from that era. Use lowercase mostly, some abbreviations like 'lol', 'rofl', 'omg', or 'xd'. 
      Keep it short (max 10 words). Don't use emojis, use text faces like :D or :). 
      Be helpful if they ask a question, but stay in character.`,
      config: {
        maxOutputTokens: 25,
      }
    });
    return response.text || "lol nice";
  } catch (e) {
    return "lol cool";
  }
}
