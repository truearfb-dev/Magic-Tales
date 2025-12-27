import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // Мы убрали секцию define с API_KEY, так как ключ теперь используется 
    // ТОЛЬКО в серверной функции api/generate.ts и не должен попадать в браузер.
  };
});