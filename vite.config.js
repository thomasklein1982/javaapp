import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,eot,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 3000000,
      },
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'icon-transparent.png','Logo.png', 'additionalJSCode.js','icon-transparent.png','assets/primeicons.c9eaf535.eot','assets/*.ttf'],  
      //assetsInclude: ["assets/*.ttf"],
      manifest: {
        name: 'JavaApp',
        description: 'Erstelle deine eigenen Apps mit Java',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icon512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
  base: "./"
})
