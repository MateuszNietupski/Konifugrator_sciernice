import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'vendor-mui';
            }
            if (id.includes('react')) {
              return 'vendor-core';
            }
            return 'vendor-libs';
          }
          if (id.includes('src/data/')) {
            return 'app-data';
          }
        }
      }
    }
  },
});