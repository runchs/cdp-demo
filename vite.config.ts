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
  };
});
