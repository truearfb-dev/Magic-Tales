import { GoogleGenAI, Type } from "@google/genai";

// Vercel Serverless Function definition
export default async function handler(request: any, response: any) {
    // Настройка CORS
    response.setHeader('Access-Control-Allow-Credentials', "true");
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'Server configuration error: API_KEY is missing' });
    }

    try {
        const body = request.body;
        const { name, hero, topic, customTopic } = body;

        const finalTopic = topic === "Свой вариант" ? customTopic : topic;
        
        // Переключаем на gemini-2.0-flash для большей стабильности
        // gemini-3-flash-preview часто выдает 429 Quota Exceeded в бесплатном тире
        const model = 'gemini-2.0-flash'; 

        const prompt = `Ты — талантливый детский писатель.
        Напиши добрую сказку (около 150-200 слов) для ребенка по имени ${name}.
        Главный герой: ${hero}.
        Сюжет учит: ${finalTopic || "доброте"}.

        Требования к ответу (JSON):
        1. "title": Придумай ЛИТЕРАТУРНЫЙ, креативный заголовок (3-5 слов).
           ВАЖНО: Обязательно просклоняй имя героя в заголовке, если нужно (например, не "Про Смелый Зайчик", а "Приключения Смелого Зайчика").
        2. "content": Текст сказки. Раздели его на 3-4 логических абзаца. Используй символ переноса строки (\\n) между абзацами.
        3. Стиль: Мягкий, волшебный, убаюкивающий.
        `;

        const ai = new GoogleGenAI({ apiKey });
        
        const result = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: 0.7,
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

        return response.status(200).json({ text: result.text });

    } catch (error: any) {
        console.error("Server API Error:", error);
        
        // Определяем статус ответа
        let status = 500;
        let message = error.message || 'Internal Server Error';

        if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
            status = 429;
            message = 'Слишком много запросов. Попробуйте через минуту.';
        }

        return response.status(status).json({ 
            error: message 
        });
    }
}