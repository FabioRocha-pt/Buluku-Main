import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // 0.0.0.0
    port: 5173,
    hmr: { host: '192.168.0.122', protocol: 'ws', port: 5173 }
  }
})
