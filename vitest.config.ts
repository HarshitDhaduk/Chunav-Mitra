import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**', '.next/**'],
    mockReset: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // Mock next/navigation for all tests
      'next/navigation': path.resolve(__dirname, './__mocks__/next/navigation.ts'),
      // Mock framer-motion to avoid animation issues in jsdom
      'framer-motion': path.resolve(__dirname, './__mocks__/framer-motion.tsx'),
    },
  },
});
