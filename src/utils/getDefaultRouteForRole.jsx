export const getDefaultRouteForRole = (role) => {
  switch (role?.toLowerCase()) {
    case 'super_admin':
      return '/organizations';
    case 'restaurant_admin':
      return '/restaurant';
    case 'manager':
    case 'cashier':
    case 'waiter':
      return '/app/dashboard';
    default:
      return '/login';
  }
};