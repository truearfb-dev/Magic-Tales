import { GoogleGenAI } from "@google/genai";
import { StoryParams } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ""; 
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateStory = async (params: StoryParams): Promise<string> => {
    // Check if key exists immediately
    if (!apiKey) {
        console.error("API Key is missing in the build!");
        throw new Error("API Key не найден. Добавьте переменную API_KEY в настройках Vercel и пересоберите проект (Redeploy).");
    }

    const topic = params.topic === "Свой вариант" ? params.customTopic : params.topic;
    
    // Using gemini-3-flash-preview as recommended for text tasks
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
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("Не удалось сгенерировать текст сказки.");
        }
        return text;
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        // Pass through the specific API key error if we caught it earlier, or a generic one
        if (error.message.includes("API Key")) {
            throw error;
        }
        throw new Error("Ошибка соединения с магическим кристаллом (API). Попробуйте позже.");
    }
};