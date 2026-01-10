import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa";
import prism from 'vite-plugin-prismjs';

export default defineConfig(({mode})=>{
  let manifest;
  if(mode=="web"){
    manifest={
      name: 'WebEd',
      description: 'Erstelle Webseiten mit HTML, CSS und JavaScript',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'web-icon-128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: 'web-icon-big.png',
          sizes: '512x512',
          type: 'image/png',
        }
      ]
    };
  }else{
    manifest={
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
    };
  }
  let standard={
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
          maximumFileSizeToCacheInBytes: 4000000,
        },
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'icon-transparent.png','Logo.png', 'additionalJSCode.js','icon-transparent.png','assets/primeicons.c9eaf535.eot','assets/*.ttf'],  
        //assetsInclude: ["assets/*.ttf"],
        manifest: manifest 
      }),
      prism({
        languages: ['javascript', 'css', 'html', 'java'],
        plugins: ['line-numbers','normalize-whitespace'],
        theme: 'coy',
        css: true,
      })
    ],
    base: "./"
  };
  if(mode==="production"){

  }
  return standard;
})
