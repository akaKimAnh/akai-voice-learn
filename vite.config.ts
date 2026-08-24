import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Tự động xác định Base Path chuẩn cho cả Vercel, GitHub Pages và Local
const getBasePath = () => {
  if (process.env.BASE_PATH) return process.env.BASE_PATH;
  // Nếu deploy trên Vercel hoặc Netlify -> dùng đường dẫn gốc '/'
  if (process.env.VERCEL || process.env.NETLIFY) return '/';
  // Nếu deploy trên GitHub Pages -> dùng '/<repo-name>/'
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    return `/${repoName}/`;
  }
  // Mặc định cho môi trường dev/local
  return './';
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: getBasePath(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
