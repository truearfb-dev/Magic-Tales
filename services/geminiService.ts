import { StoryParams } from "../types";

export const generateStory = async (params: StoryParams): Promise<{ title: string; content: string }> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // Передаем статус ошибки в сообщение, чтобы поймать его в catch
            throw new Error(JSON.stringify(errorData) || `Server Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.text;

        if (!text) {
            throw new Error("Не удалось получить текст сказки от сервера.");
        }
        
        const jsonResponse = JSON.parse(text);
        return {
            title: jsonResponse.title,
            content: jsonResponse.content
        };

    } catch (error: any) {
        console.error("Story Generation Error:", error);
        
        // Пытаемся достать текст ошибки (она может быть внутри JSON строки)
        let errorMsg = error.message || "";
        
        // Проверяем на типичные ошибки лимитов Google API
        const isQuotaError = 
            errorMsg.includes("429") || 
            errorMsg.includes("RESOURCE_EXHAUSTED") || 
            errorMsg.includes("Quota exceeded") ||
            errorMsg.includes("limit");

        if (isQuotaError) {
            throw new Error("Слишком много желающих получить сказку прямо сейчас. Магический кристалл перегрелся! 🪄\n\nПожалуйста, подождите минутку и попробуйте снова.");
        }

        if (errorMsg.includes("504") || errorMsg.includes("timeout")) {
            throw new Error("Сказка сочиняется дольше обычного. Пожалуйста, попробуйте еще раз.");
        }

        // Если ошибка выглядит как технический JSON (как на скриншоте), скрываем её
        if (errorMsg.includes("{") && errorMsg.includes("error")) {
             throw new Error("Произошла небольшая магическая заминка. Попробуйте нажать кнопку еще раз.");
        }

        throw new Error("Не удалось создать сказку. Проверьте интернет и попробуйте снова.");
    }
};