import React, { useState } from 'react';

// Имя вашего канала
const TELEGRAM_CHANNEL_USERNAME = '@groupaifaily';
const TELEGRAM_CHANNEL_LINK = 'https://t.me/groupaifaily';

interface SubscriptionModalProps {
    onUnlock: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onUnlock }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckSubscription = async () => {
        setIsLoading(true);
        setError(null);

        // Получаем данные пользователя из Telegram
        const webApp = window.Telegram?.WebApp;
        const user = webApp?.initDataUnsafe?.user;

        // СТРОГАЯ ПРОВЕРКА: Если нет User ID, мы не можем проверить подписку.
        // Раньше тут был пропуск для отладки, теперь его нет.
        if (!user || !user.id) {
            setError("Ошибка: Не удалось определить ваш Telegram ID. Попробуйте перезапустить приложение через меню бота.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/check-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    channelUsername: TELEGRAM_CHANNEL_USERNAME
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Обработка ошибок сервера
                if (data.details && data.details.includes("chat not found")) {
                    throw new Error("Ошибка настройки: Бот не является администратором канала @groupaifaily.");
                }
                throw new Error(data.error || "Ошибка соединения с сервером проверки.");
            }

            if (data.subscribed) {
                // Успех!
                onUnlock();
            } else {
                // Если API вернул false - значит пользователь точно не подписан (или статус 'left'/'kicked')
                setError("Система пока не видит вашу подписку. Подпишитесь и нажмите кнопку снова.");
            }

        } catch (err: any) {
            console.error("Sub check error:", err);
            setError(err.message || "Не удалось проверить подписку. Попробуйте позже.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-[#0B1026]/90 backdrop-blur-sm transition-opacity"></div>
            
            <div className="relative bg-[#161D36] border border-[#2D3766] rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center transform transition-all animate-bounce-in">
                <div className="w-16 h-16 bg-[#FDE047]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[#FDE047]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Сказка почти готова!</h3>
                <p className="text-gray-400 mb-6">
                    Чтобы прочитать волшебную историю, пожалуйста, подпишитесь на наш Telegram канал.
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-xs">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <a 
                        href={TELEGRAM_CHANNEL_LINK} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                        </svg>
                        Подписаться на канал
                    </a>

                    <button 
                        onClick={handleCheckSubscription}
                        disabled={isLoading}
                        className="block w-full bg-transparent border-2 border-[#2D3766] hover:border-[#FDE047] text-gray-300 hover:text-[#FDE047] font-semibold py-3 px-4 rounded-xl transition-all flex justify-center items-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-[#FDE047]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Я подписался'}
                    </button>
                </div>
            </div>
        </div>
    );
};