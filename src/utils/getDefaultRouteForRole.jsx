export const getDefaultRouteForRole = (role) => {
  // Convert to lowercase to ensure a safe match regardless of backend formatting
  const userRole = role?.toLowerCase(); 

  switch (userRole) {
    case 'super_admin':
      return '/organizations';
    case 'restaurant_admin':
      return '/restaurant';
    case 'manager':
      return '/manager/dashboard';
    case 'cashier':
      return '/cashier/restaurant';
    case 'waiter':
      return '/waiter/restaurant';
    default:
      return '/login';
  }
};