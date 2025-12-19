import React from 'react';

export const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0B1026]/80 backdrop-blur-md">
            <div className="relative">
                {/* Main Spinner */}
                <div className="w-20 h-20 border-4 border-[#FDE047]/30 border-t-[#FDE047] rounded-full animate-spin"></div>
                
                {/* Sparkling Stars Animation */}
                <div className="absolute top-0 left-0 w-full h-full animate-pulse">
                    <span className="absolute top-[-10px] left-[50%] text-[#FDE047] text-xl animate-bounce">✨</span>
                    <span className="absolute bottom-[-5px] right-[10%] text-[#FDE047] text-sm animate-ping">★</span>
                    <span className="absolute top-[40%] left-[-20px] text-[#FDE047] text-lg animate-pulse">✦</span>
                </div>
            </div>
            <h2 className="mt-8 text-xl font-serif text-[#FDE047] animate-pulse">Волшебство случается...</h2>
            <p className="mt-2 text-gray-400 text-sm">Пишем вашу сказку</p>
        </div>
    );
};