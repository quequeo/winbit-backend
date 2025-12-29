import { describe, it, expect, vi } from 'vitest';

// Mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    handlers: { GET: vi.fn(), POST: vi.fn() },
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}));

vi.mock('next-auth/providers/google', () => ({
  default: vi.fn(() => ({})),
}));

describe('Auth Configuration', () => {
  it('exports auth config', async () => {
    const { authConfig } = await import('./auth');
    expect(authConfig).toBeDefined();
    expect(authConfig.providers).toBeDefined();
    expect(authConfig.callbacks).toBeDefined();
  });

  it('exports auth handlers', async () => {
    const { handlers, auth, signIn, signOut } = await import('./auth');
    expect(handlers).toBeDefined();
    expect(auth).toBeDefined();
    expect(signIn).toBeDefined();
    expect(signOut).toBeDefined();
  });

  it('has correct callback structure', async () => {
    const { authConfig } = await import('./auth');
    expect(authConfig.callbacks?.authorized).toBeDefined();
    expect(authConfig.callbacks?.jwt).toBeDefined();
    expect(authConfig.callbacks?.session).toBeDefined();
  });

  it('has login page configured', async () => {
    const { authConfig } = await import('./auth');
    expect(authConfig.pages?.signIn).toBe('/login');
  });
});

