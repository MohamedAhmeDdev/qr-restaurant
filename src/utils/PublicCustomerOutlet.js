import { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

export default function PublicCustomerOutlet() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // 1. Store the token for subsequent API requests
      sessionStorage.setItem('guest_table_token', token);

      // 2. Remove ?token=... from the URL without triggering a page reload
      searchParams.delete('token');
      const newSearch = searchParams.toString();
      const cleanPath = location.pathname + (newSearch ? `?${newSearch}` : '');
      
      navigate(cleanPath, { replace: true });
    }
  }, [searchParams, navigate, location]);

  return <Outlet />;
}