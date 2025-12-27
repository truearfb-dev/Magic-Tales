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

    // Здесь теперь должен быть ключ от VseGPT
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'Server configuration error: API_KEY is missing' });
    }

    try {
        const body = request.body;
        const { name, hero, topic, customTopic } = body;

        const finalTopic = topic === "Свой вариант" ? customTopic : topic;
        
        // ВЫБОР МОДЕЛИ VSEGPT
        // openai/gpt-4o-mini - сейчас это лучший выбор по соотношению цена/качество для простых задач.
        // Она стоит копейки и работает очень быстро.
        const MODEL = 'openai/gpt-4o-mini'; 
        const VSEGPT_URL = 'https://api.vsegpt.ru/v1/chat/completions';

        const systemPrompt = `Ты — талантливый детский писатель.
        Твоя задача — написать добрую сказку (около 150-200 слов).
        
        ВАЖНО: Твой ответ должен быть СТРОГО валидным JSON объектом. Не пиши никакого вступительного текста или markdown (типа \`\`\`json), просто верни сырой JSON.
        
        Структура JSON:
        {
            "title": "Креативный заголовок (3-5 слов), просклоняй имя героя",
            "content": "Текст сказки. Раздели на 3-4 абзаца символами \\n"
        }
        
        Стиль: Мягкий, волшебный, убаюкивающий.`;

        const userPrompt = `Напиши сказку для ребенка по имени ${name}.
        Главный герой: ${hero}.
        Сюжет учит: ${finalTopic || "доброте"}.`;

        const apiResponse = await fetch(VSEGPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                // response_format: { type: "json_object" } // Гарантирует JSON на поддерживаемых моделях
                response_format: { type: "json_object" }
            })
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({}));
            console.error("VseGPT Error:", errorData);
            throw new Error(`API Error: ${apiResponse.status} ${JSON.stringify(errorData)}`);
        }

        const data = await apiResponse.json();
        
        // OpenAI формат ответа: choices[0].message.content
        const contentString = data.choices?.[0]?.message?.content;

        if (!contentString) {
            throw new Error("Пустой ответ от нейросети.");
        }

        // Мы возвращаем { text: ... } чтобы сохранить совместимость с фронтендом,
        // который ожидает поле text с JSON-строкой внутри.
        return response.status(200).json({ text: contentString });

    } catch (error: any) {
        console.error("Server API Error:", error);
        
        let status = 500;
        let message = error.message || 'Internal Server Error';

        if (message.includes('429') || message.includes('insufficient_quota')) {
            status = 429;
            message = 'Превышен лимит запросов или закончился баланс.';
        }

        return response.status(status).json({ 
            error: message 
        });
    }
}