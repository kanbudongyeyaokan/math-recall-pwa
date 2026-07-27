import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('katex')) return 'math-renderer'
          if (id.includes('dexie')) return 'local-database'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react')) return 'react-runtime'
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'pwa-icon-192.png', 'pwa-icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: '斗破数学 · 何耀焜的交大斗魂之路',
        short_name: '斗破数学',
        description: '按高数讲次自由做题，在交大斗魂主线中积累经验、灵石、称号与装备',
        theme_color: '#101814',
        background_color: '#f3f3ef',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        start_url: '.',
        scope: '.',
        id: '.',
        lang: 'zh-CN',
        categories: ['education', 'productivity'],
        prefer_related_applications: false,
        shortcuts: [
          {
            name: '选择讲次做题',
            short_name: '开始做题',
            description: '打开高数18讲地图',
            url: '.',
            icons: [{ src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ],
        icons: [
          {
            src: 'pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html'
      }
    })
  ]
})
