import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';
import SignUp from './SignUp';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithAuth = (component, authOverrides = {}) => {
  const value = {
    login: vi.fn().mockResolvedValue({ email: 'test@test.com' }),
    register: vi.fn().mockResolvedValue({ email: 'new@test.com' }),
    ...authOverrides,
  };

  render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>
        {component}
      </AuthContext.Provider>
    </MemoryRouter>
  );

  return value;
};

describe('authentication pages', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('submits login credentials and navigates home', async () => {
    const auth = renderWithAuth(<Login />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => expect(auth.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'secret123',
    }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('submits registration data and navigates home', async () => {
    const auth = renderWithAuth(<SignUp />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newbie' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => expect(auth.register).toHaveBeenCalledWith({
      email: 'new@test.com',
      username: 'newbie',
      password: 'secret123',
      confirmPassword: 'secret123',
    }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows an error when registration passwords do not match', async () => {
    const auth = renderWithAuth(<SignUp />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newbie' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different' } });
    fireEvent.click(screen.getByText('Sign Up'));

    expect(await screen.findByText("Passwords don't match.")).toBeInTheDocument();
    expect(auth.register).not.toHaveBeenCalled();
  });
});
