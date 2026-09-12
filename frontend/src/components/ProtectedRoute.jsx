import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole, children }) => {
  const { user } = useAuth();

  // If unauthenticated: redirect to appropriate login page
  if (!user) {
    if (allowedRole === 'admin') {
      return <Navigate to="/login/admin" replace />;
    }
    return <Navigate to="/login/manager" replace />;
  }

  // Role matching logic
  if (allowedRole === 'admin') {
    // ADMIN portal requires user.role === 'ADMIN'
    if (user.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
  } else if (allowedRole === 'manager') {
    // MANAGER portal accepts non-admin staff roles (MEMBER / MANAGER / USER)
    // ADMIN accessing /manager redirects to '/'
    if (user.role === 'ADMIN') {
      return <Navigate to="/" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
