import { GoogleGenAI } from "@google/genai";
import { StoryParams } from "../types";

// Initialize Gemini Client
// We add a fallback to empty string to prevent the app from crashing with "White Screen" 
// on load if the process.env.API_KEY is undefined during build/runtime initialization.
const apiKey = process.env.API_KEY || ""; 
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateStory = async (params: StoryParams): Promise<string> => {
    if (!apiKey) {
        console.error("API Key is missing!");
        throw new Error("API Key is missing. Please check your Vercel settings.");
    }

    const topic = params.topic === "Свой вариант" ? params.customTopic : params.topic;
    
    // We use gemini-3-flash-preview as it is the recommended model for text tasks in the system instructions
    // providing a good balance of speed and quality for creative writing.
    const model = 'gemini-3-flash-preview'; 

    const prompt = `Напиши короткую (около 150-200 слов), добрую и поучительную сказку на ночь на русском языке для ребенка по имени ${params.name}. 
    Главный герой: ${params.hero}. 
    Сюжет должен учить: ${topic || "доброте"}. 
    Стиль: мягкий, уютный, сказочный, как в старых книгах сказок. 
    Используй красивые эпитеты.
    Разбей текст на 3-4 небольших абзаца для удобного чтения с телефона.
    Не пиши никаких вступлений типа "Вот сказка", просто начни повествование.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: 0.8, // Slightly creative
                topK: 40,
                topP: 0.95,
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("No story generated");
        }
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};