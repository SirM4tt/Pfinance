import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'production'
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            manifest: {
              name: 'Pfinance',
              short_name: 'Pfinance',
              theme_color: '#0f0f1a',
              background_color: '#0f0f1a',
              display: 'standalone',
              icons: [
                { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
              ],
            },
          }),
        ]
      : []),
  ],
}))
