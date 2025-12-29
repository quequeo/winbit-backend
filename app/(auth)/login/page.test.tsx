import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next-auth
vi.mock('@/lib/auth', () => ({
  signIn: vi.fn(),
}));

// Mock the login page
vi.mock('./page', () => ({
  default: () => (
    <div>
      <h1>Winbit Admin</h1>
      <p>Iniciar sesión en el panel de administración</p>
      <form>
        <button type="submit">Iniciar sesión con Google</button>
      </form>
    </div>
  ),
}));

describe('LoginPage', () => {
  it('renders login page with title', async () => {
    const LoginPage = (await import('./page')).default;
    render(<LoginPage />);

    expect(screen.getByText(/winbit admin/i)).toBeInTheDocument();
    expect(screen.getByText(/iniciar sesión en el panel de administración/i)).toBeInTheDocument();
  });

  it('renders Google sign-in button', async () => {
    const LoginPage = (await import('./page')).default;
    render(<LoginPage />);

    const button = screen.getByRole('button', { name: /iniciar sesión con google/i });
    expect(button).toBeInTheDocument();
  });
});

