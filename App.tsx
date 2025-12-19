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

  const handleGenerate = async (inputParams: StoryParams) => {
    setParams(inputParams);
    setAppState(AppState.GENERATING);
    
    try {
      const generatedStory = await generateStory(inputParams);
      setStory(generatedStory);
      // Once generated, move to LOCKED state (the Sub Lock feature)
      setAppState(AppState.LOCKED);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      // In a real app, show toast error here
      setTimeout(() => setAppState(AppState.INPUT), 3000);
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
            <div className="text-center p-8 bg-red-900/50 border border-red-500 rounded-xl">
                <p className="text-white text-lg">Упс! Магия дала сбой. Попробуйте снова.</p>
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