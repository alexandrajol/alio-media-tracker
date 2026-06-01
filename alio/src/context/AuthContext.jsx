import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE_URL, getAuthHeaders } from '../utils/api';

export const AuthContext = createContext();

const TOKEN_KEY = 'alio_auth_token';
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const inactivityTimer = useRef(null);

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const saveSession = (session) => {
    localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
  };

  const logout = async () => {
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(token),
      }).catch(() => {});
    }
    clearSession();
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (!token) return;

    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT_MS);
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: getAuthHeaders(token),
        });

        if (!res.ok) {
          clearSession();
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } finally {
        setAuthLoading(false);
      }
    };

    verifySession();
  }, []);

  useEffect(() => {
    const activityEvents = ['click', 'keydown', 'mousemove', 'touchstart'];
    activityEvents.forEach((event) => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [token]);

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    saveSession(data);
    return data.user;
  };

  const register = async ({ email, username, password }) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    saveSession(data);
    return data.user;
  };

  const value = useMemo(() => ({
    token,
    user,
    authLoading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  }), [token, user, authLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
