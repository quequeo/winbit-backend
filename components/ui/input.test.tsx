import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Name" />);

    const input = screen.getByPlaceholderText(/name/i);
    await user.type(input, 'John Doe');

    expect(input).toHaveValue('John Doe');
  });

  it('handles onChange events', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Test" />);

    const input = screen.getByPlaceholderText(/test/i);
    await user.type(input, 'a');

    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText(/disabled/i);
    expect(input).toBeDisabled();
  });

  it('supports different types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText(/email/i)).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText(/password/i)).toHaveAttribute('type', 'password');
  });
});

