// utils/RequirePermission.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RequirePermission({ permission, children, fallback = '/app/dashboard' }) {
  const { can } = useAuth();
  if (!can(permission)) return <Navigate to={fallback} replace />;
  return children;
}