import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo192.svg', 'logo512.svg'],
      manifest: {
        name: 'despesaJusta - Divida despesas de forma justa',
        short_name: 'despesaJusta',
        description: 'Divida despesas de forma justa e simples',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/svg+xml'
          },
          {
            src: 'logo192.svg',
            type: 'image/svg+xml',
            sizes: '192x192'
          },
          {
            src: 'logo512.svg',
            type: 'image/svg+xml',
            sizes: '512x512'
          }
        ]
      }
    })
  ],
})
