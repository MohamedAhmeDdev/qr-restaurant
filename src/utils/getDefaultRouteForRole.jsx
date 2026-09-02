export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'super_admin':
      return '/organizations';
    case 'restaurant_admin':
      return '/restaurant';  
    case 'cashier':
    case 'waiter':
    case 'waitress':
    case 'staff':
    case 'kitchen':
    case 'chef':
      return '/dashboard';    
    default:
      return '/dashboard';
  }
};