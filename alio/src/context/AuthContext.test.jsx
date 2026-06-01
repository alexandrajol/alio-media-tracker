import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, AuthProvider } from './AuthContext';

const AuthHarness = () => {
  const { isAuthenticated, user, login, register, logout } = useContext(AuthContext);

  return (
    <div>
      <div data-testid="auth-state">{isAuthenticated ? 'authenticated' : 'anonymous'}</div>
      <div data-testid="email">{user?.email || ''}</div>
      <button onClick={() => login({ email: 'test@test.com', password: 'secret123' })}>Login</button>
      <button onClick={() => register({ email: 'new@test.com', username: 'newbie', password: 'secret123' })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext authentication flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    global.fetch = vi.fn((url, options = {}) => {
      if (url.endsWith('/auth/login') && options.method === 'POST') {
        const body = JSON.parse(options.body);

        if (body.password !== 'secret123') {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ message: 'Invalid email or password' }),
          });
        }

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'login-token',
            user: { id: 1, email: body.email, username: 'tester', role: 'USER' },
          }),
        });
      }

      if (url.endsWith('/auth/register') && options.method === 'POST') {
        const body = JSON.parse(options.body);

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'register-token',
            user: { id: 2, email: body.email, username: body.username, role: 'USER' },
          }),
        });
      }

      if (url.endsWith('/auth/logout') && options.method === 'POST') {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { id: 1, email: 'stored@test.com', username: 'stored', role: 'USER' } }),
      });
    });
  });

  it('logs in and stores the token session', async () => {
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated'));
    expect(screen.getByTestId('email')).toHaveTextContent('test@test.com');
    expect(localStorage.getItem('alio_auth_token')).toBe('login-token');
  });

  it('registers and stores the token session', async () => {
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated'));
    expect(screen.getByTestId('email')).toHaveTextContent('new@test.com');
    expect(localStorage.getItem('alio_auth_token')).toBe('register-token');
  });

  it('clears the session on logout', async () => {
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated'));

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous'));
    expect(localStorage.getItem('alio_auth_token')).toBeNull();
  });
});
