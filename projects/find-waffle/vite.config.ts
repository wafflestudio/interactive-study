import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: './static/',
  base: mode === 'production' ? '/projects/find-waffle/' : '/',
}));
