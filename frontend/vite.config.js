import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import commonjs from 'vite-plugin-commonjs';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000, 
  },

  plugins: [
    react(),
    tailwindcss(),
    commonjs()
  ],
})
