import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx', // Reactのエントリポイント
            ],
            refresh: true,
        }),
        react(), // Reactのプラグイン
    ],
    server: {
        host: true, // Dockerとの連携用
        port: 5173,
        hmr: {
            host: 'localhost',
        },
    },
});
