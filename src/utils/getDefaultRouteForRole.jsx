export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'super_admin':
      return '/organizations';
    case 'restaurant_admin':
      return '/restaurant';
    default:
      return '/login';
  }
};