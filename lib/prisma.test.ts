import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock pg and @prisma/adapter-pg before importing prisma
vi.mock('pg', () => {
  class MockPool {
    query = vi.fn();
    end = vi.fn();
  }
  return {
    Pool: MockPool,
  };
});

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(),
}));

vi.mock('@prisma/client', () => {
  class MockPrismaClient {
    $connect = vi.fn();
    $disconnect = vi.fn();
  }
  return {
    PrismaClient: MockPrismaClient,
  };
});

describe('Prisma Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports prisma client instance', async () => {
    const { prisma } = await import('./prisma');
    expect(prisma).toBeDefined();
    expect(prisma.$connect).toBeDefined();
    expect(prisma.$disconnect).toBeDefined();
  });
});

