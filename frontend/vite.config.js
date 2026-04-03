import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@theme/tailwindcss-vite' // Import ini

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tambahkan ini
  ],
})