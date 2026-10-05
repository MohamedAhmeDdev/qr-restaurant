// pages/customer/CustomerLayout.jsx
import { useEffect } from 'react';
import { Outlet, useParams, useSearchParams, useLocation } from 'react-router-dom';

export default function CustomerLayout() {
  const { restaurantSlug, tableSlug } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');

    if (tokenFromUrl) {
      // Persist token for guestApi interceptor
      sessionStorage.setItem('guest_table_token', tokenFromUrl);

      // Also persist slugs so refresh/navigation works reliably
      sessionStorage.setItem('guest_restaurant_slug', restaurantSlug);
      sessionStorage.setItem('guest_table_slug', tableSlug);

      // Clean URL so token isn't visible / shared accidentally
      const cleanUrl = location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    } else {
      // Fallback: token not in URL — try sessionStorage, else check if we have a stored session for this table
      const storedToken = sessionStorage.getItem('guest_table_token');
      const storedRestaurant = sessionStorage.getItem('guest_restaurant_slug');
      const storedTable = sessionStorage.getItem('guest_table_slug');

      // If the user navigated to a different restaurant/table, clear stale token
      if (
        storedToken &&
        (storedRestaurant !== restaurantSlug || storedTable !== tableSlug)
      ) {
        sessionStorage.removeItem('guest_table_token');
        sessionStorage.removeItem('guest_restaurant_slug');
        sessionStorage.removeItem('guest_table_slug');
      }
    }
  }, [restaurantSlug, tableSlug, searchParams, location.pathname]);

  return <Outlet />;
}