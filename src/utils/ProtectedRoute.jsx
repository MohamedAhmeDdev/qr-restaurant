import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';


export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingScreen label="Verifying access" />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = allowedRoles?.includes(user.role);

  if (!hasRequiredRole) {
    return <Navigate to="/login" replace />;
  }

  // ✅ CRITICAL: Use Outlet so child routes render
  return <Outlet />;
};