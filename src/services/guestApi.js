import axios from 'axios';
import { ServerUrl } from '../utils/ServerUrl';

const guestApi = axios.create({
  baseURL: ServerUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

guestApi.interceptors.request.use(
  (config) => {
    // 1. Try sessionStorage first
    let token = sessionStorage.getItem('guest_table_token');

    // 2. If missing, try to bootstrap it from the URL (QR scan entry)
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromQuery = urlParams.get('token') || urlParams.get('t');

      // Also support token embedded in the path: /slug/slug/<token>
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const tokenFromPath = pathParts[2] && pathParts[2].length > 20 ? pathParts[2] : null;

      token = tokenFromQuery || tokenFromPath;

      if (token) {
        sessionStorage.setItem('guest_table_token', token);
      }
    }

    if (token) {
      config.headers['X-Table-Token'] = token;
    }

    // 3. Always send restaurant/table slugs from the URL
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const restaurantSlug = pathParts[0];
    const tableSlug = pathParts[1];

    if (restaurantSlug) config.headers['X-Restaurant-Slug'] = restaurantSlug;
    if (tableSlug) config.headers['X-Table-Slug'] = tableSlug;

    return config;
  },
  (error) => Promise.reject(error)
);

export default guestApi;