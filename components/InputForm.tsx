import React, { useState } from 'react';
import { StoryParams, TOPICS } from '../types';

interface InputFormProps {
    onSubmit: (params: StoryParams) => void;
    isGenerating: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating }) => {
    const [name, setName] = useState('');
    const [hero, setHero] = useState('');
    const [topic, setTopic] = useState(TOPICS[0]);
    const [customTopic, setCustomTopic] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !hero) return;
        onSubmit({ name, hero, topic, customTopic });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6 p-6 bg-[#161D36] rounded-2xl border border-[#2D3766] shadow-xl relative z-10">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-[#FDE047] mb-2 font-serif tracking-wide">Magic Tales</h1>
                <p className="text-gray-400 text-sm">Создайте волшебную историю для вашего ребенка</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-semibold">Имя ребенка</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Например: Аня"
                        className="w-full bg-[#0B1026] border border-[#2D3766] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FDE047] focus:ring-1 focus:ring-[#FDE047] transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-semibold">Главный герой</label>
                    <input 
                        type="text" 
                        value={hero}
                        onChange={(e) => setHero(e.target.value)}
                        placeholder="Например: Смелый Зайчик"
                        className="w-full bg-[#0B1026] border border-[#2D3766] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FDE047] focus:ring-1 focus:ring-[#FDE047] transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-semibold">Чему учит сказка?</label>
                    <div className="relative">
                        <select 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full bg-[#0B1026] border border-[#2D3766] rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#FDE047] focus:ring-1 focus:ring-[#FDE047] transition-all"
                        >
                            {TOPICS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#FDE047]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                {topic === "Свой вариант" && (
                     <div className="animate-fade-in-down">
                        <label className="block text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-semibold">Ваша тема</label>
                        <input 
                            type="text" 
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="Например: Почему важно кушать кашу"
                            className="w-full bg-[#0B1026] border border-[#2D3766] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FDE047] focus:ring-1 focus:ring-[#FDE047] transition-all"
                            required
                        />
                    </div>
                )}
            </div>

            <button 
                type="submit" 
                disabled={isGenerating}
                className="w-full mt-8 bg-gradient-to-r from-[#FDE047] to-[#FACC15] hover:from-[#FACC15] hover:to-[#EAB308] text-[#0B1026] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(253,224,71,0.3)] transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-[#0B1026]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Сочиняем...
                    </>
                ) : (
                    <>
                        <span>✨ Создать Сказку</span>
                    </>
                )}
            </button>
        </form>
    );
};