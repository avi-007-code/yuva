import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'kandice-unbreached-misapprehensively.ngrok-free.dev', // ✅ add your ngrok domain
    ],
  },
})
