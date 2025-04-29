import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, path.resolve(root, 'config'), '');

  console.log('mode', mode)

  const defineEnv = Object.keys(env).reduce((prev, key) => {
    prev[`import.meta.env.${key}`] = JSON.stringify(env[key]);
    return prev;
  }, {} as Record<string, string>);

  return {
    define: defineEnv,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
        '@axios': path.resolve(root, 'src/api/axiosInstance'),
      },
    },
  };
});
