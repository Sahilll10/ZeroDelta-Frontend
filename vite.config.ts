import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the Tailwind Vite plugin
import path from "path";

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(), // ADD THIS: This handles the CSS processing
    react()
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        app: './index.html',
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});