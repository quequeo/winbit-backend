import { beforeAll, afterEach, afterAll, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock environment variables
beforeAll(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.NEXTAUTH_SECRET = 'test-secret';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

