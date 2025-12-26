import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { StoryBook } from './components/StoryBook';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Library } from './components/Library';
import { generateStory } from './services/geminiService';
import { StoryParams, AppState, SavedStory } from './types';

const STORAGE_KEY = 'magic_tales_library';
const SUBSCRIPTION_KEY = 'magic_tales_is_subscribed';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [generatedStoryData, setGeneratedStoryData] = useState<{ title: string; content: string } | null>(null);
  const [params, setParams] = useState<StoryParams | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  
  // Инициализируем состояние сразу из LocalStorage (Lazy Initialization)
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(() => {
      if (typeof window !== 'undefined') {
          return localStorage.getItem(SUBSCRIPTION_KEY) === 'true';
      }
      return false;
  });

  // Инициализация Telegram Mini App и загрузка историй
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      try {
        tg.setHeaderColor('#0B1026');
        tg.setBackgroundColor('#0B1026');
      } catch (e) {
        console.log("Error setting header color", e);
      }
    }

    // Load stories from local storage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedStories(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stories", e);
      }
    }
  }, []);

  const saveStoryToLibrary = (title: string, content: string, hero: string) => {
    const newStory: SavedStory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ru-RU'),
        title,
        content,
        hero
    };
    const updatedStories = [...savedStories, newStory];
    setSavedStories(updatedStories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
  };

  const handleGenerate = async (inputParams: StoryParams) => {
    setParams(inputParams);
    setAppState(AppState.GENERATING);
    setErrorMessage('');
    
    try {
      const storyData = await generateStory(inputParams);
      setGeneratedStoryData(storyData);
      
      // Auto-save successful story
      saveStoryToLibrary(storyData.title, storyData.content, inputParams.hero);

      const isSubscribed = isUserSubscribed || localStorage.getItem(SUBSCRIPTION_KEY) === 'true';

      if (isSubscribed) {
          setAppState(AppState.READING);
      } else {
          setAppState(AppState.LOCKED);
      }
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      const msg = error?.message || "Неизвестная ошибка";
      setErrorMessage(msg);
    }
  };

  const handleUnlock = () => {
      localStorage.setItem(SUBSCRIPTION_KEY, 'true');
      setIsUserSubscribed(true);

      setAppState(AppState.UNLOCKING);
      setTimeout(() => {
          setAppState(AppState.READING);
      }, 500);
  };

  // Полный сброс (для кнопки "Создать новую")
  const handleReset = () => {
    setGeneratedStoryData(null);
    setParams(null);
    setAppState(AppState.INPUT);
    setErrorMessage('');
  };

  // Повторная попытка (для кнопки "Попробовать снова" при ошибке)
  const handleRetry = () => {
    if (params) {
        handleGenerate(params);
    } else {
        // Если параметров по какой-то причине нет, возвращаем на ввод
        handleReset();
    }
  };

  const handleOpenLibrary = () => {
    setAppState(AppState.LIBRARY);
  };

  const handleSelectStory = (story: SavedStory) => {
    setGeneratedStoryData({ title: story.title, content: story.content });
    setAppState(AppState.READING);
  };

  const handleBackToInput = () => {
    setAppState(AppState.INPUT);
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden flex flex-col">
       {/* Background Elements */}
       <div className="stars-bg absolute inset-0 z-0 pointer-events-none"></div>
       <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#2A3C82] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
       <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FDE047] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-5xl mx-auto">
        
        {appState === AppState.INPUT && (
          <InputForm 
            onSubmit={handleGenerate} 
            onOpenLibrary={handleOpenLibrary}
            isGenerating={false} 
          />
        )}

        {appState === AppState.LIBRARY && (
            <Library 
                stories={savedStories} 
                onSelectStory={handleSelectStory} 
                onBack={handleBackToInput} 
            />
        )}

        {appState === AppState.GENERATING && (
           <>
             <InputForm onSubmit={() => {}} onOpenLibrary={()=>{}} isGenerating={true} />
             <LoadingOverlay />
           </>
        )}

        {appState === AppState.ERROR && (
            <div className="max-w-md w-full text-center p-8 bg-red-900/80 backdrop-blur-md border border-red-500 rounded-xl shadow-2xl animate-bounce-in relative z-50">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Упс! Магия дала сбой</h3>
                <p className="text-red-200 mb-6 text-sm break-words">{errorMessage}</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleRetry}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-red-500/30 transform hover:scale-105"
                    >
                        Попробовать снова
                    </button>
                    <button 
                        onClick={handleReset}
                        className="text-gray-400 hover:text-white text-sm underline decoration-gray-500 hover:decoration-white transition-all"
                    >
                        Изменить данные
                    </button>
                </div>
            </div>
        )}

        {appState === AppState.LOCKED && (
           <>
              <LoadingOverlay />
              <SubscriptionModal onUnlock={handleUnlock} />
           </>
        )}

         {appState === AppState.UNLOCKING && (
            <LoadingOverlay />
        )}

        {appState === AppState.READING && generatedStoryData && (
          <StoryBook 
            title={generatedStoryData.title} 
            content={generatedStoryData.content} 
            onReset={handleReset} 
          />
        )}

      </main>

      <footer className="p-6 text-center text-gray-600 text-sm relative z-10">
        <p>&copy; {new Date().getFullYear()} Magic Tales. Сделано с любовью и магией AI.</p>
      </footer>
    </div>
  );
}

export default App;