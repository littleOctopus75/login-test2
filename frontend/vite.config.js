import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    server: {
        host: 'localhost',
        port: 5173,
        open: true, // Abre automáticamente en el navegador
    },
});
