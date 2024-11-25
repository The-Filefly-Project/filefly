import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: "../build/client/"
    },
    server: {
        // For development only, so the live reload enabled 
        // page can access the actual server's APIs.
        proxy: {
            "/api/v1": "http://localhost"
        }
    }
})
