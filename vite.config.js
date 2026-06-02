import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    strictPort: true,
    allowedHosts: 'all',
    hmr: { clientPort: 443, protocol: 'wss' },
    cors: true
  },
  preview: { host: true, allowedHosts: 'all' }
})
