import React, { useState } from 'react';

// ВСТАВЬТЕ ССЫЛКУ НА ВАШ КАНАЛ ЗДЕСЬ
const TELEGRAM_CHANNEL_LINK = 'https://t.me/groupaifaily';

interface SubscriptionModalProps {
    onUnlock: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onUnlock }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckSubscription = () => {
        setIsLoading(true);
        // Имитация проверки подписки (задержка 2 секунды)
        // В реальном приложении здесь может быть запрос к вашему боту
        setTimeout(() => {
            setIsLoading(false);
            onUnlock();
        }, 2000);
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
                <p className="text-gray-400 mb-8">
                    Чтобы прочитать волшебную историю, пожалуйста, подпишитесь на наш Telegram канал.
                </p>

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
                        className="block w-full bg-transparent border-2 border-[#2D3766] hover:border-[#FDE047] text-gray-300 hover:text-[#FDE047] font-semibold py-3 px-4 rounded-xl transition-all"
                    >
                        {isLoading ? 'Проверяем подписку...' : 'Я подписался'}
                    </button>
                </div>
            </div>
        </div>
    );
};