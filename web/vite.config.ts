import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-48.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'QuranVoc 80',
        short_name: 'QuranVoc',
        description: 'Learn the 570 most frequent Qur’anic words that cover 82.6% of the text. Spaced repetition, quizzes and verb tables.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#06130e',
        theme_color: '#06130e',
        categories: ['education', 'books'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Study today’s cards', url: '/#/study', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
          { name: 'Take a quiz', url: '/#/practice', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,woff,json}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
});
