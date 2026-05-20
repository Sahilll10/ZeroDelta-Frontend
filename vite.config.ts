import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  // Force the build output to be clear and simple
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Point explicitly to the root index.html
      input: {
        app: './index.html',
      },
    },
  },
  resolve: {
    alias: {
      // Use absolute pathing for the @ alias
      "@": path.resolve(__dirname, "./src"),
    },
  },
});