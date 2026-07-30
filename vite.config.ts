import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        routes: ['/'],
      },
    }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 4173,
  },
});
