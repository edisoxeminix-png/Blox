
import { GoogleGenAI, Type } from "@google/genai";
import { BloxObject, GameExperience } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGameWorld(prompt: string): Promise<Partial<GameExperience>> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a unique Blox game world based on this prompt: "${prompt}". 
    The world is made of basic shapes (box, sphere, npc, goal, lava). 
    Position coordinates range from -10 to 10. Sizes range from 0.5 to 3.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          instructions: { type: Type.STRING },
          objects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['box', 'sphere', 'npc', 'goal', 'lava'] },
                position: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    z: { type: Type.NUMBER }
                  },
                  required: ['x', 'y', 'z']
                },
                color: { type: Type.STRING, description: "Hex color" },
                size: { type: Type.NUMBER },
                label: { type: Type.STRING }
              },
              required: ['id', 'type', 'position', 'color', 'size']
            }
          }
        },
        required: ['title', 'description', 'objects', 'instructions']
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateGameThumbnail(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A 3D isometric cartoon game thumbnail for a game called Blox about: ${prompt}. Bright colors, blocky characters.` }]
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
