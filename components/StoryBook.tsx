import React from 'react';

interface StoryBookProps {
    title: string;
    content: string;
    onReset: () => void;
}

export const StoryBook: React.FC<StoryBookProps> = ({ title, content, onReset }) => {
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in relative z-10 px-4 pb-12">
            <div className="bg-[#FFFDF5] text-[#1F2937] rounded-sm md:rounded-r-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative min-h-[60vh] flex flex-col">
                {/* Book Spine / Binding Effect (Left side decorative) */}
                <div className="absolute left-0 top-0 bottom-0 w-2 md:w-4 bg-gradient-to-r from-[#D1D5DB] to-[#F3F4F6] z-20 border-r border-gray-300"></div>
                
                {/* Book Content */}
                <div className="flex-1 p-8 md:p-12 pl-10 md:pl-16 relative">
                     {/* Decorative Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block border-b-2 border-[#FDE047] pb-2 px-4">
                            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Сказка для вас</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1026] mt-6 mb-2 leading-tight">
                            {title}
                        </h2>
                        <div className="flex justify-center items-center gap-2 mt-4 text-[#FDE047]">
                            <span>★</span><span>★</span><span>★</span>
                        </div>
                    </div>

                    {/* Story Text */}
                    <div className="font-serif text-lg md:text-xl leading-relaxed text-gray-800 space-y-6">
                        {paragraphs.map((para, index) => (
                            <p key={index} className={index === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:text-[#0B1026] first-letter:float-left first-letter:mr-2 first-letter:mt-[-10px]" : ""}>
                                {para}
                            </p>
                        ))}
                    </div>

                    {/* Footer / Page Number */}
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 font-serif italic text-sm">
                        Конец
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                 <button 
                    onClick={onReset}
                    className="inline-flex items-center gap-2 text-[#FDE047] hover:text-white font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-[#1F2937]"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path></svg>
                    Создать еще одну
                </button>
            </div>
        </div>
    );
};