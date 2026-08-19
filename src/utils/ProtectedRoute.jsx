import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = allowedRoles?.includes(user.role);

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ CRITICAL: Use Outlet so child routes render
  return <Outlet />;
};