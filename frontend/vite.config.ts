import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Docker/Render içinde tüm arayüzlerde dinle (0.0.0.0)
    allowedHosts: [
      'resilengine-frontend.onrender.com',
    ],
  },
})
