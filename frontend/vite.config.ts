import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: '/sax/', // GitHub Pages base path
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8020', // Local backend for development
        changeOrigin: true,
      },
    },
  },
  define: {
    // Inject the backend URL based on environment
    '__API_BASE_URL__': mode === 'production' 
      ? JSON.stringify('https://sax-enuz.onrender.com')
      : JSON.stringify(''), // Empty in dev to use proxy
  },
}))
