import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  const root = process.cwd();

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
        '@axios': path.resolve(root, 'src/api/axiosInstance'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  };
});
