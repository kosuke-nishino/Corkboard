import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '0.0.0.0', // ← これがポイント！IPv6もIPv4も受け入れる
    port: 5173,       // ← 明示的に固定
    hmr: {
      host: 'localhost', // ← ブラウザからアクセスするホスト名
    },
  },
  plugins: [
    laravel({
      input: ['resources/js/app.jsx'],
      refresh: true,
    }),
    react(),
  ],
});