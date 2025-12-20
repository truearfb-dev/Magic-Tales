export interface StoryParams {
    name: string;
    hero: string;
    topic: string;
    customTopic?: string;
}

export interface SavedStory {
    id: string;
    date: string;
    title: string;
    content: string;
    hero: string;
}

export enum AppState {
    INPUT = 'INPUT',
    GENERATING = 'GENERATING',
    LOCKED = 'LOCKED',
    UNLOCKING = 'UNLOCKING',
    READING = 'READING',
    LIBRARY = 'LIBRARY',
    ERROR = 'ERROR'
}

export const TOPICS = [
    "Чистить зубки",
    "Делиться игрушками",
    "Убрать комнату",
    "Не бояться темноты",
    "Свой вариант"
];

// Объявляем типы для Telegram WebApp, чтобы TypeScript не ругался
declare global {
    interface Window {
        Telegram: any;
    }
}