import { StoryParams } from "../types";

// Функция паузы
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateStory = async (params: StoryParams, isRetry = false): Promise<{ title: string; content: string }> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });

        // СПЕЦИАЛЬНАЯ ОБРАБОТКА ЛИМИТОВ (Auto-Retry)
        // Если сервер вернул 429 (Too Many Requests) и мы еще не делали повторную попытку
        if (response.status === 429 && !isRetry) {
            console.log("Hit rate limit, retrying in 2.5s...");
            await wait(2500); // Ждем 2.5 секунды (чтобы "остыть" в рамках минутного лимита)
            return generateStory(params, true); // Пробуем снова с флагом isRetry=true
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `HTTP Error ${response.status}` }));
            throw new Error(errorData.error || "Ошибка сервера");
        }

        const data = await response.json();
        const text = data.text;

        if (!text) {
            throw new Error("Пустой ответ от волшебника.");
        }
        
        const jsonResponse = JSON.parse(text);
        return {
            title: jsonResponse.title,
            content: jsonResponse.content
        };

    } catch (error: any) {
        console.error("Story Generation Error:", error);
        
        // Если это повторная ошибка после ретрая - показываем сообщение
        let errorMsg = error.message || "";
        
        if (errorMsg.includes("429") || errorMsg.includes("Quota") || errorMsg.includes("EXHAUSTED") || errorMsg.includes("перегружена")) {
            throw new Error("Сейчас очень много желающих получить сказку! 🪄\n\nПожалуйста, подождите 15-20 секунд и попробуйте снова.");
        }

        if (errorMsg.includes("{") || errorMsg.includes("Wait")) {
             throw new Error("Магия немного сбилась. Пожалуйста, попробуйте еще раз.");
        }

        throw new Error(errorMsg.length < 100 ? errorMsg : "Не удалось создать сказку. Проверьте интернет и попробуйте снова.");
    }
};