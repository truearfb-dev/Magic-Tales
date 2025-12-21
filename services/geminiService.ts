import { StoryParams } from "../types";

export const generateStory = async (params: StoryParams): Promise<{ title: string; content: string }> => {
    try {
        // Теперь мы отправляем запрос на НАШ сервер (Vercel), а не в Google напрямую.
        // Сервер сам свяжется с Google, и ошибка геолокации исчезнет.
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server Error: ${response.status}`);
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
        
        let friendlyMessage = "Ошибка соединения с магическим кристаллом.";
        const technicalDetails = error.message || "Unknown error";

        if (technicalDetails.includes("504") || technicalDetails.includes("timeout")) {
            friendlyMessage = "Магия творится слишком долго, попробуйте еще раз.";
        } else if (technicalDetails.includes("429")) {
            friendlyMessage = "Слишком много желающих получить сказку. Подождите минутку.";
        }

        throw new Error(`${friendlyMessage} (Детали: ${technicalDetails})`);
    }
};