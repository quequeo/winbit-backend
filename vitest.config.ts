import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.config.{js,ts,mjs}',
        '**/types.ts',
        '**/*.d.ts',
        'prisma/',
        'vitest.setup.ts',
        'lib/auth.ts', // NextAuth config is hard to test, focus on application logic
        'middleware.ts', // Next.js middleware
        'app/**/layout.tsx', // Server Components with auth
        'app/**/page.tsx', // Server Components (mocked in tests)
        'app/api/**', // API routes (will be tested when implemented)
      ],
      thresholds: {
        lines: 85,
        functions: 80,
        branches: 70,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});

