export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'super_admin':
      return '/organizations';
    case 'restaurant_admin':
      return '/switcher';
    default:
      return '/login';
  }
};