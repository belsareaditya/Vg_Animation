import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // allow connections from outside container
    port: 5173         // optional (default is 5173 for dev)
  },
  preview: {
    host: '0.0.0.0',   // same for vite preview mode
    port: 5173         // match your logs (or switch to 5173 if you prefer)
  }
})
