import { useAuth } from '../contexts/AuthContext';

export const useRoleBasePath = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  switch (role) {
    case 'manager':
      return '/manager';
    case 'restaurant_admin':
      return '/restaurant';
    case 'super_admin':
      return '/organizations';
    case 'cashier':
      return '/cashier';
    case 'waiter':
      return '/waiter';
    default:
      return '/'; // Safe fallback
  }
};