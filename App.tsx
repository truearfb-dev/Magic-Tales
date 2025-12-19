import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { StoryBook } from './components/StoryBook';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { generateStory } from './services/geminiService';
import { StoryParams, AppState } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [story, setStory] = useState<string>('');
  const [params, setParams] = useState<StoryParams | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerate = async (inputParams: StoryParams) => {
    setParams(inputParams);
    setAppState(AppState.GENERATING);
    setErrorMessage('');
    
    try {
      const generatedStory = await generateStory(inputParams);
      setStory(generatedStory);
      // Once generated, move to LOCKED state (the Sub Lock feature)
      setAppState(AppState.LOCKED);
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      // Extract meaningful error message
      const msg = error?.message || "Неизвестная ошибка";
      setErrorMessage(msg);
      
      // Auto-reset after 5 seconds to let user try again
      setTimeout(() => {
        setAppState(AppState.INPUT);
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleUnlock = () => {
      // Simulate "Unlocking" state if needed, or go straight to READING
      setAppState(AppState.UNLOCKING);
      setTimeout(() => {
          setAppState(AppState.READING);
      }, 500); // Short transition
  };

  const handleReset = () => {
    setStory('');
    setParams(null);
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
          <InputForm onSubmit={handleGenerate} isGenerating={false} />
        )}

        {appState === AppState.GENERATING && (
           <>
             {/* We keep the form visible but maybe blurred or just show the overlay on top */}
             <InputForm onSubmit={() => {}} isGenerating={true} />
             <LoadingOverlay />
           </>
        )}

        {appState === AppState.ERROR && (
            <div className="max-w-md w-full text-center p-8 bg-red-900/80 backdrop-blur-md border border-red-500 rounded-xl shadow-2xl animate-bounce-in">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Упс! Магия дала сбой</h3>
                <p className="text-red-200 mb-4">{errorMessage}</p>
                <p className="text-sm text-gray-400">Попробуйте еще раз через пару секунд...</p>
            </div>
        )}

        {appState === AppState.LOCKED && (
           <>
              <LoadingOverlay /> {/* Keep loading aesthetic in bg if desired, or just blur */}
              <SubscriptionModal onUnlock={handleUnlock} />
           </>
        )}

         {appState === AppState.UNLOCKING && (
            <LoadingOverlay />
        )}

        {appState === AppState.READING && params && (
          <StoryBook 
            title={`Сказка про ${params.hero}`} 
            content={story} 
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