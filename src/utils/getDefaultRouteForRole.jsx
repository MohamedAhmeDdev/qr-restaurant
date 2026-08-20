export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'super_admin':
      return '/tenants';
    case 'restaurant_admin':
      return '/switcher';
    default:
      return '/unauthorized';
  }
};