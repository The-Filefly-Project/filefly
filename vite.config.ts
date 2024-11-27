import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "./build/spa/"
    },
    server: {
        // For development only, so the live reload enabled 
        // page can access the actual server's APIs.
        proxy: {
            "/api/v1": "http://localhost"
        }
    }
})
