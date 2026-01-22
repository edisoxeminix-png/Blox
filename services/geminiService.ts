
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a thumbnail image for a game based on a title prompt.
 */
export async function generateGameThumbnail(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A futuristic 2026 3D game thumbnail for a blocky world. Title: "${prompt}". Ultra-realistic lighting, RTX reflections, cinematic style, masterpiece.` }]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "https://picsum.photos/seed/blox2026/800/600";
}

/**
 * Provides building advice or suggestions in the Studio view.
 */
export async function getBuilderHelp(userRequest: string, currentContext: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the "Blox 2026 Assistant". The user is building a game manually.
      Context: ${currentContext}
      User asks: "${userRequest}"
      Give short, creative building advice or suggest a name/theme. Max 20 words. Be inspiring.`,
      config: { 
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 50 }
      }
    });
    return response.text || "¡Intenta añadir bloques de neón para un toque futurista!";
  } catch (e) {
    return "¡Esa idea suena genial! Sigue construyendo.";
  }
}

/**
 * The core logic for the Arceus X Neo V5 Executor.
 * Takes a natural language command and the current world state, 
 * returning JSON instructions to modify the game world.
 */
export async function executeBloxScript(command: string, world: any[]): Promise<{
  newObjects?: any[], 
  removeIds?: string[], 
  teleport?: {x: number, y: number, z: number},
  message?: string
}> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Arceus X Neo V5 Engine, the most powerful executor for Blox 2026.
      User wants to "execute" this script/command: "${command}"
      Current world has ${world.length} objects.
      
      Capabilities:
      - 'teleport': Move player to a coordinate. (x,y,z)
      - 'newObjects': Create new objects. Use types: 'box', 'sphere', 'lava', 'water', 'goal', 'neon', 'grass', 'wood'.
      - 'removeIds': Delete objects by ID.
      
      Constraint: 
      - If they say "teleport to end", find the 'goal' object and return its x, y, z.
      - If they say "spawn boxes", generate valid BloxObject JSON.
      
      Return a JSON object only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newObjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  position: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      z: { type: Type.NUMBER }
                    }
                  },
                  color: { type: Type.STRING },
                  size: { type: Type.NUMBER },
                  material: { type: Type.STRING },
                  label: { type: Type.STRING },
                  // Added parity with BloxObject interface
                  isSafeZone: { type: Type.BOOLEAN },
                  isPickable: { type: Type.BOOLEAN }
                }
              }
            },
            removeIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            teleport: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                z: { type: Type.NUMBER }
              }
            },
            message: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Arceus Error:", e);
    return { message: "Execution failed: " + (e as Error).message };
  }
}

/**
 * Simulated chat bot response for the friends or game chat.
 */
export async function getBotChatResponse(history: {role: string, text: string}[], botName: string): Promise<string> {
  try {
    const context = history.map(h => `${h.role === 'user' ? 'Player' : botName}: ${h.text}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are ${botName}, a pro player in Blox 2026. 
      Respond to: ${context}. 
      Style: Modern gamer 2026 (hype, gg, fr fr, no cap) but with 2011 nostalgia. Max 10 words.`,
      config: { 
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 50 }
      }
    });
    return response.text || "fr fr looks good";
  } catch (e) {
    return "gg!";
  }
}
