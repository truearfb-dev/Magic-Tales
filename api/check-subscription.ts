export default async function handler(request: any, response: any) {
    // Настройка CORS
    response.setHeader('Access-Control-Allow-Credentials', "true");
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

    // Очищаем токен от пробелов, если они случайно попали при копировании
    const botToken = process.env.BOT_TOKEN ? process.env.BOT_TOKEN.trim() : "";
    
    if (!botToken) {
        return response.status(500).json({ error: 'Server config error: BOT_TOKEN is missing' });
    }

    try {
        const { userId, channelUsername } = request.body;

        if (!userId || !channelUsername) {
            return response.status(400).json({ error: 'Missing userId or channelUsername' });
        }

        // Формируем запрос к API Telegram
        const tgUrl = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelUsername}&user_id=${userId}`;
        
        const tgResponse = await fetch(tgUrl);
        const tgData = await tgResponse.json();

        if (!tgData.ok) {
            console.error('Telegram API Error:', tgData);
            return response.status(400).json({ error: 'Failed to verify with Telegram', details: tgData.description });
        }

        const status = tgData.result.status;
        console.log(`User ${userId} status in ${channelUsername}: ${status}`);
        
        // creator - создатель
        // administrator - админ
        // member - подписчик
        // restricted - ограниченный подписчик (считаем за подписчика)
        const isSubscribed = ['creator', 'administrator', 'member', 'restricted'].includes(status);

        return response.status(200).json({ 
            subscribed: isSubscribed,
            debugStatus: status // Возвращаем статус для отладки, если понадобится
        });

    } catch (error: any) {
        console.error("Subscription Check Error:", error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}