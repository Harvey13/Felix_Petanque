import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import fs from 'fs';

// Plugin pour copier le service worker
const copyServiceWorker = () => {
  return {
    name: 'copy-service-worker',
    writeBundle() {
      const srcPath = resolve(__dirname, 'public/service-worker.js');
      const destPath = resolve(__dirname, 'dist/service-worker.js');
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['petanque.svg'],
      manifest: {
        name: 'Tirage Équipes',
        short_name: 'Tirage',
        description: 'Application de tirage au sort d\'équipes de pétanque',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    copyServiceWorker()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});