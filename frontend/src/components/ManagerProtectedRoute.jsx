import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const ManagerProtectedRoute = ({ children }) => {
  return <ProtectedRoute allowedRole="manager">{children}</ProtectedRoute>;
};

export default ManagerProtectedRoute;
