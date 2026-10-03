import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import prescriptionBackend from './backend/backendPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prescriptionBackend()],
})
