import { GoogleGenAI, Type } from "@google/genai";
import { StoryParams } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ""; 
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateStory = async (params: StoryParams): Promise<{ title: string; content: string }> => {
    // Check if key exists immediately
    if (!apiKey) {
        console.error("API Key is missing in the build!");
        throw new Error("API Key не найден. Добавьте переменную API_KEY в настройках Vercel и пересоберите проект (Redeploy).");
    }

    const topic = params.topic === "Свой вариант" ? params.customTopic : params.topic;
    
    // Using gemini-3-flash-preview as recommended for text tasks
    const model = 'gemini-3-flash-preview'; 

    const prompt = `Ты — талантливый детский писатель.
    Напиши добрую сказку (около 150-200 слов) для ребенка по имени ${params.name}.
    Главный герой: ${params.hero}.
    Сюжет учит: ${topic || "доброте"}.

    Требования к ответу (JSON):
    1. "title": Придумай ЛИТЕРАТУРНЫЙ, креативный заголовок (3-5 слов).
       ВАЖНО: Обязательно просклоняй имя героя в заголовке, если нужно (например, не "Про Смелый Зайчик", а "Приключения Смелого Зайчика").
    2. "content": Текст сказки. Раздели его на 3-4 логических абзаца. Используй символ переноса строки (\\n) между абзацами.
    3. Стиль: Мягкий, волшебный, убаюкивающий.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: 0.7, // Чуть ниже для большей связности
                topK: 40,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "Креативный заголовок сказки с правильным склонением имен.",
                        },
                        content: {
                            type: Type.STRING,
                            description: "Текст сказки с переносами строк.",
                        },
                    },
                    required: ["title", "content"],
                },
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("Не удалось сгенерировать текст сказки.");
        }
        
        // Parse JSON response
        const jsonResponse = JSON.parse(text);
        return {
            title: jsonResponse.title,
            content: jsonResponse.content
        };

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        
        // Если это наша кастомная ошибка про ключ - пробрасываем её
        if (error.message && error.message.includes("API Key не найден")) {
            throw error;
        }

        // Формируем более понятное сообщение об ошибке
        let friendlyMessage = "Ошибка соединения с магическим кристаллом (API).";
        
        // Добавляем технические детали из ответа API, если они есть
        const technicalDetails = error.message || error.statusText || JSON.stringify(error);
        
        // Проверяем распространенные коды ошибок
        if (technicalDetails.includes("429")) {
            friendlyMessage = "Слишком много запросов. Магии нужно немного отдохнуть.";
        } else if (technicalDetails.includes("503") || technicalDetails.includes("500")) {
            friendlyMessage = "Магический сервер временно недоступен.";
        } else if (technicalDetails.includes("SAFETY")) {
            friendlyMessage = "Сказка не прошла магический контроль безопасности (попробуйте другую тему).";
        }

        throw new Error(`${friendlyMessage} (Детали: ${technicalDetails})`);
    }
};