export interface StoryParams {
    name: string;
    hero: string;
    topic: string;
    customTopic?: string;
}

export enum AppState {
    INPUT = 'INPUT',
    GENERATING = 'GENERATING',
    LOCKED = 'LOCKED',
    UNLOCKING = 'UNLOCKING',
    READING = 'READING',
    ERROR = 'ERROR'
}

export const TOPICS = [
    "Чистить зубки",
    "Делиться игрушками",
    "Убрать комнату",
    "Не бояться темноты",
    "Свой вариант"
];