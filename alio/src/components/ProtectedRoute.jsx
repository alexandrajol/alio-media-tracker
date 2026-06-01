import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '4rem' }}>Checking session...</div>;
  }

  // If they aren't logged in, instantly redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them see the page they requested!
  return children;
}
