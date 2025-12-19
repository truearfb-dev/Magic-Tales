import React from 'react';
import { SavedStory } from '../types';

interface LibraryProps {
    stories: SavedStory[];
    onSelectStory: (story: SavedStory) => void;
    onBack: () => void;
}

export const Library: React.FC<LibraryProps> = ({ stories, onSelectStory, onBack }) => {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={onBack}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h2 className="text-2xl font-serif font-bold text-[#FDE047]">Моя полка</h2>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {stories.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-70 mt-10">
                    <div className="w-20 h-20 bg-[#161D36] rounded-full flex items-center justify-center mb-4 border border-[#2D3766]">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    <p className="text-gray-300">Полка пока пуста.</p>
                    <p className="text-gray-500 text-sm mt-1">Создайте свою первую сказку!</p>
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto pb-8">
                    {stories.slice().reverse().map((story) => (
                        <div 
                            key={story.id}
                            onClick={() => onSelectStory(story)}
                            className="bg-[#161D36] border border-[#2D3766] hover:border-[#FDE047]/50 rounded-xl p-4 cursor-pointer transition-all hover:translate-x-1 group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-serif font-bold text-white text-lg group-hover:text-[#FDE047] transition-colors">{story.title}</h3>
                                <span className="text-xs text-gray-500 bg-[#0B1026] px-2 py-1 rounded-full">{story.date}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">Про {story.hero}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{story.content.substring(0, 100)}...</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};