// Use HTTP for network access (other devices), HTTPS for localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const protocol = isLocalhost ? 'https' : 'http';
const port = isLocalhost ? '3000' : '3001';
const host = window.location.hostname;

export const API_BASE_URL = import.meta.env.VITE_API_URL || `${protocol}://${host}:${port}/api`;

export const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});
