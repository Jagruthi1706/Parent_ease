
import { GoogleGenAI, Type } from "@google/genai";
import { Task, MealPlan, BudgetEntry } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSchedule = async (tasks: Task[], context: string) => {
  const prompt = `You are an AI parenting assistant. Here is a list of family tasks: ${JSON.stringify(tasks)}. 
  The parent's context: ${context}. 
  Please prioritize these tasks and suggest an optimal schedule for today. 
  Explain why you prioritized them this way.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const getBudgetAdvice = async (entries: BudgetEntry[]) => {
  const prompt = `Review these family expenses: ${JSON.stringify(entries)}. Provide 3 concrete tips on how to save money next month while maintaining quality of life for the kids.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text;
};

export const getMealSuggestions = async (preferences: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest a weekly meal plan (7 days) for a family with these preferences: ${preferences}. Return a JSON array of daily meal objects.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            breakfast: { type: Type.STRING },
            lunch: { type: Type.STRING },
            dinner: { type: Type.STRING },
            snacks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["day", "breakfast", "lunch", "dinner", "snacks"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as MealPlan[];
};

export const getSupportAdvice = async (query: string, chatHistory: {role: string, text: string}[]) => {
  const contents = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: query }] });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: "You are Parent Ease, a supportive AI assistant for parents. Focus on blue-themed efficiency and empathetic guidance."
    }
  });

  return response.text;
};
