import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './src-web',
  plugins: [react()],
  server: { port: 5174 },
});
